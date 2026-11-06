import { HttpErrorResponse } from "@angular/common/http";
import { HttpErrorHandler } from "@core/http-error-handler";
import { LabelApi } from "@features/home/labels/label-api";
import { Component, DestroyRef, inject, input, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Label } from "@features/home/labels/label";
import { ConfirmModalData } from "@shared/confirm-modal/confirm-modal-data";
import { MatDialog } from "@angular/material/dialog";
import { filter, switchMap } from "rxjs";
import { ConfirmModal } from "@shared/confirm-modal/confirm-modal";
import { DIALOG_SMALL_HEIGHT, DIALOG_SMALL_WIDTH } from "@shared/dialog-sizes";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatTooltip } from "@angular/material/tooltip";

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

  protected openDeleteLabelDialog(labelId: number): void {
    this.dialog
      .open(ConfirmModal, {
        height: DIALOG_SMALL_HEIGHT,
        width: DIALOG_SMALL_WIDTH,
        data: this.labels.deleteLabelDialog
      })
      .afterClosed()
      .pipe(
        filter((result) => result === "validate"),
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
