import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { format } from "date-fns";
import { Observable } from "rxjs";
import { Expense } from "@model/Expense";
import { environment } from "../../../environments/environment";
import { ITotalExpenseByMonth } from "@model/ITotalExpenseByMonth";
import { InsertExpensePayload } from "@model/payloads/InsertExpensePayload";

const DATE_FORMAT = "yyyy-MM-dd";

@Service()
export class ExpenseService {
  private readonly http = inject(HttpClient);
  private readonly expenseUrl = `${environment.backend_url}/expense`;

  public getExpensesAtMonth(startIntervalDate: Date, endIntervalDate: Date): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.expenseUrl}/`, {
      params: {
        startIntervalDate: format(startIntervalDate, DATE_FORMAT),
        endIntervalDate: format(endIntervalDate, DATE_FORMAT)
      }
    });
  }

  public getTotalExpensesByMonth(): Observable<ITotalExpenseByMonth[]> {
    return this.http.get<ITotalExpenseByMonth[]>(`${this.expenseUrl}/getTotalExpensesByMonth`);
  }

  public getTotalExpensesByMonthByLabelId(labelId: number): Observable<ITotalExpenseByMonth[]> {
    return this.http.get<ITotalExpenseByMonth[]>(
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
