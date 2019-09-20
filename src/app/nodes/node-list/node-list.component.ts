import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections'
import { Node } from '../../models/node'
import { DefaultService as ApiService } from '../../api-client';
import { RestObject } from '../../api-client/model/models'


@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'state', 'health', 'groups'];

  dataSource: MatTableDataSource<Node> = new MatTableDataSource();

  selection = new SelectionModel<Node>(true);

  constructor(
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh(): void {
    this.api.getNodes().subscribe(result => {
      this.selection.clear();
      this.dataSource.data = result.map(e => Node.fromProperties(e.Properties));
    })
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
      this.dataSource.data.forEach(node => this.selection.select(node));
  }

  bringOnline(): void {
    let names = this.selection.selected.map(node => node.Name);
    this.api.operateNodes("online", names).subscribe(_ => {
      this.refresh();
    });
  }

  takeOffline(): void {
    let names = this.selection.selected.map(node => node.Name);
    this.api.operateNodes("offline", names).subscribe(_ => {
      this.refresh();
    });
  }
}
