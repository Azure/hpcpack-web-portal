import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-item-selector',
  templateUrl: './list-item-selector.component.html',
  styleUrls: ['./list-item-selector.component.scss']
})
export class ListItemSelectorComponent implements OnInit {
  @Input()
  set selected(value: string[]) {
    this._selected = Array.from(value);
  }

  get selected(): string[] {
    return this._selected;
  }

  @Input()
  set unselected(value: string[]) {
    this._unselected = Array.from(value);
  }

  get unselected(): string[] {
    return this._unselected;
  }

  private _selected: string[] = [];

  private _unselected: string[] = [];

  constructor() { }

  ngOnInit() {
  }

  select(item: string): void {
    let idx = this._unselected.indexOf(item);
    if (idx >= 0) {
      this._unselected.splice(idx, 1);
      this._selected.push(item);
    }
  }

  unselect(item: string): void {
    let idx = this._selected.indexOf(item);
    if (idx >= 0) {
      this._selected.splice(idx, 1);
      this._unselected.unshift(item);
    }
  }

  moveUp(item: string): void {
    let idx = this._selected.indexOf(item);
    if (idx > 0) {
      let preItem = this._selected[idx - 1];
      this._selected[idx - 1] = this._selected[idx];
      this._selected[idx] = preItem;
    }
  }

  moveDown(item: string): void {
    let idx = this._selected.indexOf(item);
    if (idx >= 0 && idx < this._selected.length - 1) {
      let nextItem = this._selected[idx + 1];
      this._selected[idx + 1] = this._selected[idx];
      this._selected[idx] = nextItem;
    }
  }

}
