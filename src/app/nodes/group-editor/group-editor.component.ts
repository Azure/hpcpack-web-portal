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
      //TODO: validate against blank value
      name: [this.group.Name, Validators.required],
      description: [this.group.Description],
    });
  }

  ngOnInit() {
  }

  get title(): string {
    return this.edit ? 'Edit Group' : 'New Group';
  }

  get result(): NodeGroup {
    let g: NodeGroup = { Name: this.formGroup.value.name, Description: this.formGroup.value.description };
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
