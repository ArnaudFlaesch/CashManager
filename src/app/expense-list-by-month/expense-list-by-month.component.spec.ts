import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  createHttpFactory,
  HttpMethod,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { environment } from '../../environments/environment';
import { Expense } from '../model/Expense';
import { Label } from '../model/Label';
import { ErrorHandlerService } from '../services/error.handler.service';
import { ExpenseService } from '../services/expense.service/expense.service';
import { LabelService } from '../services/label.service/label.service';

import { ExpenseListByMonthComponent } from './expense-list-by-month.component';

describe('ExpenseListByMonthComponent', () => {
  let spectator: Spectator<ExpenseListByMonthComponent>;
  let labelService: SpectatorHttp<LabelService>;
  let expenseService: SpectatorHttp<ExpenseService>;

  const labelPath = '/label/';
  const expensePath = '/expense/';

  const createComponent = createComponentFactory({
    component: ExpenseListByMonthComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      MatSnackBarModule,
      MatDialogModule
    ],
    providers: [ErrorHandlerService, { provide: MatDialogRef, useValue: {} }],
    schemas: [NO_ERRORS_SCHEMA]
  });
  const createLabelHttp = createHttpFactory(LabelService);
  const createExpenseHttp = createHttpFactory(ExpenseService);

  const labelData = [new Label(1, 'Courses', 1), new Label(2, 'Restaurant', 1)];

  const dateFormat = 'yyyy-MM-dd';

  beforeEach(() => {
    spectator = createComponent();
    labelService = createLabelHttp();
    expenseService = createExpenseHttp();
  });

  it('Should display two labels and three expenses, then change the month', () => {
    const currentMonth = new Date();
    const startIntervalDate = format(startOfMonth(currentMonth), dateFormat);
    const endIntervalDate = format(endOfMonth(currentMonth), dateFormat);

    spectator.component.currentSelectedMonth = currentMonth;

    const expectedExpenseData: Expense[] = [
      new Expense(1, 323, currentMonth, labelData[0].id),
      new Expense(2, 130, currentMonth, labelData[1].id),
      new Expense(3, 4, currentMonth, labelData[1].id)
    ];

    const getExpensesRequest = expenseService.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDate}&endIntervalDate=${endIntervalDate}`,
      HttpMethod.GET
    );
    getExpensesRequest.flush(expectedExpenseData);

    expect(spectator.component.expenses).toEqual(expectedExpenseData);
    expect(spectator.component.expenses.length).toEqual(3);
    expect(spectator.component.getTotalForMonth()).toEqual(457);

    const januaryMonth = new Date(2023, 0, 1);
    const startIntervalDateJanuary = format(
      startOfMonth(januaryMonth),
      dateFormat
    );
    const endIntervalDateJanuary = format(endOfMonth(januaryMonth), dateFormat);
    spectator.component.handleSelectExpensesForMonth(januaryMonth);

    const getJanuaryExpensesRequest = expenseService.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDateJanuary}&endIntervalDate=${endIntervalDateJanuary}`,
      HttpMethod.GET
    );
    getJanuaryExpensesRequest.flush([]);
    expect(spectator.component.expenses.length).toEqual(0);
  });
});
