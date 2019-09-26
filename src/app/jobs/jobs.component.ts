import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs'
import { Job } from '../models/job'
import { UserService } from '../services/user.service'
import { ApiService } from '../services/api.service';
import { ColumnSelectorComponent, ColumnSelectorResult } from '../shared-components/column-selector/column-selector.component'


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  dataSource: MatTableDataSource<Job> = new MatTableDataSource();

  selection = new SelectionModel<Job>(true);

  @ViewChild(MatSort, {static: true})
  private sort: MatSort;

  private selectedColumns: string[] = ["Id", "Name", "Owner"];

  get displayedColumns(): string[] {
    return ['Select'].concat(this.selectedColumns);
  }

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.api.getJobs(null, null, null, null, null, 10000).subscribe((data) => {
      this.dataSource.data = data.map(e => Job.fromProperties(e.Properties));
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
      this.dataSource.data.forEach(job => this.selection.select(job));
  }

}
