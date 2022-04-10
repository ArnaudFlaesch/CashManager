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
      { id: 1, amount: 323, label: 'Courses' },
      { id: 2, amount: 130, label: 'Courses' },
      { id: 3, amount: 4, label: 'Restaurant' }
    ];

    spectator.service
      .getExpenses()
      .subscribe((response) => expect(response).toEqual(expectedExpenseData));

    const request = spectator.expectOne(
      environment.backend_url + expensePath,
      HttpMethod.GET
    );
    request.flush(expectedExpenseData);
  });

  it('Devrait supprimer une dépense', () => {
    const expenseId = 1;
    spectator.service.deleteExpense(expenseId).subscribe(() => null);

    const request = spectator.expectOne(
      environment.backend_url + expensePath + 'deleteExpense/?id=' + expenseId,
      HttpMethod.DELETE
    );
    request.flush(true);
  });
});
