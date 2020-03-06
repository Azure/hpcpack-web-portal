import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { OperationLogEntry, OperationLog } from 'src/app/models/operation-log';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-operation-log',
  templateUrl: './operation-log.component.html',
  styleUrls: ['./operation-log.component.scss']
})
export class OperationLogComponent implements OnInit, OnDestroy {
  readonly columns = OperationLogEntry.properties;

  displayedColumns: string[] = ['Type', 'CreateTime', 'Message'];

  dataSource: MatTableDataSource<OperationLogEntry> = new MatTableDataSource();

  private dataSubscription: Subscription;

  private loadingData: boolean = false;

  get isLoading(): boolean {
    return this.loadingData;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public log: OperationLog,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.reset();
  }

  refresh(): void {
    this.reset();
    this.loadData();
  }

  private reset(): void {
    if (this.loadingData) {
      this.dataSubscription.unsubscribe();
    }
    this.loadingData = false;
    this.dataSubscription = null;
    this.dataSource.data = [];
  }

  private get shouldUseCache(): boolean {
    return this.log.Entries && this.log.State !== 'Executing';
  }

  private loadData(): void {
    if (this.shouldUseCache) {
      this.dataSource.data = this.log.Entries;
      return;
    }

    if (this.loadingData) {
      this.dataSubscription.unsubscribe();
    }
    this.loadingData = true;
    this.dataSubscription = this.api.getClusterOperation(this.log.Id).subscribe({
      next: res => {
        this.loadingData = false;
        let obj = OperationLog.fromJson(res);
        this.log.update(obj);
        this.dataSource.data = this.log.Entries;
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

  columnIcon(row: OperationLogEntry): string {
    let res: string;
    switch (row.Severity) {
      case 'Information':
        res = 'info';
        break;
      case 'Error':
        res = 'error';
        break;
      case 'Warning':
        res = 'warning';
        break;
      case 'Trace':
        res = 'bookmark';
        break;
      default:
        console.error(`Unkown type "${row.Severity}"!`)
        res = 'not_listed_location';
    }
    return res;
  }

  iconClass(row: OperationLogEntry): string {
    let res: string;
    switch (row.Severity) {
      case 'Information':
        res = 'info';
        break;
      case 'Error':
        res = 'error';
        break;
      case 'Warning':
        res = 'warning';
        break;
      case 'Trace':
        res = 'trace';
        break;
      default:
        console.error(`Unkown type "${row.Severity}"!`)
    }
    return res;
  }

  get title(): string {
    return this.log.Name;
  }
}
