import { ITotalExpenseByMonth } from '../../model/ITotalExpenseByMonth';
import { InsertExpensePayload } from './../../model/payloads/InsertExpensePayload';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Expense } from '../../../app/model/Expense';
import { environment } from '../../../environments/environment';
import authorizationBearer from '../authorizationBearer/authorizationBearer';
import { format } from 'date-fns';

@Injectable()
export class ExpenseService {
  private dateFormat = 'yyyy-MM-dd';

  constructor(private http: HttpClient) {}

  public getExpensesAtMonth(
    startIntervalDate: Date,
    endIntervalDate: Date
  ): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${environment.backend_url}/expense/`, {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      },
      params: {
        startIntervalDate: format(startIntervalDate, this.dateFormat),
        endIntervalDate: format(endIntervalDate, this.dateFormat)
      }
    });
  }

  public getTotalExpensesByMonth(): Observable<ITotalExpenseByMonth[]> {
    return this.http
      .get<ITotalExpenseByMonth[]>(
        `${environment.backend_url}/expense/getTotalExpensesByMonth`,
        {
          headers: {
            Authorization: authorizationBearer(),
            'Content-type': 'application/json'
          }
        }
      )
      .pipe(
        map((totalsByMonth) => {
          return totalsByMonth.map((total) => {
            total.date = new Date(total.date);
            return total;
          });
        })
      );
  }

  public getTotalExpensesByMonthByLabelId(
    labelId: number
  ): Observable<ITotalExpenseByMonth[]> {
    return this.http
      .get<ITotalExpenseByMonth[]>(
        `${environment.backend_url}/expense/getTotalExpensesByMonthByLabelId?labelId=${labelId}`,
        {
          headers: {
            Authorization: authorizationBearer(),
            'Content-type': 'application/json'
          }
        }
      )
      .pipe(
        map((totalsByMonth) => {
          return totalsByMonth.map((total) => {
            total.date = new Date(total.date);
            return total;
          });
        })
      );
  }

  public addExpense(expense: InsertExpensePayload): Observable<Expense> {
    return this.http.post<Expense>(
      `${environment.backend_url}/expense/addExpense`,
      { ...expense },
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }

  public deleteExpense(expenseId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.backend_url}/expense/deleteExpense/?id=${expenseId}`,
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }
}
