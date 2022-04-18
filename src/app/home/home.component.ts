import { Expense } from './../model/Expense';
import { ExpenseService } from './../services/expense.service/expense.service';
import { Label } from '../model/Label';
import { LabelService } from './../services/label.service/label.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../services/error.handler.service';
import { AuthService } from './../services/auth.service/auth.service';
import { ChartData, ChartTypeRegistry } from 'chart.js';
import startOfMonth from 'date-fns/startOfMonth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public labels: Label[] = [];
  public expenses: Expense[] = [];
  public expensesByLabelChart:
    | ChartData<keyof ChartTypeRegistry, number[], string>
    | undefined = undefined;

  private EXPENSES_CHART_LABEL = 'Dépenses';

  constructor(
    private router: Router,
    private authService: AuthService,
    private labelService: LabelService,
    private expenseService: ExpenseService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.initDashboard();
  }

  private initDashboard() {
    this.getLabels();
    this.getExpenses();
  }

  private getExpenses() {
    const startIntervalDate = startOfMonth(new Date());
    const endIntervalDate = new Date();
    this.expenseService
      .getExpenses(startIntervalDate, endIntervalDate)
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
    console.log(Object.keys(expensesByLabel));
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

  public logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
