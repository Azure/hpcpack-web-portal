import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NodeGroup } from 'src/app/api-client';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-group-editor',
  templateUrl: './group-editor.component.html',
  styleUrls: ['./group-editor.component.scss']
})
export class GroupEditorComponent implements OnInit {
  formGroup: FormGroup;

  private edit: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public group: NodeGroup,
    private dialogRef: MatDialogRef<NodeGroup>,
    private fb: FormBuilder,
  ) {
    if (!this.group) {
      this.group = {};
      this.edit = false;
    }
    else {
      this.edit = true;
    }
    this.formGroup = this.fb.group({
      name: [this.group.Name, [Validators.required, Validators.pattern(/.*\S+.*/)]],
      description: [this.group.Description],
    });
  }

  ngOnInit() {
  }

  get title(): string {
    return this.edit ? 'Edit Group' : 'New Group';
  }

  private trimInput(str: string): string {
    let result: string;
    try {
      result = str.trim();
    }
    catch {}
    return result;
  }

  get result(): NodeGroup {
    let g: NodeGroup = {
      Name: this.trimInput(this.formGroup.value.name),
      Description: this.trimInput(this.formGroup.value.description)
    };
    if (!this.edit || g.Name != this.group.Name || g.Description != this.group.Description)
      return g;
    return undefined;
  }

  closeDialog() {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.result);
    }
  }
}
