import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { format } from "date-fns";
import { Observable } from "rxjs";
import { Expense } from "./expense";
import { environment } from "@environments/environment";
import { MonthlyExpenseTotal } from "./monthly-expense-total";
import { InsertExpensePayload } from "./insert-expense-payload";

@Service()
export class ExpenseApi {
  private readonly DATE_FORMAT = "yyyy-MM-dd";

  private readonly http = inject(HttpClient);
  private readonly expenseUrl = `${environment.backend_url}/expense`;

  public getExpensesAtMonth(startIntervalDate: Date, endIntervalDate: Date): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.expenseUrl}/`, {
      params: {
        startIntervalDate: format(startIntervalDate, this.DATE_FORMAT),
        endIntervalDate: format(endIntervalDate, this.DATE_FORMAT)
      }
    });
  }

  public getTotalExpensesByMonth(): Observable<MonthlyExpenseTotal[]> {
    return this.http.get<MonthlyExpenseTotal[]>(`${this.expenseUrl}/getTotalExpensesByMonth`);
  }

  public getTotalExpensesByMonthByLabelId(labelId: number): Observable<MonthlyExpenseTotal[]> {
    return this.http.get<MonthlyExpenseTotal[]>(
      `${this.expenseUrl}/getTotalExpensesByMonthByLabelId`,
      { params: { labelId } }
    );
  }

  public addExpense(expense: InsertExpensePayload): Observable<Expense> {
    return this.http.post<Expense>(`${this.expenseUrl}/addExpense`, expense);
  }

  public deleteExpense(expenseId: number): Observable<void> {
    return this.http.delete<void>(`${this.expenseUrl}/deleteExpense/`, { params: { expenseId } });
  }
}
