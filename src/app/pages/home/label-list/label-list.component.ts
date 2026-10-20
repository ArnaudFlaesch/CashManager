import { ErrorHandlerService } from "@services/error.handler.service";
import { LabelService } from "@services/label.service/label.service";
import { Component, DestroyRef, inject, input, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Label } from "@model/Label";
import { MatDialog } from "@angular/material/dialog";
import { filter, switchMap } from "rxjs";
import { ConfirmModalComponent } from "../../../modals/confirm-modal/confirm-modal.component";
import { DIALOG_SMALL_HEIGHT, DIALOG_SMALL_WIDTH } from "../../../utils/Constants";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";

const ERROR_DELETING_LABEL = "Erreur lors de la suppression du label.";

@Component({
  selector: "cash-manager-label-list",
  templateUrl: "./label-list.component.html",
  styleUrl: "./label-list.component.scss",
  imports: [MatIconButton, MatIcon]
})
export class LabelListComponent {
  public readonly labels = input<Label[]>([]);
  public readonly labelDeleted = output<number>();

  private readonly labelService = inject(LabelService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public openDeleteLabelDialog(labelId: number): void {
    this.dialog
      .open(ConfirmModalComponent, {
        height: DIALOG_SMALL_HEIGHT,
        width: DIALOG_SMALL_WIDTH,
        data: {
          title: "Suppression d'un label",
          message: "Êtes-vous sûr de vouloir supprimer ce label ?"
        }
      })
      .afterClosed()
      .pipe(
        filter((result) => result === "validate"),
        switchMap(() => this.labelService.deleteLabel(labelId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.labelDeleted.emit(labelId),
        error: (error) => this.errorHandlerService.handleError(error, ERROR_DELETING_LABEL)
      });
  }
}
