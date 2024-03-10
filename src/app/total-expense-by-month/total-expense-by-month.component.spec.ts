import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../environments/environment';
import { Label } from '../model/Label';
import { ErrorHandlerService } from '../services/error.handler.service';
import { ExpenseService } from '../services/expense.service/expense.service';
import { ITotalExpenseByMonth } from './../model/ITotalExpenseByMonth';
import { TotalExpenseByMonthComponent } from './total-expense-by-month.component';

describe('TotalExpenseByMonthComponent', () => {
  let component: TotalExpenseByMonthComponent;
  let httpTestingController: HttpTestingController;

  const expensePath = '/expense/';
  const labelData = [new Label(1, 'Courses', 1), new Label(2, 'Restaurant', 1)];
  const expectedTotalExpenseByMonthData = [
    { date: '2022-04-01', total: 200 }
  ] as ITotalExpenseByMonth[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule
      ],
      providers: [
        ErrorHandlerService,
        ExpenseService,
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(TotalExpenseByMonthComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Should display the total with two labels', () => {
    component.labels = labelData;
    component.ngOnInit();
    const getTotalExpenseByMonthRequest = httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}getTotalExpensesByMonth`
    );
    getTotalExpenseByMonthRequest.flush(expectedTotalExpenseByMonthData);

    const expectedTotalExpenseByMonthByLabelIdData = [
      { date: '2022-04-01', total: 400 },
      { date: '2022-03-01', total: 100 }
    ] as ITotalExpenseByMonth[];

    const labelIdToSelect = component.labels[0].id;
    component.selectLabel(labelIdToSelect);
    const getTotalExpenseByMonthByLabelIdRequest =
      httpTestingController.expectOne(
        `${environment.backend_url}${expensePath}getTotalExpensesByMonthByLabelId?labelId=${labelIdToSelect}`
      );
    getTotalExpenseByMonthByLabelIdRequest.flush(
      expectedTotalExpenseByMonthByLabelIdData
    );
    expect(component.isOneLabelSelected()).toEqual(true);
    expect(component.totalExpensesByMonthChart).toEqual({
      datasets: [
        {
          data: [100, 400],
          label: 'Total des dépenses'
        }
      ],
      labels: ['mars 2022', 'avril 2022']
    });
  });
});
