import { HttpErrorResponse } from "@angular/common/http";
import { Component, computed, inject, input, output, signal } from "@angular/core";
import { form, FormField, FormRoot, min, required, submit, validate } from "@angular/forms/signals";
import { firstValueFrom } from "rxjs";

import { Expense } from "@features/home/expenses/expense.model";
import { IExpenseFormModel } from "@features/home/expenses/expense-form.model";
import { formatDateWithOffsetToUtc } from "@shared/date.utils";
import { Label } from "@features/home/labels/label.model";
import { ErrorHandlerService } from "@core/error-handler.service";
import { ExpenseService } from "@features/home/expenses/expense.service";
import { MatButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import { MatInput } from "@angular/material/input";
import {
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "cash-manager-create-expense",
  templateUrl: "./create-expense.component.html",
  styleUrl: "./create-expense.component.scss",
  imports: [
    MatFormField,
    FormRoot,
    FormField,
    MatInput,
    MatDatepickerInput,
    MatHint,
    MatDatepickerToggle,
    MatPrefix,
    MatSuffix,
    MatIcon,
    MatDatepicker,
    MatLabel,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatButton
  ]
})
export class CreateExpenseComponent {
  public readonly labels = {
    amount: "Montant",
    amountPlaceholder: "Saisissez le montant de la dépense",
    date: "Date",
    datePlaceholder: "Sélectionnez une date",
    dateHint: "DD/MM/YYYY",
    label: "Étiquette",
    labelPlaceholder: "Renseignez un label",
    labelAriaLabel: "Label",
    add: "Ajouter"
  };

  public readonly expenseLabels = input<Label[]>([]);
  public readonly insertedExpenseEvent = output<Expense>();

  public readonly expenseModel = signal<IExpenseFormModel>({ amount: 0, date: null, label: "" });
  public readonly expenseForm = form(
    this.expenseModel,
    (schema) => {
      min(schema.amount, 0.01);
      required(schema.date);
      validate(schema.label, ({ value }) =>
        typeof value() === "string" ? { kind: "labelNotSelected" } : undefined
      );
    },
    {
      submission: {
        action: async (expenseForm) => {
          const { amount, date, label } = expenseForm().value();
          try {
            const createdExpense = await firstValueFrom(
              this.expenseService.addExpense({
                amount,
                labelId: (label as Label).id,
                expenseDate: formatDateWithOffsetToUtc(date as Date)
              })
            );
            this.insertedExpenseEvent.emit(createdExpense);
            this.expenseModel.update((model) => ({ ...model, amount: 0, label: "" }));
          } catch (error) {
            this.errorHandlerService.handleError(
              error as HttpErrorResponse,
              this.ERROR_CREATING_EXPENSE
            );
          }
          return undefined;
        }
      }
    }
  );

  public readonly canCreateExpense = computed(
    () => this.expenseForm().valid() && !this.expenseForm().submitting()
  );
  public readonly filteredOptions = computed(() => {
    const label = this.expenseModel().label;
    const filterValue = (typeof label === "string" ? label : label.label).toLowerCase();
    return this.expenseLabels().filter((option) =>
      option.label.toLowerCase().includes(filterValue)
    );
  });

  private readonly expenseService = inject(ExpenseService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly ERROR_CREATING_EXPENSE = "Erreur lors de l'ajout de la dépense.";

  public handleCreateExpense(): Promise<boolean> {
    return submit(this.expenseForm);
  }

  public selectLabel(label: Label): void {
    this.expenseForm.label().value.set(label);
  }

  public displayLabel(label: Label | string | null): string {
    return typeof label === "string" ? label : (label?.label ?? "");
  }
}
