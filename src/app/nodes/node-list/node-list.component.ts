import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { MatSort, Sort } from '@angular/material/sort';
import { MatSidenavContainer } from '@angular/material/sidenav'
import { Subscription } from 'rxjs'
import { Node } from '../../models/node'
import { UserService } from '../../services/user.service'
import { ApiService } from '../../services/api.service';
import { MediaQueryService } from '../../services/media-query.service'
import { ColumnDef, ColumnSelectorComponent, ColumnSelectorInput, ColumnSelectorResult }
  from '../../shared-components/column-selector/column-selector.component'
import { CommanderComponent } from '../commander/commander.component'

@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent implements OnInit, OnDestroy {
  readonly columns: ColumnDef[] = [
    { name: 'Availability', label: 'Availability' },
    { name: 'AzureServiceName', label: 'Azure Service Name' },
    { name: 'CpuSpeed', label: 'Cpu Speed' },
    { name: 'DnsSuffix', label: 'Dns Suffix' },
    { name: 'NodeGroups', label: 'Node Groups' },
    { name: 'Guid', label: 'Guid' },
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

  dataSource: MatTableDataSource<Node> = new MatTableDataSource();

  selection = new SelectionModel<Node>(true);

  private static readonly defaultSelectedColumns = ['Id', 'Name', 'State', 'Reachable', 'NodeGroups'];

  private userOptions = this.userService.userOptions.nodeOptions;

  private get selectedColumns(): string[] {
    return this.userOptions.selectedColumns || NodeListComponent.defaultSelectedColumns;
  }

  private set selectedColumns(value: string[]) {
    this.userOptions.selectedColumns = value;
    this.userService.saveUserOptions();
  }

  get displayedColumns(): string[] {
    return ['Select'].concat(this.selectedColumns);
  }

  orderBy: string = "Id";

  asc: boolean = false;

  rowCount: number;

  readonly pageSizeOptions = [25, 50, 100, 200, 500];

  pageSize: number = this.pageSizeOptions[0];

  pageIndex: number = 0;

  private get startRow(): number {
    return this.pageIndex * this.pageSize;
  }

  private updateInterval = 1200;

  private updateExpiredIn = 36 * 1000;

  private subscription: Subscription = new Subscription();

  private pageDataSub: Subscription;

  private pageLoading: boolean = false;

  get isLoading(): boolean {
    return this.pageLoading;
  }

  private get actionListHidden(): boolean {
    return this.userOptions.hideActionList !== undefined ? this.userOptions.hideActionList :
      (this.mediaQuery.smallWidth ? true: false);
  }

  private set actionListHidden(val: boolean) {
    this.userOptions.hideActionList = val;
    this.userService.saveUserOptions();
  }

  @ViewChild(MatSidenavContainer, { static: false })
  private sidenavContainer: MatSidenavContainer;

  @ViewChild(MatSort, {static: true})
  private sort: MatSort;

  constructor(
    private mediaQuery: MediaQueryService,
    private api: ApiService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.refresh();
  }

  ngOnDestroy(): void {
    this.reset();
  }

  private loadData(): void {
    if (this.pageLoading) {
      this.pageDataSub.unsubscribe();
    }
    this.pageLoading = true;
    this.pageDataSub = this.api.getNodes(null, null, null, null, this.orderBy, this.asc, this.startRow, this.pageSize, null, 'response').subscribe({
      next: res => {
        this.pageLoading = false;
        this.rowCount = Number(res.headers.get('x-ms-row-count'));
        let nodes = res.body.map(e => Node.fromProperties(e.Properties));
        this.dataSource.data = nodes;
      },
      error: err => {
        this.pageLoading = false;
        console.log(err);
      }
    });
  }

  onPageChange(e: PageEvent): void {
    console.log(e);
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.refresh();
  }

  onSortChange(e: Sort): void {
    console.log(e);
    this.orderBy = e.active;
    this.asc = (e.direction == "asc");
    if (this.pageSize < this.rowCount) {
      this.refresh();
    }
  }

  private reset(): void {
    if (this.pageLoading) {
      this.pageDataSub.unsubscribe();
    }
    this.pageLoading = false;
    this.pageDataSub = null;

    //TODO: Use separate subscriptions for loading and updating and don't unsubscribe the updating one on reset?
    this.subscription.unsubscribe();
    //When a subscription is unsubscribed, new subscription added to it won't work.
    //So a new subscription instance is required.
    this.subscription = new Subscription();
    this.selection.clear();
    this.dataSource.data = [];
  }

  //TODO: let browser refresh instead?
  refresh(): void {
    this.reset();
    this.loadData();
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
    let data: ColumnSelectorInput = { selected: this.selectedColumns, columns: this.columns };
    let dialogRef = this.dialog.open(ColumnSelectorComponent, { data })
    dialogRef.afterClosed().subscribe((result: undefined | ColumnSelectorResult) => {
      if (result) {
        this.selectedColumns = result.selected;
      }
    });
  }

  get isActionListHidden(): boolean {
    return this.actionListHidden;
  }

  toggleActionList(): void {
    this.actionListHidden = !this.actionListHidden;
    setTimeout(() => this.sidenavContainer.updateContentMargins(), 0);
  }

  get toggleActionListIcon(): string {
    return this.actionListHidden ? 'keyboard_arrow_left' : 'keyboard_arrow_right';
  }

  runCommand(): void {
    let nodeNames = this.selection.selected.map(node => node.Name);
    let dialogRef = this.dialog.open(CommanderComponent, { data: nodeNames, disableClose: true, minWidth: '50%' });
  }

  get adminView(): boolean {
    return this.userService.user.isAdmin;
  }
}
