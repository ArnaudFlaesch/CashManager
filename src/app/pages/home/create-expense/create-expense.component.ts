import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormField, form, min } from "@angular/forms/signals";

import { Expense } from "@model/Expense";
import { DateUtilsService } from "../../../utils/date.utils.service";
import { Label } from "@model/Label";
import { InsertExpensePayload } from "@model/payloads/InsertExpensePayload";
import { ErrorHandlerService } from "@services/error.handler.service";
import { ExpenseService } from "@services/expense.service/expense.service";
import { MatButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import { MatInput } from "@angular/material/input";
import { MatFormField, MatHint, MatLabel, MatSuffix } from "@angular/material/form-field";

@Component({
  selector: "app-create-expense",
  templateUrl: "./create-expense.component.html",
  styleUrls: ["./create-expense.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    FormField,
    MatInput,
    MatDatepickerInput,
    MatHint,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatLabel,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatButton
  ]
})
export class CreateExpenseComponent {
  public readonly expenseModel = signal({
    amount: 0,
    date: null as string | null,
    labelQuery: ""
  });
  public readonly expenseForm = form(this.expenseModel, (schema) => {
    min(schema.amount, 0);
  });
  public readonly filteredOptions = computed(() => {
    const filterValue = this.expenseModel().labelQuery.toLowerCase();
    return filterValue
      ? this.labels().filter((label) => label.label.toLowerCase().includes(filterValue))
      : this.labels().slice();
  });
  public readonly labels = input<Label[]>([]);
  protected readonly insertedExpenseEvent = output<Expense>();

  private readonly selectedLabel = signal<Label | null>(null);
  private readonly ERROR_CREATING_EXPENSE_MESSAGE = "Erreur lors de l'ajout de la dépense.";
  private readonly expenseService = inject(ExpenseService);
  private readonly dateUtilsService = inject(DateUtilsService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly destroyRef = inject(DestroyRef);

  public handleCreateExpense(): void {
    const selectedLabel = this.selectedLabel();
    if (selectedLabel) {
      this.insertExpense(selectedLabel.id);
    }
  }

  public selectLabel(label: Label): void {
    this.selectedLabel.set(label);
    this.expenseModel.update((model) => ({ ...model, labelQuery: label.label }));
  }

  public clearSelectedLabel(): void {
    this.selectedLabel.set(null);
  }

  public displayLabel(label: Label): string {
    return label?.label ? label.label : "";
  }

  public canCreateExpense(): boolean {
    return (
      this.expenseModel().amount > 0 &&
      this.selectedLabel() !== null &&
      this.expenseModel().date !== null
    );
  }
  private insertExpense(labelId: number): void {
    const { amount, date } = this.expenseModel();
    if (date) {
      const expenseToCreate = new InsertExpensePayload();
      expenseToCreate.amount = amount;
      expenseToCreate.labelId = labelId;
      expenseToCreate.expenseDate = this.dateUtilsService.formatDateWithOffsetToUtc(
        new Date(Date.parse(date))
      );

      this.expenseService
        .addExpense(expenseToCreate)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (createdExpense) => {
            this.insertedExpenseEvent.emit(createdExpense);
            this.expenseModel.update((model) => ({ ...model, amount: 0 }));
            this.clearSelectedLabel();
            this.expenseModel.update((model) => ({ ...model, labelQuery: "" }));
          },
          error: (error) =>
            this.errorHandlerService.handleError(error, this.ERROR_CREATING_EXPENSE_MESSAGE)
        });
    }
  }
}
