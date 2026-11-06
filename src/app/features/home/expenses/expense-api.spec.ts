import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { environment } from "@environments/environment";
import { Expense } from "./expense";
import { ExpenseApi } from "./expense-api";

describe("ExpenseApi", () => {
  let service: ExpenseApi;
  let httpTestingController: HttpTestingController;

  const expenseUrl = `${environment.backend_url}/expense`;
  const expense: Expense = { id: 1, amount: 12.5, expenseDate: new Date(2022, 2, 5), labelId: 2 };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(ExpenseApi);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("Should get the expenses of an interval, with the dates formatted", async () => {
    const expenses = firstValueFrom(
      service.getExpensesAtMonth(new Date(2022, 2, 1), new Date(2022, 2, 31))
    );
    httpTestingController
      .expectOne(`${expenseUrl}/?startIntervalDate=2022-03-01&endIntervalDate=2022-03-31`)
      .flush([expense]);
    expect(await expenses).toEqual([expense]);
  });

  it("Should get the total of the expenses by month, for all the labels or only one", async () => {
    const totals = [{ date: "2022-03-01", total: 12.5 }];

    const allLabels = firstValueFrom(service.getTotalExpensesByMonth());
    httpTestingController.expectOne(`${expenseUrl}/getTotalExpensesByMonth`).flush(totals);
    expect(await allLabels).toEqual(totals);

    const oneLabel = firstValueFrom(service.getTotalExpensesByMonthByLabelId(2));
    httpTestingController
      .expectOne(`${expenseUrl}/getTotalExpensesByMonthByLabelId?labelId=2`)
      .flush(totals);
    expect(await oneLabel).toEqual(totals);
  });

  it("Should add an expense", async () => {
    const payload = { amount: 12.5, expenseDate: expense.expenseDate, labelId: 2 };
    const added = firstValueFrom(service.addExpense(payload));
    const request = httpTestingController.expectOne(`${expenseUrl}/addExpense`);
    expect(request.request.method).toEqual("POST");
    expect(request.request.body).toEqual(payload);
    request.flush(expense);
    expect(await added).toEqual(expense);
  });

  it("Should delete an expense", async () => {
    const deleted = firstValueFrom(service.deleteExpense(1));
    const request = httpTestingController.expectOne(`${expenseUrl}/deleteExpense/?expenseId=1`);
    expect(request.request.method).toEqual("DELETE");
    request.flush(null);
    expect(await deleted).toBeNull();
  });
});
