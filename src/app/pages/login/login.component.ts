import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service/auth.service';
import { ErrorHandlerService } from '../../services/error.handler.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [RouterLink, FormsModule, MatButton, MatProgressSpinner]
})
export class LoginComponent {
  authService = inject(AuthService);
  private errorHandlerService = inject(ErrorHandlerService);
  private router = inject(Router);

  public isLoading = false;

  public inputUsername = '';
  public inputPassword = '';

  private ERROR_AUTHENTICATING_USER = "Erreur lors de la connexion de l'utilisateur.";

  public handleLogin(): void {
    if (this.inputUsername && this.inputPassword) {
      this.isLoading = true;
      this.authService.login(this.inputUsername, this.inputPassword).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['home']).catch((error) => console.log(error.message));
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorHandlerService.handleLoginError(error, this.ERROR_AUTHENTICATING_USER);
        },
        complete: () => (this.isLoading = false)
      });
    } else {
      this.isLoading = false;
    }
  }
}
