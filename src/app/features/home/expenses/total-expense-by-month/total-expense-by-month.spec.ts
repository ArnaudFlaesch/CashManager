import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { environment } from "@environments/environment";
import { Label } from "@features/home/labels/label";
import { MonthlyExpenseTotal } from "@features/home/expenses/monthly-expense-total";
import { TotalExpenseByMonth } from "./total-expense-by-month";
import { ComponentRef } from "@angular/core";
import { HttpErrorHandler } from "@core/http-error-handler";

describe("TotalExpenseByMonth", () => {
  let component: TotalExpenseByMonth;
  let fixture: ComponentFixture<TotalExpenseByMonth>;
  let componentRef: ComponentRef<TotalExpenseByMonth>;
  let httpTestingController: HttpTestingController;

  const expensePath = "/expense/";
  const labelData = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ] as Label[];
  const expectedTotalExpenseByMonthData = [
    { date: "2022-04-01", total: 200 }
  ] as MonthlyExpenseTotal[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(TotalExpenseByMonth);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("Should display the total with two labels", async () => {
    componentRef.setInput("expenseLabels", labelData);
    TestBed.tick();
    httpTestingController
      .expectOne(`${environment.backend_url}${expensePath}getTotalExpensesByMonth`)
      .flush(expectedTotalExpenseByMonthData);
    await fixture.whenStable();
    expect(component["isOneLabelSelected"]()).toEqual(false);

    const expectedTotalExpenseByMonthByLabelIdData = [
      { date: "2022-04-01", total: 400 },
      { date: "2022-03-01", total: 100 }
    ] as MonthlyExpenseTotal[];

    const labelIdToSelect = component.expenseLabels()[0].id;
    component["selectLabel"](labelIdToSelect);
    TestBed.tick();
    httpTestingController
      .expectOne(
        `${environment.backend_url}${expensePath}getTotalExpensesByMonthByLabelId?labelId=${labelIdToSelect}`
      )
      .flush(expectedTotalExpenseByMonthByLabelIdData);
    await fixture.whenStable();
    expect(component["isOneLabelSelected"]()).toEqual(true);
    expect(component["totalExpensesByMonthChart"]()).toEqual({
      datasets: [
        { data: [100, 400], label: "Total des dépenses" },
        { data: [250, 250], label: "Moyenne" }
      ],
      labels: ["mars 2022", "avril 2022"]
    });
  });

  it("Should display the total of all the labels again once the selected label is reset", async () => {
    componentRef.setInput("expenseLabels", labelData);
    TestBed.tick();
    httpTestingController
      .expectOne(`${environment.backend_url}${expensePath}getTotalExpensesByMonth`)
      .flush(expectedTotalExpenseByMonthData);
    component["selectLabel"](labelData[0].id);
    TestBed.tick();
    httpTestingController
      .expectOne(
        `${environment.backend_url}${expensePath}getTotalExpensesByMonthByLabelId?labelId=${labelData[0].id}`
      )
      .flush([]);
    await fixture.whenStable();

    fixture.nativeElement.querySelector("#label-filter button").click();
    TestBed.tick();
    httpTestingController
      .expectOne(`${environment.backend_url}${expensePath}getTotalExpensesByMonth`)
      .flush(expectedTotalExpenseByMonthData);
    await fixture.whenStable();

    expect(component["isOneLabelSelected"]()).toEqual(false);
    expect(fixture.nativeElement.querySelector("#label-filter button")).toBeNull();
  });

  it("Should display an error and an empty chart when the totals cannot be loaded", async () => {
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(HttpErrorHandler), "handleError")
      .mockImplementation(() => undefined);
    TestBed.tick();
    httpTestingController
      .expectOne(`${environment.backend_url}${expensePath}getTotalExpensesByMonth`)
      .flush(null, { status: 500, statusText: "Server error" });
    await fixture.whenStable();

    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors de la récupération du total des dépenses."
    );
    expect(component["totalExpensesByMonthChart"]().labels).toEqual([]);
  });
});
