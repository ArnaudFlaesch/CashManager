import { ErrorHandlerService } from "@core/error-handler.service";
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
import { ConfigService } from "@core/config.service";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "cash-manager-import-config-modal",
  templateUrl: "./import-config-modal.component.html",
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ImportConfigModalComponent {
  public readonly labels = {
    title: "Importer la configuration",
    selectFile: "Sélectionner un fichier de configuration",
    cancel: "Annuler",
    import: "Importer"
  };

  public readonly fileToUpload = signal<File | null>(null);

  private readonly configService = inject(ConfigService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject<MatDialogRef<ImportConfigModalComponent>>(MatDialogRef);
  private readonly ERROR_IMPORT_CONFIGURATION = "Erreur lors de l'import de la configuration.";

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
            this.errorHandlerService.handleError(error, this.ERROR_IMPORT_CONFIGURATION),
          complete: () => {
            this.dialogRef.close();
            window.location.reload();
          }
        });
    }
  }
}
