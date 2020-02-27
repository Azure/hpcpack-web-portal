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
import { GroupEditorComponent } from './group-editor/group-editor.component';

const routes: Routes = [{
  path: '',
  component: NodesComponent,
  children: [
    { path: '', component: NodeListComponent, data: { breadcrumb: "List" }},
    { path: 'map', component: NodeMapComponent, data: { breadcrumb: "Heat Map" }},
    { path: 'groups', component: GroupListComponent, data: { breadcrumb: "Groups" }},
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
    GroupEditorComponent,
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
    GroupSelectorComponent,
    GroupEditorComponent,
  ],
})
export class NodesModule { }
