import { NgOptimizedImage } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, computed, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ImportConfigModal } from "./import-config-modal/import-config-modal";
import { AuthService } from "@core/auth/auth-service";
import { ConfigService } from "@core/config-service";
import { ErrorHandlerService } from "@core/error-handler-service";
import { ThemeService } from "@core/theme-service";
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
  public readonly labels = {
    appName: "CashManager",
    applications: "Applications",
    dash: "Dash",
    userMenu: "Menu utilisateur",
    darkTheme: "Thème sombre",
    downloadConfig: "Télécharger la configuration",
    importConfig: "Importer une configuration",
    logout: "Déconnexion"
  };

  public readonly dashApplicationUrl = "https://arnaudflaesch.github.io/Dash-Web/";

  public readonly isDarkMode = computed(() => this.themeService.isDarkMode());
  public readonly canUserSeeNotifications = computed(() => this.authService.isUserAdmin());

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly configService = inject(ConfigService);
  private readonly themeService = inject(ThemeService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly ERROR_EXPORT_CONFIGURATION = "Erreur lors de l'export de la configuration.";
  private readonly CONFIG_FILE_NAME = "cashManagerData.json";
  private readonly IMPORT_CONFIG_MODAL_WIDTH = "640px";

  public downloadConfig(): void {
    this.configService
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
        error: (error: HttpErrorResponse) =>
          this.errorHandlerService.handleError(error, this.ERROR_EXPORT_CONFIGURATION)
      });
  }

  public openImportConfigModal(): void {
    this.dialog.open(ImportConfigModal, { width: this.IMPORT_CONFIG_MODAL_WIDTH });
  }

  public toggleTheme(isToggleChecked: boolean): void {
    this.themeService.selectDarkMode(isToggleChecked);
  }

  public async logout(): Promise<void> {
    this.authService.logout();
    await this.router.navigate(["login"]);
  }
}
