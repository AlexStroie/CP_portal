import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userStr = sessionStorage.getItem('user');
    if (!userStr) return this.deny();
    const user = JSON.parse(userStr);

    if (user.role.includes('ADMIN') || user.role.includes('SUPER_ADMIN')) {
      return true;
    }

    return this.deny();
  }

  deny() {
    this.router.navigate(['/login']);
    return false;
  }
}
