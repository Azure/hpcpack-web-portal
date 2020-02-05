import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { Subscription, Observable } from 'rxjs';
import { Task } from '../../models/task';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { MediaQueryService } from '../../services/media-query.service';
import { ColumnDef, ColumnSelectorComponent, ColumnSelectorInput, ColumnSelectorResult }
  from '../../shared-components/column-selector/column-selector.component';

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
    return this.selectedColumns;
  }

  orderBy: string = "TaskId";

  asc: boolean = true;

  rowCount: number;

  readonly pageSizeOptions = [25, 50, 100, 200, 500];

  pageSize: number = this.pageSizeOptions[0];

  pageIndex: number = 0;

  private get startRow(): number {
    return this.pageIndex * this.pageSize;
  }

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

  private jobId: number;

  constructor(
    private route: ActivatedRoute,
    private mediaQuery: MediaQueryService,
    private api: ApiService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.route.paramMap.subscribe(map => {
      this.jobId = Number(map.get('id'));
      console.log(this.jobId);
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

  columnText(row: any, column: string): string {
    let v = row[column];
    if (v instanceof Date) {
      return `${v.getFullYear()}/${v.getMonth() + 1}/${v.getDate()} ${v.getHours()}:${v.getMinutes()}:${v.getSeconds()}`
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
