import { HttpInterceptorFn } from "@angular/common/http";
import authorizationBearer from "@services/authorizationBearer/authorizationBearer";

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authorization = authorizationBearer();
  return next(
    authorization ? request.clone({ setHeaders: { Authorization: authorization } }) : request
  );
};
