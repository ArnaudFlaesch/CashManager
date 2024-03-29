import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service/auth.service';
import { ErrorHandlerService } from '../../services/error.handler.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [RouterLink, FormsModule, MatButton, NgIf, MatProgressSpinner]
})
export class LoginComponent {
  public isLoading = false;

  public inputUsername = '';
  public inputPassword = '';

  private ERROR_AUTHENTICATING_USER =
    "Erreur lors de la connexion de l'utilisateur.";

  constructor(
    public authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  public handleLogin(): void {
    if (this.inputUsername && this.inputPassword) {
      this.isLoading = true;
      this.authService.login(this.inputUsername, this.inputPassword).subscribe({
        next: () => {
          this.isLoading = false;
          this.router
            .navigate(['home'])
            .catch((error) => console.log(error.message));
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorHandlerService.handleLoginError(
            error,
            this.ERROR_AUTHENTICATING_USER
          );
        },
        complete: () => (this.isLoading = false)
      });
    } else {
      this.isLoading = false;
    }
  }
}
