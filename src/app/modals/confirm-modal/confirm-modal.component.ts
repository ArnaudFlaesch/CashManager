import { Component, inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import { IConfirmDialogData } from "./IConfirmDialogData";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "cash-manager-confirm-modal",
  templateUrl: "./confirm-modal.component.html",
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ConfirmModalComponent {
  protected readonly data = inject<IConfirmDialogData>(MAT_DIALOG_DATA);
}
