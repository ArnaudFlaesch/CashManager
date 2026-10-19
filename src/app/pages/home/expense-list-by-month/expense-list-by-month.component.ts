import { DatePipe } from "@angular/common";
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

import { ConfirmModalComponent } from "../../../modals/confirm-modal/confirm-modal.component";
import { Expense } from "@model/Expense";
import { Label } from "@model/Label";
import { ErrorHandlerService } from "@services/error.handler.service";
import { ExpenseService } from "@services/expense.service/expense.service";
import { CHART_OPTIONS, DIALOG_SMALL_HEIGHT, DIALOG_SMALL_WIDTH } from "../../../utils/Constants";
import { CreateExpenseComponent } from "../create-expense/create-expense.component";

import { MatInput } from "@angular/material/input";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { BaseChartDirective } from "ng2-charts";

const ERROR_GETTING_EXPENSES = "Erreur lors de la récupération des dépenses.";
const EXPENSES_CHART_LABEL = "Dépenses";

@Component({
  selector: "cash-manager-expense-list-by-month",
  templateUrl: "./expense-list-by-month.component.html",
  styleUrl: "./expense-list-by-month.component.scss",
  imports: [
    BaseChartDirective,
    DatePipe,
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
    CreateExpenseComponent
  ]
})
export class ExpenseListByMonthComponent {
  public readonly labels = input<Label[]>([]);
  public readonly chartOptions = CHART_OPTIONS;

  public readonly selectedMonthModel = signal({ selectedMonth: startOfMonth(new Date()) });
  public readonly selectedMonthForm = form(this.selectedMonthModel);

  public readonly expenses = rxResource({
    params: () => this.selectedMonth(),
    stream: ({ params: month }) =>
      this.expenseService
        .getExpensesAtMonth(month, endOfMonth(month))
        .pipe(this.errorHandlerService.catchError<Expense[]>(ERROR_GETTING_EXPENSES, [])),
    defaultValue: []
  });

  public readonly labelNames = computed(
    () => new Map(this.labels().map((label) => [label.id, label.label]))
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
      labels: [EXPENSES_CHART_LABEL],
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
  private readonly destroyRef = inject(DestroyRef);

  public handleExpenseCreation(newExpense: Expense): void {
    this.expenses.value.update((expenses) => [...expenses, newExpense]);
  }

  public openDeleteExpenseModal(expenseId: number): void {
    this.dialog
      .open(ConfirmModalComponent, {
        height: DIALOG_SMALL_HEIGHT,
        width: DIALOG_SMALL_WIDTH,
        data: {
          title: "Suppression d'une dépense",
          message: "Êtes-vous sûr de vouloir supprimer cette dépense ?"
        }
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
