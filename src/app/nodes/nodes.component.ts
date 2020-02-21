import { Component } from '@angular/core';


@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})
export class NodesComponent {
  readonly navItems = [
    {
      path: '.',
      name: 'List'
    },
    {
      path: 'map',
      name: 'Heat Map'
    },
    {
      path: 'groups',
      name: 'Groups'
    }
  ];

  constructor() {}

}
