import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = await this.authService.getRole();
    const expectedRole = next.data['expectedRole'];

    if (userRole !== expectedRole) {
      this.router.navigate(['/access-denied']);
      return false;
    }

    return true;
  }
}