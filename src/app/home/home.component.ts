import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ChartConfiguration,
  ChartData,
  ChartEvent,
  ChartTypeRegistry
} from 'chart.js';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { Label } from '../model/Label';
import { ErrorHandlerService } from '../services/error.handler.service';
import { Expense } from './../model/Expense';
import { ExpenseService } from './../services/expense.service/expense.service';
import { LabelService } from './../services/label.service/label.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public labels: Label[] = [];
  public expenses: Expense[] = [];
  public monthsWithExpenses: string[] = [];
  public currentSelectedMonth = startOfMonth(new Date());
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

  private EXPENSES_CHART_LABEL = 'Dépenses';
  public pastMonths: Date[] = Array.from(
    Array(new Date().getMonth() + 1).keys()
  ).map((month) => new Date(new Date().getFullYear(), month, 1));

  constructor(
    public dialog: MatDialog,
    private labelService: LabelService,
    private expenseService: ExpenseService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.initDashboard();
  }

  private initDashboard() {
    this.getLabels();
  }

  public handleSelectExpensesForMonth(month: Date) {
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
          this.errorHandlerService.handleError(error.message, 'this.epenses')
      });
  }

  private getExpensesByLabel(expenses: Expense[]): Record<string, number[]> {
    return expenses.reduce(
      (expensesByLabel: Record<string, number[]>, currentExpense: Expense) => {
        const label = currentExpense.label.id;
        expensesByLabel[label] = expensesByLabel[label] ?? [];
        expensesByLabel[label].push(currentExpense.amount);
        return expensesByLabel;
      },
      {}
    );
  }

  private getLabels() {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
        const startIntervalDate = this.currentSelectedMonth;
        const endIntervalDate = endOfMonth(this.currentSelectedMonth);
        this.getExpenses(startIntervalDate, endIntervalDate);
      },
      error: (error: HttpErrorResponse) =>
        this.errorHandlerService.handleError(
          error.message,
          'this.ERROR_MESSAGE_INIT_DASHBOARD'
        )
    });
  }

  private refreshExpensesChart() {
    const expensesByLabel = this.getExpensesByLabel(this.expenses);
    this.expensesByLabelChart = {
      labels: [this.EXPENSES_CHART_LABEL],
      datasets: Object.keys(expensesByLabel).map((labelId) => {
        return {
          label: this.labels.filter(
            (label) => label.id.toString() === labelId
          )[0].label,
          data: [
            expensesByLabel[labelId].reduce((total, amount) => total + amount)
          ]
        };
      })
    };
  }

  public handleExpenseCreation(newExpense: Expense) {
    this.expenses = [...this.expenses, newExpense];
    this.refreshExpensesChart();
  }

  public handleLabelCreation(newLabel: Label) {
    this.labels = [...this.labels, newLabel];
  }

  public deleteLabel(labelId: number): void {
    this.labelService.deleteLabel(labelId).subscribe({
      next: () => {
        this.labels = this.labels.filter((label) => label.id !== labelId);
        this.expenses = this.expenses.filter(
          (expense) => expense.label.id !== labelId
        );
        this.refreshExpensesChart();
      },
      error: (error) =>
        this.errorHandlerService.handleError(
          error.message,
          'erreur suppression label'
        )
    });
  }

  public getTotalForMonth = () =>
    this.expenses
      .map((expense) => expense.amount)
      .reduce((total, amount) => total + amount);

  public formatMonthToDisplay = (monthDate: Date) =>
    format(monthDate, 'MMMM yyyy');

  public getMonthButtonColor = (monthDate: Date) =>
    this.currentSelectedMonth.getTime() === startOfMonth(monthDate).getTime()
      ? 'primary'
      : '';

  public handleChartClickedEvent({
    event,
    active
  }: {
    event?: ChartEvent;
    active?: Record<string, unknown>[];
  }): void {
    console.log(event, active);
  }
}
