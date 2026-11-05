import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "@environments/environment";
import { AuthService } from "./auth.service";

/**
 * Adds the user's bearer token to every request sent to the CashManager backend,
 * except the authentication endpoints.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getAccessToken();
  if (!token || !req.url.startsWith(environment.backend_url) || req.url.includes("/auth/")) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
