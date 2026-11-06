import { NgOptimizedImage } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, computed, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ImportConfigModal } from "./import-config-modal/import-config-modal";
import { Auth } from "@core/auth/auth";
import { ConfigApi } from "@core/config-api";
import { HttpErrorHandler } from "@core/http-error-handler";
import { Theme } from "@core/theme";
import { MatDivider } from "@angular/material/divider";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { Notifications } from "./notifications/notifications";

import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatTooltip } from "@angular/material/tooltip";
import { MatIconButton } from "@angular/material/button";

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

  protected readonly dashApplicationUrl = "https://arnaudflaesch.github.io/Dash-Web/";
  private readonly CONFIG_FILE_NAME = "cashManagerData.json";
  private readonly IMPORT_CONFIG_MODAL_WIDTH = "640px";

  protected readonly isDarkMode = computed(() => this.theme.isDarkMode());
  protected readonly canUserSeeNotifications = computed(() => this.auth.isUserAdmin());

  protected downloadConfig(): void {
    this.configApi
      .exportConfig()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (config) => {
          console.info("Configuration exportée");
          const url = URL.createObjectURL(config);
          const link = document.createElement("a");
          link.href = url;
          link.download = this.CONFIG_FILE_NAME;
          link.click();
          URL.revokeObjectURL(url);
        },
        error: (error: HttpErrorResponse) => {
          this.httpErrorHandler.handleError(error, this.labels.errors.exportConfiguration);
        }
      });
  }

  protected openImportConfigModal(): void {
    this.dialog.open(ImportConfigModal, { width: this.IMPORT_CONFIG_MODAL_WIDTH });
  }

  protected toggleTheme(isToggleChecked: boolean): void {
    this.theme.selectDarkMode(isToggleChecked);
  }

  protected async logout(): Promise<void> {
    this.auth.logout();
    await this.router.navigate(["login"]);
  }
}
