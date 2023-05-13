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
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { advanceTo } from 'jest-date-mock';

import { environment } from '../../environments/environment';
import { Expense } from '../model/Expense';
import { Label } from '../model/Label';
import { ErrorHandlerService } from '../services/error.handler.service';
import { ExpenseService } from '../services/expense.service/expense.service';
import { LabelService } from '../services/label.service/label.service';
import { ExpenseListByMonthComponent } from './expense-list-by-month.component';

describe('ExpenseListByMonthComponent', () => {
  let spectator: Spectator<ExpenseListByMonthComponent>;
  let expenseService: SpectatorHttp<ExpenseService>;
  let labelService: SpectatorHttp<LabelService>;

  const mockedCurrentMonth = new Date(1644882400);
  advanceTo(mockedCurrentMonth); // 15/02/2022

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
  const createExpenseHttp = createHttpFactory(ExpenseService);
  const createLabelHttp = createHttpFactory(LabelService);

  const labelData = [new Label(1, 'Courses', 1), new Label(2, 'Restaurant', 1)];

  const dateFormat = 'yyyy-MM-dd';

  beforeEach(() => {
    spectator = createComponent();
    expenseService = createExpenseHttp();
    labelService = createLabelHttp();
  });

  it('Should display two labels and three expenses, then change the month', () => {
    const currentMonth = new Date();
    const startIntervalDate = format(
      startOfMonth(mockedCurrentMonth),
      dateFormat
    );
    const endIntervalDate = format(endOfMonth(mockedCurrentMonth), dateFormat);

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

    const previousMonth = subMonths(mockedCurrentMonth, 1);
    const startIntervalDatePreviousMonth = format(
      startOfMonth(previousMonth),
      dateFormat
    );
    const endIntervalDatePreviousMonth = format(
      endOfMonth(previousMonth),
      dateFormat
    );
    spectator.component.selectPreviousMonth();

    const getPreviousMonthExpensesRequest = expenseService.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDatePreviousMonth}&endIntervalDate=${endIntervalDatePreviousMonth}`,
      HttpMethod.GET
    );
    getPreviousMonthExpensesRequest.flush([]);
    expect(spectator.component.expenses.length).toEqual(0);

    spectator.component.selectNextMonth();
    const getNextMonthExpensesRequest = expenseService.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDate}&endIntervalDate=${endIntervalDate}`,
      HttpMethod.GET
    );
    getNextMonthExpensesRequest.flush(expectedExpenseData);

    spectator.component.labels = labelData;
    expect(spectator.component.getLabelFromId(99)).toEqual(undefined);
    expect(
      spectator.component.getLabelFromId(expectedExpenseData[0].labelId)?.label
    ).toEqual(labelData[0].label);

    spectator.component.deleteLabel(labelData[1].id);
    const deleteLabelRequest = labelService.expectOne(
      `${environment.backend_url}/label/deleteLabel/?labelId=${labelData[1].id}`,
      HttpMethod.DELETE
    );
    deleteLabelRequest.flush({});
    expect(spectator.component.labels).toEqual([labelData[0]]);
  });
});
