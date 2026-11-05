import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/auth-guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("@features/login/login").then((m) => m.Login)
  },
  {
    path: "home",
    loadComponent: () => import("@features/home/home").then((m) => m.Home),
    canActivate: [authGuard]
  },
  {
    path: "error",
    loadComponent: () => import("@features/error/error-page").then((m) => m.ErrorPage)
  },
  { path: "**", redirectTo: "home" }
];
