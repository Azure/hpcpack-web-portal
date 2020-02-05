import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../material.module'
import { SharedComponents } from '../shared-components/shared-components.module'
import { JobsComponent } from './jobs.component';
import { TaskListComponent } from './task-list/task-list.component';

const routes: Routes = [{
  path: '',
  children: [
    { path: '', component: JobsComponent },
    { path: ':id', component: TaskListComponent, data: { breadcrumb: ":id" } },
  ]
}];

@NgModule({
  declarations: [JobsComponent, TaskListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedComponents,
  ]
})
export class JobsModule { }
