import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatDialog, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { MatSort, Sort } from '@angular/material/sort';
import { Subscription, Observable } from 'rxjs'
import { Job } from '../models/job'
import { UserService } from '../services/user.service'
import { ApiService } from '../services/api.service';
import { ColumnDef, ColumnSelectorComponent, ColumnSelectorInput, ColumnSelectorResult }
  from '../shared-components/column-selector/column-selector.component'
import { CollapsablePanelOptions } from '../shared-components/collapsable-panel/collapsable-panel.component';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit, OnDestroy {
  readonly columns: ColumnDef[] = Job.properties;

  dataSource: MatTableDataSource<Job> = new MatTableDataSource();

  selection = new SelectionModel<Job>(true);

  private static readonly defaultSelectedColumns = [
    "Id",
    "Name",
    "State",
    "Owner",
    "Progress",
    "CreateTime",
    "SubmitTime",
    "StartTime",
    "ChangeTime",
    "EndTime",
    "ErrorMessage",
  ];

  private userOptions = this.userService.userOptions.jobOptions;

  private get selectedColumns(): string[] {
    return this.userOptions.selectedColumns || JobsComponent.defaultSelectedColumns;
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
      this.orderByValue = this.userOptions.orderBy || 'Id';
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
        this.ascValue = false;
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

  private updateInterval = 1500;

  private updateExpiredIn = 5 * 60 * 1000;

  private subscription: Subscription = new Subscription();

  private pageDataSub: Subscription;

  private pageLoading: boolean = false;

  get isLoading(): boolean {
    return this.pageLoading;
  }

  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    if (value) {
    //NOTE: Only when ngAfterViewInit() then there will be a value for MatSort, since it's inside
    //a <ng-template> now(and the <ng-template> is controlled by a <app-collapsable-panel>).
    this.dataSource.sort = value;
    }
  };

  nodes: string[];

  get nodesLabel(): string {
    if (!this.nodes) {
      return null;
    }
    if (this.nodes.length == 1) {
      return `On Node ${this.nodes[0]}`;
    }
    return `On Nodes ${this.nodes.join(', ')}`;
  }

  get noPagination(): boolean {
    return !!this.nodes;
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

  ngOnInit() {
    this.route.queryParamMap.subscribe(map => {
      let nodesParam = map.get('nodes');
      this.nodes = nodesParam ? nodesParam.split(',') : null;
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.reset();
  }

  private loadData(): void {
    if (this.nodes) {
      this.getJobsForNodes();
    }
    else {
      this.getJobs();
    }
  }

  private readonly propertiesToRead = Job.properties.map(p => p.name).join(',');

  private getJobsForNodes(): void {
    if (this.pageLoading) {
      this.pageDataSub.unsubscribe();
    }
    this.pageLoading = true;
    this.pageDataSub = this.api.getJobs(null, this.nodes.join(','), this.propertiesToRead).subscribe({
      next: res => {
        this.pageLoading = false;
        let jobs = res.map(e => Job.fromProperties(e.Properties));
        this.dataSource.data = jobs;
      },
      error: err => {
        this.pageLoading = false;
        console.error(err);
      }
    });
  }

  private getJobs(): void {
    if (this.pageLoading) {
      this.pageDataSub.unsubscribe();
    }
    this.pageLoading = true;
    this.pageDataSub = this.api.getJobs(null, null, this.propertiesToRead, null, null, this.orderBy, this.asc, this.startRow, this.pageSize, null, 'response').subscribe({
      next: res => {
        this.pageLoading = false;
        this.rowCount = Number(res.headers.get('x-ms-row-count'));
        let jobs = res.body.map(e => Job.fromProperties(e.Properties));
        this.dataSource.data = jobs;
      },
      error: err => {
        this.pageLoading = false;
        console.error(err);
      }
    });
  }

  onPageChange(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.refresh();
  }

  onSortChange(e: Sort): void {
    this.orderBy = e.active;
    this.asc = (e.direction == "asc");
    if (!this.noPagination && this.pageSize < this.rowCount) {
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

  routerLinkToJob(row: Job): string[] {
    return ['.', row.Id.toString()];
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
      this.dataSource.data.forEach(job => this.selection.select(job));
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

  private updateJob(job: Job): void {
    let old = this.dataSource.data.find(j => j.Id === job.Id)
    if (old) {
      old.update(job);
    }
  }

  private operateOnSelectedJobs(operate: (job: Job) => Observable<Job>): void {
    for (let job of this.selection.selected) {
      let sub = operate(job).subscribe(newJob => {
        this.updateJob(newJob);
      });
      this.subscription.add(sub);
    }
  }

  get canSubmitJobs(): boolean {
    if (!this.anySelected) {
      return false;
    }
    return this.selection.selected.every(e => e.State === 'Configuring');
  }

  submitJobs(): void {
    this.operateOnSelectedJobs(job => this.api.submitJobAndWatch(job.Id, this.updateInterval, this.updateExpiredIn));
  }

  private readonly cancelableStates: Set<string> = new Set(['Configuring', 'Submitted', 'Validating', 'Queued', 'Running']);

  get canCancelJobs(): boolean {
    if (!this.anySelected) {
      return false;
    }
    return this.selection.selected.every(e => this.cancelableStates.has(e.State));
  }

  cancelJobs(): void {
    this.operateOnSelectedJobs(job => this.api.cancelJobAndWatch(job.Id, this.updateInterval, this.updateExpiredIn));
  }

  finishJobs(): void {
    this.operateOnSelectedJobs(job => this.api.finishJobAndWatch(job.Id, this.updateInterval, this.updateExpiredIn));
  }

  get canRequeueJobs(): boolean {
    if (!this.anySelected) {
      return false;
    }
    return this.selection.selected.every(e => e.State === 'Failed' || e.State === 'Canceled');
  }

  requeueJobs(): void {
    this.operateOnSelectedJobs(job => this.api.requeueJobAndWatch(job.Id, this.updateInterval, this.updateExpiredIn));
  }

  viewNodes(): void {
    let ids = this.selection.selected.map(e => e.Id);
    this.router.navigate(['/nodes'], { queryParams: { jobs: ids.join(',') }});
  }
}
