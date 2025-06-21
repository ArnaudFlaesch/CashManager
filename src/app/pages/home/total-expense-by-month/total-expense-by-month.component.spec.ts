import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { Label } from '@model/Label';
import { ErrorHandlerService } from '@services/error.handler.service';
import { ExpenseService } from '@services/expense.service/expense.service';
import { ITotalExpenseByMonth } from '@model/ITotalExpenseByMonth';
import { TotalExpenseByMonthComponent } from './total-expense-by-month.component';
import { ComponentRef, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../main';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AuthGuard } from '../../../guards/auth.guard';

describe.skip('TotalExpenseByMonthComponent', () => {
  let component: TotalExpenseByMonthComponent;
  let componentRef: ComponentRef<TotalExpenseByMonthComponent>;
  let httpTestingController: HttpTestingController;

  const expensePath = '/expense/';
  const labelData = [
    { id: 1, label: 'Courses', userId: 1 },
    { id: 2, label: 'Restaurant', userId: 1 }
  ] as Label[];
  const expectedTotalExpenseByMonthData = [
    { date: '2022-04-01', total: 200 }
  ] as ITotalExpenseByMonth[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalExpenseByMonthComponent],
      providers: [
        AuthGuard,
        ErrorHandlerService,
        ExpenseService,
        { provide: MatDialogRef, useValue: {} },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes),
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(TotalExpenseByMonthComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Should display the total with two labels', () => {
    componentRef.setInput('labels', labelData);
    component.ngOnInit();
    const getTotalExpenseByMonthRequest = httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}getTotalExpensesByMonth`
    );
    getTotalExpenseByMonthRequest.flush(expectedTotalExpenseByMonthData);

    const expectedTotalExpenseByMonthByLabelIdData = [
      { date: '2022-04-01', total: 400 },
      { date: '2022-03-01', total: 100 }
    ] as ITotalExpenseByMonth[];

    const labelIdToSelect = component.labels()[0].id;
    component.selectLabel(labelIdToSelect);
    const getTotalExpenseByMonthByLabelIdRequest = httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}getTotalExpensesByMonthByLabelId?labelId=${labelIdToSelect}`
    );
    getTotalExpenseByMonthByLabelIdRequest.flush(expectedTotalExpenseByMonthByLabelIdData);
    expect(component.isOneLabelSelected()).toEqual(true);
    expect(component.totalExpensesByMonthChart).toEqual({
      datasets: [
        {
          data: [400, 100],
          label: 'Total des dépenses'
        },
        {
          data: [250, 250],
          label: 'Moyenne'
        }
      ],
      labels: ['mars 2022', 'avril 2022']
    });
  });
});
