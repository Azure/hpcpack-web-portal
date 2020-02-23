import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectionList } from '@angular/material';

export interface GroupSeletorItem {
  name: string;
  disabled: boolean;
  selected: boolean;
}

@Component({
  selector: 'app-group-selector',
  templateUrl: './group-selector.component.html',
  styleUrls: ['./group-selector.component.scss']
})
export class GroupSelectorComponent implements OnInit {
  @ViewChild('selector', { static: true })
  selector: MatSelectionList;

  constructor(
    @Inject(MAT_DIALOG_DATA) public groupItems: GroupSeletorItem[],
    private dialogRef: MatDialogRef<GroupSelectorComponent>,
  ) { }

  ngOnInit() {
  }

  get result(): GroupSeletorItem[] {
    let items: GroupSeletorItem[] = [];
    this.selector.options.forEach((e, i) => {
      if (e.selected !== this.groupItems[i].selected) {
        items.push({
          name: this.groupItems[i].name,
          selected: e.selected,
          disabled: e.disabled
        });
      }
    })
    return items;
  }

  closeDialog() {
    this.dialogRef.close(this.result);
  }
}
