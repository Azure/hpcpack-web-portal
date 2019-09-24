import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { UserOptions } from '../models/user-options';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends LocalStorageService {
  protected readonly userKey = 'user';

  get user(): User {
    return this.getProperty(this.userKey);
  }

  set user(value: User) {
    this.setProperty(this.userKey, value);
  }

  protected readonly authenticatedKey = 'authenticated';

  get authenticated(): boolean {
    return this.getProperty(this.authenticatedKey);
  }

  set authenticated(value: boolean) {
    this.setProperty(this.authenticatedKey, value);
  }

  protected get userOptionsKey(): string {
    return `${this.user.username}-userOptions`;
  }

  get userOptions(): UserOptions {
    let opt = this.getProperty(this.userOptionsKey, true);
    if (opt === undefined) {
      opt = new UserOptions();
      this.userOptions = opt;
    }
    return opt;
  }

  set userOptions(value: UserOptions) {
    this.setProperty(this.userOptionsKey, value, true);
  }

}
