import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, computed, input, model, output } from "@angular/core";
import { form, FormField } from "@angular/forms/signals";
import { MatIconButton } from "@angular/material/button";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatTooltip } from "@angular/material/tooltip";
import { ChartData } from "chart.js";
import { addMonths, startOfMonth, subMonths } from "date-fns";
import { BaseChartDirective } from "ng2-charts";

import { Label } from "@features/home/labels/label";
import { getChartOptions } from "@shared/chart-options";
import { Expense } from "../expense";

@Component({
  selector: "cash-manager-expense-list-by-month-view",
  templateUrl: "./expense-list-by-month-view.html",
  styleUrl: "./expense-list-by-month-view.scss",
  imports: [
    BaseChartDirective,
    CurrencyPipe,
    DatePipe,
    MatTooltip,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerInput,
    FormField,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker
  ]
})
export class ExpenseListByMonthView {
  public readonly expenses = input.required<Expense[]>();
  public readonly expenseLabels = input<Label[]>([]);
  public readonly isDarkMode = input(false);
  /** Month of the displayed expenses, also changed by the navigation and the datepicker. */
  public readonly selectedMonth = model.required<Date>();
  /** Emitted with the id of the expense to delete, once the user clicks on its delete button. */
  public readonly expenseDeletionRequested = output<number>();

  protected readonly labels = {
    previousMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    selectMonth: "Sélectionnez un mois",
    expensesByLabel: "Dépenses par étiquette",
    noExpense: "Aucune dépense ce mois-ci.",
    totalForMonth: "Total ce mois",
    deleteExpense: "Supprimer la dépense",
    expensesChart: "Dépenses"
  };

  public readonly selectedMonthForm = form(this.selectedMonth);
  public readonly labelNames = computed(
    () => new Map(this.expenseLabels().map((label) => [label.id, label.label]))
  );
  public readonly totalForMonth = computed(() =>
    // Rounded to remove the floating point errors of the sum, such as 0.1 + 0.2
    Number.parseFloat(
      this.expenses()
        .reduce((total, expense) => total + expense.amount, 0)
        .toFixed(10)
    )
  );
  public readonly chartOptions = computed(() => getChartOptions(this.isDarkMode()));
  public readonly expensesByLabelChart = computed<ChartData<"bar">>(() => {
    const totalByLabel = new Map<number, number>();
    for (const { labelId, amount } of this.expenses()) {
      totalByLabel.set(labelId, (totalByLabel.get(labelId) ?? 0) + amount);
    }
    return {
      labels: [this.labels.expensesChart],
      datasets: [...totalByLabel].map(([labelId, total]) => {
        const labelName = this.labelNames().get(labelId);
        return labelName === undefined
          ? { label: "", data: [] }
          : { label: labelName, data: [total] };
      })
    };
  });

  public selectPreviousMonth(): void {
    this.selectMonth(subMonths(startOfMonth(this.selectedMonth()), 1));
  }

  public selectNextMonth(): void {
    this.selectMonth(addMonths(startOfMonth(this.selectedMonth()), 1));
  }

  public setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>): void {
    this.selectMonth(normalizedMonthAndYear);
    datepicker.close();
  }

  private selectMonth(month: Date): void {
    this.selectedMonth.set(startOfMonth(month));
  }
}
