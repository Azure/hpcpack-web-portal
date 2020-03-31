import { Component, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';

import { RemoteCommandService, RemoteCommand, CommandOutput } from '../../services/remote-command.service'

class NodeOut {
  name: string;
  eof: boolean;
  errorOut: string;
  output: string;

  get state(): string {
    if (this.eof === undefined)
      return '';
    if (this.errorOut) {
      return 'Error';
    }
    return this.eof ? 'End' : 'Running';
  }

  constructor(name: string) {
    this.name = name;
  }

  update(output: CommandOutput): void {
    this.eof = output.eof;
    if (!this.eof) {
      if (output.error) {
        if (this.errorOut) {
          this.errorOut += `\n${output.line}`;
        }
        else {
          this.errorOut = output.line;
        }
      }
      else {
        if (this.output) {
          this.output += `\n${output.line}`;
        }
        else {
          this.output = output.line;
        }
      }
    }
  }
}

@Component({
  selector: 'app-commander',
  templateUrl: './commander.component.html',
  styleUrls: ['./commander.component.scss']
})
export class CommanderComponent implements OnInit, OnDestroy {
  private command: RemoteCommand;

  dataSource: MatTableDataSource<NodeOut> = new MatTableDataSource();

  displayedColumns = ['name', 'state'];

  @ViewChild(MatSort, {static: true})
  private sort: MatSort;

  selected: NodeOut;

  cmdInput: FormControl;

  get cmdLine(): string {
    try {
      return this.cmdInput.value.trim();
    }
    catch {
      return '';
    }
  }

  private nameToIndex: Map<string, number>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public nodeNames: string[],
    private fb: FormBuilder,
    private commandService: RemoteCommandService,
  ) {
    this.cmdInput = this.fb.control('');
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.nodeNames.map(name => new NodeOut(name));
  }

  ngOnDestroy(): void {
    if (this.command) {
      this.command.disconnect();
      this.command = null;
    }
  }

  get readyToRun(): boolean {
    return !this.running && this.cmdLine.length != 0;
  }

  get running(): boolean {
    return this.command && this.dataSource.data.findIndex(node => node.eof != true) >= 0;
  }

  run(): void {
    if (!this.readyToRun) {
      return;
    }
    this.dataSource.data = this.nodeNames.map(name => new NodeOut(name));
    this.select(this.dataSource.data[0]);
    this.nameToIndex = new Map(this.nodeNames.map((name, idx) => [name.toLowerCase(), idx]));
    this.command = this.commandService.create(this.cmdLine, this.nodeNames);
    this.command.start(
      output => {
        let idx = this.nameToIndex.get(output.nodeName.toLowerCase());
        let nodeOut = this.dataSource.data[idx];
        nodeOut.update(output);
      },
      err => {
        console.error(err);
      }
    );
  }

  cancel(): void {
    if (this.command) {
      this.command.cancel();
      this.command = null;
    }
  }

  select(node: NodeOut): void {
    this.selected = node;
  }

  cssClass(node: NodeOut): string {
    return node == this.selected ? 'selected' : '';
  }
}
