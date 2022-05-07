import { ExpenseViewEnum } from './../enums/ExpenseViewEnum';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public expenseView = ExpenseViewEnum.EXPENSES_BY_MONTH;

  public isExpenseByMonthViewSelected() {
    return this.expenseView === ExpenseViewEnum.EXPENSES_BY_MONTH;
  }

  public isTotalExpensesByMonthViewSelected() {
    return this.expenseView === ExpenseViewEnum.TOTAL_BY_MONTH;
  }

  public selectExpenseByMonthView() {
    this.expenseView = ExpenseViewEnum.EXPENSES_BY_MONTH;
  }

  public selectTotalExpensesByMonthView() {
    this.expenseView = ExpenseViewEnum.TOTAL_BY_MONTH;
  }
}
