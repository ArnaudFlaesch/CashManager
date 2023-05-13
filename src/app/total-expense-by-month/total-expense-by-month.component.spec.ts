import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  createHttpFactory,
  createSpyObject,
  HttpMethod,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { environment } from '../../environments/environment';
import { Label } from '../model/Label';
import { ErrorHandlerService } from '../services/error.handler.service';
import { ExpenseService } from '../services/expense.service/expense.service';
import { LabelService } from '../services/label.service/label.service';
import { ITotalExpenseByMonth } from './../model/ITotalExpenseByMonth';
import { TotalExpenseByMonthComponent } from './total-expense-by-month.component';

describe('TotalExpenseByMonthComponent', () => {
  let spectator: Spectator<TotalExpenseByMonthComponent>;
  let labelService: SpectatorHttp<LabelService>;
  let expenseService: SpectatorHttp<ExpenseService>;

  const labelPath = '/label/';
  const expensePath = '/expense/';

  const createLabelHttp = createHttpFactory(LabelService);
  const createExpenseHttp = createHttpFactory(ExpenseService);

  const labelData = [new Label(1, 'Courses', 1), new Label(2, 'Restaurant', 1)];
  const expectedTotalExpenseByMonthData = [
    { date: '2022-04-01', total: 200 }
  ] as ITotalExpenseByMonth[];

  describe('Nominal cases', () => {
    const createComponent = createComponentFactory({
      component: TotalExpenseByMonthComponent,
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule
      ],
      providers: [ErrorHandlerService, { provide: MatDialogRef, useValue: {} }]
    });

    beforeEach(() => {
      spectator = createComponent();
      labelService = createLabelHttp();
      expenseService = createExpenseHttp();
    });

    it('Should display the total with two labels', () => {
      const getLabelsRequest = labelService.expectOne(
        environment.backend_url + labelPath,
        HttpMethod.GET
      );
      getLabelsRequest.flush(labelData);

      const getTotalExpenseByMonthRequest = expenseService.expectOne(
        `${environment.backend_url}${expensePath}getTotalExpensesByMonth`,
        HttpMethod.GET
      );
      getTotalExpenseByMonthRequest.flush(expectedTotalExpenseByMonthData);
      expect(spectator.component.labels).toEqual(labelData);

      const expectedTotalExpenseByMonthByLabelIdData = [
        { date: '2022-04-01', total: 400 },
        { date: '2022-03-01', total: 100 }
      ] as ITotalExpenseByMonth[];

      const labelIdToSelect = spectator.component.labels[0].id;
      spectator.component.selectLabel(labelIdToSelect);
      const getTotalExpenseByMonthByLabelIdRequest = expenseService.expectOne(
        `${environment.backend_url}${expensePath}getTotalExpensesByMonthByLabelId?labelId=${labelIdToSelect}`,
        HttpMethod.GET
      );
      getTotalExpenseByMonthByLabelIdRequest.flush(
        expectedTotalExpenseByMonthByLabelIdData
      );
      expect(spectator.component.isLabelSelected(labelIdToSelect)).toEqual(
        true
      );
      expect(spectator.component.totalExpensesByMonthChart).toEqual({
        datasets: [
          {
            data: [100, 400],
            label: 'Total des dépenses'
          }
        ],
        labels: ['March 2022', 'April 2022']
      });

      spectator.component.selectLabel(labelIdToSelect);
      const getExpensesRequest = expenseService.expectOne(
        `${environment.backend_url}${expensePath}getTotalExpensesByMonth`,
        HttpMethod.GET
      );
      getExpensesRequest.flush([]);
    });
  });

  describe('Error cases', () => {
    const errorHandlerService = createSpyObject(ErrorHandlerService);
    const createComponent = createComponentFactory({
      component: TotalExpenseByMonthComponent,
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule
      ],
      providers: [
        { provide: ErrorHandlerService, useValue: errorHandlerService }
      ]
    });

    it('Should log error on get labels when server throws an error', () => {
      spectator = createComponent();
      labelService = createLabelHttp();

      labelService.controller
        .expectOne(environment.backend_url + labelPath, HttpMethod.GET)
        .error(new ProgressEvent('Server error'));

      expect(errorHandlerService.handleError).toHaveBeenCalledTimes(1);
    });
  });
});
