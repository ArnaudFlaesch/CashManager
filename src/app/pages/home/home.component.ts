import { HttpErrorResponse } from '@angular/common/http';
import { Label } from '@model/Label';
import { ErrorHandlerService } from '@services/error.handler.service';
import { LabelService } from '@services/label.service/label.service';
import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabelListComponent } from './label-list/label-list.component';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { TotalExpenseByMonthComponent } from './total-expense-by-month/total-expense-by-month.component';
import { ExpenseListByMonthComponent } from './expense-list-by-month/expense-list-by-month.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    MatTabGroup,
    MatTab,
    ExpenseListByMonthComponent,
    TotalExpenseByMonthComponent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    LabelListComponent
  ]
})
export class HomeComponent implements OnInit {
  public labelControl = new FormControl<string>('');
  public labels = signal<Label[]>([]);
  protected readonly insertedLabelEvent = output<Label>();

  private readonly ERROR_CREATING_LABEL_MESSAGE = "Erreur lors de l'ajout du label.";
  private readonly ERROR_GETTING_LABELS = 'Erreur lors de la récupération des labels.';
  private readonly labelService = inject(LabelService);
  private readonly errorHandlerService = inject(ErrorHandlerService);

  public ngOnInit(): void {
    this.getLabels();
  }

  public handleCreateLabel(): void {
    if (this.labelControl.value) {
      this.labelService.addLabel(this.labelControl.value).subscribe({
        next: (insertedLabel) => {
          this.labels.update((labels) => [...labels, insertedLabel]);
          this.insertedLabelEvent.emit(insertedLabel);
          this.labelControl.setValue(null);
        },
        error: (error) =>
          this.errorHandlerService.handleError(error.message, this.ERROR_CREATING_LABEL_MESSAGE)
      });
    }
  }

  public onDeleteLabel(labelId: number): void {
    this.labels.update((labels) => labels.filter((label) => label.id !== labelId));
  }

  private getLabels(): void {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels.set(labels);
      },
      error: (error: HttpErrorResponse) =>
        this.errorHandlerService.handleError(error, this.ERROR_GETTING_LABELS)
    });
  }
}
