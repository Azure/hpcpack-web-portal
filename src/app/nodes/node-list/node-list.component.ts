import { Component, OnInit } from '@angular/core';
import { Node } from '../../models/node'

@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'state', 'health', 'groups'];

  dataSource: Node[] = [
    { name: 'H1', state: 'Online', reachable: true, health: 'OK', nodeGroups: 'HeadNodes, ComputeNodes'},
    { name: 'N1', state: 'Online', reachable: true, health: 'OK', nodeGroups: 'ComputeNodes'},
    { name: 'N2', state: 'Online', reachable: true, health: 'OK', nodeGroups: 'ComputeNodes'},
    { name: 'N3', state: 'Online', reachable: true, health: 'OK', nodeGroups: 'ComputeNodes'},
    { name: 'N4', state: 'Online', reachable: true, health: 'OK', nodeGroups: 'ComputeNodes'},
    { name: 'N5', state: 'Online', reachable: true, health: 'OK', nodeGroups: 'ComputeNodes'},
    { name: 'N6', state: 'Online', reachable: true, health: 'OK', nodeGroups: 'ComputeNodes'},
    { name: 'N7', state: 'Online', reachable: true, health: 'OK', nodeGroups: 'ComputeNodes'},
    { name: 'N8', state: 'Online', reachable: true, health: 'OK', nodeGroups: 'ComputeNodes'},
    { name: 'N9', state: 'Online', reachable: true, health: 'OK', nodeGroups: 'ComputeNodes'},
    { name: 'N10', state: 'Online', reachable: true, health: 'OK',  nodeGroups: 'ComputeNodes'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
