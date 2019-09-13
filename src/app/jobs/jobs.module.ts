import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { JobsComponent } from './jobs.component';

const routes: Routes = [{
  path: '',
  component: JobsComponent,
}];

@NgModule({
  declarations: [JobsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class JobsModule { }
