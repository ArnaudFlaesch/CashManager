import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { environment } from "@environments/environment";
import { Label } from "@model/Label";
import { ITotalExpenseByMonth } from "@model/ITotalExpenseByMonth";
import { TotalExpenseByMonthComponent } from "./total-expense-by-month.component";
import { ComponentRef } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";

describe("TotalExpenseByMonthComponent", () => {
  let component: TotalExpenseByMonthComponent;
  let fixture: ComponentFixture<TotalExpenseByMonthComponent>;
  let componentRef: ComponentRef<TotalExpenseByMonthComponent>;
  let httpTestingController: HttpTestingController;

  const expensePath = "/expense/";
  const labelData = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ] as Label[];
  const expectedTotalExpenseByMonthData = [
    { date: "2022-04-01", total: 200 }
  ] as ITotalExpenseByMonth[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(TotalExpenseByMonthComponent);
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
    expect(component.isOneLabelSelected()).toEqual(false);

    const expectedTotalExpenseByMonthByLabelIdData = [
      { date: "2022-04-01", total: 400 },
      { date: "2022-03-01", total: 100 }
    ] as ITotalExpenseByMonth[];

    const labelIdToSelect = component.expenseLabels()[0].id;
    component.selectLabel(labelIdToSelect);
    TestBed.tick();
    httpTestingController
      .expectOne(
        `${environment.backend_url}${expensePath}getTotalExpensesByMonthByLabelId?labelId=${labelIdToSelect}`
      )
      .flush(expectedTotalExpenseByMonthByLabelIdData);
    await fixture.whenStable();
    expect(component.isOneLabelSelected()).toEqual(true);
    expect(component.totalExpensesByMonthChart()).toEqual({
      datasets: [
        { data: [100, 400], label: "Total des dépenses" },
        { data: [250, 250], label: "Moyenne" }
      ],
      labels: ["mars 2022", "avril 2022"]
    });
  });
});
