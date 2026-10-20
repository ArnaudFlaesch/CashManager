import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../../environments/environment";
import { LoginComponent } from "./login.component";
import { provideRouter } from "@angular/router";
import { routes } from "../../app.routes";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("Should prevent login", async () => {
    expect(component.loginModel()).toEqual({ username: "", password: "" });
    expect(await component.handleLogin()).toEqual(false);
  });

  it("Should login", async () => {
    const userData = {
      accessToken: "accessToken",
      id: 2,
      username: "admintest",
      email: "admin@email.com",
      roles: ["ROLE_ADMIN"],
      tokenType: "Bearer"
    };
    component.loginModel.set({ username: "username", password: "password" });
    const submitted = component.handleLogin();
    const request = httpTestingController.expectOne(environment.backend_url + "/auth/login");
    expect(request.request.method).toBe("POST");
    request.flush(userData);
    expect(await submitted).toEqual(true);
  });
});
