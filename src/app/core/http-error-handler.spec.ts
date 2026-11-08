import { HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { firstValueFrom, throwError } from "rxjs";
import type { MockInstance } from "vitest";
import { HttpErrorHandler } from "./http-error-handler";

describe("HttpErrorHandler", () => {
  let service: HttpErrorHandler;
  let navigateSpy: MockInstance<Router["navigate"]>;
  let snackbarSpy: MockInstance<MatSnackBar["open"]>;

  const errorMessage = "Erreur lors de la requête.";
  const snackbarConfig = { duration: 3000 };

  function httpError(status: number): HttpErrorResponse {
    return new HttpErrorResponse({ status, url: "http://localhost:8080/labels" });
  }

  beforeEach(() => {
    service = TestBed.inject(HttpErrorHandler);
    navigateSpy = vi.spyOn(TestBed.inject(Router), "navigate").mockResolvedValue(true);
    snackbarSpy = vi.spyOn(TestBed.inject(MatSnackBar), "open");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Should redirect to the login page when the token is no longer valid", async () => {
    service.handleError(httpError(401), errorMessage);
    expect(navigateSpy).toHaveBeenCalledWith(["login"]);
    await vi.waitFor(() => {
      expect(snackbarSpy).toHaveBeenCalledWith(
        "Votre jeton d'authentification n'est plus valide, veuillez vous reconnecter.",
        undefined,
        snackbarConfig
      );
    });
  });

  it("Should log the error when the redirection to the login page fails", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    navigateSpy.mockRejectedValue(new Error("Navigation error"));
    service.handleError(httpError(401), errorMessage);
    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith("Navigation error");
    });
    expect(snackbarSpy).not.toHaveBeenCalled();
  });

  it("Should display a specific message when the user is not allowed", () => {
    service.handleError(httpError(403), errorMessage);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(snackbarSpy).toHaveBeenCalledWith(
      "Vous n'avez pas les droits nécessaires pour effectuer cette opération.",
      undefined,
      snackbarConfig
    );
  });

  it("Should display the given message for the other errors", () => {
    service.handleError(httpError(500), errorMessage);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(snackbarSpy).toHaveBeenCalledWith(errorMessage, undefined, snackbarConfig);
  });

  it("Should handle the error of a request and fall back to a default value", async () => {
    const result = await firstValueFrom(
      throwError(() => httpError(500)).pipe(service.catchError<string[]>(errorMessage, []))
    );
    expect(result).toEqual([]);
    expect(snackbarSpy).toHaveBeenCalledWith(errorMessage, undefined, snackbarConfig);
  });

  it("Should display the login error without redirecting", () => {
    const loginErrorMessage = "Erreur lors de la connexion de l'utilisateur.";
    service.handleLoginError(httpError(401), loginErrorMessage);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(snackbarSpy).toHaveBeenCalledWith(loginErrorMessage, undefined, snackbarConfig);
  });
});
