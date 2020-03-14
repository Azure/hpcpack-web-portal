import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { MediaQueryService } from './services/media-query.service'

interface NavItem {
  link: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public mediaQuery: MediaQueryService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router) {}

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
