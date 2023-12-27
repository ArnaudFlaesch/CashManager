import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service/auth.service';

@Injectable()
export class AuthGuard {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.userHasValidToken()) {
      return this.router.parseUrl('login');
    } else {
      return true;
    }
  }
}
