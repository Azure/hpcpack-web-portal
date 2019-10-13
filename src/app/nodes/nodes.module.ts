import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module'
import { SharedComponents } from '../shared-components/shared-components.module'
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
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MaterialModule,
    SharedComponents,
  ],
})
export class NodesModule { }
