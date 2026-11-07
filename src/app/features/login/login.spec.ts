import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatInputHarness } from "@angular/material/input/testing";
import { provideRouter, Router } from "@angular/router";
import { environment } from "@environments/environment";
import { getElement, queryElement } from "@testing/dom";
import { HttpErrorHandler } from "@core/http-error-handler";
import { Login } from "./login";

describe("Login", () => {
  let fixture: ComponentFixture<Login>;
  let loader: HarnessLoader;
  let httpTestingController: HttpTestingController;

  const loginUrl = environment.backend_url + "/auth/login";

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    loader = TestbedHarnessEnvironment.loader(fixture);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.removeItem("user");
    vi.restoreAllMocks();
  });

  /** Fills the form and submits it, as the user would. */
  async function logIn(username: string, password: string): Promise<void> {
    await (
      await loader.getHarness(MatInputHarness.with({ selector: "#input-username" }))
    ).setValue(username);
    await (
      await loader.getHarness(MatInputHarness.with({ selector: "#input-password" }))
    ).setValue(password);
    getElement(fixture, "#login-button", HTMLButtonElement).click();
  }

  it("Should prevent login while the form is incomplete", async () => {
    await fixture.whenStable();
    expect(getElement(fixture, "#login-button", HTMLButtonElement).disabled).toBe(true);

    getElement(fixture, "#login-form", HTMLFormElement).requestSubmit();
    await fixture.whenStable();
    httpTestingController.expectNone(loginUrl);
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

    await logIn("username", "password");
    const request = httpTestingController.expectOne(loginUrl);
    // A spinner is displayed, and the button disabled, until the server answers
    fixture.detectChanges();
    expect(queryElement(fixture, "#login-button mat-spinner")).not.toBeNull();
    expect(getElement(fixture, "#login-button", HTMLButtonElement).disabled).toBe(true);
    expect(request.request.method).toBe("POST");
    expect(request.request.body).toEqual({ username: "username", password: "password" });
    request.flush(userData);
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith(["home"]);
  });

  it("Should show and hide the password", async () => {
    await fixture.whenStable();
    const passwordInput = getElement(fixture, "#input-password", HTMLInputElement);
    const toggleButton = getElement(fixture, "button[matSuffix]", HTMLButtonElement);
    expect(passwordInput.type).toBe("password");
    expect(toggleButton.getAttribute("aria-label")).toBe("Afficher le mot de passe");

    toggleButton.click();
    await fixture.whenStable();
    expect(passwordInput.type).toBe("text");
    expect(toggleButton.getAttribute("aria-label")).toBe("Masquer le mot de passe");
  });

  it("Should display an error when the user cannot log in", async () => {
    const handleLoginErrorSpy = vi
      .spyOn(TestBed.inject(HttpErrorHandler), "handleLoginError")
      .mockImplementation(() => undefined);

    await logIn("username", "wrong password");
    httpTestingController
      .expectOne(loginUrl)
      .flush(null, { status: 401, statusText: "Unauthorized" });
    await fixture.whenStable();

    expect(handleLoginErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 401 }),
      "Erreur lors de la connexion de l'utilisateur."
    );
  });
});
