import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';

import { Expense } from '../model/Expense';
import { DateUtilsService } from '../utils/date.utils.service';
import { Label } from './../model/Label';
import { InsertExpensePayload } from './../model/payloads/InsertExpensePayload';
import { ErrorHandlerService } from './../services/error.handler.service';
import { ExpenseService } from './../services/expense.service/expense.service';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import {
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepicker
} from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatHint, MatSuffix, MatLabel } from '@angular/material/form-field';

@Component({
    selector: 'app-create-expense',
    templateUrl: './create-expense.component.html',
    styleUrls: ['./create-expense.component.scss'],
    imports: [
        MatFormField,
        FormsModule,
        MatInput,
        MatDatepickerInput,
        ReactiveFormsModule,
        MatHint,
        MatDatepickerToggle,
        MatSuffix,
        MatDatepicker,
        MatLabel,
        MatAutocompleteTrigger,
        MatAutocomplete,
        MatOption,
        MatButton,
        AsyncPipe
    ]
})
export class CreateExpenseComponent {
  private expenseService = inject(ExpenseService);
  private dateUtilsService = inject(DateUtilsService);
  private errorHandlerService = inject(ErrorHandlerService);

  public readonly labels = input<Label[]>([]);

  readonly insertedExpenseEvent = output<Expense>();

  labelControl = new FormControl<Label | string>('');
  dateFormControl = new FormControl<string | null>(null);

  public expenseToCreate: InsertExpensePayload;
  public filteredOptions: Observable<Label[]> = of([]);

  private selectedLabel: Label | null = null;

  private ERROR_CREATING_EXPENSE_MESSAGE = "Erreur lors de l'ajout de la dépense.";

  constructor() {
    this.expenseToCreate = new InsertExpensePayload();
  }

  ngOnInit(): void {
    this.filteredOptions = this.labelControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
      map((name) => (name ? this.filterLabels(name) : this.labels().slice()))
    );
  }

  public handleCreateExpense(): void {
    if (this.selectedLabel) {
      this.insertExpense(this.selectedLabel.id);
    }
  }

  public selectLabel(label: Label): void {
    this.selectedLabel = label;
  }

  public clearSelectedLabel(): void {
    this.selectedLabel = null;
  }

  public displayLabel(label: Label): string {
    return label?.label ? label.label : '';
  }

  public canCreateExpense(): boolean {
    return (
      this.expenseToCreate.amount > 0 &&
      this.selectedLabel !== null &&
      this.dateFormControl.value !== null
    );
  }

  private insertExpense(labelId: number) {
    if (this.dateFormControl.value) {
      this.expenseToCreate.labelId = labelId;

      this.expenseToCreate.expenseDate = this.dateUtilsService.formatDateWithOffsetToUtc(
        new Date(Date.parse(this.dateFormControl.value))
      );

      this.expenseService.addExpense(this.expenseToCreate).subscribe({
        next: (createdExpense) => {
          this.insertedExpenseEvent.emit(createdExpense);
          this.expenseToCreate.amount = 0;
          this.clearSelectedLabel();
          this.labelControl.reset();
        },
        error: (error) =>
          this.errorHandlerService.handleError(error, this.ERROR_CREATING_EXPENSE_MESSAGE)
      });
    }
  }

  private filterLabels(value: string): Label[] {
    const filterValue = value.toLowerCase();
    return this.labels().filter((label) => label.label.toLowerCase().includes(filterValue));
  }
}
