import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("@features/login/login.component").then((m) => m.LoginComponent)
  },
  {
    path: "home",
    loadComponent: () => import("@features/home/home.component").then((m) => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: "error",
    loadComponent: () => import("@features/error/error.component").then((m) => m.ErrorComponent)
  },
  { path: "**", redirectTo: "home" }
];
