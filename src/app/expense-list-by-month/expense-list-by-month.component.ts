import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import {
  ChartConfiguration,
  ChartData,
  ChartEvent,
  ChartTypeRegistry
} from 'chart.js';
import {
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subMonths
} from 'date-fns';

import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { Expense } from '../model/Expense';
import { Label } from '../model/Label';
import { ErrorHandlerService } from '../services/error.handler.service';
import { ExpenseService } from '../services/expense.service/expense.service';
import { LabelService } from '../services/label.service/label.service';
import { DIALOG_SMALL_HEIGHT, DIALOG_SMALL_WIDTH } from '../utils/Constants';

@Component({
  selector: 'app-expense-list-by-month',
  templateUrl: './expense-list-by-month.component.html',
  styleUrls: ['./expense-list-by-month.component.scss']
})
export class ExpenseListByMonthComponent {
  @Input()
  public labels: Label[] = [];
  public expenses: Expense[] = [];
  public monthsWithExpenses: string[] = [];
  public selectedMonthFormControl = new FormControl(startOfMonth(new Date()));

  public expensesByLabelChart:
    | ChartData<keyof ChartTypeRegistry, number[], string>
    | undefined = undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };

  private currentSelectedMonth = startOfMonth(new Date());

  private ERROR_DELETING_LABEL = 'Erreur lors de la suppression du label.';
  private ERROR_GETTING_EXPENSES =
    'Erreur lors de la récupération des dépenses.';

  private EXPENSES_CHART_LABEL = 'Dépenses';

  constructor(
    public dialog: MatDialog,
    private labelService: LabelService,
    private expenseService: ExpenseService,
    private errorHandlerService: ErrorHandlerService
  ) {
    const startIntervalDate = this.currentSelectedMonth;
    const endIntervalDate = endOfMonth(this.currentSelectedMonth);
    this.getExpenses(startIntervalDate, endIntervalDate);
    // Get total expenses, et switch avec la liste des expense par mois
  }

  public deleteLabel(labelId: number): void {
    this.labelService.deleteLabel(labelId).subscribe({
      next: () => {
        this.labels = this.labels.filter((label) => label.id !== labelId);
        this.expenses = this.expenses.filter(
          (expense) => expense.labelId !== labelId
        );
        this.refreshExpensesChart();
      },
      error: (error: HttpErrorResponse) =>
        this.errorHandlerService.handleError(error, this.ERROR_DELETING_LABEL)
    });
  }

  public handleExpenseCreation(newExpense: Expense): void {
    this.expenses = [...this.expenses, newExpense];
    this.refreshExpensesChart();
  }

  public openDeleteExpenseModal(expenseId: number): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      height: DIALOG_SMALL_HEIGHT,
      width: DIALOG_SMALL_WIDTH,
      data: {
        title: "Suppression d'une dépense",
        message: 'Êtes-vous sûr de vouloir supprimer cette dépense ?'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'validate') {
        this.deleteExpense(expenseId);
      }
    });
  }

  public getLabelFromId(labelId: number): Label | undefined {
    return this.labels.find((label) => label.id === labelId);
  }

  public getTotalForMonth(): number {
    return parseFloat(
      this.expenses
        .map((expense) => expense.amount)
        .reduce((total, amount) => total + amount, 0)
        .toFixed(10)
    );
  }

  public handleChartClickedEvent({
    event,
    active
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public selectPreviousMonth(): void {
    this.selectMonth(subMonths(this.currentSelectedMonth, 1));
  }

  public selectNextMonth(): void {
    this.selectMonth(addMonths(this.currentSelectedMonth, 1));
  }

  public setMonthAndYear(
    normalizedMonthAndYear: Date,
    datepicker: MatDatepicker<Date>
  ): void {
    const selectedMonth = new Date(
      normalizedMonthAndYear.getFullYear(),
      normalizedMonthAndYear.getMonth(),
      1
    );
    this.selectMonth(selectedMonth);
    datepicker.close();
  }

  public formatExpenseDate(expenseDate: Date): string {
    return format(expenseDate, 'dd-MM');
  }

  private selectMonth(selectedMonth: Date): void {
    this.selectedMonthFormControl.setValue(selectedMonth);
    this.handleSelectExpensesForMonth(selectedMonth);
  }

  private deleteExpense(expenseId: number) {
    this.expenseService.deleteExpense(expenseId).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(
          (expense) => expense.id !== expenseId
        );
        this.refreshExpensesChart();
      }
    });
  }

  private getExpensesByLabel(expenses: Expense[]): Record<string, number[]> {
    return expenses.reduce(
      (expensesByLabel: Record<string, number[]>, currentExpense: Expense) => {
        const labelId = currentExpense.labelId;
        expensesByLabel[labelId] = expensesByLabel[labelId] ?? [];
        expensesByLabel[labelId].push(currentExpense.amount);
        return expensesByLabel;
      },
      {}
    );
  }

  private handleSelectExpensesForMonth(month: Date): void {
    if (this.currentSelectedMonth.getTime() !== startOfMonth(month).getTime()) {
      this.currentSelectedMonth = startOfMonth(month);
      this.getExpenses(this.currentSelectedMonth, endOfMonth(month));
    }
  }

  private getExpenses(startIntervalDate: Date, endIntervalDate: Date) {
    this.expenseService
      .getExpensesAtMonth(startIntervalDate, endIntervalDate)
      .subscribe({
        next: (expenses) => {
          this.expenses = expenses;
          this.refreshExpensesChart();
        },
        error: (error: HttpErrorResponse) =>
          this.errorHandlerService.handleError(
            error,
            this.ERROR_GETTING_EXPENSES
          )
      });
  }

  private refreshExpensesChart() {
    const expensesByLabel = this.getExpensesByLabel(this.expenses);
    this.expensesByLabelChart = {
      labels: [this.EXPENSES_CHART_LABEL],
      datasets: Object.keys(expensesByLabel).map((labelId) => {
        const labelName = this.labels.filter(
          (label) => label.id.toString() === labelId
        )[0];
        if (!labelId || labelName === undefined) {
          return { label: '', data: [] };
        }
        return {
          label: labelName.label,
          data: [
            expensesByLabel[labelId].reduce((total, amount) => total + amount)
          ]
        };
      })
    };
  }
}
