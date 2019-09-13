import { Injectable } from '@angular/core';
import { Router, CanActivate, Route, UrlSegment, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.authenticatedUser) {
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (this.authService.authenticatedUser) {
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: route.path }});
    return false;
  }
}
