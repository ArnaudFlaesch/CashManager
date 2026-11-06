import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { environment } from "@environments/environment";
import { User } from "./user";
import { Role } from "./role";
import { Auth } from "./auth";

describe("Auth", () => {
  let service: Auth;
  let httpTestingController: HttpTestingController;

  const loginUrl = `${environment.backend_url}/auth/login`;
  const user: User = {
    id: 1,
    username: "admin",
    email: "admin@email.com",
    accessToken: "token",
    roles: [Role.ROLE_USER, Role.ROLE_ADMIN]
  };

  /** Builds an unsigned JWT expiring at the given date. */
  function buildToken(expirationDate: Date): string {
    const payload = btoa(
      JSON.stringify({ sub: "admin", iat: 0, exp: expirationDate.getTime() / 1000 })
    );
    return `header.${payload}.signature`;
  }

  function storeUser(storedUser: User): void {
    localStorage.setItem("user", JSON.stringify(storedUser));
  }

  /** The service reads the stored user when it is created. */
  function createService(): void {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(Auth);
    httpTestingController = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpTestingController.verify();
    localStorage.removeItem("user");
  });

  it("Should log the user in and store it", async () => {
    createService();
    expect(service.isUserAdmin()).toBe(false);

    const login = firstValueFrom(service.login("admin", "password"));
    const request = httpTestingController.expectOne(loginUrl);
    expect(request.request.method).toBe("POST");
    expect(request.request.body).toEqual({ username: "admin", password: "password" });
    request.flush(user);

    expect(await login).toEqual(user);
    expect(JSON.parse(localStorage.getItem("user") ?? "")).toEqual(user);
    expect(service.isUserAdmin()).toBe(true);
    expect(service.getAccessToken()).toBe("token");
  });

  it("Should not store a user without token", async () => {
    createService();
    const login = firstValueFrom(service.login("admin", "password"));
    httpTestingController.expectOne(loginUrl).flush({ ...user, accessToken: "" });
    await login;

    expect(localStorage.getItem("user")).toBeNull();
    expect(service.isUserAdmin()).toBe(false);
  });

  it("Should read the stored user and log it out", () => {
    storeUser(user);
    createService();
    expect(service.isUserAdmin()).toBe(true);

    service.logout();
    expect(localStorage.getItem("user")).toBeNull();
    expect(service.isUserAdmin()).toBe(false);
    expect(service.getAccessToken()).toBeUndefined();
  });

  it("Should not consider a user without the admin role as admin", () => {
    storeUser({ ...user, roles: [Role.ROLE_USER] });
    createService();
    expect(service.isUserAdmin()).toBe(false);
  });

  it("Should ignore a corrupted stored user", () => {
    localStorage.setItem("user", "{not json");
    createService();
    expect(service.isUserAdmin()).toBe(false);
    expect(service.getAccessToken()).toBeUndefined();
  });

  it("Should check the validity of the token", () => {
    createService();
    expect(service.userHasValidToken()).toBe(false);

    storeUser({ ...user, accessToken: buildToken(new Date(Date.now() + 60_000)) });
    expect(service.userHasValidToken()).toBe(true);

    storeUser({ ...user, accessToken: buildToken(new Date(Date.now() - 60_000)) });
    expect(service.userHasValidToken()).toBe(false);

    storeUser({ ...user, accessToken: "malformed" });
    expect(service.userHasValidToken()).toBe(false);
  });
});
