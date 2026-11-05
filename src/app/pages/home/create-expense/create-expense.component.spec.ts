import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { fr } from "date-fns/locale/fr";
import { environment } from "@environments/environment";
import { CreateExpenseComponent } from "./create-expense.component";
import { ErrorHandlerService } from "@services/error-handler.service";

describe("CreateExpenseComponent", () => {
  let component: CreateExpenseComponent;
  let fixture: ComponentFixture<CreateExpenseComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideDateFnsAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: fr },
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateExpenseComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  const expensePath = "/expense/";

  it("Should create an expense", async () => {
    const newLabelName = "Vacances";
    expect(component.canCreateExpense()).toEqual(false);
    component.selectLabel({ id: 1, label: newLabelName, userId: 1 });
    component.expenseModel.update((model) => ({
      ...model,
      date: new Date(2022, 2, 5),
      amount: 23
    }));

    expect(component.canCreateExpense()).toEqual(true);
    const submitted = component.handleCreateExpense();

    const getExpensesRequest = httpTestingController.expectOne(
      `${environment.backend_url}${expensePath}addExpense`
    );
    getExpensesRequest.flush({
      id: 1,
      amount: 23,
      expenseDate: new Date("2022-03-05"),
      labelId: 1
    });
    expect(await submitted).toEqual(true);
    expect(component.expenseModel().amount).toEqual(0);
    expect(component.expenseModel().label).toEqual("");
    expect(component.canCreateExpense()).toEqual(false);
  });

  it("Should display the label", () => {
    const label = { id: 1, label: "Dépense 1", userId: 1 };
    expect(component.displayLabel(label)).toEqual("Dépense 1");
    expect(label.userId).toEqual(1);
  });

  it("Should filter the labels with the typed text", () => {
    fixture.componentRef.setInput("expenseLabels", [
      { id: 1, label: "Courses", userId: 1 },
      { id: 2, label: "Restaurant", userId: 1 }
    ]);
    component.expenseModel.update((model) => ({ ...model, label: "rest" }));
    expect(component.filteredOptions().map((label) => label.label)).toEqual(["Restaurant"]);

    component.selectLabel({ id: 1, label: "Courses", userId: 1 });
    expect(component.filteredOptions().map((label) => label.label)).toEqual(["Courses"]);
    expect(component.displayLabel(null)).toEqual("");
    expect(component.displayLabel("typed text")).toEqual("typed text");
  });

  it("Should display an error when the expense cannot be created", async () => {
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(ErrorHandlerService), "handleError")
      .mockImplementation(() => undefined);
    const insertedExpenseSpy = vi.spyOn(component.insertedExpenseEvent, "emit");
    component.selectLabel({ id: 1, label: "Courses", userId: 1 });
    component.expenseModel.update((model) => ({
      ...model,
      date: new Date(2022, 2, 5),
      amount: 23
    }));

    const submitted = component.handleCreateExpense();
    httpTestingController
      .expectOne(`${environment.backend_url}${expensePath}addExpense`)
      .flush(null, { status: 500, statusText: "Server error" });

    expect(await submitted).toEqual(true);
    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors de l'ajout de la dépense."
    );
    expect(insertedExpenseSpy).not.toHaveBeenCalled();
    expect(component.expenseModel().amount).toEqual(23);
  });
});
