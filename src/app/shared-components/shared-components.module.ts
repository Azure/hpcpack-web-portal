import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module'
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component'
import { ListItemSelectorComponent } from './list-item-selector/list-item-selector.component'
import { ColumnSelectorComponent } from './column-selector/column-selector.component'
import { MesssageComponent } from './messsage/messsage.component';
import { CollapsablePanelComponent } from './collapsable-panel/collapsable-panel.component';

const components = [
  ProgressSpinnerComponent,
  ListItemSelectorComponent,
  ColumnSelectorComponent,
  MesssageComponent,
  CollapsablePanelComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: components,
  exports: components,
  entryComponents: components
})
export class SharedComponentsModule {}