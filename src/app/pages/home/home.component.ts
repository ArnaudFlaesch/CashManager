import { HttpErrorResponse } from '@angular/common/http';
import { Label } from '../../model/Label';
import { ErrorHandlerService } from '../../services/error.handler.service';
import { LabelService } from '../../services/label.service/label.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabelListComponent } from '../../label-list/label-list.component';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { TotalExpenseByMonthComponent } from '../../total-expense-by-month/total-expense-by-month.component';
import { ExpenseListByMonthComponent } from '../../expense-list-by-month/expense-list-by-month.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { HeaderComponent } from '../../header/header.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [HeaderComponent, MatTabGroup, MatTab, ExpenseListByMonthComponent, TotalExpenseByMonthComponent, FormsModule, MatFormField, MatLabel, MatInput, ReactiveFormsModule, MatButton, LabelListComponent]
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
