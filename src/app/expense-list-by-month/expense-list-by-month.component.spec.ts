import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { advanceTo } from 'jest-date-mock';

import { TestBed } from '@angular/core/testing';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { environment } from '../../environments/environment';
import { Expense } from '../model/Expense';
import { Label } from '../model/Label';
import { ErrorHandlerService } from '../services/error.handler.service';
import { DateUtilsService } from '../utils/date.utils.service';
import { ExpenseListByMonthComponent } from './expense-list-by-month.component';
import { LabelService } from '../services/label.service/label.service';
import { ExpenseService } from '../services/expense.service/expense.service';

describe('ExpenseListByMonthComponent', () => {
  let component: ExpenseListByMonthComponent;
  let httpTestingController: HttpTestingController;
  const mockedCurrentMonth = new Date(1644882400);
  advanceTo(mockedCurrentMonth); // 15/02/2022
  const labelData = [new Label(1, 'Courses', 1), new Label(2, 'Restaurant', 1)];
  const dateFormat = 'yyyy-MM-dd';
  const expensePath = '/expense/';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatSnackBarModule, MatDialogModule],
      providers: [
        ErrorHandlerService,
        { provide: MatDialogRef, useValue: {} },
        DateUtilsService,
        LabelService,
        ExpenseService,
        provideDateFnsAdapter()
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ExpenseListByMonthComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Should display two labels and three expenses, then change the month', () => {
    const currentMonth = new Date();
    const startIntervalDate = format(startOfMonth(mockedCurrentMonth), dateFormat);
    const endIntervalDate = format(endOfMonth(mockedCurrentMonth), dateFormat);

    const expectedExpenseData: Expense[] = [
      new Expense(1, 323, currentMonth, labelData[0].id),
      new Expense(2, 130, currentMonth, labelData[1].id),
      new Expense(3, 4, currentMonth, labelData[1].id)
    ];

    component.ngOnInit();

    const getExpensesRequest = httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDate}&endIntervalDate=${endIntervalDate}`
    );
    getExpensesRequest.flush(expectedExpenseData);

    expect(component.expenses).toEqual(expectedExpenseData);
    expect(component.expenses.length).toEqual(3);
    expect(component.getTotalForMonth()).toEqual(457);

    const previousMonth = subMonths(mockedCurrentMonth, 1);
    const startIntervalDatePreviousMonth = format(startOfMonth(previousMonth), dateFormat);
    const endIntervalDatePreviousMonth = format(endOfMonth(previousMonth), dateFormat);
    component.selectPreviousMonth();

    const getPreviousMonthExpensesRequest = httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDatePreviousMonth}&endIntervalDate=${endIntervalDatePreviousMonth}`
    );
    getPreviousMonthExpensesRequest.flush([]);
    expect(component.expenses.length).toEqual(0);

    component.selectNextMonth();
    const getNextMonthExpensesRequest = httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDate}&endIntervalDate=${endIntervalDate}`
    );
    getNextMonthExpensesRequest.flush(expectedExpenseData);

    component.labels = labelData;
    expect(component.getLabelFromId(99)).toEqual(undefined);
    expect(component.getLabelFromId(expectedExpenseData[0].labelId)?.label).toEqual(
      labelData[0].label
    );

    component.deleteLabel(labelData[1].id);
    const deleteLabelRequest = httpTestingController.expectOne(
      `${environment.backend_url}/label/deleteLabel?labelId=${labelData[1].id}`
    );
    deleteLabelRequest.flush({});
    expect(component.labels).toEqual([labelData[0]]);
  });
});
