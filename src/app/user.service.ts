import { Injectable } from '@angular/core';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;
  authenticated = false;

  constructor() { }
}
