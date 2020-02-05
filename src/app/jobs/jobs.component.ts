import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatDialog, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { MatSort, Sort } from '@angular/material/sort';
import { MatSidenavContainer } from '@angular/material/sidenav'
import { Subscription, Observable } from 'rxjs'
import { Job } from '../models/job'
import { UserService } from '../services/user.service'
import { ApiService } from '../services/api.service';
import { MediaQueryService } from '../services/media-query.service'
import { ColumnDef, ColumnSelectorComponent, ColumnSelectorInput, ColumnSelectorResult }
  from '../shared-components/column-selector/column-selector.component'

//TODO: A table component with "scroll to load" and "side action panel"?
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit, OnDestroy {
  readonly columns: ColumnDef[] = [
    { name: "Id", label: "Id" },
    { name: "Name", label: "Name" },
    { name: "Owner", label: "Owner" },
    { name: "SubmitTime", label: "Submitted at" },
    { name: "CreateTime", label: "Created at" },
    { name: "EndTime", label: "Ended at" },
    { name: "StartTime", label: "Started at" },
    { name: "ChangeTime", label: "Changed at" },
    { name: "State", label: "State" },
    { name: "ErrorMessage", label: "Error Message" },
    { name: "Progress", label: "Progress" },
  ];

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

  orderBy: string = "Id";

  asc: boolean = false;

  rowCount: number;

  readonly pageSizeOptions = [25, 50, 100, 200, 500];

  pageSize: number = this.pageSizeOptions[0];

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

  @ViewChild(MatSort, { static: true })
  private sort: MatSort;

  constructor(
    private mediaQuery: MediaQueryService,
    private api: ApiService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
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
    this.pageDataSub = this.api.getJobs(null, Job.properties.join(','), null, null, this.orderBy, this.asc, this.startRow, this.pageSize, null, 'response').subscribe({
      next: res => {
        this.pageLoading = false;
        this.rowCount = Number(res.headers.get('x-ms-row-count'));
        let jobs = res.body.map(e => Job.fromProperties(e.Properties));
        this.dataSource.data = jobs;
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

  submitJobs(): void {
    this.operateOnSelectedJobs(job => this.api.submitJobAndWatch(parseInt(job.Id), this.updateInterval, this.updateExpiredIn));
  }

  cancelJobs(): void {
    this.operateOnSelectedJobs(job => this.api.cancelJobAndWatch(parseInt(job.Id), this.updateInterval, this.updateExpiredIn));
  }

  finishJobs(): void {
    this.operateOnSelectedJobs(job => this.api.finishJobAndWatch(parseInt(job.Id), this.updateInterval, this.updateExpiredIn));
  }

  requeueJobs(): void {
    this.operateOnSelectedJobs(job => this.api.requeueJobAndWatch(parseInt(job.Id), this.updateInterval, this.updateExpiredIn));
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
}
