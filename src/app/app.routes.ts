import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./pages/login/login.component").then((m) => m.LoginComponent)
  },
  {
    path: "home",
    loadComponent: () => import("./pages/home/home.component").then((m) => m.HomeComponent),
    canActivate: [(): AuthGuard => inject(AuthGuard)]
  },
  {
    path: "error",
    loadComponent: () => import("./pages/error/error.component").then((m) => m.ErrorComponent)
  },
  { path: "**", redirectTo: "home" }
];
