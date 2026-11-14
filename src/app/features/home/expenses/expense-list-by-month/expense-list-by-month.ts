import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, computed, DestroyRef, inject, input, signal } from "@angular/core";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { form, FormField } from "@angular/forms/signals";
import { MatIconButton } from "@angular/material/button";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatTooltip } from "@angular/material/tooltip";
import { ChartData } from "chart.js";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import { BaseChartDirective } from "ng2-charts";
import { switchMap } from "rxjs";

import { HttpErrorHandler } from "@core/http-error-handler";
import { Theme } from "@core/theme";
import { Label } from "@features/home/labels/label";
import { getChartOptions } from "@shared/chart-options";
import { confirmWithModal } from "@shared/confirm-modal/confirm-modal";
import { ConfirmModalData } from "@shared/confirm-modal/confirm-modal-data";
import { CreateExpense } from "../create-expense/create-expense";
import { Expense } from "../expense";
import { ExpenseApi } from "../expense-api";

@Component({
  selector: "cash-manager-expense-list-by-month",
  templateUrl: "./expense-list-by-month.html",
  styleUrl: "./expense-list-by-month.scss",
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
    MatDatepicker,
    CreateExpense
  ]
})
export class ExpenseListByMonth {
  private readonly dialog = inject(MatDialog);
  private readonly expenseApi = inject(ExpenseApi);
  private readonly httpErrorHandler = inject(HttpErrorHandler);
  private readonly theme = inject(Theme);
  private readonly destroyRef = inject(DestroyRef);

  public readonly expenseLabels = input<Label[]>([]);

  protected readonly labels = {
    previousMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    selectMonth: "Sélectionnez un mois",
    expensesByLabel: "Dépenses par étiquette",
    noExpense: "Aucune dépense ce mois-ci.",
    totalForMonth: "Total ce mois",
    deleteExpense: "Supprimer la dépense",
    newExpense: "Nouvelle dépense",
    expensesChart: "Dépenses",
    deleteExpenseDialog: {
      title: "Suppression d'une dépense",
      message: "Êtes-vous sûr de vouloir supprimer cette dépense ?"
    } satisfies ConfirmModalData,
    errors: {
      gettingExpenses: "Erreur lors de la récupération des dépenses."
    }
  };

  public readonly selectedMonthModel = signal({ selectedMonth: startOfMonth(new Date()) });
  public readonly selectedMonthForm = form(this.selectedMonthModel);
  private readonly selectedMonth = computed(
    () => startOfMonth(this.selectedMonthModel().selectedMonth),
    { equal: (monthA, monthB) => monthA.getTime() === monthB.getTime() }
  );
  public readonly expenses = rxResource({
    params: () => this.selectedMonth(),
    stream: ({ params: month }) =>
      this.expenseApi
        .getExpensesAtMonth(month, endOfMonth(month))
        .pipe(this.httpErrorHandler.catchError<Expense[]>(this.labels.errors.gettingExpenses, [])),
    defaultValue: []
  });
  public readonly labelNames = computed(
    () => new Map(this.expenseLabels().map((label) => [label.id, label.label]))
  );
  public readonly totalForMonth = computed(() =>
    // Rounded to remove the floating point errors of the sum, such as 0.1 + 0.2
    Number.parseFloat(
      this.expenses
        .value()
        .reduce((total, expense) => total + expense.amount, 0)
        .toFixed(10)
    )
  );
  public readonly chartOptions = computed(() => getChartOptions(this.theme.isDarkMode()));
  public readonly expensesByLabelChart = computed<ChartData<"bar">>(() => {
    const totalByLabel = new Map<number, number>();
    for (const { labelId, amount } of this.expenses.value()) {
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

  public addExpense(newExpense: Expense): void {
    this.expenses.value.update((expenses) => [...expenses, newExpense]);
  }

  public openDeleteExpenseModal(expenseId: number): void {
    confirmWithModal(this.dialog, this.labels.deleteExpenseDialog)
      .pipe(
        switchMap(() => this.expenseApi.deleteExpense(expenseId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.expenses.value.update((expenses) =>
          expenses.filter((expense) => expense.id !== expenseId)
        );
      });
  }

  public selectPreviousMonth(): void {
    this.selectMonth(subMonths(this.selectedMonth(), 1));
  }

  public selectNextMonth(): void {
    this.selectMonth(addMonths(this.selectedMonth(), 1));
  }

  public setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>): void {
    this.selectMonth(normalizedMonthAndYear);
    datepicker.close();
  }

  private selectMonth(month: Date): void {
    this.selectedMonthForm.selectedMonth().value.set(startOfMonth(month));
  }
}
