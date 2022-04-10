import { LabelService } from './../services/label.service/label.service';
import { Label } from './../model/Label';
import { ErrorHandlerService } from './../services/error.handler.service';
import { ExpenseService } from './../services/expense.service/expense.service';
import { Expense } from './../model/Expense';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.scss']
})
export class CreateExpenseComponent {
  public expenseToCreate: Expense;

  myControl = new FormControl('');

  @Input()
  public labels: Label[] = [];
  public filteredOptions: Observable<Label[]> = of([]);

  private ERROR_CREATING_EXPENSE_MESSAGE =
    "Erreur lors de l'ajout de la dépense.";

  constructor(
    private expenseService: ExpenseService,
    private labelService: LabelService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.expenseToCreate = new Expense();
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.labels.slice()))
    );
  }

  public handleCreateExpense() {
    console.log(this.myControl.value);
    console.log();
    if (typeof this.myControl.value == 'string') {
      // Add label to database, then get its id and add the expense
    }
    const selectedLabel: Label = this.myControl.value;
    this.expenseService.addExpense(this.expenseToCreate).subscribe({
      next: (createdExpense) => console.log(createdExpense),
      error: (error) =>
        this.errorHandlerService.handleError(
          error.message,
          this.ERROR_CREATING_EXPENSE_MESSAGE
        )
    });
  }

  displayFn(label: Label): string {
    return label && label.label ? label.label : '';
  }

  private _filter(value: string): Label[] {
    const filterValue = value.toLowerCase();
    return this.labels.filter((label) =>
      label.label.toLowerCase().includes(filterValue)
    );
  }
}
