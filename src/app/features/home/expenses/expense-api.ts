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
  private readonly expenseUrl = `${environment.backend_url}/expenses`;

  public getExpensesAtMonth(startIntervalDate: Date, endIntervalDate: Date): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.expenseUrl, {
      params: {
        startIntervalDate: format(startIntervalDate, this.DATE_FORMAT),
        endIntervalDate: format(endIntervalDate, this.DATE_FORMAT)
      }
    });
  }

  public getTotalExpensesByMonth(): Observable<MonthlyExpenseTotal[]> {
    return this.http.get<MonthlyExpenseTotal[]>(`${this.expenseUrl}/monthly-totals`);
  }

  public getTotalExpensesByMonthByLabelId(labelId: number): Observable<MonthlyExpenseTotal[]> {
    return this.http.get<MonthlyExpenseTotal[]>(`${this.expenseUrl}/monthly-totals`, {
      params: { labelId }
    });
  }

  public addExpense(expense: InsertExpensePayload): Observable<Expense> {
    return this.http.post<Expense>(this.expenseUrl, expense);
  }

  /** The backend answers with an empty body, that HttpClient returns as null. */
  public deleteExpense(expenseId: number): Observable<null> {
    return this.http.delete<null>(`${this.expenseUrl}/${expenseId}`);
  }
}
