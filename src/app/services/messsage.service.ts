import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { MesssageComponent } from '../shared-components/messsage/messsage.component';

@Injectable({
  providedIn: 'root'
})
export class MesssageService {

  constructor(
    private dialog: MatDialog,
  ) { }

  showError(msg: string): void {
    this.dialog.open(MesssageComponent, { data: { message: msg, type: 'error' } });
  }

  confirm(msg: string): Observable<boolean> {
    let dialogRef = this.dialog.open(MesssageComponent, { data: { message: msg, type: 'confirm' } });
    return dialogRef.afterClosed();
  }
}
