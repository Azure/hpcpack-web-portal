import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../material.module'
import { ColumnSelectorComponent } from '../column-selector/column-selector.component'
import { ListItemSelectorComponent } from '../list-item-selector/list-item-selector.component'
import { NodesComponent } from './nodes.component'
import { NodeListComponent } from './node-list/node-list.component';
import { NodeMapComponent } from './node-map/node-map.component';

const routes: Routes = [{
  path: '',
  component: NodesComponent,
  children: [
    { path: 'list', component: NodeListComponent, data: { breadcrumb: "List" }},
    { path: 'map', component: NodeMapComponent, data: { breadcrumb: "Heat Map" }},
    { path: '', redirectTo: 'list', pathMatch: 'full' },
  ],
}];

@NgModule({
  declarations: [
    NodesComponent,
    NodeListComponent,
    NodeMapComponent,
    ColumnSelectorComponent,
    ListItemSelectorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
  ],
  entryComponents: [
    ColumnSelectorComponent,
  ]
})
export class NodesModule { }
