import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';
import { Expense } from '../model/Expense';
import { DateUtilsService } from '../utils/date.utils.service';
import { Label } from './../model/Label';
import { InsertExpensePayload } from './../model/payloads/InsertExpensePayload';
import { ErrorHandlerService } from './../services/error.handler.service';
import { ExpenseService } from './../services/expense.service/expense.service';
import { LabelService } from './../services/label.service/label.service';

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.scss']
})
export class CreateExpenseComponent {
  public expenseToCreate: InsertExpensePayload;
  @Output() insertedExpenseEvent = new EventEmitter<Expense>();
  @Output() insertedLabelEvent = new EventEmitter<Label>();

  labelControl = new FormControl<Label | string>('');
  dateFormControl = new FormControl('');

  @Input()
  public labels: Label[] = [];
  public filteredOptions: Observable<Label[]> = of([]);

  private ERROR_CREATING_EXPENSE_MESSAGE =
    "Erreur lors de l'ajout de la dépense.";

  constructor(
    private expenseService: ExpenseService,
    private labelService: LabelService,
    private dateUtilsService: DateUtilsService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.expenseToCreate = new InsertExpensePayload();
  }

  ngOnInit() {
    this.filteredOptions = this.labelControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
      map((name) => (name ? this.filterLabels(name) : this.labels.slice()))
    );
  }

  public handleCreateExpense() {
    if (typeof this.labelControl.value == 'string') {
      this.labelService.addLabel(this.labelControl.value).subscribe({
        next: (insertedLabel) => {
          this.labels = [...this.labels, insertedLabel];
          this.insertedLabelEvent.emit(insertedLabel);
          this.labelControl.setValue(insertedLabel);
          this.insertExpense(insertedLabel.id);
        },
        error: (error) =>
          this.errorHandlerService.handleError(error.message, 'error new label')
      });
    } else if (this.labelControl.value) {
      this.insertExpense(this.labelControl.value.id);
    }
  }

  private insertExpense(labelId: number) {
    if (this.dateFormControl.value) {
      this.expenseToCreate.labelId = labelId;

      this.expenseToCreate.expenseDate =
        this.dateUtilsService.formatDateWithOffsetToUtc(
          new Date(Date.parse(this.dateFormControl.value))
        );

      this.expenseService.addExpense(this.expenseToCreate).subscribe({
        next: (createdExpense) =>
          this.insertedExpenseEvent.emit(createdExpense),
        error: (error) =>
          this.errorHandlerService.handleError(
            error.message,
            this.ERROR_CREATING_EXPENSE_MESSAGE
          )
      });
    }
  }

  public displayLabel = (label: Label): string =>
    label && label.label ? label.label : '';

  private filterLabels(value: string): Label[] {
    const filterValue = value.toLowerCase();
    return this.labels.filter((label) =>
      label.label.toLowerCase().includes(filterValue)
    );
  }
}
