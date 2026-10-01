import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { map, Observable, of, startWith } from "rxjs";

import { Expense } from "@model/Expense";
import { DateUtilsService } from "../../../utils/date.utils.service";
import { Label } from "@model/Label";
import { InsertExpensePayload } from "@model/payloads/InsertExpensePayload";
import { ErrorHandlerService } from "@services/error.handler.service";
import { ExpenseService } from "@services/expense.service/expense.service";
import { MatButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import { AsyncPipe } from "@angular/common";
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
export class CreateExpenseComponent implements OnInit {
  public expenseToCreate = signal(new InsertExpensePayload());
  public filteredOptions: Observable<Label[]> = of([]);
  public readonly labels = input<Label[]>([]);
  public dateFormControl = new FormControl<string | null>(null);
  protected labelControl = new FormControl<Label | string>("");
  protected readonly insertedExpenseEvent = output<Expense>();

  private readonly selectedLabel = signal<Label | null>(null);
  private readonly ERROR_CREATING_EXPENSE_MESSAGE = "Erreur lors de l'ajout de la dépense.";
  private readonly expenseService = inject(ExpenseService);
  private readonly dateUtilsService = inject(DateUtilsService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.filteredOptions = this.labelControl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : "")),
      map((name) => (name ? this.filterLabels(name) : this.labels().slice()))
    );
  }

  public handleCreateExpense(): void {
    const selectedLabel = this.selectedLabel();
    if (selectedLabel) {
      this.insertExpense(selectedLabel.id);
    }
  }

  public selectLabel(label: Label): void {
    this.selectedLabel.set(label);
  }

  public clearSelectedLabel(): void {
    this.selectedLabel.set(null);
  }

  public displayLabel(label: Label): string {
    return label?.label ? label.label : "";
  }

  public canCreateExpense(): boolean {
    return (
      this.expenseToCreate().amount > 0 &&
      this.selectedLabel() !== null &&
      this.dateFormControl.value !== null
    );
  }

  private insertExpense(labelId: number): void {
    if (this.dateFormControl.value) {
      const expenseToCreate = new InsertExpensePayload();
      expenseToCreate.amount = this.expenseToCreate().amount;
      expenseToCreate.labelId = labelId;
      expenseToCreate.expenseDate = this.dateUtilsService.formatDateWithOffsetToUtc(
        new Date(Date.parse(this.dateFormControl.value))
      );

      this.expenseService
        .addExpense(expenseToCreate)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (createdExpense) => {
            this.insertedExpenseEvent.emit(createdExpense);
            this.expenseToCreate.update((expense) => ({ ...expense, amount: 0 }));
            this.clearSelectedLabel();
            this.labelControl.reset();
          },
          error: (error) =>
            this.errorHandlerService.handleError(error, this.ERROR_CREATING_EXPENSE_MESSAGE)
        });
    }
  }

  public setExpenseAmount(amount: number): void {
    this.expenseToCreate.update((expense) => ({ ...expense, amount }));
  }

  private filterLabels(value: string): Label[] {
    const filterValue = value.toLowerCase();
    return this.labels().filter((label) => label.label.toLowerCase().includes(filterValue));
  }
}
