import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule as NgCharts } from 'ng2-charts';
import { MaterialModule } from '../material.module';
import { ChartsComponent } from './charts.component';
import { ChartComponent } from './chart/chart.component';

const routes: Routes = [{
  path: '',
  component: ChartsComponent,
}];

@NgModule({
  declarations: [ChartsComponent, ChartComponent],
  entryComponents: [ChartComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MaterialModule,
    NgCharts,
  ]
})
export class ChartsModule { }
