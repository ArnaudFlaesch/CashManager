import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Auth } from "./auth";
import { authGuard } from "./auth-guard";

describe("authGuard", () => {
  const userHasValidToken = vi.fn<() => boolean>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Auth, useValue: { userHasValidToken } }]
    });
  });

  function runGuard(): ReturnType<typeof authGuard> {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
  }

  it("Should let a user with a valid token access the page", () => {
    userHasValidToken.mockReturnValue(true);
    expect(runGuard()).toBe(true);
  });

  it("Should redirect a user without a valid token to the login page", () => {
    userHasValidToken.mockReturnValue(false);
    const result = runGuard();
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe("/login");
  });
});
