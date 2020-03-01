import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { OperationLogsComponent } from './operation-logs.component';

const routes: Routes = [{
  path: '',
  component: OperationLogsComponent,
}];

@NgModule({
  declarations: [OperationLogsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedComponentsModule,
  ]
})
export class OperationLogsModule { }
