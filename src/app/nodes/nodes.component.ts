import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})
export class NodesComponent implements OnInit {

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

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.router.url);
  }

  isActivePath(path: string): boolean {
    let idx = this.router.url.lastIndexOf('/');
    let last = this.router.url.slice(idx + 1);
    idx = last.indexOf('?');
    let base = idx == -1 ? last : last.slice(0, idx);
    return path === '.' ? (base === 'nodes') : (base === path);
  }

}
