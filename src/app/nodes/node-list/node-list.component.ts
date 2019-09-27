import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs'
import { Node } from '../../models/node'
import { UserService } from '../../services/user.service'
import { ApiService } from '../../services/api.service';
import { ColumnSelectorComponent, ColumnSelectorResult } from '../../shared-components/column-selector/column-selector.component'

@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent implements OnInit, OnDestroy {
  readonly columns = [
    { name: 'Availability', label: 'Availability' },
    { name: 'AzureServiceName', label: 'Azure Service Name' },
    { name: 'CpuSpeed', label: 'Cpu Speed' },
    { name: 'DnsSuffix', label: 'Dns Suffix' },
    { name: 'Groups', label: 'Node Groups' },
    { name: 'Guid', label: 'Guid' },
    { name: 'Health', label: 'Health' },
    { name: 'Id', label: 'Id' },
    { name: 'JobType', label: 'Job Type' },
    { name: 'Location', label: 'Location' },
    { name: 'MemorySize', label: 'Memory Size' },
    { name: 'Name', label: 'Name' },
    { name: 'NumCores', label: 'Cores' },
    { name: 'NumSockets', label: 'Sockets' },
    { name: 'OfflineTime', label: 'Offline at' },
    { name: 'OnlineTime', label: 'Online at' },
    { name: 'Reachable', label: 'Reachable' },
    { name: 'State', label: 'State' },
  ];

  private readonly availableColumns: string[] = this.columns.map(c => c.name);

  dataSource: MatTableDataSource<Node> = new MatTableDataSource();

  selection = new SelectionModel<Node>(true);

  private selectedColumns: string[];

  private get unselectedColumns(): string[] {
    return this.availableColumns.filter(e => !this.selectedColumns.includes(e));
  }

  get displayedColumns(): string[] {
    return ['Select'].concat(this.selectedColumns);
  }

  private updateInterval = 1200;

  private updateExpiredIn = 36 * 1000;

  private subscription: Subscription = new Subscription();

  @ViewChild(MatSort, {static: true})
  private sort: MatSort;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.selectedColumns = this.userService.userOptions.nodeOptions.selectedColumns;
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.refresh();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  refresh(): void {
    this.selection.clear();
    this.api.getNodes(null, null, null, null, null, 10000).subscribe((data) => {
      this.dataSource.data = data.map(e => Node.fromProperties(e.Properties));
    });
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

  private updateNodes(nodes: Node[]): void {
    let pairs: [string, Node][] = nodes.map(n => [n.Id, n]);
    let idToNode = new Map<string, Node>(pairs);
    for (let node of this.dataSource.data) {
      let update = idToNode.get(node.Id);
      if (update) {
        node.update(update)
      }
    }
  }

  bringOnline(): void {
    let names = this.selection.selected.map(node => node.Name);
    let sub = this.api.bringNodesOnlineAndWatch(names, this.updateInterval, this.updateExpiredIn).subscribe({
      next: (nodes) => {
        this.updateNodes(nodes);
      }
    });
    this.subscription.add(sub);
  }

  takeOffline(): void {
    let names = this.selection.selected.map(node => node.Name);
    let sub = this.api.takeNodesOfflineAndWatch(names, this.updateInterval, this.updateExpiredIn).subscribe({
      next: (nodes) => {
        this.updateNodes(nodes);
      }
    });
    this.subscription.add(sub);
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
