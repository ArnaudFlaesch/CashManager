import { HttpErrorResponse } from "@angular/common/http";
import { Component, computed, DestroyRef, inject, input, signal, viewChild } from "@angular/core";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { endOfMonth, startOfMonth } from "date-fns";
import { switchMap } from "rxjs";

import { HttpErrorHandler } from "@core/http-error-handler";
import { Theme } from "@core/theme";
import { Label } from "@features/home/labels/label";
import { confirmWithModal } from "@shared/confirm-modal/confirm-modal";
import { ConfirmModalData } from "@shared/confirm-modal/confirm-modal-data";
import { CreateExpense } from "../create-expense/create-expense";
import { Expense } from "../expense";
import { ExpenseApi } from "../expense-api";
import { ExpenseListByMonthView } from "../expense-list-by-month-view/expense-list-by-month-view";
import { InsertExpensePayload } from "../insert-expense-payload";

@Component({
  selector: "cash-manager-expense-list-by-month",
  templateUrl: "./expense-list-by-month.html",
  imports: [MatIcon, ExpenseListByMonthView, CreateExpense]
})
export class ExpenseListByMonth {
  private readonly dialog = inject(MatDialog);
  private readonly expenseApi = inject(ExpenseApi);
  private readonly httpErrorHandler = inject(HttpErrorHandler);
  private readonly theme = inject(Theme);
  private readonly destroyRef = inject(DestroyRef);

  public readonly expenseLabels = input<Label[]>([]);

  protected readonly labels = {
    newExpense: "Nouvelle dépense",
    deleteExpenseDialog: {
      title: "Suppression d'une dépense",
      message: "Êtes-vous sûr de vouloir supprimer cette dépense ?"
    } satisfies ConfirmModalData,
    errors: {
      creatingExpense: "Erreur lors de l'ajout de la dépense.",
      gettingExpenses: "Erreur lors de la récupération des dépenses."
    }
  };

  private readonly createExpenseForm = viewChild(CreateExpense);

  public readonly selectedMonth = signal(startOfMonth(new Date()));
  // The month typed in the datepicker may be any day of the month
  private readonly month = computed(() => startOfMonth(this.selectedMonth()), {
    equal: (monthA, monthB) => monthA.getTime() === monthB.getTime()
  });
  public readonly expenses = rxResource({
    params: () => this.month(),
    stream: ({ params: month }) =>
      this.expenseApi
        .getExpensesAtMonth(month, endOfMonth(month))
        .pipe(this.httpErrorHandler.catchError<Expense[]>(this.labels.errors.gettingExpenses, [])),
    defaultValue: []
  });
  public readonly isCreatingExpense = signal(false);
  public readonly isDarkMode = this.theme.isDarkMode;

  public addExpense(newExpense: InsertExpensePayload): void {
    this.isCreatingExpense.set(true);
    this.expenseApi
      .addExpense(newExpense)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (createdExpense) => {
          this.expenses.value.update((expenses) => [...expenses, createdExpense]);
          this.createExpenseForm()?.clearAmountAndLabel();
          this.isCreatingExpense.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.isCreatingExpense.set(false);
          this.httpErrorHandler.handleError(error, this.labels.errors.creatingExpense);
        }
      });
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
}
