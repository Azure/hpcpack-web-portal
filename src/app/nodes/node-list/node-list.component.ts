import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatDialog, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { MatSort, Sort } from '@angular/material/sort';
import { Subscription, Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators';
import { Node } from '../../models/node'
import { UserService } from '../../services/user.service'
import { ApiService, NodeGroup, NodeGroupOperation } from '../../services/api.service';
import { oneAfterAnother } from 'src/app/utils/looper';
import { ColumnDef, ColumnSelectorComponent, ColumnSelectorInput, ColumnSelectorResult }
  from '../../shared-components/column-selector/column-selector.component'
import { CollapsablePanelOptions } from 'src/app/shared-components/collapsable-panel/collapsable-panel.component';
import { CommanderComponent } from '../commander/commander.component'
import { GroupSelectorComponent, GroupSeletorItem } from '../group-selector/group-selector.component';

@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent implements OnInit, OnDestroy {
  readonly columns: ColumnDef[] = Node.properties;

  dataSource: MatTableDataSource<Node> = new MatTableDataSource();

  selection = new SelectionModel<Node>(true);

  private static readonly defaultSelectedColumns = ['Name', 'State', 'Reachable', 'NodeGroups'];

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

  private orderByValue: string;

  get orderBy(): string {
    if (this.orderByValue === undefined) {
      this.orderByValue = this.userOptions.orderBy || 'Name';
    }
    return this.orderByValue;
  }

  set orderBy(value: string) {
    this.orderByValue = value;
    this.userOptions.orderBy = value;
    this.userService.saveUserOptions();
  }

  private ascValue: boolean;

  get asc(): boolean {
    if (this.ascValue === undefined) {
      this.ascValue = this.userOptions.orderAsc;
      if (this.ascValue === undefined) {
        this.ascValue = true;
      }
    }
    return this.ascValue;
  }

  set asc(value: boolean) {
    this.ascValue = value;
    this.userOptions.orderAsc = value;
    this.userService.saveUserOptions();
  }

  rowCount: number;

  readonly pageSizeOptions = [25, 50, 100, 200, 500];

  private pageSizeValue: number;

  get pageSize(): number {
    if (this.pageSizeValue === undefined) {
      this.pageSizeValue = this.userOptions.pageSize || this.pageSizeOptions[0];
    }
    return this.pageSizeValue;
  }

  set pageSize(value: number) {
    this.pageSizeValue = value;
    this.userOptions.pageSize = value;
    this.userService.saveUserOptions();
  }

  pageIndex: number = 0;

  private get startRow(): number {
    return this.pageIndex * this.pageSize;
  }

  private updateInterval = 1200;

  private updateExpiredIn = 36 * 1000;

  private subscription: Subscription = new Subscription();

  private dataSubscription: Subscription;

  private loadingData: boolean = false;

  get isLoading(): boolean {
    return this.loadingData;
  }

  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    if (value) {
    //NOTE: Only when ngAfterViewInit() then there will be a value for MatSort, since it's inside
    //a <ng-template> now(and the <ng-template> is controlled by a <app-collapsable-panel>).
    this.dataSource.sort = value;
    }
  };

  nodeGroup: string;

  get nodeGroupLabel(): string {
    return `In Group ${this.nodeGroup}`;
  }

  jobIds: string[];

  get jobIdsLabel(): string {
    if (!this.jobIds) {
      return null;
    }
    return this.jobIds.length > 1 ? `For Jobs ${this.jobIds.join(', ')}` : `For Job ${this.jobIds[0]}`;
  }

  get hasFilter(): boolean {
    return !!this.nodeGroup || !!this.jobIds;
  }

  get noPagination(): boolean {
    return this.hasFilter;
  }

  panelOptions: CollapsablePanelOptions;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.panelOptions = new CollapsablePanelOptions(this.userService, this.userOptions);
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(map => {
      this.nodeGroup = map.get('group');
      let jobIds = map.get('jobs');
      this.jobIds = jobIds ? jobIds.split(',') : null;
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.reset();
  }

  private getNodesInGroup(): void {
    this.loadingData = true;
    this.dataSubscription = this.api.getNodesOfGroup(this.nodeGroup).pipe(
      mergeMap(names => this.api.getNodes(null, names.join(',')))
    ).subscribe(
      data => {
        this.loadingData = false;
        this.rowCount = data.length;
        let nodes = data.map(e => Node.fromProperties(e.Properties));
        this.dataSource.data = nodes;
      },
      error => {
        this.loadingData = false;
        console.log(error);
      }
    );
  }

  private getNodesForJobs(): void {
    if (this.loadingData) {
      this.dataSubscription.unsubscribe();
    }
    this.loadingData = true;
    this.dataSubscription = this.api.getNodes(null, null, this.jobIds.join(',')).subscribe({
      next: res => {
        this.loadingData = false;
        this.rowCount = res.length;
        let nodes = res.map(e => Node.fromProperties(e.Properties));
        this.dataSource.data = nodes;
      },
      error: err => {
        this.loadingData = false;
        console.log(err);
      }
    });
  }

  private getNodes(): void {
    if (this.loadingData) {
      this.dataSubscription.unsubscribe();
    }
    this.loadingData = true;
    this.dataSubscription = this.api.getNodes(null, null, null, null, null, this.orderBy, this.asc, this.startRow, this.pageSize, null, 'response').subscribe({
      next: res => {
        this.loadingData = false;
        this.rowCount = Number(res.headers.get('x-ms-row-count'));
        let nodes = res.body.map(e => Node.fromProperties(e.Properties));
        this.dataSource.data = nodes;
      },
      error: err => {
        this.loadingData = false;
        console.log(err);
      }
    });
  }

  private loadData(): void {
    if (this.nodeGroup) {
      this.getNodesInGroup();
    }
    else if (this.jobIds) {
      this.getNodesForJobs();
    }
    else {
      this.getNodes();
    }
  }

  //TODO: change URL accordingly?
  onPageChange(e: PageEvent): void {
    console.log(e);
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.refresh();
  }


  //TODO: change URL accordingly?
  onSortChange(e: Sort): void {
    console.log(e);
    this.orderBy = e.active;
    this.asc = (e.direction == "asc");
    if (!this.noPagination && this.pageSize < this.rowCount) {
      this.refresh();
    }
  }

  private reset(): void {
    if (this.loadingData) {
      this.dataSubscription.unsubscribe();
    }
    this.loadingData = false;
    this.dataSubscription = null;

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

  columnText(row: any, column: string): string {
    let v = row[column];
    if (v instanceof Date) {
      return v.toLocaleString();
    }
    return v;
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
    let pairs: [number, Node][] = nodes.map(n => [n.Id, n]);
    let idToNode = new Map<number, Node>(pairs);
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

  get adminView(): boolean {
    return this.userService.user.isAdmin;
  }

  runCommand(): void {
    let nodeNames = this.selection.selected.map(node => node.Name);
    let dialogRef = this.dialog.open(CommanderComponent, { data: nodeNames, disableClose: true, minWidth: '50%' });
  }

  manageGroups(): void {
    let sub = this.api.getNodeGroups().subscribe(data => {
      let items = this.makeGroupSelectorItems(data);
      let dialogRef = this.dialog.open(GroupSelectorComponent, { data: items });
      dialogRef.afterClosed().subscribe((changes: GroupSeletorItem[]) => {
        this.updateNodesForGroups(changes);
      });
    });
    this.subscription.add(sub);
  }

  private makeGroupSelectorItems(groups: NodeGroup[]): GroupSeletorItem[] {
    let groupCount = new Map<string, number>(groups.map(g => [g.Name, 0]));
    for (let node of this.selection.selected) {
      for (let g of node.NodeGroups) {
        let v = groupCount.get(g);
        if (v !== undefined) {
          groupCount.set(g, v + 1);
        }
      }
    }
    let total = this.selection.selected.length;
    let counts = Array.from(groupCount.values());
    let items: GroupSeletorItem[] = [];
    for (let i = 0; i < groups.length; i++) {
      items.push({
        name: groups[i].Name,
        selected: counts[i] == total,
        disabled: groups[i].Managed
      });
    }
    return items;
  }

  //TODO: Make a node group service to handle all node group changes, since it's error-prone
  //for the timing of concurrent updates.
  private updateNodesForGroups(changes: GroupSeletorItem[]): void {
    if (!changes) {
      return;
    }
    let nodes = this.selection.selected.map(n => n); //Shallow clone selected nodes to "lock" the changed nodes
    let nodeNames = this.selection.selected.map(n => n.Name);
    let updates: Observable<any>[] = [];
    for (let group of changes) {
      let op: NodeGroupOperation = {
        GroupName: group.name,
        Operation: group.selected ? 'add' : 'remove',
        NodeNames: nodeNames
      };
      //Prepare update operation to do later
      updates.push(this.api.moveNodesOfGroup(op.GroupName, null, op));
      //Update UI instantly. NOTE:
      //If anything goes wrong, then user has to "refresh data" to get consistent with server
      for (let node of nodes) {
        let idx = node.NodeGroups.indexOf(group.name);
        if (group.selected) {
          if (idx < 0) {
            node.NodeGroups.push(group.name);
          }
        }
        else {
          if (idx >= 0) {
            node.NodeGroups.splice(idx, 1);
          }
        }
      }
    }
    //Make one update after another, because multiple concurrent updates on node groups are likely to fail.
    //Still, a node group service is preferred since there may be multiple concurrent loopers like this.
    oneAfterAnother(updates, 3);
  }

  viewJobs(): void {
    let names = this.selection.selected.map(e => e.Name);
    this.router.navigate(['/jobs'], { queryParams: { nodes: names.join(',') }});
  }

  viewLogs(): void {
    let names = this.selection.selected.map(e => e.Name);
    this.router.navigate(['/logs'], { queryParams: { nodes: names.join(',') }});
  }
}
