import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { MatSort } from '@angular/material/sort';
import { Node } from '../../models/node'
import { UserService } from '../../services/user.service'
import { ApiService, RestObject } from '../../services/api.service';
import { ILooper, Looper } from '../../services/looper.service'
import { ColumnSelectorComponent, ColumnSelectorResult } from '../../shared-components/column-selector/column-selector.component'

@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Node> = new MatTableDataSource();

  selection = new SelectionModel<Node>(true);

  private updaters: ILooper<RestObject[]>[] = [];

  private updateInterval = 1200;

  private updateExpiredIn = 36 * 1000;

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
    this.api.getNodes(null, null, null, null, null, 10000).subscribe((data) => {
      this.dataSource.data = data.map(e => Node.fromProperties(e.Properties));
    });
  }

  ngOnDestroy(): void {
    for (let updater of this.updaters) {
      updater.stop(false);
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
    this.api.operateNodes("online", names).subscribe(_ => {
      let looper = Looper.start(
        this.api.getNodes(null, names.join(',')),
        {
          next: (data, looper) => {
            let pairs: [string, Node][] = data.map(e => {
              let node = Node.fromProperties(e.Properties);
              return [node.Id, node];
            });
            let idToNode = new Map<string, Node>(pairs);

            //1. Update UI.
            for (let node of this.dataSource.data) {
              let update = idToNode.get(node.Id);
              if (update) {
                node.update(update)
              }
            }

            //2. Check target status and filter out nodes that needs further check.
            let names: string[] = [];
            for (let node of idToNode.values()) {
              if (node.State !== 'Online') {
                names.push(node.Name);
              }
            }

            //3. Do next check or finish.
            if (names.length == 0) {
              looper.stop();
            }
            else {
              looper.observable = this.api.getNodes(null, names.join(','));
            }
          },
          stop: (looper) => {
            let idx = this.updaters.indexOf(looper);
            if (idx >= 0) {
              this.updaters.splice(idx, 1);
            }
          }
        },
        this.updateInterval,
        this.updateExpiredIn
      );
      this.updaters.push(looper);
    });
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
        this.userService.userOptions = this.userService.userOptions; //save options
      }
    });
  }
}
