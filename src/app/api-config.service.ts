import { Injectable } from '@angular/core';
import { Configuration } from './api-client/configuration'
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private config: Configuration;

  constructor(
    private userService: UserService,
  ) {
    this.config = new Configuration();
  }

  get username(): string {
    return this.userService.user.username;
  }

  get password(): string {
    return this.userService.user.password;
  }

  selectHeaderContentType (contentTypes: string[]): string | undefined {
    return this.config.selectHeaderContentType(contentTypes);
  }

  selectHeaderAccept(accepts: string[]): string | undefined {
    return this.config.selectHeaderAccept(accepts);
  }

  isJsonMime(mime: string): boolean {
    return this.config.isJsonMime(mime);
  }
}
