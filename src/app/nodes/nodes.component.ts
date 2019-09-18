import { Component } from '@angular/core';


@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})
export class NodesComponent {
  readonly navItems = [
    {
      path: 'list',
      name: 'List'
    },
    {
      path: 'map',
      name: 'Heat Map'
    }
  ];

  constructor() {}

}
