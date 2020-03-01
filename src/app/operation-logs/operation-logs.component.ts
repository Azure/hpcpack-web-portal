import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ColumnDef, ColumnSelectorInput, ColumnSelectorComponent, ColumnSelectorResult }
  from '../shared-components/column-selector/column-selector.component';
import { CollapsablePanelOptions } from '../shared-components/collapsable-panel/collapsable-panel.component';
import { OperationLog } from '../api-client';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { LogOptions } from '../models/user-options';

@Component({
  selector: 'app-operation-logs',
  templateUrl: './operation-logs.component.html',
  styleUrls: ['./operation-logs.component.scss']
})
export class OperationLogsComponent implements OnInit, OnDestroy {
  readonly columns: ColumnDef[] = [
    { name: 'Id', label: 'ID' },
    { name: 'Name', label: 'Name' },
    { name: 'State', label: 'State' },
    { name: 'Operator', label: 'Operator' },
    //{ name: 'Node', label: 'Node' },
    { name: 'UpdateTime', label: 'Update Time' },
  ]

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
    return this.selectedColumns;
  }

  private dataSubscription: Subscription;

  private loadingData: boolean = false;

  get isLoading(): boolean {
    return this.loadingData;
  }

  nodes: string[];

  panelOptions: CollapsablePanelOptions;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.panelOptions = new CollapsablePanelOptions(this.userService, this.userOptions);
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.reset();
  }

  private reset(): void {
    if (this.loadingData) {
      this.dataSubscription.unsubscribe();
    }
    this.loadingData = false;
    this.dataSubscription = null;
    this.dataSource.data = [];
  }

  private loadData(): void {
    if (this.loadingData) {
      this.dataSubscription.unsubscribe();
    }
    this.loadingData = true;
    this.dataSubscription = this.api.getClusterOperations().subscribe({
      next: res => {
        this.loadingData = false;
        this.dataSource.data = res;
      },
      error: err => {
        this.loadingData = false;
        console.log(err);
      }
    });
  }

  refresh(): void {
    this.reset();
    this.loadData();
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
}
