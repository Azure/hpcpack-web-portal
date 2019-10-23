import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private smallDisplayQuery: MediaQueryList = window.matchMedia("(max-width: 560px)");

  private appClass: string;

  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    this.smallDisplayQuery.addListener(() => this.onDisplayWidthChange());
    this.onDisplayWidthChange();
  }

  ngOnDestroy(): void {
  }

  private onDisplayWidthChange(): void {
    if (this.smallDisplayQuery.matches) {
      this.appClass = 'small'
    }
    else {
      this.appClass = '';
    }
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
      icon: 'desktop_windows',
    },
    {
      link: 'jobs',
      title: 'Jobs',
      icon: 'work',
    },
  ];
}
