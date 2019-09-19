import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Node } from '../../models/node'
import { DefaultService as ApiService } from '../../api-client';
import { RestObject } from '../../api-client/model/models'


@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'state', 'health', 'groups'];

  dataSource: MatTableDataSource<Node> = new MatTableDataSource();

  constructor(
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.api.getNodes().subscribe(result => {
      this.dataSource.data = result.map(e => Node.fromProperties(e.Properties));
    })
  }

}
