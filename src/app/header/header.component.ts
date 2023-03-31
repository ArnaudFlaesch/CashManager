import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImportConfigModalComponent } from '../modals/import-config-modal/import-config-modal.component';
import { AuthService } from '../services/auth.service/auth.service';
import { ConfigService } from '../services/config.service/config.service';
import { ErrorHandlerService } from '../services/error.handler.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private ERROR_EXPORT_CONFIGURATION =
    "Erreur lors de l'export de la configuration.";

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private errorHandlerService: ErrorHandlerService,
    public dialog: MatDialog,
    private router: Router
  ) {}

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
        this.errorHandlerService.handleError(
          error,
          this.ERROR_EXPORT_CONFIGURATION
        )
    });
  }

  public openImportConfigModal(): void {
    this.dialog.open(ImportConfigModalComponent, {
      height: '400px',
      width: '600px'
    });
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
