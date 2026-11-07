import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest
} from "@angular/common/http/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerInputHarness } from "@angular/material/datepicker/testing";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { BaseChartDirective } from "ng2-charts";
import { of } from "rxjs";
import type { MockInstance } from "vitest";
import { environment } from "@environments/environment";
import { Expense } from "@features/home/expenses/expense";
import { getElement, queryElement } from "@testing/dom";
import { HttpErrorHandler } from "@core/http-error-handler";
import { ConfirmModal } from "@shared/confirm-modal/confirm-modal";
import { CreateExpense } from "../create-expense/create-expense";
import { ExpenseListByMonth } from "./expense-list-by-month";

describe("ExpenseListByMonth", () => {
  let fixture: ComponentFixture<ExpenseListByMonth>;
  let httpTestingController: HttpTestingController;

  const mockedCurrentMonth = new Date(2022, 1, 15);
  const labelData = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ];
  const expenses: Expense[] = [
    { id: 1, amount: 323, expenseDate: mockedCurrentMonth, labelId: 1 },
    { id: 2, amount: 130, expenseDate: mockedCurrentMonth, labelId: 2 },
    { id: 3, amount: 4, expenseDate: mockedCurrentMonth, labelId: 2 }
  ];
  const dateFormat = "yyyy-MM-dd";

  function expectExpensesRequest(month: Date): TestRequest {
    return httpTestingController.expectOne(
      `${environment.backend_url}/expense/?startIntervalDate=${format(startOfMonth(month), dateFormat)}&endIntervalDate=${format(endOfMonth(month), dateFormat)}`
    );
  }

  /** Answers the request of the expenses of the month, sent once the component is rendered. */
  async function loadExpenses(month: Date, monthExpenses: Expense[]): Promise<void> {
    TestBed.tick();
    expectExpensesRequest(month).flush(monthExpenses);
    await fixture.whenStable();
  }

  /** Label and amount of each displayed expense, with the spaces of the formatted amounts normalized. */
  function displayedExpenses(): string[][] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll(".expense-row"),
      (row) =>
        [".expense-label", ".expense-amount"].map((selector) =>
          normalizeSpaces(row.querySelector(selector)?.textContent ?? "")
        )
    );
  }

  function displayedTotal(): string {
    return normalizeSpaces(getElement(fixture, "#month-total-value", HTMLElement).textContent);
  }

  function normalizeSpaces(text: string): string {
    return text.replace(/\s+/g, " ").trim();
  }

  function chartDatasets(): unknown {
    return fixture.debugElement
      .query(By.directive(BaseChartDirective))
      .injector.get(BaseChartDirective).data?.datasets;
  }

  /** Changes the month, which sends the request of its expenses. */
  function clickMonthButton(label: string): void {
    getElement(
      fixture,
      `#month-navigation button[aria-label="${label}"]`,
      HTMLButtonElement
    ).click();
    TestBed.tick();
  }

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
    fixture.componentRef.setInput("expenseLabels", labelData);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("Should display the expenses of the month with their total, then change the month", async () => {
    await loadExpenses(mockedCurrentMonth, expenses);

    expect(displayedExpenses()).toEqual([
      ["Courses", "323,00 €"],
      ["Restaurant", "130,00 €"],
      ["Restaurant", "4,00 €"]
    ]);
    expect(displayedTotal()).toBe("457,00 €");
    expect(chartDatasets()).toEqual([
      { label: "Courses", data: [323] },
      { label: "Restaurant", data: [134] }
    ]);

    clickMonthButton("Mois précédent");
    expectExpensesRequest(subMonths(mockedCurrentMonth, 1)).flush([]);
    await fixture.whenStable();
    expect(displayedExpenses()).toEqual([]);

    clickMonthButton("Mois suivant");
    expectExpensesRequest(mockedCurrentMonth).flush(expenses);
    await fixture.whenStable();
    expect(displayedExpenses()).toHaveLength(3);
  });

  it("Should display the empty state when there is no expense", async () => {
    await loadExpenses(mockedCurrentMonth, []);

    expect(displayedTotal()).toBe("0,00 €");
    expect(queryElement(fixture, ".empty-state")).not.toBeNull();
    expect(queryElement(fixture, "#expenses-list")).toBeNull();
  });

  it("Should ignore in the chart the expenses of an unknown label", async () => {
    await loadExpenses(mockedCurrentMonth, [
      { id: 1, amount: 10, expenseDate: mockedCurrentMonth, labelId: 99 }
    ]);

    expect(displayedExpenses()).toEqual([["", "10,00 €"]]);
    expect(chartDatasets()).toEqual([{ label: "", data: [] }]);
  });

  it("Should add the created expense to the list", async () => {
    await loadExpenses(mockedCurrentMonth, []);

    const newExpense: Expense = { id: 4, amount: 20, expenseDate: mockedCurrentMonth, labelId: 1 };
    fixture.debugElement
      .query(By.directive(CreateExpense))
      .injector.get(CreateExpense)
      .expenseCreated.emit(newExpense);
    await fixture.whenStable();

    expect(displayedExpenses()).toEqual([["Courses", "20,00 €"]]);
    expect(displayedTotal()).toBe("20,00 €");
  });

  it("Should select the month picked in the datepicker", async () => {
    await loadExpenses(mockedCurrentMonth, []);

    const monthInput =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(MatDatepickerInputHarness);
    await monthInput.openCalendar();
    const calendar = await monthInput.getCalendar();
    await calendar.selectCell({ text: "2021" });
    // The harness waits for the page to be stable, so the request is answered meanwhile
    const monthSelected = calendar.selectCell({ text: /juin/i });
    await vi.waitFor(() => {
      expectExpensesRequest(new Date(2021, 5, 1)).flush([]);
    });
    await monthSelected;

    expect(await monthInput.isCalendarOpen()).toBe(false);
    expect(await monthInput.getValue()).toBe("01/06/2021");
  });

  /**
   * Opens the deletion modal of the expense, closed with the given result.
   * The delete button is not displayed yet, so the method is called directly.
   */
  function deleteExpense(expenseId: number, modalResult: string): MockInstance<MatDialog["open"]> {
    const openSpy = vi
      .spyOn(TestBed.inject(MatDialog), "open")
      .mockReturnValue({ afterClosed: () => of(modalResult) } as MatDialogRef<unknown>);
    fixture.componentInstance.openDeleteExpenseModal(expenseId);
    return openSpy;
  }

  it("Should delete an expense once the deletion is confirmed", async () => {
    await loadExpenses(mockedCurrentMonth, expenses);

    const openSpy = deleteExpense(1, "validate");
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
      .expectOne(`${environment.backend_url}/expense/deleteExpense/?expenseId=1`)
      .flush(null);
    await fixture.whenStable();

    expect(displayedExpenses()).toEqual([
      ["Restaurant", "130,00 €"],
      ["Restaurant", "4,00 €"]
    ]);
    expect(displayedTotal()).toBe("134,00 €");
  });

  it("Should keep the expense when the deletion is cancelled", async () => {
    await loadExpenses(mockedCurrentMonth, expenses);

    deleteExpense(1, "cancel");
    await fixture.whenStable();

    expect(displayedExpenses()).toHaveLength(3);
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
    expect(queryElement(fixture, ".empty-state")).not.toBeNull();
  });
});
