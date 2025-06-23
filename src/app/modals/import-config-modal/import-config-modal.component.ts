import { ErrorHandlerService } from '@services/error.handler.service';
import { Component, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '@services/config.service/config.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-import-config-modal',
  templateUrl: './import-config-modal.component.html',
  styleUrls: ['./import-config-modal.component.scss'],
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ImportConfigModalComponent {
  public fileToUpload: File | null = null;

  private readonly configService = inject(ConfigService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly dialogRef = inject<MatDialogRef<ImportConfigModalComponent>>(MatDialogRef);
  private ERROR_IMPORT_CONFIGURATION = "Erreur lors de l'import de la configuration.";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public selectFile(event: any): void {
    if (event.target.files?.[0]) {
      this.fileToUpload = event.target.files[0];
    }
  }

  public upload(): void {
    if (this.fileToUpload) {
      this.configService.importConfig(this.fileToUpload).subscribe({
        error: (error: HttpErrorResponse) =>
          this.errorHandlerService.handleError(error, this.ERROR_IMPORT_CONFIGURATION),
        complete: () => {
          this.dialogRef.close();
          window.location.reload();
        }
      });
    }
  }
}
