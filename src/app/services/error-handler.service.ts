import { HttpErrorResponse } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { catchError, of, OperatorFunction } from "rxjs";

@Service()
export class ErrorHandlerService {
  private readonly ERROR_UNAUTHORIZED =
    "Votre jeton d'authentification n'est plus valide, veuillez vous reconnecter.";

  private readonly ERROR_FORBIDDEN =
    "Vous n'avez pas les droits nécessaires pour effectuer cette opération.";

  private readonly SNACKBAR_DURATION = 3000;

  private readonly router = inject(Router);
  private readonly snackbar = inject(MatSnackBar);

  public handleError(error: HttpErrorResponse, messageToDisplay: string): void {
    switch (error.status) {
      case 401:
        this.router
          .navigate(["login"])
          .then(() => this.displayErrorMessage(error.message, this.ERROR_UNAUTHORIZED))
          .catch((navigationError) => console.log(navigationError.message));
        break;
      case 403:
        this.displayErrorMessage(error.message, this.ERROR_FORBIDDEN);
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
    this.snackbar.open(messageToDisplay, undefined, { duration: this.SNACKBAR_DURATION });
  }
}
