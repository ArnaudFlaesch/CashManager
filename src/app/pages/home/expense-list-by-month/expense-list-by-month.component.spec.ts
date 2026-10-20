import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest
} from "@angular/common/http/testing";

import { MatDialogRef } from "@angular/material/dialog";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

import { ComponentRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { fr } from "date-fns/locale/fr";
import { environment } from "../../../../environments/environment";
import { Expense } from "@model/Expense";
import { ExpenseListByMonthComponent } from "./expense-list-by-month.component";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { routes } from "../../../app.routes";

describe("ExpenseListByMonthComponent", () => {
  let component: ExpenseListByMonthComponent;
  let fixture: ComponentFixture<ExpenseListByMonthComponent>;
  let componentRef: ComponentRef<ExpenseListByMonthComponent>;
  let httpTestingController: HttpTestingController;
  const mockedCurrentMonth = new Date(2022, 1, 15);
  const labelData = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ];
  const dateFormat = "yyyy-MM-dd";
  const expensePath = "/expense/";

  const expectExpensesRequest = (month: Date): TestRequest =>
    httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}?startIntervalDate=${format(startOfMonth(month), dateFormat)}&endIntervalDate=${format(endOfMonth(month), dateFormat)}`
    );

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(mockedCurrentMonth);

    await TestBed.configureTestingModule({
      imports: [ExpenseListByMonthComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        provideDateFnsAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: fr },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseListByMonthComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.useRealTimers();
  });

  it("Should display two labels and three expenses, then change the month", async () => {
    const expectedExpenseData: Expense[] = [
      { id: 1, amount: 323, expenseDate: mockedCurrentMonth, labelId: labelData[0].id },
      { id: 2, amount: 130, expenseDate: mockedCurrentMonth, labelId: labelData[1].id },
      { id: 3, amount: 4, expenseDate: mockedCurrentMonth, labelId: labelData[1].id }
    ];

    componentRef.setInput("labels", labelData);
    TestBed.tick();
    expectExpensesRequest(mockedCurrentMonth).flush(expectedExpenseData);
    await fixture.whenStable();

    expect(component.expenses.value()).toEqual(expectedExpenseData);
    expect(component.totalForMonth()).toEqual(457);
    expect(component.expensesByLabelChart().datasets).toEqual([
      { label: "Courses", data: [323] },
      { label: "Restaurant", data: [134] }
    ]);
    expect(component.labelNames().get(99)).toEqual(undefined);
    expect(component.labelNames().get(expectedExpenseData[0].labelId)).toEqual(labelData[0].label);

    component.selectPreviousMonth();
    TestBed.tick();
    expectExpensesRequest(subMonths(mockedCurrentMonth, 1)).flush([]);
    await fixture.whenStable();
    expect(component.expenses.value().length).toEqual(0);

    component.selectNextMonth();
    TestBed.tick();
    expectExpensesRequest(mockedCurrentMonth).flush(expectedExpenseData);
    await fixture.whenStable();
    expect(component.expenses.value().length).toEqual(3);
  });
});
