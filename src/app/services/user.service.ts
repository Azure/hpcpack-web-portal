import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { UserOptions } from '../models/user-options';
import { LocalStorageService } from './local-storage.service';

export type AuthStateChangeHandler = (authenticated: boolean) => void;

@Injectable({
  providedIn: 'root'
})
export class UserService extends LocalStorageService {
  protected readonly userKey = 'user';

  private authHandlers: Set<AuthStateChangeHandler> = new Set<AuthStateChangeHandler>();

  get user(): User {
    return this.getProperty(this.userKey);
  }

  set user(value: User) {
    this.setProperty(this.userKey, value);
  }

  saveUser(): void {
    this.user = this.user;
  }

  protected readonly authenticatedKey = 'authenticated';

  get authenticated(): boolean {
    return this.getProperty(this.authenticatedKey);
  }

  set authenticated(value: boolean) {
    this.setProperty(this.authenticatedKey, value);
    for (let h of this.authHandlers) {
      h(value);
    }
  }

  AddAuthStateChangeHandler(handler: AuthStateChangeHandler): void {
    this.authHandlers.add(handler);
  }

  RemoveAuthStateChangeHandler(handler: AuthStateChangeHandler): void {
    this.authHandlers.delete(handler);
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
    else {
      //TODO: Ensure the unserialized object opt is a valid UserOptions object?
    }
    return opt;
  }

  set userOptions(value: UserOptions) {
    this.setProperty(this.userOptionsKey, value, true);
  }

  saveUserOptions(): void {
    this.userOptions = this.userOptions;
  }

}
