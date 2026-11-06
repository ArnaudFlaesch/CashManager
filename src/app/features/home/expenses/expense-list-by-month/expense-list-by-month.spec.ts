import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest
} from "@angular/common/http/testing";

import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { HttpErrorHandler } from "@core/http-error-handler";

import { ComponentRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { fr } from "date-fns/locale/fr";
import { environment } from "@environments/environment";
import { Expense } from "@features/home/expenses/expense";
import { ExpenseListByMonth } from "./expense-list-by-month";
import { MatDatepicker } from "@angular/material/datepicker";
import { of } from "rxjs";
import { ConfirmModal } from "@shared/confirm-modal/confirm-modal";

describe("ExpenseListByMonth", () => {
  let component: ExpenseListByMonth;
  let fixture: ComponentFixture<ExpenseListByMonth>;
  let componentRef: ComponentRef<ExpenseListByMonth>;
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
      providers: [
        provideDateFnsAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: fr },
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseListByMonth);
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

    componentRef.setInput("expenseLabels", labelData);
    TestBed.tick();
    expectExpensesRequest(mockedCurrentMonth).flush(expectedExpenseData);
    await fixture.whenStable();

    expect(component["expenses"].value()).toEqual(expectedExpenseData);
    expect(component["totalForMonth"]()).toEqual(457);
    expect(component["expensesByLabelChart"]().datasets).toEqual([
      { label: "Courses", data: [323] },
      { label: "Restaurant", data: [134] }
    ]);
    expect(component["labelNames"]().get(99)).toEqual(undefined);
    expect(component["labelNames"]().get(expectedExpenseData[0].labelId)).toEqual(
      labelData[0].label
    );

    component["selectPreviousMonth"]();
    TestBed.tick();
    expectExpensesRequest(subMonths(mockedCurrentMonth, 1)).flush([]);
    await fixture.whenStable();
    expect(component["expenses"].value().length).toEqual(0);

    component["selectNextMonth"]();
    TestBed.tick();
    expectExpensesRequest(mockedCurrentMonth).flush(expectedExpenseData);
    await fixture.whenStable();
    expect(component["expenses"].value().length).toEqual(3);
  });

  it("Should display the empty state when there is no expense", async () => {
    componentRef.setInput("expenseLabels", labelData);
    TestBed.tick();
    expectExpensesRequest(mockedCurrentMonth).flush([]);
    await fixture.whenStable();

    expect(component["totalForMonth"]()).toEqual(0);
    expect(fixture.nativeElement.querySelector(".empty-state")).not.toBeNull();
    expect(fixture.nativeElement.querySelector("#expenses-list")).toBeNull();
  });

  it("Should ignore in the chart the expenses of an unknown label", async () => {
    TestBed.tick();
    expectExpensesRequest(mockedCurrentMonth).flush([
      { id: 1, amount: 10, expenseDate: mockedCurrentMonth, labelId: 99 }
    ]);
    await fixture.whenStable();

    expect(component["expensesByLabelChart"]().datasets).toEqual([{ label: "", data: [] }]);
  });

  it("Should add the created expense to the list", async () => {
    TestBed.tick();
    expectExpensesRequest(mockedCurrentMonth).flush([]);
    await fixture.whenStable();

    const newExpense: Expense = {
      id: 4,
      amount: 20,
      expenseDate: mockedCurrentMonth,
      labelId: labelData[0].id
    };
    component["addExpense"](newExpense);
    expect(component["expenses"].value()).toEqual([newExpense]);
    expect(component["totalForMonth"]()).toEqual(20);
  });

  it("Should select the month picked in the datepicker", async () => {
    TestBed.tick();
    expectExpensesRequest(mockedCurrentMonth).flush([]);
    await fixture.whenStable();

    const datepicker = { close: vi.fn() } as unknown as MatDatepicker<Date>;
    const pickedMonth = new Date(2021, 5, 20);
    component["setMonthAndYear"](pickedMonth, datepicker);
    TestBed.tick();
    expectExpensesRequest(pickedMonth).flush([]);

    expect(datepicker.close).toHaveBeenCalled();
    expect(component["selectedMonthModel"]().selectedMonth).toEqual(startOfMonth(pickedMonth));
  });

  it("Should delete an expense once the deletion is confirmed", async () => {
    const expense: Expense = { id: 1, amount: 10, expenseDate: mockedCurrentMonth, labelId: 1 };
    TestBed.tick();
    expectExpensesRequest(mockedCurrentMonth).flush([expense]);
    await fixture.whenStable();
    const openSpy = vi
      .spyOn(TestBed.inject(MatDialog), "open")
      .mockReturnValue({ afterClosed: () => of("validate") } as MatDialogRef<unknown>);

    component["openDeleteExpenseModal"](expense.id);
    expect(openSpy).toHaveBeenCalledWith(
      ConfirmModal,
      expect.objectContaining({
        data: {
          title: "Suppression d'une dépense",
          message: "Êtes-vous sûr de vouloir supprimer cette dépense ?"
        }
      })
    );
    httpTestingController
      .expectOne(`${environment.backend_url}${expensePath}deleteExpense/?expenseId=1`)
      .flush(null);

    expect(component["expenses"].value()).toEqual([]);
  });

  it("Should display an error and no expense when they cannot be loaded", async () => {
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(HttpErrorHandler), "handleError")
      .mockImplementation(() => undefined);
    TestBed.tick();
    expectExpensesRequest(mockedCurrentMonth).flush(null, {
      status: 500,
      statusText: "Server error"
    });
    await fixture.whenStable();

    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors de la récupération des dépenses."
    );
    expect(component["expenses"].value()).toEqual([]);
  });
});
