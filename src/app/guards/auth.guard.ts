import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { AuthService } from '@services/auth.service/auth.service';

@Injectable()
export class AuthGuard {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  public canActivate(): boolean | UrlTree {
    if (this.authService.userHasValidToken()) {
      return this.router.parseUrl('login');
    } else {
      return true;
    }
  }
}
