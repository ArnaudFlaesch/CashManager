import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { environment } from "@environments/environment";
import { IUser } from "./user.model";
import { RoleEnum } from "./role.enum";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  const loginUrl = `${environment.backend_url}/auth/login`;
  const user: IUser = {
    id: 1,
    username: "admin",
    email: "admin@email.com",
    accessToken: "token",
    roles: [RoleEnum.ROLE_USER, RoleEnum.ROLE_ADMIN]
  };

  /** Builds an unsigned JWT expiring at the given date. */
  function buildToken(expirationDate: Date): string {
    const payload = btoa(
      JSON.stringify({ sub: "admin", iat: 0, exp: expirationDate.getTime() / 1000 })
    );
    return `header.${payload}.signature`;
  }

  function storeUser(storedUser: IUser): void {
    localStorage.setItem("user", JSON.stringify(storedUser));
  }

  /** The service reads the stored user when it is created. */
  function createService(): void {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpTestingController.verify();
    localStorage.removeItem("user");
  });

  it("Should log the user in and store it", async () => {
    createService();
    expect(service.isUserAdmin()).toEqual(false);

    const login = firstValueFrom(service.login("admin", "password"));
    const request = httpTestingController.expectOne(loginUrl);
    expect(request.request.method).toEqual("POST");
    expect(request.request.body).toEqual({ username: "admin", password: "password" });
    request.flush(user);

    expect(await login).toEqual(user);
    expect(JSON.parse(localStorage.getItem("user") ?? "")).toEqual(user);
    expect(service.isUserAdmin()).toEqual(true);
    expect(service.getAccessToken()).toEqual("token");
  });

  it("Should not store a user without token", async () => {
    createService();
    const login = firstValueFrom(service.login("admin", "password"));
    httpTestingController.expectOne(loginUrl).flush({ ...user, accessToken: "" });
    await login;

    expect(localStorage.getItem("user")).toBeNull();
    expect(service.isUserAdmin()).toEqual(false);
  });

  it("Should read the stored user and log it out", () => {
    storeUser(user);
    createService();
    expect(service.isUserAdmin()).toEqual(true);

    service.logout();
    expect(localStorage.getItem("user")).toBeNull();
    expect(service.isUserAdmin()).toEqual(false);
    expect(service.getAccessToken()).toBeUndefined();
  });

  it("Should not consider a user without the admin role as admin", () => {
    storeUser({ ...user, roles: [RoleEnum.ROLE_USER] });
    createService();
    expect(service.isUserAdmin()).toEqual(false);
  });

  it("Should ignore a corrupted stored user", () => {
    localStorage.setItem("user", "{not json");
    createService();
    expect(service.isUserAdmin()).toEqual(false);
    expect(service.getAccessToken()).toBeUndefined();
  });

  it("Should check the validity of the token", () => {
    createService();
    expect(service.userHasValidToken()).toEqual(false);

    storeUser({ ...user, accessToken: buildToken(new Date(Date.now() + 60_000)) });
    expect(service.userHasValidToken()).toEqual(true);

    storeUser({ ...user, accessToken: buildToken(new Date(Date.now() - 60_000)) });
    expect(service.userHasValidToken()).toEqual(false);

    storeUser({ ...user, accessToken: "malformed" });
    expect(service.userHasValidToken()).toEqual(false);
  });
});
