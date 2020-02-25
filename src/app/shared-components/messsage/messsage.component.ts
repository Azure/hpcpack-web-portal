import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

export interface MessageBoxOptions {
  type: 'error' | 'confirm';
  message: string;
}

@Component({
  selector: 'app-messsage',
  templateUrl: './messsage.component.html',
  styleUrls: ['./messsage.component.scss']
})
export class MesssageComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public options: MessageBoxOptions,
  ) { }

  ngOnInit() {
  }

  get styleClass(): string {
    return this.options.type;
  }

  get title(): string {
    return this.options.type == 'error' ? 'Error' : 'Confirmation';
  }

  get icon(): string {
    return this.options.type == 'error' ? 'error_outline' : 'notifications_none';
  }

  get message(): string {
    return this.options.message;
  }

  get confirm(): boolean {
    return this.options.type == 'confirm';
  }

}
