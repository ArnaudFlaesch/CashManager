import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { MatDialogRef } from '@angular/material/dialog';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';

import { TestBed } from '@angular/core/testing';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { environment } from '../../../../environments/environment';
import { Expense } from '@model/Expense';
import { ErrorHandlerService } from '@services/error.handler.service';
import { DateUtilsService } from '../../../utils/date.utils.service';
import { ExpenseListByMonthComponent } from './expense-list-by-month.component';
import { LabelService } from '@services/label.service/label.service';
import { ExpenseService } from '@services/expense.service/expense.service';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../main';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe.skip('ExpenseListByMonthComponent', () => {
  let component: ExpenseListByMonthComponent;
  let httpTestingController: HttpTestingController;
  const mockedCurrentMonth = new Date(2022, 1, 15);
  const labelData = [
    { id: 1, label: 'Courses', userId: 1 },
    { id: 2, label: 'Restaurant', userId: 1 }
  ];
  const dateFormat = 'yyyy-MM-dd';
  const expensePath = '/expense/';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseListByMonthComponent],
      providers: [
        ErrorHandlerService,
        { provide: MatDialogRef, useValue: {} },
        DateUtilsService,
        LabelService,
        ExpenseService,
        provideDateFnsAdapter(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
        provideRouter(routes)
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ExpenseListByMonthComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    vi.useFakeTimers();
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.useRealTimers();
  });

  it('Should display two labels and three expenses, then change the month', () => {
    vi.setSystemTime(mockedCurrentMonth);
    const currentMonth = new Date();
    const startIntervalDate = format(startOfMonth(mockedCurrentMonth), dateFormat);
    const endIntervalDate = format(endOfMonth(mockedCurrentMonth), dateFormat);

    const expectedExpenseData: Expense[] = [
      { id: 1, amount: 323, expenseDate: currentMonth, labelId: labelData[0].id },
      { id: 2, amount: 130, expenseDate: currentMonth, labelId: labelData[1].id },
      { id: 3, amount: 4, expenseDate: currentMonth, labelId: labelData[1].id }
    ];

    component.ngOnInit();

    const getExpensesRequest = httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDate}&endIntervalDate=${endIntervalDate}`
    );
    getExpensesRequest.flush(expectedExpenseData);

    expect(component.expenses()).toEqual(expectedExpenseData);
    expect(component.expenses().length).toEqual(3);
    expect(component.getTotalForMonth()).toEqual(457);

    const previousMonth = subMonths(mockedCurrentMonth, 1);
    const startIntervalDatePreviousMonth = format(startOfMonth(previousMonth), dateFormat);
    const endIntervalDatePreviousMonth = format(endOfMonth(previousMonth), dateFormat);
    component.selectPreviousMonth();

    const getPreviousMonthExpensesRequest = httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDatePreviousMonth}&endIntervalDate=${endIntervalDatePreviousMonth}`
    );
    getPreviousMonthExpensesRequest.flush([]);
    expect(component.expenses().length).toEqual(0);

    component.selectNextMonth();
    const getNextMonthExpensesRequest = httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${startIntervalDate}&endIntervalDate=${endIntervalDate}`
    );
    getNextMonthExpensesRequest.flush(expectedExpenseData);

    component.labels.set(labelData);
    expect(component.getLabelFromId(99)).toEqual(undefined);
    expect(component.getLabelFromId(expectedExpenseData[0].labelId)?.label).toEqual(
      labelData[0].label
    );

    component.deleteLabel(labelData[1].id);
    const deleteLabelRequest = httpTestingController.expectOne(
      `${environment.backend_url}/label/deleteLabel?labelId=${labelData[1].id}`
    );
    deleteLabelRequest.flush({});
    expect(component.labels()).toEqual([labelData[0]]);
  });
});
