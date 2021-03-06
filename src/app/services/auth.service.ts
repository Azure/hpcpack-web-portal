import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { User } from '../models/user';
import { ApiService, UserRole } from './api.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private userService: UserService,
    private api: ApiService,
  ) { }

  get authenticatedUser(): User {
    return this.userService.authenticated ? this.userService.user : null;
  }

  //This method has global side-effect, that is:
  //1) Reset/logout current user
  //2) Login new user
  authenticate(username: string, password: string): Observable<boolean> {
    this.reset();
    return new Observable<boolean>(subscriber => {
      //The following line set the username and password that the api service will read
      this.userService.user = { username: username, password: password };
      let subscription = this.api.getUserRoles().subscribe({
        next: (roles) => {
          this.userService.authenticated = true;
          //TODO: Why UserRole.Administrator is valid in editor but not in ng server?
          this.userService.user.isAdmin = (roles.indexOf('Administrator') >= 0);
          this.userService.saveUser();
          subscriber.next(true);
          subscriber.complete();
        },
        error: (_) => {
          subscriber.next(false);
          subscriber.complete();
        }
      });
      return () => subscription.unsubscribe();
    });
  }

  reset(): void {
    this.userService.authenticated = false;
    this.userService.user = null;
  }
}
