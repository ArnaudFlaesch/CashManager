import { HttpErrorResponse } from '@angular/common/http';
import { Label } from '../../model/Label';
import { ErrorHandlerService } from '../../services/error.handler.service';
import { LabelService } from '../../services/label.service/label.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @Output() insertedLabelEvent = new EventEmitter<Label>();

  public labels: Label[] = [];

  labelControl = new FormControl<string>('');

  private ERROR_CREATING_LABEL_MESSAGE = "Erreur lors de l'ajout du label.";
  private ERROR_GETTING_LABELS = 'Erreur lors de la récupération des labels.';

  constructor(
    private labelService: LabelService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.getLabels();
  }

  public handleCreateLabel(): void {
    if (this.labelControl.value) {
      this.labelService.addLabel(this.labelControl.value).subscribe({
        next: (insertedLabel) => {
          this.labels = [...this.labels, insertedLabel];
          this.insertedLabelEvent.emit(insertedLabel);
          this.labelControl.setValue(null);
        },
        error: (error) =>
          this.errorHandlerService.handleError(
            error.message,
            this.ERROR_CREATING_LABEL_MESSAGE
          )
      });
    }
  }

  private getLabels() {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
      },
      error: (error: HttpErrorResponse) =>
        this.errorHandlerService.handleError(error, this.ERROR_GETTING_LABELS)
    });
  }
}
