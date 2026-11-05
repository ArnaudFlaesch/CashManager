import { Route } from "@angular/router";
import { routes } from "./app.routes";
import { ErrorComponent } from "./pages/error/error.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";

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
