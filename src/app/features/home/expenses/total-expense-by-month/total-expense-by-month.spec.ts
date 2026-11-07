import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSelectHarness } from "@angular/material/select/testing";
import { By } from "@angular/platform-browser";
import { BaseChartDirective } from "ng2-charts";
import { environment } from "@environments/environment";
import { Label } from "@features/home/labels/label";
import { MonthlyExpenseTotal } from "@features/home/expenses/monthly-expense-total";
import { getElement, queryElement } from "@testing/dom";
import { HttpErrorHandler } from "@core/http-error-handler";
import { TotalExpenseByMonth } from "./total-expense-by-month";

describe("TotalExpenseByMonth", () => {
  let fixture: ComponentFixture<TotalExpenseByMonth>;
  let httpTestingController: HttpTestingController;

  const totalUrl = `${environment.backend_url}/expense/getTotalExpensesByMonth`;
  const totalByLabelUrl = (labelId: number): string =>
    `${environment.backend_url}/expense/getTotalExpensesByMonthByLabelId?labelId=${labelId}`;
  const labelData: Label[] = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ];
  const totalData: MonthlyExpenseTotal[] = [{ date: "2022-04-01", total: 200 }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(TotalExpenseByMonth);
    fixture.componentRef.setInput("expenseLabels", labelData);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.restoreAllMocks();
  });

  /** Answers the request of the totals of all the labels, sent once the component is rendered. */
  async function loadTotals(): Promise<void> {
    TestBed.tick();
    httpTestingController.expectOne(totalUrl).flush(totalData);
    await fixture.whenStable();
  }

  /** Selects the label in the list, and answers the request of its totals. */
  async function selectLabel(label: string, totals: MonthlyExpenseTotal[]): Promise<void> {
    const select = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatSelectHarness);
    await select.open();
    // The harness waits for the page to be stable, so the request is answered meanwhile
    const selected = select.clickOptions({ text: label });
    await vi.waitFor(() => {
      httpTestingController.expectOne(totalByLabelUrl(1)).flush(totals);
    });
    await selected;
    await fixture.whenStable();
  }

  function chartData(): unknown {
    return fixture.debugElement
      .query(By.directive(BaseChartDirective))
      .injector.get(BaseChartDirective).data;
  }

  function getResetButton(): HTMLButtonElement | null {
    return queryElement(
      fixture,
      '#label-filter button[aria-label="Toutes les étiquettes"]'
    ) as HTMLButtonElement | null;
  }

  it("Should display the total of all the labels, then of the selected one", async () => {
    await loadTotals();
    expect(getResetButton()).toBeNull();

    await selectLabel("Courses", [
      { date: "2022-04-01", total: 400 },
      { date: "2022-03-01", total: 100 }
    ]);

    expect(getResetButton()).not.toBeNull();
    expect(chartData()).toEqual({
      datasets: [
        { data: [100, 400], label: "Total des dépenses" },
        { data: [250, 250], label: "Moyenne" }
      ],
      labels: ["mars 2022", "avril 2022"]
    });
  });

  it("Should display the total of all the labels again once the selected label is reset", async () => {
    await loadTotals();
    await selectLabel("Courses", []);

    getElement(
      fixture,
      '#label-filter button[aria-label="Toutes les étiquettes"]',
      HTMLButtonElement
    ).click();
    TestBed.tick();
    httpTestingController.expectOne(totalUrl).flush(totalData);
    await fixture.whenStable();

    expect(getResetButton()).toBeNull();
  });

  it("Should display an error and an empty chart when the totals cannot be loaded", async () => {
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(HttpErrorHandler), "handleError")
      .mockImplementation(() => undefined);
    TestBed.tick();
    httpTestingController
      .expectOne(totalUrl)
      .flush(null, { status: 500, statusText: "Server error" });
    await fixture.whenStable();

    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors de la récupération du total des dépenses."
    );
    expect(chartData()).toEqual(expect.objectContaining({ labels: [] }));
  });
});
