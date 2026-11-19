import { Component, input, output } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatTooltip } from "@angular/material/tooltip";

/** Menus of the header. The notifications, if any, are projected before them. */
@Component({
  selector: "cash-manager-header-actions",
  templateUrl: "./header-actions.html",
  imports: [
    MatIconButton,
    MatTooltip,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatSlideToggle,
    MatDivider
  ]
})
export class HeaderActions {
  public readonly isDarkMode = input(false);
  public readonly darkModeToggled = output<boolean>();
  public readonly configDownloadRequested = output();
  public readonly configImportRequested = output();
  public readonly logoutRequested = output();

  protected readonly labels = {
    applications: "Applications",
    dash: "Dash",
    userMenu: "Menu utilisateur",
    darkTheme: "Thème sombre",
    downloadConfig: "Télécharger la configuration",
    importConfig: "Importer une configuration",
    logout: "Déconnexion"
  };

  public readonly dashApplicationUrl = "https://arnaudflaesch.github.io/Dash-Web/";
}
