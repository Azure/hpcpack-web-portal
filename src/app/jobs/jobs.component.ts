import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { MatSort } from '@angular/material/sort';
import { Subscription, Observable } from 'rxjs'
import { Job } from '../models/job'
import { UserService } from '../services/user.service'
import { ApiService } from '../services/api.service';
import { ColumnSelectorComponent, ColumnSelectorResult } from '../shared-components/column-selector/column-selector.component'


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Job> = new MatTableDataSource();

  selection = new SelectionModel<Job>(true);

  @ViewChild(MatSort, {static: true})
  private sort: MatSort;

  private selectedColumns: string[];

  private get unselectedColumns(): string[] {
    return JobsComponent.availableColumns.filter(e => !this.selectedColumns.includes(e));
  }

  private static availableColumns: string[] = [
    "Id",
    "Name",
    "Owner",
    // "UserName",
    // "Project",
    // "RuntimeSeconds",
    "SubmitTime",
    "CreateTime",
    "EndTime",
    "StartTime",
    "ChangeTime",
    "State",
    // "PreviousState",
    // "MinCores",
    // "MaxCores",
    // "MinNodes",
    // "MaxNodes",
    // "MinSockets",
    // "MaxSockets",
    // "UnitType",
    // "RequestedNodes",
    // "IsExclusive",
    // "RunUntilCanceled",
    // "NodeGroups",
    // "FailOnTaskFailure",
    // "AutoCalculateMax",
    // "AutoCalculateMin",
    // "CanGrow",
    // "CanShrink",
    // "Preemptable",
    "ErrorMessage",
    // "HasRuntime",
    // "RequeueCount",
    // "MinMemory",
    // "MaxMemory",
    // "MinCoresPerNode",
    // "MaxCoresPerNode",
    // "EndpointReference",
    // "SoftwareLicense",
    // "OrderBy",
    // "ClientSource",
    "Progress",
    // "ProgressMessage",
    // "TargetResourceCount",
    // "ExpandedPriority",
    // "ServiceName",
    // "JobTemplate",
    // "HoldUntil",
    // "NotifyOnStart",
    // "NotifyOnCompletion",
    // "ExcludedNodes",
    // "EmailAddress",
    // "Pool",
    // "Priority",
    // "AllocatedNodes",
    // "JobValidExitCodes",
    // "ParentJobIds",
    // "FailDependentTasks",
    // "NodeGroupOp",
    // "SingleNode",
    // "ChildJobIds",
    // "EstimatedProcessMemory",
    // "PlannedCoreCount",
    // "TaskExecutionFailureRetryLimit",
  ];

  get displayedColumns(): string[] {
    return ['Select'].concat(this.selectedColumns);
  }

  private updateInterval = 1500;

  private updateExpiredIn = 5 * 60 * 1000;

  private subscription: Subscription = new Subscription();

  constructor(
    private api: ApiService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.selectedColumns = this.userService.userOptions.jobOptions.selectedColumns;
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.api.getJobs(null, Job.properties.join(','), null, null, null, 10000).subscribe((data) => {
      this.dataSource.data = data.map(e => Job.fromProperties(e.Properties));
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    let data = { selected: this.selectedColumns, unselected: this.unselectedColumns };
    let dialogRef = this.dialog.open(ColumnSelectorComponent, { data })
    dialogRef.afterClosed().subscribe((result: undefined | ColumnSelectorResult) => {
      if (result) {
        this.selectedColumns = result.selected;
        this.userService.userOptions.jobOptions.selectedColumns = this.selectedColumns;
        this.userService.userOptions = this.userService.userOptions; //save options
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
}
