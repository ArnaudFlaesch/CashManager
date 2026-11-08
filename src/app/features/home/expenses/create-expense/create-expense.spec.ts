import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MatAutocompleteHarness } from "@angular/material/autocomplete/testing";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerInputHarness } from "@angular/material/datepicker/testing";
import { MatInputHarness } from "@angular/material/input/testing";
import { format, setDate } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { environment } from "@environments/environment";
import { getElement } from "@testing/dom";
import { InsertExpensePayload } from "../insert-expense-payload";
import { CreateExpense } from "./create-expense";
import { HttpErrorHandler } from "@core/http-error-handler";

describe("CreateExpense", () => {
  let fixture: ComponentFixture<CreateExpense>;
  let loader: HarnessLoader;
  let httpTestingController: HttpTestingController;

  const addExpenseUrl = `${environment.backend_url}/expenses`;
  const labels = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideDateFnsAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: fr },
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateExpense);
    fixture.componentRef.setInput("expenseLabels", labels);
    loader = TestbedHarnessEnvironment.loader(fixture);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.restoreAllMocks();
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

  it("Should create an expense", async () => {
    const expenseCreatedSpy = vi.spyOn(fixture.componentInstance.expenseCreated, "emit");
    await fixture.whenStable();
    expect(getAddButton().disabled).toBe(true);

    await fillForm();
    expect(getAddButton().disabled).toBe(false);
    getAddButton().click();

    const request = httpTestingController.expectOne(addExpenseUrl);
    const body = request.request.body as InsertExpensePayload;
    expect(body.amount).toBe(23);
    expect(body.labelId).toBe(1);
    expect(body.expenseDate.toISOString().slice(0, 10)).toBe(
      format(setDate(new Date(), 5), "yyyy-MM-dd")
    );
    const createdExpense = { id: 1, amount: 23, expenseDate: body.expenseDate, labelId: 1 };
    request.flush(createdExpense);
    await fixture.whenStable();

    expect(expenseCreatedSpy).toHaveBeenCalledWith(createdExpense);
    // The amount and the label are reset, the date is kept for the next expense
    expect(await (await getAmountInput()).getValue()).toBe("0");
    expect(await (await getLabelInput()).getValue()).toBe("");
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

  it("Should display an error when the expense cannot be created", async () => {
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(HttpErrorHandler), "handleError")
      .mockImplementation(() => undefined);
    const expenseCreatedSpy = vi.spyOn(fixture.componentInstance.expenseCreated, "emit");

    await fillForm();
    getAddButton().click();
    httpTestingController
      .expectOne(addExpenseUrl)
      .flush(null, { status: 500, statusText: "Server error" });
    await fixture.whenStable();

    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors de l'ajout de la dépense."
    );
    expect(expenseCreatedSpy).not.toHaveBeenCalled();
    expect(await (await getAmountInput()).getValue()).toBe("23");
  });
});
