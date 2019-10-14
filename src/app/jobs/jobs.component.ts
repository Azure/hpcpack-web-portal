import { Component, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { MatSort } from '@angular/material/sort';
import { MatSidenavContainer } from '@angular/material/sidenav'
import { Subscription, Observable, fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { Job } from '../models/job'
import { UserService } from '../services/user.service'
import { ApiService } from '../services/api.service';
import { ColumnDef, ColumnSelectorComponent, ColumnSelectorInput, ColumnSelectorResult }
  from '../shared-components/column-selector/column-selector.component'

//TODO: A table component with "scroll to load" and "side action panel"?
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit, OnDestroy, AfterViewInit {
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

  private readonly availableColumns: string[] = this.columns.map(c => c.name);

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

  private get selectedColumns(): string[] {
    return this.userService.userOptions.jobOptions.selectedColumns || JobsComponent.defaultSelectedColumns;
  }

  private set selectedColumns(value: string[]) {
    this.userService.userOptions.jobOptions.selectedColumns = value;
    this.userService.saveUserOptions();
  }

  get displayedColumns(): string[] {
    return ['Select'].concat(this.selectedColumns);
  }

  private updateInterval = 1500;

  private updateExpiredIn = 5 * 60 * 1000;

  private subscription: Subscription = new Subscription();

  private continuationToken: string = null;

  private loading: boolean = false;

  get isLoading(): boolean {
    return this.loading;
  }

  private allLoaded: boolean = false;

  get canLoadMore(): boolean {
    return !(this.loading || this.allLoaded);
  }

  private readonly dataPageSize = 100;

  private actionListHidden = false;

  @ViewChild(MatSidenavContainer, { static: false })
  private sidenavContainer: MatSidenavContainer;

  @ViewChild('tableContainer', { read: ElementRef, static: false })
  private tableContainerRef: ElementRef;

  @ViewChild(MatSort, { static: true })
  private sort: MatSort;

  constructor(
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

  ngAfterViewInit(): void {
    fromEvent<Event>(this.tableContainerRef.nativeElement, 'scroll')
      .pipe(debounceTime(500))
      .subscribe(e => this.onTableScroll(e));
  }

  private reset(): void {
    //TODO: Use separate subscriptions for loading and updating and don't unsubscribe the updating one on reset?
    this.subscription.unsubscribe();
    //When a subscription is unsubscribed, new subscription added to it won't work.
    //So a new subscription instance is required.
    this.subscription = new Subscription();
    this.selection.clear();
    this.dataSource.data = [];
    this.continuationToken = null;
    this.loading = false;
    this.allLoaded = false;
  }

  //TODO: let browser refresh instead?
  refresh(): void {
    this.reset();
    this.loadMoreData();
  }

  get loadDataActionText(): string {
    return this.loading ? 'Loading...' : 'Load More Data';
  }

  loadMoreData(): void {
    console.log('Loading more data...');
    if (!this.canLoadMore) {
      return;
    }
    this.loading = true;
    //TODO: 1. Get only those for columns? 2. Filter on job owner for user role?
    let sub = this.api.getJobs(null, Job.properties.join(','), null, null, null, this.dataPageSize, this.continuationToken, 'response').subscribe({
      next: res => {
        this.loading = false;
        this.continuationToken = res.headers.get('x-ms-continuation-queryId');
        this.allLoaded = (this.continuationToken == null);
        let jobs = res.body.map(e => Job.fromProperties(e.Properties));
        this.dataSource.data = this.dataSource.data.concat(jobs);
      },
      error: err => {
        this.loading = false;
        console.log(err);
      }
    });
    this.subscription.add(sub);
  }

  onTableScroll(e: Event): void {
    console.log('Scrolling...');
    if (!this.canLoadMore) {
      return;
    }
    let target = e.target as Element;
    let totalScrollableDistance = target.scrollHeight - target.clientHeight;
    if (totalScrollableDistance > 0 && target.scrollTop / totalScrollableDistance >= 0.8) {
      this.loadMoreData();
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
