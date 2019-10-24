import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MediaQueryService } from './services/media-query.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public mediaQuery: MediaQueryService,
    private authService: AuthService,
    private router: Router) {}

  get username(): string {
    return this.authService.authenticatedUser ? this.authService.authenticatedUser.username : 'Guest';
  }

  get authenticated(): boolean {
    return this.authService.authenticatedUser != null;
  }

  logout(): void {
    this.authService.reset();
    this.router.navigate(['/login']);
  }

  readonly navItems = [
    // {
    //   link: 'dashboard',
    //   title: 'Dashboard',
    //   icon: 'dashboard',
    // },
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
  ];
}
