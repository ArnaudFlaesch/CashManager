import { Component, inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import { ConfirmModalData } from "./confirm-modal-data";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "cash-manager-confirm-modal",
  templateUrl: "./confirm-modal.html",
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ConfirmModal {
  protected readonly data = inject<ConfirmModalData>(MAT_DIALOG_DATA);

  protected readonly labels = {
    cancel: "Annuler",
    validate: "Valider"
  };
}
