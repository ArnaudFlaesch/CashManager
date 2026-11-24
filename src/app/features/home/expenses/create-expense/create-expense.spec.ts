import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MatAutocompleteHarness } from "@angular/material/autocomplete/testing";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerInputHarness } from "@angular/material/datepicker/testing";
import { MatInputHarness } from "@angular/material/input/testing";
import { format, setDate } from "date-fns";
import { fr } from "date-fns/locale/fr";

import { getElement } from "@testing/dom";
import { CreateExpense } from "./create-expense";

describe("CreateExpense", () => {
  let fixture: ComponentFixture<CreateExpense>;
  let loader: HarnessLoader;

  const labels = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideDateFnsAdapter(), { provide: MAT_DATE_LOCALE, useValue: fr }]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateExpense);
    fixture.componentRef.setInput("expenseLabels", labels);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  function getAmountInput(): Promise<MatInputHarness> {
    return loader.getHarness(MatInputHarness.with({ selector: "#expense-amount" }));
  }

  function getLabelInput(): Promise<MatAutocompleteHarness> {
    return loader.getHarness(MatAutocompleteHarness.with({ selector: "#expense-label" }));
  }

  function getAddButton(): HTMLButtonElement {
    return getElement(fixture, "#add-expense-button", HTMLButtonElement);
  }

  /** Fills the form with an amount of 23, the 5th of the current month and the "Courses" label. */
  async function fillForm(): Promise<void> {
    await (await getAmountInput()).setValue("23");
    const dateInput = await loader.getHarness(MatDatepickerInputHarness);
    await dateInput.openCalendar();
    await (await dateInput.getCalendar()).selectCell({ text: "5" });
    const labelInput = await getLabelInput();
    await labelInput.enterText("Cour");
    await labelInput.selectOption({ text: "Courses" });
  }

  it("Should submit the expense", async () => {
    const expenseSubmittedSpy = vi.spyOn(fixture.componentInstance.expenseSubmitted, "emit");
    await fixture.whenStable();
    expect(getAddButton().disabled).toBe(true);

    await fillForm();
    expect(getAddButton().disabled).toBe(false);
    getAddButton().click();
    await fixture.whenStable();

    expect(expenseSubmittedSpy).toHaveBeenCalledTimes(1);
    const payload = expenseSubmittedSpy.mock.calls[0][0];
    expect(payload.amount).toBe(23);
    expect(payload.labelId).toBe(1);
    expect(payload.expenseDate.toISOString().slice(0, 10)).toBe(
      format(setDate(new Date(), 5), "yyyy-MM-dd")
    );
  });

  it("Should disable the button while the expense is submitted", async () => {
    await fillForm();
    fixture.componentRef.setInput("isSubmitting", true);
    await fixture.whenStable();

    expect(getAddButton().disabled).toBe(true);
  });

  it("Should clear the amount and the label, and keep the date for the next expense", async () => {
    await fillForm();
    const dateInput = await loader.getHarness(MatDatepickerInputHarness);
    const date = await dateInput.getValue();

    fixture.componentInstance.clearAmountAndLabel();
    await fixture.whenStable();

    expect(await (await getAmountInput()).getValue()).toBe("0");
    expect(await (await getLabelInput()).getValue()).toBe("");
    expect(await dateInput.getValue()).toBe(date);
    expect(getAddButton().disabled).toBe(true);
  });

  it("Should filter the labels with the typed text, and display the selected one", async () => {
    const labelInput = await getLabelInput();
    await labelInput.enterText("rest");
    const options = await labelInput.getOptions();
    expect(await Promise.all(options.map((option) => option.getText()))).toEqual(["Restaurant"]);

    await labelInput.selectOption({ text: "Restaurant" });
    expect(await labelInput.getValue()).toBe("Restaurant");
  });
});
