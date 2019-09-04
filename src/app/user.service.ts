import { Injectable } from '@angular/core';
import { User } from './models/user';
import { LocalStorageService } from './local-storage.service';
import { extend } from 'webdriver-js-extender';

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

  constructor() {
    super();
  }
}
