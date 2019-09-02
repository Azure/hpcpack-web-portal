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
}
