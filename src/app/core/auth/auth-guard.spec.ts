import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "./auth-service";
import { authGuard } from "./auth-guard";

describe("authGuard", () => {
  const userHasValidToken = vi.fn<() => boolean>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { userHasValidToken } }]
    });
  });

  function runGuard(): ReturnType<typeof authGuard> {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
  }

  it("Should let a user with a valid token access the page", () => {
    userHasValidToken.mockReturnValue(true);
    expect(runGuard()).toEqual(true);
  });

  it("Should redirect a user without a valid token to the login page", () => {
    userHasValidToken.mockReturnValue(false);
    const result = runGuard();
    expect(result).toBeInstanceOf(UrlTree);
    expect(String(result)).toEqual("/login");
  });
});
