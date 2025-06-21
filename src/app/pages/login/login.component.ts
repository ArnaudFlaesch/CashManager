import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service/auth.service';
import { ErrorHandlerService } from '@services/error.handler.service';
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
  public isLoading = signal(false);
  public inputUsername = '';
  public inputPassword = '';
  public readonly authService = inject(AuthService);

  private ERROR_AUTHENTICATING_USER = "Erreur lors de la connexion de l'utilisateur.";
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly router = inject(Router);

  public handleLogin(): void {
    if (this.inputUsername && this.inputPassword) {
      this.isLoading.set(true);
      this.authService.login(this.inputUsername, this.inputPassword).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['home']).catch((error) => console.log(error.message));
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorHandlerService.handleLoginError(error, this.ERROR_AUTHENTICATING_USER);
        },
        complete: () => this.isLoading.set(false)
      });
    } else {
      this.isLoading.set(false);
    }
  }
}
