import { Injectable, InjectionToken, Inject } from '@angular/core';
import { UserService, AuthStateChangeHandler } from './user.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ApiService } from './api.service';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

export const GA_TRACK_ID = new InjectionToken<string>('gaTrackId');

export const AI_TRACK_ID = new InjectionToken<string>('aiTrackId');

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private ai: ApplicationInsights;

  constructor(
    private router: Router,
    private api: ApiService,
    private userService: UserService,
    @Inject(GA_TRACK_ID) private gaTrackId: string,
    @Inject(AI_TRACK_ID) private aiTrackId: string,
  ) {
    this.ai = new ApplicationInsights({
      config: {
        instrumentationKey: this.aiTrackId,
        disableAjaxTracking: true,
      }
    });
    this.ai.loadAppInsights();
    this.router.events.pipe(
      filter((e: Event) => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => this.trackRoute());
    this.userService.AddAuthStateChangeHandler(this.authHandler);
  }

  private authHandler: AuthStateChangeHandler = (authenticated) => {
    if (authenticated && this.enabled) {
      this.api.getClusterSummary().subscribe(summary => {
        this.trackGaEvent('summary', `${summary.SubscriptionId}:${summary.DeploymentId}`, JSON.stringify(summary));
        this.trackAiEvent('summary', summary);
      });
    }
  }

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

  trackRoute(): void {
    if (this.enabled) {
      if (this.gaTrackId) {
        gtag('config', this.gaTrackId, { 'page_location': location.href });
        //NOTE: Do not change names of GA event action, category and label freely, to avoid polluting existing records.
        gtag('event', 'browse', { event_category: location.hostname, event_label: location.pathname });
      }
      if (this.aiTrackId) {
        this.ai.trackPageView({ name: location.href });
      }
    }
  }

  trackGaEvent(action: string, category: string, label: string): void {
    if (this.gaTrackId && this.enabled) {
      //NOTE: Do not change names of GA event action, category and label freely, to avoid polluting existing records.
      gtag('event', action, { event_category: category, event_label: label });
    }
  }

  trackAiEvent(name: string, properties: {[key: string]: any}): void {
    if (this.aiTrackId && this.enabled) {
      this.ai.trackEvent({ name }, properties);
    }
  }
}
