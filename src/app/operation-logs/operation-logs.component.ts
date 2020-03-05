import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSort } from '@angular/material';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ColumnDef, ColumnSelectorInput, ColumnSelectorComponent, ColumnSelectorResult }
  from '../shared-components/column-selector/column-selector.component';
import { CollapsablePanelOptions } from '../shared-components/collapsable-panel/collapsable-panel.component';
import { OperationLog } from '../models/operation-log';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { LogOptions } from '../models/user-options';
import { OperationLogComponent } from './operation-log/operation-log.component';

@Component({
  selector: 'app-operation-logs',
  templateUrl: './operation-logs.component.html',
  styleUrls: ['./operation-logs.component.scss']
})
export class OperationLogsComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly columns: ColumnDef[] = OperationLog.properties.filter(e => e.name !== 'Entries');

  private readonly defaultSelectedColumns = ['UpdateTime', 'State', 'Name'];

  dataSource: MatTableDataSource<OperationLog> = new MatTableDataSource();

  private get userOptions(): LogOptions {
    let opts = this.userService.userOptions.logOptions;
    if (!opts) {
      opts = this.userService.userOptions.logOptions = {};
    }
    return opts;
  }

  private get selectedColumns(): string[] {
    return this.userOptions.selectedColumns || this.defaultSelectedColumns;
  }

  private set selectedColumns(value: string[]) {
    this.userOptions.selectedColumns = value;
    this.userService.saveUserOptions();
  }

  get displayedColumns(): string[] {
    return this.selectedColumns.concat(['Detail']);
  }

  private dataSubscription: Subscription;

  private loadedAll: boolean = false;

  private loadingData: boolean = false;

  get isLoading(): boolean {
    return this.loadingData;
  }

  nodes: string[];

  //Cursor for loadMoreData, not simply meaning "now".
  currentTime: Date;

  //Get 7 days' log in one time
  private readonly timeSpan = 1000 * 3600 * 24 * 7;

  panelOptions: CollapsablePanelOptions;

  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    if (value) {
    //NOTE: Only when ngAfterViewInit() then there will be a value for MatSort, since it's inside
    //a <ng-template> now(and the <ng-template> is controlled by a <app-collapsable-panel>).
    this.dataSource.sort = value;
    }
  };

  //NOTE: Only when ngAfterViewInit() then there will be a value for tableContainerRef, since it's
  //inside a <ng-template>. And since this.shouldLoadMore depends on it, this.loadData should not be
  //earlier than ngAfterViewInit.
  @ViewChild('tableContainer', { read: ElementRef, static: false })
  tableContainerRef: ElementRef

  constructor(
    private api: ApiService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.panelOptions = new CollapsablePanelOptions(this.userService, this.userOptions);
    this.currentTime = new Date();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.reset();
  }

  ngAfterViewInit(): void {
    fromEvent<Event>(this.tableContainerRef.nativeElement, 'scroll')
      .pipe(debounceTime(500))
      .subscribe(e => this.onTableScroll(e));
    console.log("Listening to scroll");
    //To avoid ExpressionChangedAfterItHasBeenCheckedError, do loadData in next round.
    setTimeout(() => this.loadData(), 0);
  }

  onTableScroll(e: Event): void {
    console.log('Scrolling...');
    this.loadData();
  }

  refresh(): void {
    this.reset();
    //Let UI get update before determining to load more or not, since shouldLoadMore depends on UI change.
    setTimeout(() => this.loadData(), 0);
  }

  private reset(): void {
    if (this.loadingData) {
      this.dataSubscription.unsubscribe();
    }
    this.loadingData = false;
    this.loadedAll = false;
    this.currentTime = new Date();
    this.dataSubscription = null;
    this.dataSource.data = [];
  }

  private loadData(): void {
    if (this.shouldLoadMore) {
      //Let UI get update before determining to load more or not, since shouldLoadMore depends on UI change.
      this.loadMoreData(() => setTimeout(() => this.loadData(), 0));
    }
  }

  private get shouldLoadMore(): boolean {
    if (this.isLoading || this.loadedAll) {
      return false;
    }
    let target = this.tableContainerRef.nativeElement;
    let totalScrollableDistance = target.scrollHeight - target.clientHeight;
    return totalScrollableDistance <= 0 || (totalScrollableDistance > 0 && target.scrollTop / totalScrollableDistance >= 0.9);
  }

  private loadMoreData(onDataLoad?: () => void): void {
    if (this.loadingData) {
      this.dataSubscription.unsubscribe();
    }
    this.loadingData = true;
    //NOTE: api.getClusterOperations gets data between (from, to), exclusive in both ends. So "-1"
    //is required to get data between [fromTime, this.currentTime).
    let fromTime = new Date(this.currentTime.getTime() - this.timeSpan - 1);
    this.dataSubscription = this.api.getClusterOperations(null, fromTime, this.currentTime).subscribe({
      next: res => {
        this.loadingData = false;
        //Move cursor for next loadMoreData
        this.currentTime = new Date(fromTime.getTime() + 1);
        if (res && res.length > 0) {
          let data = res.map(e => OperationLog.fromJson(e));
          this.dataSource.data = this.dataSource.data.concat(data);
        }
        else {
          this.loadedAll = true;
        }
        if (onDataLoad) {
          onDataLoad();
        }
      },
      error: err => {
        this.loadingData = false;
        console.log(err);
      }
    });
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

  showDetail(log: OperationLog): void {
    this.dialog.open(OperationLogComponent, { data: log });
  }
}
