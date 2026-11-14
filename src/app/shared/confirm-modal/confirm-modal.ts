import { Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import { filter, map, Observable } from "rxjs";

import { ConfirmModalData } from "./confirm-modal-data";

/** Result of the modal when the user validates the action, see `mat-dialog-close` in the template. */
const VALIDATE_RESULT = "validate";

@Component({
  selector: "cash-manager-confirm-modal",
  templateUrl: "./confirm-modal.html",
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ConfirmModal {
  public readonly data = inject<ConfirmModalData>(MAT_DIALOG_DATA);

  protected readonly labels = {
    cancel: "Annuler",
    validate: "Valider"
  };

  public readonly validateResult = VALIDATE_RESULT;
}

/** Opens the confirmation modal. Emits once the user validates the action, completes otherwise. */
export function confirmWithModal(dialog: MatDialog, data: ConfirmModalData): Observable<void> {
  return dialog
    .open<ConfirmModal, ConfirmModalData, string>(ConfirmModal, {
      height: "250px",
      width: "400px",
      data
    })
    .afterClosed()
    .pipe(
      filter((result) => result === VALIDATE_RESULT),
      map(() => undefined)
    );
}
