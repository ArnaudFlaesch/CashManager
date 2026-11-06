import { HttpErrorHandler } from "@core/http-error-handler";
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
import { ConfigApi } from "@core/config-api";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "cash-manager-import-config-modal",
  templateUrl: "./import-config-modal.html",
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ImportConfigModal {
  private readonly configApi = inject(ConfigApi);
  private readonly httpErrorHandler = inject(HttpErrorHandler);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject<MatDialogRef<ImportConfigModal>>(MatDialogRef);

  protected readonly labels = {
    title: "Importer la configuration",
    selectFile: "Sélectionner un fichier de configuration",
    cancel: "Annuler",
    import: "Importer",
    errors: {
      importConfiguration: "Erreur lors de l'import de la configuration."
    }
  };

  protected readonly fileToUpload = signal<File | null>(null);

  protected selectFile(input: HTMLInputElement): void {
    this.fileToUpload.set(input.files?.[0] ?? null);
  }

  protected upload(): void {
    const fileToUpload = this.fileToUpload();
    if (fileToUpload) {
      this.configApi
        .importConfig(fileToUpload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          error: (error: HttpErrorResponse) => {
            this.httpErrorHandler.handleError(error, this.labels.errors.importConfiguration);
          },
          complete: () => {
            this.dialogRef.close();
            window.location.reload();
          }
        });
    }
  }
}
