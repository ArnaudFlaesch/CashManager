import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { IConfirmDialogData } from './IConfirmDialogData';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-confirm-modal.component',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class ConfirmModalComponent {
  protected readonly data = inject<IConfirmDialogData>(MAT_DIALOG_DATA);
}
