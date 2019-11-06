import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

import { DashboardComponent } from './dashboard.component';

const routes: Routes = [{
  path: '',
  component: DashboardComponent,
}];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChartsModule,
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardModule { }
