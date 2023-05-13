import { Expense } from './../../model/Expense';
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp
} from '@ngneat/spectator/jest';
import { environment } from '../../../environments/environment';
import { ExpenseService } from './expense.service';

describe('ExpenseService tests', () => {
  let spectator: SpectatorHttp<ExpenseService>;
  const createSpectator = createHttpFactory({
    service: ExpenseService
  });

  const expensePath = '/expense/';

  beforeEach(() => (spectator = createSpectator()));

  it('Devrait retourner trois dépenses', () => {
    const expectedExpenseData: Expense[] = [
      new Expense(1, 323, new Date(), 1),
      new Expense(2, 130, new Date(), 1),
      new Expense(3, 4, new Date(), 1)
    ];

    const startIntervalDate = new Date(2022, 2, 1);
    const endIntervalDate = new Date(2022, 2, 24);

    spectator.service
      .getExpensesAtMonth(startIntervalDate, endIntervalDate)
      .subscribe((response) => expect(response).toEqual(expectedExpenseData));

    const request = spectator.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=2022-03-01&endIntervalDate=2022-03-24`,
      HttpMethod.GET
    );
    request.flush(expectedExpenseData);
  });

  it('Devrait supprimer une dépense', () => {
    const expenseId = 1;
    spectator.service.deleteExpense(expenseId).subscribe(() => null);

    const request = spectator.expectOne(
      environment.backend_url +
        expensePath +
        'deleteExpense/?expenseId=' +
        expenseId,
      HttpMethod.DELETE
    );
    request.flush(true);
  });
});
