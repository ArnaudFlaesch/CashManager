import { Component, computed, input, output, signal } from "@angular/core";
import { form, FormField, FormRoot, min, required, validate } from "@angular/forms/signals";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";

import { Label } from "@features/home/labels/label";
import { formatDateWithOffsetToUtc } from "@shared/utc-date";
import { ExpenseFormModel } from "../expense-form-model";
import { InsertExpensePayload } from "../insert-expense-payload";

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
  public readonly expenseLabels = input<Label[]>([]);
  public readonly isSubmitting = input(false);
  /** Emitted with the expense to create, once the form is submitted and valid. */
  public readonly expenseSubmitted = output<InsertExpensePayload>();

  protected readonly labels = {
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
        action: (expenseForm) => {
          const { amount, date, label } = expenseForm().value();
          // Already guaranteed by the validators, checked so that the types are narrowed
          if (typeof label !== "string" && date !== null) {
            this.expenseSubmitted.emit({
              amount,
              labelId: label.id,
              expenseDate: formatDateWithOffsetToUtc(date)
            });
          }
          return Promise.resolve(undefined);
        }
      }
    }
  );
  public readonly canCreateExpense = computed(
    () => this.expenseForm().valid() && !this.isSubmitting()
  );
  public readonly filteredOptions = computed(() => {
    const label = this.expenseModel().label;
    const filterValue = (typeof label === "string" ? label : label.label).toLowerCase();
    return this.expenseLabels().filter((option) =>
      option.label.toLowerCase().includes(filterValue)
    );
  });

  /** Public: called by the parent once the expense is created, the date is kept for the next one. */
  public clearAmountAndLabel(): void {
    this.expenseModel.update((model) => ({ ...model, amount: 0, label: "" }));
  }

  public displayLabel(label: Label | string | null): string {
    return typeof label === "string" ? label : (label?.label ?? "");
  }
}
