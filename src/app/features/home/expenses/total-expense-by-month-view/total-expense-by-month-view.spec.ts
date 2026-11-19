import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSelectHarness } from "@angular/material/select/testing";
import { By } from "@angular/platform-browser";
import { ChartData } from "chart.js";
import { BaseChartDirective } from "ng2-charts";

import { NO_LABEL_ID_SELECTED } from "@features/home/labels/label";
import { getElement, queryElement } from "@testing/dom";
import { TotalExpenseByMonthView } from "./total-expense-by-month-view";

describe("TotalExpenseByMonthView", () => {
  let fixture: ComponentFixture<TotalExpenseByMonthView>;
  let loader: HarnessLoader;

  const labels = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ];

  beforeEach(async () => {
    fixture = TestBed.createComponent(TotalExpenseByMonthView);
    fixture.componentRef.setInput("totalExpensesByMonth", [
      { date: "2022-02-01", total: 30 },
      { date: "2022-01-01", total: 10 }
    ]);
    fixture.componentRef.setInput("expenseLabels", labels);
    fixture.componentRef.setInput("selectedLabelId", NO_LABEL_ID_SELECTED);
    loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();
  });

  function chartData(): ChartData | undefined {
    return fixture.debugElement
      .query(By.directive(BaseChartDirective))
      .injector.get(BaseChartDirective).data;
  }

  it("Should display the totals sorted by month, with their average", () => {
    expect(chartData()).toEqual({
      labels: ["janvier 2022", "février 2022"],
      datasets: [
        { label: "Total des dépenses", data: [10, 30] },
        { label: "Moyenne", data: [20, 20] }
      ]
    });
  });

  it("Should select a label, then reset the selection", async () => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    await select.clickOptions({ text: "Restaurant" });
    expect(fixture.componentInstance.selectedLabelId()).toBe(2);

    getElement(fixture, "#label-filter button", HTMLButtonElement).click();
    await fixture.whenStable();

    expect(fixture.componentInstance.selectedLabelId()).toBe(NO_LABEL_ID_SELECTED);
    expect(queryElement(fixture, "#label-filter button")).toBeNull();
  });
});
