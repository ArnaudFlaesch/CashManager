import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  createComponentFactory,
  createHttpFactory,
  Spectator,
  SpectatorHttp
} from '@ngneat/spectator';
import { AuthService } from '../services/auth.service/auth.service';
import { ErrorHandlerService } from '../services/error.handler.service';
import { ExpenseService } from '../services/expense.service/expense.service';
import { LabelService } from '../services/label.service/label.service';

import { CreateExpenseComponent } from './create-expense.component';

describe('CreateExpenseComponent', () => {
  let spectator: Spectator<CreateExpenseComponent>;
  let labelService: SpectatorHttp<LabelService>;
  let expenseService: SpectatorHttp<ExpenseService>;

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

  it('Should display two labels', () => {
    expect(spectator.component).toBeTruthy();
  });
});
