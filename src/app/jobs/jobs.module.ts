import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../material.module'
import { SharedComponents } from '../shared-components/shared-components.module'
import { JobsComponent } from './jobs.component';

const routes: Routes = [{
  path: '',
  component: JobsComponent,
}];

@NgModule({
  declarations: [JobsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedComponents,
  ]
})
export class JobsModule { }
