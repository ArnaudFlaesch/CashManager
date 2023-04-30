import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  createComponentFactory,
  createHttpFactory,
  HttpMethod,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator/jest';

import { environment } from '../../environments/environment';
import { Label } from '../model/Label';
import { InsertExpensePayload } from '../model/payloads/InsertExpensePayload';
import { AuthService } from '../services/auth.service/auth.service';
import { ErrorHandlerService } from '../services/error.handler.service';
import { ExpenseService } from '../services/expense.service/expense.service';
import { DateUtilsService } from '../utils/date.utils.service';
import { Expense } from './../model/Expense';
import { CreateExpenseComponent } from './create-expense.component';

describe('CreateExpenseComponent', () => {
  let spectator: Spectator<CreateExpenseComponent>;
  let expenseService: SpectatorHttp<ExpenseService>;

  const expensePath = '/expense/';

  const createComponent = createComponentFactory({
    component: CreateExpenseComponent,
    imports: [MatSnackBarModule, MatAutocompleteModule],
    providers: [AuthService, ErrorHandlerService, DateUtilsService],
    schemas: [NO_ERRORS_SCHEMA]
  });
  const createExpenseHttp = createHttpFactory(ExpenseService);

  beforeEach(() => {
    spectator = createComponent();
    expenseService = createExpenseHttp();
  });

  it('Should create an expense', () => {
    const newLabelName = 'Vacances';
    expect(spectator.component.canCreateExpense()).toEqual(false);
    spectator.component.selectLabel(new Label(1, newLabelName, 1));
    spectator.component.dateFormControl.setValue('2022-3-5');
    spectator.component.expenseToCreate = new InsertExpensePayload();
    spectator.component.expenseToCreate.amount = 23;

    expect(spectator.component.canCreateExpense()).toEqual(true);
    spectator.component.handleCreateExpense();

    const getExpensesRequest = expenseService.expectOne(
      `${environment.backend_url}${expensePath}addExpense`,
      HttpMethod.POST
    );
    getExpensesRequest.flush(
      new Expense(
        1,
        spectator.component.expenseToCreate.amount,
        spectator.component.expenseToCreate.expenseDate,
        1
      )
    );
  });

  it('Should display the label', () => {
    const label = new Label(1, 'Dépense 1', 1);
    expect(spectator.component.displayLabel(label)).toEqual('Dépense 1');
    expect(label.userId).toEqual(1);
  });
});
