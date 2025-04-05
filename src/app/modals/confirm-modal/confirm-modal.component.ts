import { Component, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { IConfirmDialogData } from './IConfirmDialogData';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirm-modal.component',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ConfirmModalComponent {
  dialogRef = inject<MatDialogRef<ConfirmModalComponent>>(MatDialogRef);
  data = inject<IConfirmDialogData>(MAT_DIALOG_DATA);
}
