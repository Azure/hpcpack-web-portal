import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ListItemSelectorComponent } from '../list-item-selector/list-item-selector.component'

export interface ColumnDef {
  name: string;
  label: string;
}

export interface ColumnSelectorInput {
  columns: ColumnDef[];
  selected: string[];
}

export interface ColumnSelectorResult {
  selected: string[];
}

@Component({
  selector: 'app-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: ['./column-selector.component.scss']
})
export class ColumnSelectorComponent {
  @ViewChild(ListItemSelectorComponent, { static: false })
  private selector: ListItemSelectorComponent;

  selected: string[];

  unselected: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private input: ColumnSelectorInput,
    private dialogRef: MatDialogRef<ColumnSelectorComponent>,
  ) {
    let pairs: [string, string][] = this.input.columns.map(c => [c.name, c.label]);
    let nameToLabel = new Map(pairs);
    this.selected = this.input.selected.map(e => nameToLabel.get(e));
    let selectedSet = new Set(this.input.selected);
    let unselected = this.input.columns.map(c => c.name).filter(e => !selectedSet.has(e));
    this.unselected = unselected.map(e => nameToLabel.get(e));
  }

  get result(): ColumnSelectorResult | undefined {
    if (!this.selector) {
      return undefined;
    }
    let pairs: [string, string][] = this.input.columns.map(c => [c.label, c.name]);
    let labelToName = new Map(pairs);
    return { selected: this.selector.selected.map(e => labelToName.get(e)) };
  }

  closeDialog() {
    this.dialogRef.close(this.result);
  }

}
