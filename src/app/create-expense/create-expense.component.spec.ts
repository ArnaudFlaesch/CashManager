import { LabelService } from './../services/label.service/label.service';
import { Expense } from './../model/Expense';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  createComponentFactory,
  createHttpFactory,
  HttpMethod,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator';
import { AuthService } from '../services/auth.service/auth.service';
import { ErrorHandlerService } from '../services/error.handler.service';
import { ExpenseService } from '../services/expense.service/expense.service';

import { CreateExpenseComponent } from './create-expense.component';
import { InsertExpensePayload } from '../model/payloads/InsertExpensePayload';
import { environment } from '../../environments/environment';
import { Label } from '../model/Label';

describe('CreateExpenseComponent', () => {
  let spectator: Spectator<CreateExpenseComponent>;
  let labelService: SpectatorHttp<LabelService>;
  let expenseService: SpectatorHttp<ExpenseService>;

  const expensePath = '/expense/';
  const labelPath = '/label/';

  const createComponent = createComponentFactory({
    component: CreateExpenseComponent,
    imports: [MatSnackBarModule, MatAutocompleteModule],
    providers: [AuthService, ErrorHandlerService],
    schemas: [NO_ERRORS_SCHEMA]
  });
  const createLabelHttp = createHttpFactory(LabelService);
  const createExpenseHttp = createHttpFactory(ExpenseService);

  beforeEach(() => {
    spectator = createComponent();
    labelService = createLabelHttp();
    expenseService = createExpenseHttp();
  });

  it('Should create an expense', () => {
    spectator.component.labelControl.setValue('Vacances');
    spectator.component.expenseToCreate = new InsertExpensePayload();
    spectator.component.expenseToCreate.amount = 23;
    spectator.component.expenseToCreate.expenseDate = new Date(2022, 3, 5);
    spectator.component.handleCreateExpense();

    const addLabelRequest = labelService.expectOne(
      `${environment.backend_url}${labelPath}addLabel`,
      HttpMethod.POST
    );

    const expectedAddedLabel = new Label(
      1,
      spectator.component.labelControl.value
    );

    addLabelRequest.flush(expectedAddedLabel);

    const getExpensesRequest = expenseService.expectOne(
      `${environment.backend_url}${expensePath}addExpense`,
      HttpMethod.POST
    );
    getExpensesRequest.flush(
      new Expense(
        1,
        spectator.component.expenseToCreate.amount,
        spectator.component.expenseToCreate.expenseDate,
        expectedAddedLabel
      )
    );
  });
});
