import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router) {
  }

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
    {
      link: 'dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
    },
    {
      link: 'nodes',
      title: 'Nodes',
      icon: 'computer',
    },
    {
      link: 'jobs',
      title: 'Jobs',
      icon: 'list',
    },
    {
      link: 'charts',
      title: 'Charts',
      icon: 'bar_chart',
    },
  ];
}
