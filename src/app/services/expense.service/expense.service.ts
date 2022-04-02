import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IExpense } from '../../../app/model/IExpense';
import { environment } from '../../../environments/environment';
import authorizationBearer from '../authorizationBearer/authorizationBearer';

@Injectable()
export class ExpenseService {
  constructor(private http: HttpClient) {}

  public getExpenses(): Observable<IExpense[]> {
    return this.http.get<IExpense[]>(`${environment.backend_url}/expense/`, {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      }
    });
  }

  public addExpense(label: string): Observable<IExpense> {
    return this.http.post<IExpense>(
      `${environment.backend_url}/expense/addExpense`,
      { label: label },
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }

  public deleteTab(id: number): Observable<void> {
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
