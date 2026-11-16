import { NgOptimizedImage } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatTooltip } from "@angular/material/tooltip";
import { Router } from "@angular/router";

import { Auth } from "@core/auth/auth";
import { ConfigApi } from "@core/config-api";
import { HttpErrorHandler } from "@core/http-error-handler";
import { Theme } from "@core/theme";
import { ImportConfigModal } from "./import-config-modal/import-config-modal";
import { Notifications } from "./notifications/notifications";

@Component({
  selector: "cash-manager-header",
  templateUrl: "./header.html",
  styleUrl: "./header.scss",
  imports: [
    NgOptimizedImage,
    MatIconButton,
    MatTooltip,
    MatMenuTrigger,
    MatIcon,
    Notifications,
    MatMenu,
    MatMenuItem,
    MatSlideToggle,
    MatDivider
  ]
})
export class Header {
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly configApi = inject(ConfigApi);
  private readonly theme = inject(Theme);
  private readonly httpErrorHandler = inject(HttpErrorHandler);

  protected readonly labels = {
    appName: "CashManager",
    applications: "Applications",
    dash: "Dash",
    userMenu: "Menu utilisateur",
    darkTheme: "Thème sombre",
    downloadConfig: "Télécharger la configuration",
    importConfig: "Importer une configuration",
    logout: "Déconnexion",
    errors: {
      exportConfiguration: "Erreur lors de l'export de la configuration."
    }
  };

  private readonly CONFIG_FILE_NAME = "cashManagerData.json";
  private readonly IMPORT_CONFIG_MODAL_WIDTH = "640px";

  public readonly dashApplicationUrl = "https://arnaudflaesch.github.io/Dash-Web/";
  public readonly isDarkMode = this.theme.isDarkMode;
  public readonly canUserSeeNotifications = this.auth.isUserAdmin;

  public downloadConfig(): void {
    this.configApi
      .exportConfig()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (config) => {
          this.downloadFile(config, this.CONFIG_FILE_NAME);
        },
        error: (error: HttpErrorResponse) => {
          this.httpErrorHandler.handleError(error, this.labels.errors.exportConfiguration);
        }
      });
  }

  public openImportConfigModal(): void {
    this.dialog.open(ImportConfigModal, { width: this.IMPORT_CONFIG_MODAL_WIDTH });
  }

  public toggleTheme(isToggleChecked: boolean): void {
    this.theme.selectDarkMode(isToggleChecked);
  }

  public async logout(): Promise<void> {
    this.auth.logout();
    await this.router.navigate(["login"]);
  }

  /** Saves the file on the user's computer, through a temporary link to its content. */
  private downloadFile(file: Blob, fileName: string): void {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }
}
