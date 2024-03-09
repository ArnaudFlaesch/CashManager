import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
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
  let component: CreateExpenseComponent;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        MatAutocompleteModule,
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
        ExpenseService,
        ErrorHandlerService,
        DateUtilsService,
        provideDateFnsAdapter()
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(CreateExpenseComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  const expensePath = '/expense/';

  it('Should create an expense', () => {
    const newLabelName = 'Vacances';
    expect(component.canCreateExpense()).toEqual(false);
    component.selectLabel(new Label(1, newLabelName, 1));
    component.dateFormControl.setValue('2022-3-5');
    component.expenseToCreate = new InsertExpensePayload();
    component.expenseToCreate.amount = 23;

    expect(component.canCreateExpense()).toEqual(true);
    component.handleCreateExpense();

    const getExpensesRequest = httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}addExpense`
    );
    getExpensesRequest.flush(
      new Expense(
        1,
        component.expenseToCreate.amount,
        component.expenseToCreate.expenseDate,
        1
      )
    );
  });

  it('Should display the label', () => {
    const label = new Label(1, 'Dépense 1', 1);
    expect(component.displayLabel(label)).toEqual('Dépense 1');
    expect(label.userId).toEqual(1);
  });
});
