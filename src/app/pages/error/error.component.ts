import { Component } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "cash-manager-error",
  templateUrl: "./error.component.html",
  styleUrl: "./error.component.scss",
  imports: [MatButton, MatIcon, RouterLink]
})
export class ErrorComponent {
  public readonly labels = {
    title: "Une erreur est survenue",
    message: "La page demandée n'a pas pu être affichée.",
    backToHome: "Retour à l'accueil"
  };
}
