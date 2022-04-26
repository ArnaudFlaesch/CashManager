import { ConfigService } from '../../app/services/config.service/config.service';
import { LabelService } from './../services/label.service/label.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  createHttpFactory,
  HttpMethod,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { AuthService } from './../services/auth.service/auth.service';
import { ErrorHandlerService } from './../services/error.handler.service';
import { HomeComponent } from './home.component';
import { environment } from '../../environments/environment';
import { Label } from '../model/Label';
import { ExpenseService } from '../services/expense.service/expense.service';
import { Expense } from '../model/Expense';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>;
  let labelService: SpectatorHttp<LabelService>;
  let expenseService: SpectatorHttp<ExpenseService>;

  const labelPath = '/label/';
  const expensePath = '/expense/';

  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      MatSnackBarModule,
      MatDialogModule
    ],
    providers: [
      AuthService,
      ConfigService,
      ErrorHandlerService,
      { provide: MatDialogRef, useValue: {} }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  });
  const createLabelHttp = createHttpFactory(LabelService);
  const createExpenseHttp = createHttpFactory(ExpenseService);

  const labelData = [new Label(1, 'Courses'), new Label(2, 'Restaurant')];

  const dateFormat = 'yyyy-MM-dd';

  beforeEach(() => {
    spectator = createComponent();
    labelService = createLabelHttp();
    expenseService = createExpenseHttp();
  });

  it('Should display two labels and three expenses', () => {
    const aprilMonth = new Date(2022, 3, 1);
    const startIntervalDate = format(startOfMonth(aprilMonth), dateFormat);
    const endIntervalDate = format(endOfMonth(aprilMonth), dateFormat);

    spectator.component.currentSelectedMonth = aprilMonth;

    const expectedExpenseData: Expense[] = [
      new Expense(1, 323, new Date(), labelData[0]),
      new Expense(2, 130, new Date(), labelData[1]),
      new Expense(3, 4, new Date(), labelData[1])
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
  });
});
