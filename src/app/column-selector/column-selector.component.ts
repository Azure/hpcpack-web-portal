import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ListItemSelectorComponent } from '../list-item-selector/list-item-selector.component'

export interface ColumnSelectorInput {
  selected: string[];
  unselected: string[];
}

export interface ColumnSelectorResult {
  selected: string[];
  unselected: string[];
}

@Component({
  selector: 'app-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: ['./column-selector.component.scss']
})
export class ColumnSelectorComponent {
  @ViewChild(ListItemSelectorComponent, { static: false })
  private selector: ListItemSelectorComponent;

  private viewInited = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: ColumnSelectorInput,
    private dialogRef: MatDialogRef<ColumnSelectorComponent>,
  ) {}

  get result(): ColumnSelectorResult | undefined {
    return this.selector ? { selected: this.selector.selected, unselected: this.selector.unselected } : undefined;
  }

  closeDialog() {
    this.dialogRef.close(this.result);
  }

}
