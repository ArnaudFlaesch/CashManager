import { ErrorHandlerService } from "@services/error.handler.service";
import { Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { HttpErrorResponse } from "@angular/common/http";
import { ConfigService } from "@services/config.service/config.service";
import { MatButton } from "@angular/material/button";

const ERROR_IMPORT_CONFIGURATION = "Erreur lors de l'import de la configuration.";

@Component({
  selector: "app-import-config-modal",
  templateUrl: "./import-config-modal.component.html",
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ImportConfigModalComponent {
  public readonly fileToUpload = signal<File | null>(null);

  private readonly configService = inject(ConfigService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject<MatDialogRef<ImportConfigModalComponent>>(MatDialogRef);

  public selectFile(input: HTMLInputElement): void {
    this.fileToUpload.set(input.files?.[0] ?? null);
  }

  public upload(): void {
    const fileToUpload = this.fileToUpload();
    if (fileToUpload) {
      this.configService
        .importConfig(fileToUpload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          error: (error: HttpErrorResponse) =>
            this.errorHandlerService.handleError(error, ERROR_IMPORT_CONFIGURATION),
          complete: () => {
            this.dialogRef.close();
            window.location.reload();
          }
        });
    }
  }
}
