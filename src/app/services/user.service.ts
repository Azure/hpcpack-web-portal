import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { UserOptions } from '../models/user-options';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends LocalStorageService {
  get user(): User {
    return this.getProperty('user');
  }

  set user(value: User) {
    this.setProperty('user', value);
  }

  get authenticated(): boolean {
    return this.getProperty('authenticated');
  }

  set authenticated(value: boolean) {
    this.setProperty('authenticated', value);
  }

  get userOptions(): UserOptions {
    let opt = this.getProperty('userOptions');
    if (opt === undefined) {
      opt = new UserOptions();
      this.userOptions = opt;
    }
    return opt;
  }

  set userOptions(value: UserOptions) {
    this.setProperty('userOptions', value);
  }

  constructor() {
    super();
  }
}
