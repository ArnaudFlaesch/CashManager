import { NgOptimizedImage } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { form, FormField, FormRoot, required, submit } from "@angular/forms/signals";
import { firstValueFrom } from "rxjs";
import { AuthService } from "@core/auth/auth.service";
import { ErrorHandlerService } from "@core/error-handler.service";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";

@Component({
  selector: "cash-manager-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
  imports: [
    NgOptimizedImage,
    RouterLink,
    FormRoot,
    FormField,
    MatButton,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatPrefix,
    MatSuffix,
    MatIcon,
    MatInput,
    MatProgressSpinner
  ]
})
export class LoginComponent {
  public readonly labels = {
    logoAlt: "cash manager logo",
    title: "CashManager",
    subtitle: "Suivez et analysez vos dépenses",
    usernameLabel: "Nom d'utilisateur",
    username: "Username",
    passwordLabel: "Mot de passe",
    password: "Password",
    hidePassword: "Masquer le mot de passe",
    showPassword: "Afficher le mot de passe",
    login: "Se connecter"
  };

  public readonly isPasswordVisible = signal(false);
  public readonly loginModel = signal({ username: "", password: "" });
  public readonly loginForm = form(
    this.loginModel,
    (schema) => {
      required(schema.username);
      required(schema.password);
    },
    {
      submission: {
        action: async (loginForm) => {
          const { username, password } = loginForm().value();
          try {
            await firstValueFrom(this.authService.login(username, password));
            await this.router.navigate(["home"]);
          } catch (error) {
            this.errorHandlerService.handleLoginError(
              error as HttpErrorResponse,
              this.ERROR_AUTHENTICATING_USER
            );
          }
          return undefined;
        }
      }
    }
  );

  private readonly authService = inject(AuthService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly router = inject(Router);
  private readonly ERROR_AUTHENTICATING_USER = "Erreur lors de la connexion de l'utilisateur.";

  public handleLogin(): Promise<boolean> {
    return submit(this.loginForm);
  }
}
