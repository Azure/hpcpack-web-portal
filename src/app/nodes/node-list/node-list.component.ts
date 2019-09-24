import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { MatSort } from '@angular/material/sort';
import { Node } from '../../models/node'
import { UserService } from '../../services/user.service'
import { DefaultService as ApiService } from '../../api-client';
import { RestObject } from '../../api-client/model/models'
import { Looper } from '../../services/looper.service'
import { ColumnSelectorComponent, ColumnSelectorResult } from '../../shared-components/column-selector/column-selector.component'

@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Node> = new MatTableDataSource();

  selection = new SelectionModel<Node>(true);

  private interval = 2500;

  private looper: Looper<RestObject[]>;

  @ViewChild(MatSort, {static: true})
  private sort: MatSort;

  private selectedColumns: string[];

  private get unselectedColumns(): string[] {
    return NodeListComponent.availableColumns.filter(e => !this.selectedColumns.includes(e));
  }

  private static availableColumns: string[] = [
    'Availability',
    'AzureServiceName',
    'CpuSpeed',
    'DnsSuffix',
    'Groups',
    'Guid',
    'Health',
    'Id',
    'JobType',
    'Location',
    'MemorySize',
    'Name',
    'NumCores',
    'NumSockets',
    'OfflineTime',
    'OnlineTime',
    'Reachable',
    'State'
  ];

  get displayedColumns(): string[] {
    return ['Select'].concat(this.selectedColumns);
  }

  constructor(
    private userService: UserService,
    private api: ApiService,
    private dialog: MatDialog,
  ) {
    this.selectedColumns = this.userService.userOptions.nodeOptions.selectedColumns;
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.looper = Looper.start(
      this.api.getNodes(),
      {
        next: (data) => {
          this.dataSource.data = data.map(e => Node.fromProperties(e.Properties));
          //TODO: select by id?
          let selected = new Set(this.selection.selected.map(e => e.Name));
          this.selection.clear();
          for (let node of this.dataSource.data) {
            if (selected.has(node.Name)) {
              this.selection.select(node);
            }
          }
        }
      },
      this.interval
    );
  }

  ngOnDestroy(): void {
    if (this.looper) {
      this.looper.stop();
    }
  }

  get anySelected(): boolean {
    return this.selection.selected.length > 0;
  }

  get allSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  get masterChecked(): boolean {
    return this.selection.hasValue() && this.allSelected;
  }

  get masterIndeterminate(): boolean {
    return this.selection.hasValue() && !this.allSelected;
  }

  masterToggle() {
    this.allSelected ?
      this.selection.clear() :
      this.dataSource.data.forEach(node => this.selection.select(node));
  }

  bringOnline(): void {
    let names = this.selection.selected.map(node => node.Name);
    this.api.operateNodes("online", names).subscribe();
  }

  takeOffline(): void {
    let names = this.selection.selected.map(node => node.Name);
    this.api.operateNodes("offline", names).subscribe();
  }

  showColumnSelector(): void {
    let data = { selected: this.selectedColumns, unselected: this.unselectedColumns };
    let dialogRef = this.dialog.open(ColumnSelectorComponent, { data })
    dialogRef.afterClosed().subscribe((result: undefined | ColumnSelectorResult) => {
      if (result) {
        this.selectedColumns = result.selected;
        this.userService.userOptions.nodeOptions.selectedColumns = this.selectedColumns;
        this.userService.save();
      }
    });
  }
}
