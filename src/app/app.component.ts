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

  private get username(): string {
    return this.authService.authenticatedUser ? this.authService.authenticatedUser.username : 'Guest';
  }

  private get authenticated(): boolean {
    return this.authService.authenticatedUser != null;
  }

  private logout(): void {
    this.authService.reset();
    this.router.navigate(['/login']);
  }
}
