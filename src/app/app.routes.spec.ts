import { Route } from "@angular/router";
import { routes } from "./app.routes";
import { ErrorComponent } from "@features/error/error.component";
import { HomeComponent } from "@features/home/home.component";
import { LoginComponent } from "@features/login/login.component";

describe("Routes", () => {
  function findRoute(path: string): Route | undefined {
    return routes.find((route) => route.path === path);
  }

  it("Should lazy load the component of each page", async () => {
    expect(await findRoute("login")?.loadComponent?.()).toEqual(LoginComponent);
    expect(await findRoute("home")?.loadComponent?.()).toEqual(HomeComponent);
    expect(await findRoute("error")?.loadComponent?.()).toEqual(ErrorComponent);
  });

  it("Should protect the home page and redirect the unknown pages to it", () => {
    expect(findRoute("home")?.canActivate).toHaveLength(1);
    expect(findRoute("**")?.redirectTo).toEqual("home");
  });
});
