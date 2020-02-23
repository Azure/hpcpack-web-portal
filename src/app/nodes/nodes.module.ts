import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module'
import { SharedComponents } from '../shared-components/shared-components.module'
import { NodesComponent } from './nodes.component'
import { NodeListComponent } from './node-list/node-list.component';
import { NodeMapComponent } from './node-map/node-map.component';
import { CommanderComponent } from './commander/commander.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupSelectorComponent } from './group-selector/group-selector.component';

const routes: Routes = [{
  path: '',
  component: NodesComponent,
  children: [
    { path: '', component: NodeListComponent, data: { breadcrumb: "List" }},
    { path: 'map', component: NodeMapComponent, data: { breadcrumb: "Heat Map" }},
    {
      path: 'groups',
      data: { breadcrumb: "Groups" },
      children: [
        { path: '', component: GroupListComponent },
        { path: ':group', component: NodeListComponent, data: { breadcrumb: ":group" } }
      ]
    },
  ],
}];

@NgModule({
  declarations: [
    NodesComponent,
    NodeListComponent,
    NodeMapComponent,
    CommanderComponent,
    GroupListComponent,
    GroupSelectorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MaterialModule,
    SharedComponents,
  ],
  entryComponents: [
    CommanderComponent,
    GroupSelectorComponent
  ],
})
export class NodesModule { }
