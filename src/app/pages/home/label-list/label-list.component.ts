import { ErrorHandlerService } from '@services/error.handler.service';
import { LabelService } from '@services/label.service/label.service';
import { ChangeDetectionStrategy, Component, inject, model, output } from '@angular/core';
import { Label } from '@model/Label';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../../modals/confirm-modal/confirm-modal.component';
import { DIALOG_SMALL_HEIGHT, DIALOG_SMALL_WIDTH } from '../../../utils/Constants';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-label-list',
  templateUrl: './label-list.component.html',
  styleUrls: ['./label-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatIcon]
})
export class LabelListComponent {
  public readonly labels = model.required<Label[]>();
  protected readonly labelDeletedEvent = output<number>();

  private readonly ERROR_DELETING_LABEL = 'Erreur lors de la suppression du label.';
  private readonly labelService = inject(LabelService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly dialog = inject(MatDialog);

  public openDeleteLabelDialog(labelId: number): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      height: DIALOG_SMALL_HEIGHT,
      width: DIALOG_SMALL_WIDTH,
      data: {
        title: "Suppression d'un label",
        message: 'Êtes-vous sûr de vouloir supprimer ce label ?'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'validate') {
        this.deleteLabel(labelId);
      }
    });
  }

  private deleteLabel(labelId: number): void {
    this.labelService.deleteLabel(labelId).subscribe({
      next: () => {
        this.labels.update((labels) => labels.filter((label) => label.id !== labelId));
        this.labelDeletedEvent.emit(labelId);
      },
      error: (error) => this.errorHandlerService.handleError(error, this.ERROR_DELETING_LABEL)
    });
  }
}
