import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { User } from './models/user';
import { DefaultService as ApiService } from './api-client';
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
    let subscriber: Subscriber<boolean>;
    let result = new Observable<boolean>(sub => {
      subscriber = sub;
    });

    this.userService.user = { username: username, password: password };
    this.api.getClusterVersion().subscribe({
      next: (_) => {
        this.userService.authenticated = true;
        if (subscriber) {
          subscriber.next(true);
          subscriber.complete();
          }
      },
      error: (_) => {
        if (subscriber) {
          subscriber.next(false);
          subscriber.complete();
        }
      }
    });
    return result;
  }

  reset(): void {
    this.userService.clear();
  }
}
