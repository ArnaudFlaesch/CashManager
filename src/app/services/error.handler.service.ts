import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerService {
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);

  private ERROR_UNAUTHORIZED_CODE =
    "Votre jeton d'authentification n'est plus valide, veuillez vous reconnecter.";
  private ERROR_FORBIDDEN_CODE =
    "Vous n'avez pas les droits nécessaires pour effectuer cette opération.";

  public handleError(error: HttpErrorResponse, messageToDisplay: string): void {
    switch (error.status) {
      case 401: {
        this.router
          .navigate(['login'])
          .then(() => this.displayErrorMessage(error.message, this.ERROR_UNAUTHORIZED_CODE))
          .catch((error) => console.log(error.message));
        break;
      }
      case 403: {
        this.displayErrorMessage(error.message, this.ERROR_FORBIDDEN_CODE);
        break;
      }
      default: {
        this.displayErrorMessage(error.message, messageToDisplay);
      }
    }
  }

  public handleLoginError(error: HttpErrorResponse, messageToDisplay: string): void {
    this.displayErrorMessage(error.message, messageToDisplay);
  }

  private displayErrorMessage(errorMessage: string, messageToDisplay: string) {
    console.error(errorMessage);
    this.snackbar.open(messageToDisplay, undefined, { duration: 3000 });
  }
}
