import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImportConfigModalComponent } from '../modals/import-config-modal/import-config-modal.component';
import { AuthService } from '../services/auth.service/auth.service';
import { ConfigService } from '../services/config.service/config.service';
import { ErrorHandlerService } from '../services/error.handler.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from '../services/theme.service/theme.service';
import { MatDivider } from '@angular/material/divider';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { NotificationsComponent } from '../notifications/notifications.component';

import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        MatMiniFabButton,
        MatTooltip,
        MatMenuTrigger,
        MatIcon,
        NotificationsComponent,
        MatMenu,
        MatMenuItem,
        MatSlideToggle,
        FormsModule,
        ReactiveFormsModule,
        MatDivider
    ]
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private configService = inject(ConfigService);
  private themeService = inject(ThemeService);
  private errorHandlerService = inject(ErrorHandlerService);
  dialog = inject(MatDialog);
  private router = inject(Router);

  public toggleControl = new FormControl(false);

  public dashApplicationUrl = 'https://arnaudflaesch.github.io/Dash-Web/';

  private ERROR_EXPORT_CONFIGURATION = "Erreur lors de l'export de la configuration.";

  ngOnInit(): void {
    this.toggleControl.setValue(this.themeService.isPreferredThemeDarkMode());
  }

  public downloadConfig(): void {
    this.configService.exportConfig().subscribe({
      next: (response) => {
        console.info('Configuration exportée');
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'cashManagerData.json');
        document.body.appendChild(link);
        link.click();
      },
      error: (error: HttpErrorResponse) =>
        this.errorHandlerService.handleError(error, this.ERROR_EXPORT_CONFIGURATION)
    });
  }

  public openImportConfigModal(): void {
    this.dialog.open(ImportConfigModalComponent, {
      height: '400px',
      width: '600px'
    });
  }

  public toggleTheme(isToggleChecked: boolean): void {
    this.themeService.selectDarkMode(isToggleChecked);
  }

  public canUserSeeNotifications(): boolean {
    return this.authService.isUserAdmin();
  }

  public async logout(): Promise<void> {
    this.authService.logout();
    await this.router.navigate(['login']);
  }
}
