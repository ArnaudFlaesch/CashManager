import { HttpErrorResponse } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { catchError, of, OperatorFunction } from "rxjs";

const ERROR_UNAUTHORIZED_CODE =
  "Votre jeton d'authentification n'est plus valide, veuillez vous reconnecter.";
const ERROR_FORBIDDEN_CODE =
  "Vous n'avez pas les droits nécessaires pour effectuer cette opération.";

@Service()
export class ErrorHandlerService {
  private readonly router = inject(Router);
  private readonly snackbar = inject(MatSnackBar);

  public handleError(error: HttpErrorResponse, messageToDisplay: string): void {
    switch (error.status) {
      case 401:
        this.router
          .navigate(["login"])
          .then(() => this.displayErrorMessage(error.message, ERROR_UNAUTHORIZED_CODE))
          .catch((navigationError) => console.log(navigationError.message));
        break;
      case 403:
        this.displayErrorMessage(error.message, ERROR_FORBIDDEN_CODE);
        break;
      default:
        this.displayErrorMessage(error.message, messageToDisplay);
    }
  }

  /** Handles the error and falls back to a default value, so that a resource never ends up in error. */
  public catchError<T>(messageToDisplay: string, fallbackValue: T): OperatorFunction<T, T> {
    return catchError((error: HttpErrorResponse) => {
      this.handleError(error, messageToDisplay);
      return of(fallbackValue);
    });
  }

  public handleLoginError(error: HttpErrorResponse, messageToDisplay: string): void {
    this.displayErrorMessage(error.message, messageToDisplay);
  }

  private displayErrorMessage(errorMessage: string, messageToDisplay: string): void {
    console.error(errorMessage);
    this.snackbar.open(messageToDisplay, undefined, { duration: 3000 });
  }
}
