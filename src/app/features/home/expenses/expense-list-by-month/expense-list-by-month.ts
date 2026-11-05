import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, computed, DestroyRef, inject, input, signal } from "@angular/core";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { form, FormField } from "@angular/forms/signals";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { ChartData } from "chart.js";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import { filter, switchMap } from "rxjs";

import { ConfirmModal } from "@shared/confirm-modal/confirm-modal";
import { Expense } from "@features/home/expenses/expense.model";
import { IConfirmModalData } from "@shared/confirm-modal/confirm-modal-data.model";
import { Label } from "@features/home/labels/label.model";
import { ErrorHandlerService } from "@core/error-handler-service";
import { ThemeService } from "@core/theme-service";
import { ExpenseService } from "@features/home/expenses/expense-service";
import { getChartOptions, DIALOG_SMALL_HEIGHT, DIALOG_SMALL_WIDTH } from "@shared/constants";
import { CreateExpense } from "@features/home/expenses/create-expense/create-expense";

import { MatInput } from "@angular/material/input";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatTooltip } from "@angular/material/tooltip";
import { BaseChartDirective } from "ng2-charts";

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
  public readonly labels = {
    previousMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    selectMonth: "Sélectionnez un mois",
    expensesByLabel: "Dépenses par étiquette",
    noExpense: "Aucune dépense ce mois-ci.",
    totalForMonth: "Total ce mois",
    deleteExpense: "Supprimer la dépense",
    newExpense: "Nouvelle dépense"
  };

  private readonly ERROR_GETTING_EXPENSES = "Erreur lors de la récupération des dépenses.";
  private readonly EXPENSES_CHART_LABEL = "Dépenses";
  private readonly DELETE_EXPENSE_MODAL_DATA: IConfirmModalData = {
    title: "Suppression d'une dépense",
    message: "Êtes-vous sûr de vouloir supprimer cette dépense ?"
  };

  public readonly expenseLabels = input<Label[]>([]);
  public readonly chartOptions = computed(() => getChartOptions(this.themeService.isDarkMode()));

  public readonly selectedMonthModel = signal({ selectedMonth: startOfMonth(new Date()) });
  public readonly selectedMonthForm = form(this.selectedMonthModel);

  public readonly expenses = rxResource({
    params: () => this.selectedMonth(),
    stream: ({ params: month }) =>
      this.expenseService
        .getExpensesAtMonth(month, endOfMonth(month))
        .pipe(this.errorHandlerService.catchError<Expense[]>(this.ERROR_GETTING_EXPENSES, [])),
    defaultValue: []
  });

  public readonly labelNames = computed(
    () => new Map(this.expenseLabels().map((label) => [label.id, label.label]))
  );

  public readonly totalForMonth = computed(() =>
    Number.parseFloat(
      this.expenses
        .value()
        .reduce((total, expense) => total + expense.amount, 0)
        .toFixed(10)
    )
  );

  public readonly expensesByLabelChart = computed<ChartData<"bar">>(() => {
    const totalByLabel = new Map<number, number>();
    for (const { labelId, amount } of this.expenses.value()) {
      totalByLabel.set(labelId, (totalByLabel.get(labelId) ?? 0) + amount);
    }
    return {
      labels: [this.EXPENSES_CHART_LABEL],
      datasets: [...totalByLabel].map(([labelId, total]) => {
        const labelName = this.labelNames().get(labelId);
        return labelName === undefined
          ? { label: "", data: [] }
          : { label: labelName, data: [total] };
      })
    };
  });

  private readonly selectedMonth = computed(
    () => startOfMonth(this.selectedMonthModel().selectedMonth),
    { equal: (monthA, monthB) => monthA.getTime() === monthB.getTime() }
  );
  private readonly dialog = inject(MatDialog);
  private readonly expenseService = inject(ExpenseService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);

  public handleExpenseCreation(newExpense: Expense): void {
    this.expenses.value.update((expenses) => [...expenses, newExpense]);
  }

  public openDeleteExpenseModal(expenseId: number): void {
    this.dialog
      .open(ConfirmModal, {
        height: DIALOG_SMALL_HEIGHT,
        width: DIALOG_SMALL_WIDTH,
        data: this.DELETE_EXPENSE_MODAL_DATA
      })
      .afterClosed()
      .pipe(
        filter((result) => result === "validate"),
        switchMap(() => this.expenseService.deleteExpense(expenseId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() =>
        this.expenses.value.update((expenses) =>
          expenses.filter((expense) => expense.id !== expenseId)
        )
      );
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
