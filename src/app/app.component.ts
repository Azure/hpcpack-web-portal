import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { MediaQueryService } from './services/media-query.service'
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { ApiService } from './services/api.service';

interface NavItem {
  link: string;
  title: string;
  icon: string;
}

export const UPDATE_URL = new InjectionToken<string>('updateUrl');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    @Inject(UPDATE_URL) private updateUrl: string,
    private router: Router,
    private ga: GoogleAnalyticsService,
    private mediaQuery: MediaQueryService,
    private authService: AuthService,
    private userService: UserService,
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((e: Event) => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => this.ga.track());
  }

  get username(): string {
    return this.authService.authenticatedUser ? this.authService.authenticatedUser.username : 'Guest';
  }

  get authenticated(): boolean {
    return this.authService.authenticatedUser != null;
  }

  get appClass(): any {
    return {
      small: this.mediaQuery.smallWidth,
      median: this.mediaQuery.medianWidth,
      big: this.mediaQuery.bigWidth,
    };
  }

  checkUpdate(): void {
    this.api.getAppVersion().subscribe(ver => {
      window.open(`${this.updateUrl}?myVersion=${ver}`);
    });
  }

  get trackable(): boolean {
    return this.ga.enabled;
  }

  toggleTrackable(enabled: boolean): void {
    this.ga.enabled = enabled;
  }

  clearLocalSettings(): void {
    this.userService.userOptions = undefined;
  }

  logout(): void {
    this.authService.reset();
    this.router.navigate(['/login']);
  }

  private readonly userNavItems: NavItem[] = [
    {
      link: 'dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
    },
    {
      link: 'nodes',
      title: 'Nodes',
      icon: 'desktop_windows',
    },
    {
      link: 'jobs',
      title: 'Jobs',
      icon: 'work',
    },
    {
      link: 'charts',
      title: 'Charts',
      icon: 'bar_chart',
    },
  ];

  private readonly adminNavItems: NavItem[] = [
    {
      link: 'logs',
      title: 'Logs',
      icon: 'list_alt',
    },
  ];

  get navItems(): NavItem[] {
    return this.userService.user.isAdmin ? this.userNavItems.concat(this.adminNavItems) : this.userNavItems;
  }

}
