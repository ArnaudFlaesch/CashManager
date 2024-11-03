import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service/auth.service';

@Injectable()
export class AuthGuard {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(): boolean | UrlTree {
    if (this.authService.userHasValidToken()) {
      return this.router.parseUrl('login');
    } else {
      return true;
    }
  }
}
