import { HttpErrorResponse } from "@angular/common/http";
import { Component, DestroyRef, inject, input, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { switchMap } from "rxjs";

import { HttpErrorHandler } from "@core/http-error-handler";
import { confirmWithModal } from "@shared/confirm-modal/confirm-modal";
import { ConfirmModalData } from "@shared/confirm-modal/confirm-modal-data";
import { Label } from "../label";
import { LabelApi } from "../label-api";

@Component({
  selector: "cash-manager-label-list",
  templateUrl: "./label-list.html",
  styleUrl: "./label-list.scss",
  imports: [MatIconButton, MatIcon, MatTooltip]
})
export class LabelList {
  private readonly labelApi = inject(LabelApi);
  private readonly httpErrorHandler = inject(HttpErrorHandler);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public readonly expenseLabels = input<Label[]>([]);
  public readonly labelDeleted = output<number>();

  protected readonly labels = {
    deleteLabel: "Supprimer l'étiquette",
    noLabel: "Aucune étiquette pour le moment.",
    deleteLabelDialog: {
      title: "Suppression d'un label",
      message: "Êtes-vous sûr de vouloir supprimer ce label ?"
    } satisfies ConfirmModalData,
    errors: {
      deletingLabel: "Erreur lors de la suppression du label."
    }
  };

  public openDeleteLabelDialog(labelId: number): void {
    confirmWithModal(this.dialog, this.labels.deleteLabelDialog)
      .pipe(
        switchMap(() => this.labelApi.deleteLabel(labelId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.labelDeleted.emit(labelId);
        },
        error: (error: HttpErrorResponse) => {
          this.httpErrorHandler.handleError(error, this.labels.errors.deletingLabel);
        }
      });
  }
}
