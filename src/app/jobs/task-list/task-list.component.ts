import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Task } from '../../models/task';
import { UserService } from '../../services/user.service';
import { ApiService, TaskOperation } from '../../services/api.service';
import { ColumnDef, ColumnSelectorComponent, ColumnSelectorInput, ColumnSelectorResult }
  from '../../shared-components/column-selector/column-selector.component';
import { CollapsablePanelOptions } from 'src/app/shared-components/collapsable-panel/collapsable-panel.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  readonly columns: ColumnDef[] = Task.properties;

  dataSource: MatTableDataSource<Task> = new MatTableDataSource();

  selection = new SelectionModel<Task>(true);

  private static readonly defaultSelectedColumns = [
    "TaskId",
    "Name",
    "State",
    "CommandLine",
    "RequiredNodes",
    "AllocatedNodes",
    "StartTime",
    "EndTime",
    "Output",
    "ErrorMessage",
  ];

  //TODO: this.userService.userOptions returned by browser storage doesn't have the newly added key,
  //such as "taskOptions", so that this.userOptions will be null. Fix it so that update on this.userService.userOptions
  //won't trouble user who has an old this.userService.userOptions saved in browser.
  private userOptions = this.userService.userOptions.taskOptions;

  private get selectedColumns(): string[] {
    return this.userOptions.selectedColumns || TaskListComponent.defaultSelectedColumns;
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
      this.orderByValue = this.userOptions.orderBy || 'TaskId';
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

  private updateInterval = 1500;

  private updateExpiredIn = 5 * 60 * 1000;

  private subscription: Subscription = new Subscription();

  private jobId: number;

  panelOptions: CollapsablePanelOptions;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.panelOptions = new CollapsablePanelOptions(this.userService, this.userOptions);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.jobId = Number(map.get('id'));
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.reset();
  }

  refresh(): void {
    this.reset();
    this.loadData();
  }

  private reset(): void {
    if (this.pageLoading) {
      this.pageDataSub.unsubscribe();
    }
    this.pageLoading = false;
    this.pageDataSub = null;
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    this.selection.clear();
    this.dataSource.data = [];
  }

  private readonly propertiesToRead = Task.properties.map(p => p.name).join(',');

  private loadData(): void {
    if (this.pageLoading) {
      this.pageDataSub.unsubscribe();
    }
    this.pageLoading = true;
    this.pageDataSub = this.api.getTasks(this.jobId, null, this.propertiesToRead, null, null, this.orderBy, this.asc, this.startRow, this.pageSize, null, 'response').subscribe({
      next: res => {
        this.pageLoading = false;
        this.rowCount = Number(res.headers.get('x-ms-row-count'));
        let tasks = res.body.map(e => Task.fromProperties(e.Properties));
        this.dataSource.data = tasks;
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
    if (this.pageSize < this.rowCount) {
      this.refresh();
    }
  }

  columnText(row: any, column: string): string {
    let v = row[column];
    if (v instanceof Date) {
      return v.toLocaleString();
    }
    return v;
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
      this.dataSource.data.forEach(item => this.selection.select(item));
  }

  private updateTask(task: Task): void {
    let old = this.dataSource.data.find(e => e.TaskId === task.TaskId)
    if (old) {
      old.update(task);
    }
  }

  private operateOnSelectedTasks(operation: TaskOperation): void {
    for (let task of this.selection.selected) {
      let sub = this.api.doTaskOperationAndWatch(operation, task.TaskId, this.updateInterval, this.updateExpiredIn).subscribe(newTask => {
        this.updateTask(newTask);
      });
      this.subscription.add(sub);
    }
  }

  private readonly cancelableStates: Set<string> = new Set(['Configuring', 'Submitted', 'Validating', 'Queued', 'Dispatching', 'Running']);

  get canCancelTasks(): boolean {
    if (!this.anySelected) {
      return false;
    }
    return this.selection.selected.every(e => this.cancelableStates.has(e.State));
  }

  cancelTasks(): void {
    this.operateOnSelectedTasks('cancel');
  }

  finishTasks(): void {
    this.operateOnSelectedTasks('finish');
  }

  get canRequeueTasks(): boolean {
    if (!this.anySelected) {
      return false;
    }
    //TODO: When parent job is over(either finished or failed), a task can not be requeued.
    return this.selection.selected.every(e => e.State === 'Failed' || e.State === 'Canceled');
  }

  requeueTasks(): void {
    this.operateOnSelectedTasks('requeue');
  }
}
