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
    const octoberMonth = new Date(2021, 9, 1);
    const startIntervalDate = format(startOfMonth(octoberMonth), dateFormat);
    const endIntervalDate = format(endOfMonth(octoberMonth), dateFormat);

    spectator.component.currentSelectedMonth = octoberMonth;

    const expectedExpenseData: Expense[] = [
      new Expense(1, 323, octoberMonth, labelData[0].id),
      new Expense(2, 130, octoberMonth, labelData[1].id),
      new Expense(3, 4, octoberMonth, labelData[1].id)
    ];

    const getLabelsRequest = labelService.expectOne(
      environment.backend_url + labelPath,
      HttpMethod.GET
    );

    getLabelsRequest.flush(labelData);
    const getExpensesRequest = expenseService.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDate}&endIntervalDate=${endIntervalDate}`,
      HttpMethod.GET
    );
    getExpensesRequest.flush(expectedExpenseData);

    expect(spectator.component.expenses).toEqual(expectedExpenseData);
    expect(spectator.component.expenses.length).toEqual(3);
    expect(spectator.component.getTotalForMonth()).toEqual(457);

    spectator.component.handleSelectExpensesForMonth(
      spectator.component.pastMonths[15]
    );

    const januaryMonth = new Date(2023, 0, 1);
    const startIntervalDateJanuary = format(
      startOfMonth(januaryMonth),
      dateFormat
    );
    const endIntervalDateJanuary = format(endOfMonth(januaryMonth), dateFormat);
    const getJanuaryExpensesRequest = expenseService.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDateJanuary}&endIntervalDate=${endIntervalDateJanuary}`,
      HttpMethod.GET
    );
    getJanuaryExpensesRequest.flush([]);
    expect(spectator.component.expenses.length).toEqual(0);
  });

  it('Should add an expense and a new label, and delete the label', () => {
    const aprilMonth = new Date(2023, 3, 1);
    const startIntervalDate = format(startOfMonth(aprilMonth), dateFormat);
    const endIntervalDate = format(endOfMonth(aprilMonth), dateFormat);
    spectator.component.currentSelectedMonth = aprilMonth;

    const getLabelsRequest = labelService.expectOne(
      environment.backend_url + labelPath,
      HttpMethod.GET
    );
    getLabelsRequest.flush([]);

    const getExpensesRequest = expenseService.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDate}&endIntervalDate=${endIntervalDate}`,
      HttpMethod.GET
    );
    getExpensesRequest.flush([]);

    const insertedLabel = new Label(1, 'Vacances', 1);
    spectator.component.handleLabelCreation(insertedLabel);
    expect(spectator.component.labels).toEqual([insertedLabel]);

    const insertedExpense = new Expense(1, 23, new Date(), insertedLabel.id);
    spectator.component.handleExpenseCreation(insertedExpense);
    expect(spectator.component.expenses).toEqual([insertedExpense]);

    spectator.component.deleteLabel(insertedLabel.id);
    const deleteLabelRequest = labelService.expectOne(
      environment.backend_url +
        labelPath +
        'deleteLabel/?labelId=' +
        insertedLabel.id,
      HttpMethod.DELETE
    );
    deleteLabelRequest.flush({});
    expect(spectator.component.labels.length).toEqual(0);
  });
});
