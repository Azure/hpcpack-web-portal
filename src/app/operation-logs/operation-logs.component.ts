import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  private loadingData: boolean = false;

  get isLoading(): boolean {
    return this.loadingData;
  }

  nodes: string[];

  get nodesLabel(): string {
    if (!this.nodes) {
      return null;
    }
    if (this.nodes.length == 1) {
      return `For Node ${this.nodes[0]}`;
    }
    return `For Nodes ${this.nodes.join(', ')}`;
  }

  //Whether the first log is being requested
  private gettingFirst: boolean = false;

  //The time of the first log
  private firstTime: Date;

  //Cursor for loadMoreData, not simply meaning "now".
  private currentTime: Date;

  //Get 14 days' log once
  private readonly timeSpan = 1000 * 3600 * 24 * 14;

  //Get the number of logs once at most
  private readonly limit = 100;

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
  //inside a <ng-template>.
  @ViewChild('tableContainer', { read: ElementRef, static: false })
  tableContainerRef: ElementRef

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.panelOptions = new CollapsablePanelOptions(this.userService, this.userOptions);
    this.currentTime = new Date();
  }

  //NOTE: Angular may "reuse" the component without destroying it(calling ngOnDestroy) before,
  //and thus without calling ngAfterViewInit. For example, when /logs is accessed after /logs?nodes=xxx.
  //When a component is reused, only ngOnInit is called, among the ngOnInit, ngOnDestroy and
  //ngAfterViewInit hooks. So we have to "reset" the component in ngOnInit, before "loadData".
  //That's what "refresh" does. Also note that this.nodes also gets "reset" by queryParamMap.
  ngOnInit() {
    this.route.queryParamMap.subscribe(map => {
      let nodesParam = map.get('nodes');
      if (nodesParam) {
        this.nodes = nodesParam.split(',');
      }
      else {
        this.nodes = null;
      }
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.reset();
  }

  ngAfterViewInit(): void {
    fromEvent<Event>(this.tableContainerRef.nativeElement, 'scroll')
      .pipe(debounceTime(500))
      .subscribe(e => this.onTableScroll(e));
  }

  onTableScroll(e: Event): void {
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
    this.gettingFirst = false;
    this.firstTime = null;
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

  private get loadedAll(): boolean {
    if (this.firstTime) {
      return this.currentTime <= this.firstTime;
    }

    if (!this.gettingFirst) {
      let nodes: string = null;
      if (this.nodes) {
        nodes = this.nodes.join(',');
      }
      this.api.getClusterFirstOperation(null, null, null, null).subscribe(
        res => {
          this.firstTime = new Date(res.UpdateTime); //Parse JOSN string into Date
          this.gettingFirst = false;
        },
        err => {
          console.error(err);
          this.gettingFirst = false;
        }
      );
      this.gettingFirst = true;
    }
    return false;
  }

  private get shouldLoadMore(): boolean {
    if (this.isLoading || this.loadedAll) {
      return false;
    }
    if (!this.tableContainerRef) {
      //When UI is not rendered completely, tableContainerRef hasn't got a value. We should load
      //data in that case.
      return true;
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
    let nodes: string = null;
    if (this.nodes) {
      nodes = this.nodes.join(',');
    }
    this.dataSubscription = this.api.getClusterOperations(null, fromTime, this.currentTime, this.limit, nodes).subscribe({
      next: res => {
        this.loadingData = false;

        let data: OperationLog[] = null;
        if (res && res.length > 0) {
          data = res.map(e => OperationLog.fromJson(e));
          this.dataSource.data = this.dataSource.data.concat(data);
        }

        //Move cursor for next loadMoreData
        if (!data || data.length < this.limit) {
          this.currentTime = new Date(fromTime.getTime() + 1);
        }
        else {
          let last = data[data.length - 1];
          //NOTE: If multiple events happened at the same last.UpdateTime, then here MAY hide some from showing.
          this.currentTime = new Date(last.UpdateTime.getTime());
        }

        if (onDataLoad) {
          onDataLoad();
        }
      },
      error: err => {
        this.loadingData = false;
        console.error(err);
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
