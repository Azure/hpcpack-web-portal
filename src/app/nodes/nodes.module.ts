import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NodesComponent } from './nodes.component';

const routes: Routes = [{
  path: '',
  component: NodesComponent,
}];

@NgModule({
  declarations: [NodesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class NodesModule { }
