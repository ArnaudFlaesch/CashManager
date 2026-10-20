import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AuthService } from "@services/auth.service/auth.service";

export const authGuard: CanActivateFn = () =>
  inject(AuthService).userHasValidToken() || inject(Router).parseUrl("login");
