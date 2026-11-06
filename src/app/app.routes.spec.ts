import { Route } from "@angular/router";
import { routes } from "./app.routes";
import { ErrorPage } from "@features/error/error-page";
import { Home } from "@features/home/home";
import { Login } from "@features/login/login";

describe("Routes", () => {
  function findRoute(path: string): Route | undefined {
    return routes.find((route) => route.path === path);
  }

  it("Should lazy load the component of each page", async () => {
    expect(await findRoute("login")?.loadComponent?.()).toEqual(Login);
    expect(await findRoute("home")?.loadComponent?.()).toEqual(Home);
    expect(await findRoute("error")?.loadComponent?.()).toEqual(ErrorPage);
  });

  it("Should protect the home page and redirect the unknown pages to it", () => {
    expect(findRoute("home")?.canActivate).toHaveLength(1);
    expect(findRoute("**")?.redirectTo).toBe("home");
  });
});
