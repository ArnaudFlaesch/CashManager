import { HttpErrorResponse } from "@angular/common/http";
import { Component, computed, inject, input, output, signal } from "@angular/core";
import { form, FormField, FormRoot, min, required, validate } from "@angular/forms/signals";
import { firstValueFrom } from "rxjs";

import { Expense } from "@features/home/expenses/expense";
import { ExpenseFormModel } from "@features/home/expenses/expense-form-model";
import { formatDateWithOffsetToUtc } from "@shared/utc-date";
import { Label } from "@features/home/labels/label";
import { HttpErrorHandler } from "@core/http-error-handler";
import { ExpenseApi } from "@features/home/expenses/expense-api";
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
  templateUrl: "./create-expense.html",
  styleUrl: "./create-expense.scss",
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
export class CreateExpense {
  private readonly expenseApi = inject(ExpenseApi);
  private readonly httpErrorHandler = inject(HttpErrorHandler);

  public readonly expenseLabels = input<Label[]>([]);
  public readonly expenseCreated = output<Expense>();

  protected readonly labels = {
    amount: "Montant",
    amountPlaceholder: "Saisissez le montant de la dépense",
    date: "Date",
    datePlaceholder: "Sélectionnez une date",
    dateHint: "DD/MM/YYYY",
    label: "Étiquette",
    labelPlaceholder: "Renseignez un label",
    labelAriaLabel: "Label",
    add: "Ajouter",
    errors: {
      creatingExpense: "Erreur lors de l'ajout de la dépense."
    }
  };

  private readonly expenseModel = signal<ExpenseFormModel>({ amount: 0, date: null, label: "" });
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
          // Already guaranteed by the validators, checked so that the types are narrowed
          if (typeof label === "string" || date === null) {
            return undefined;
          }
          try {
            const createdExpense = await firstValueFrom(
              this.expenseApi.addExpense({
                amount,
                labelId: label.id,
                expenseDate: formatDateWithOffsetToUtc(date)
              })
            );
            this.expenseCreated.emit(createdExpense);
            this.expenseModel.update((model) => ({ ...model, amount: 0, label: "" }));
          } catch (error) {
            this.httpErrorHandler.handleError(
              error as HttpErrorResponse,
              this.labels.errors.creatingExpense
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

  public displayLabel(label: Label | string | null): string {
    return typeof label === "string" ? label : (label?.label ?? "");
  }
}
