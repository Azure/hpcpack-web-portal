import { Injectable, InjectionToken, Inject } from '@angular/core';
import { UserService } from './user.service';

declare let gtag: Function;

export const GA_TRACK_ID = new InjectionToken<string>('gaTrackId');

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  constructor(
    @Inject(GA_TRACK_ID) private trackId: string,
    private userService: UserService,
  ) { }

  get enabled(): boolean {
    //User options are available only when user logged in.
    if (this.userService.authenticated) {
      return this.userService.userOptions.allowTracking !== undefined ?
        this.userService.userOptions.allowTracking : true;
    }
    else {
      return true;
    }
  }

  set enabled(value: boolean) {
    this.userService.userOptions.allowTracking = value;
    this.userService.saveUserOptions();
  }

  track(): void {
    console.log(location.href);
    if (this.trackId && this.enabled) {
      console.log('Tracking...');
      gtag('config', this.trackId, { 'page_location': location.href });
    }
  }
}
