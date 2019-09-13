import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ChartsComponent } from './charts.component';

const routes: Routes = [{
  path: '',
  component: ChartsComponent,
}];

@NgModule({
  declarations: [ChartsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ChartsModule { }
