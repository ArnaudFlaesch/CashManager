import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { environment } from "@environments/environment";
import { LoginComponent } from "./login.component";
import { provideRouter, Router } from "@angular/router";
import { ErrorHandlerService } from "@core/error-handler.service";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.removeItem("user");
    vi.restoreAllMocks();
  });

  it("Should prevent login", async () => {
    expect(component.loginModel()).toEqual({ username: "", password: "" });
    expect(await component.handleLogin()).toEqual(false);
  });

  it("Should log the user in and redirect to the home page", async () => {
    const navigateSpy = vi.spyOn(TestBed.inject(Router), "navigate").mockResolvedValue(true);
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
    expect(navigateSpy).toHaveBeenCalledWith(["home"]);
  });

  it("Should show and hide the password", async () => {
    await fixture.whenStable();
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector("#input-password");
    const toggleButton: HTMLButtonElement =
      fixture.nativeElement.querySelector("button[matSuffix]");
    expect(passwordInput.type).toEqual("password");
    expect(toggleButton.getAttribute("aria-label")).toEqual(component.labels.showPassword);

    toggleButton.click();
    await fixture.whenStable();
    expect(passwordInput.type).toEqual("text");
    expect(toggleButton.getAttribute("aria-label")).toEqual(component.labels.hidePassword);
  });

  it("Should display an error when the user cannot log in", async () => {
    const handleLoginErrorSpy = vi
      .spyOn(TestBed.inject(ErrorHandlerService), "handleLoginError")
      .mockImplementation(() => undefined);
    component.loginModel.set({ username: "username", password: "wrong password" });

    const submitted = component.handleLogin();
    httpTestingController
      .expectOne(environment.backend_url + "/auth/login")
      .flush(null, { status: 401, statusText: "Unauthorized" });

    expect(await submitted).toEqual(true);
    expect(handleLoginErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 401 }),
      "Erreur lors de la connexion de l'utilisateur."
    );
  });
});
