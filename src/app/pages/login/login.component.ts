import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { form, FormField, FormRoot, required, submit } from "@angular/forms/signals";
import { firstValueFrom } from "rxjs";
import { AuthService } from "@services/auth.service/auth.service";
import { ErrorHandlerService } from "@services/error.handler.service";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatButton } from "@angular/material/button";

const ERROR_AUTHENTICATING_USER = "Erreur lors de la connexion de l'utilisateur.";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
  imports: [RouterLink, FormRoot, FormField, MatButton, MatProgressSpinner]
})
export class LoginComponent {
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
              ERROR_AUTHENTICATING_USER
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

  public handleLogin(): Promise<boolean> {
    return submit(this.loginForm);
  }
}
