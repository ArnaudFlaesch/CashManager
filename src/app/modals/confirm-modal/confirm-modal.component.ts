import { Component, inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import { IConfirmModalData } from "@model/IConfirmModalData";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "cash-manager-confirm-modal",
  templateUrl: "./confirm-modal.component.html",
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ConfirmModalComponent {
  public readonly labels = {
    cancel: "Annuler",
    validate: "Valider"
  };

  protected readonly data = inject<IConfirmModalData>(MAT_DIALOG_DATA);
}
