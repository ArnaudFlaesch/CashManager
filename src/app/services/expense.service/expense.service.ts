import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from '../../../app/model/Expense';
import { environment } from '../../../environments/environment';
import authorizationBearer from '../authorizationBearer/authorizationBearer';

@Injectable()
export class ExpenseService {
  constructor(private http: HttpClient) {}

  public getExpenses(
    startIntervalDate: Date,
    endIntervalDate: Date
  ): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${environment.backend_url}/expense/`, {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      },
      params: {
        startIntervalDate: startIntervalDate.toISOString(),
        endIntervalDate: endIntervalDate.toISOString()
      }
    });
  }

  public addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(
      `${environment.backend_url}/expense/addExpense`,
      { expense },
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }

  public deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.backend_url}/expense/deleteExpense/?id=${id}`,
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }
}
