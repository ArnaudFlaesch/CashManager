import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { By } from "@angular/platform-browser";
import { fr } from "date-fns/locale/fr";
import { BaseChartDirective } from "ng2-charts";

import { getChartOptions } from "@shared/chart-options";
import { getElement, queryElement } from "@testing/dom";
import { Expense } from "../expense";
import { ExpenseListByMonthView } from "./expense-list-by-month-view";

describe("ExpenseListByMonthView", () => {
  let fixture: ComponentFixture<ExpenseListByMonthView>;

  const month = new Date(2022, 1, 1);
  const labels = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ];
  const expenses: Expense[] = [
    { id: 1, amount: 0.1, expenseDate: month, labelId: 1 },
    { id: 2, amount: 0.2, expenseDate: month, labelId: 2 }
  ];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideDateFnsAdapter(), { provide: MAT_DATE_LOCALE, useValue: fr }]
    });
    fixture = TestBed.createComponent(ExpenseListByMonthView);
    fixture.componentRef.setInput("expenses", expenses);
    fixture.componentRef.setInput("expenseLabels", labels);
    fixture.componentRef.setInput("selectedMonth", month);
    await fixture.whenStable();
  });

  function clickMonthButton(label: string): void {
    getElement(
      fixture,
      `#month-navigation button[aria-label="${label}"]`,
      HTMLButtonElement
    ).click();
  }

  it("Should display the expenses with the rounded total of the month", () => {
    expect(
      getElement(fixture, "#month-total-value", HTMLElement).textContent.replace(/\s+/g, " ")
    ).toContain("0,30 €");
    expect(queryElement(fixture, "#expenses-list")).not.toBeNull();
  });

  it("Should display the empty state without expense", async () => {
    fixture.componentRef.setInput("expenses", []);
    await fixture.whenStable();

    expect(queryElement(fixture, ".empty-state")).not.toBeNull();
    expect(queryElement(fixture, "#expenses-list")).toBeNull();
  });

  it("Should select the previous and the next months", () => {
    clickMonthButton("Mois précédent");
    expect(fixture.componentInstance.selectedMonth()).toEqual(new Date(2022, 0, 1));

    clickMonthButton("Mois suivant");
    clickMonthButton("Mois suivant");
    expect(fixture.componentInstance.selectedMonth()).toEqual(new Date(2022, 2, 1));
  });

  it("Should use the chart options of the theme", async () => {
    fixture.componentRef.setInput("isDarkMode", true);
    await fixture.whenStable();

    const chart = fixture.debugElement
      .query(By.directive(BaseChartDirective))
      .injector.get(BaseChartDirective);
    expect(chart.options).toEqual(getChartOptions(true));
  });
});
