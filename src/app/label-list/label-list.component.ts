import { ErrorHandlerService } from './../services/error.handler.service';
import { LabelService } from './../services/label.service/label.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Label } from '../model/Label';

@Component({
  selector: 'app-label-list',
  templateUrl: './label-list.component.html',
  styleUrls: ['./label-list.component.scss']
})
export class LabelListComponent {
  @Input() labels: Label[] = [];
  @Output() labelDeletedEvent = new EventEmitter<number>();

  constructor(
    private labelService: LabelService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  public deleteLabel(labelId: number): void {
    this.labelService.deleteLabel(labelId).subscribe({
      next: () => {
        this.labels = this.labels.filter((label) => label.id !== labelId);
        this.labelDeletedEvent.emit(labelId);
      },
      error: (error) =>
        this.errorHandlerService.handleError(
          error.message,
          'erreur suppression label'
        )
    });
  }
}
