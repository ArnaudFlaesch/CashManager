import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatInputHarness } from "@angular/material/input/testing";
import { MatTabGroupHarness } from "@angular/material/tabs/testing";
import { fr } from "date-fns/locale/fr";
import { of } from "rxjs";
import type { MockInstance } from "vitest";

import { HttpErrorHandler } from "@core/http-error-handler";
import { environment } from "@environments/environment";
import { ConfirmModal } from "@shared/confirm-modal/confirm-modal";
import { getElement } from "@testing/dom";
import { Home } from "./home";
import { Label } from "./labels/label";

describe("Home", () => {
  const labelData: Label[] = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ];
  const labelUrl = `${environment.backendUrl}/labels`;

  let fixture: ComponentFixture<Home>;
  let loader: HarnessLoader;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideDateFnsAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: fr },
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    loader = TestbedHarnessEnvironment.loader(fixture);
    httpTestingController = TestBed.inject(HttpTestingController);

    TestBed.tick();
    httpTestingController.expectOne(labelUrl).flush(labelData);
    flushExpenses();
    await fixture.whenStable();
    await openLabelsTab();
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.restoreAllMocks();
  });

  /** The tabs of the expenses load them when they are displayed. */
  function flushExpenses(): void {
    httpTestingController
      .match((request) => request.url.includes("/expenses"))
      .forEach((request) => {
        request.flush([]);
      });
  }

  async function openLabelsTab(): Promise<void> {
    const tabs = await loader.getHarness(MatTabGroupHarness);
    await tabs.selectTab({ label: /Étiquettes/ });
    flushExpenses();
    await fixture.whenStable();
  }

  function displayedLabels(): string[] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll(".label-name"),
      (labelName) => labelName.textContent.trim()
    );
  }

  /** Types the name of the label, and submits the form. */
  async function createLabel(name: string): Promise<MatInputHarness> {
    const input = await loader.getHarness(MatInputHarness.with({ selector: "#label-form" }));
    await input.setValue(name);
    getElement(fixture, "#create-label-button", HTMLButtonElement).click();
    return input;
  }

  it("Should display the labels and create a new one", async () => {
    expect(displayedLabels()).toEqual(["Courses", "Restaurant"]);

    const input = await createLabel("New label");
    const request = httpTestingController.expectOne({ method: "POST", url: labelUrl });
    expect(request.request.body).toEqual({ newLabel: "New label" });
    request.flush({ id: 3, label: "New label", userId: 1 });
    await fixture.whenStable();

    expect(displayedLabels()).toEqual(["Courses", "Restaurant", "New label"]);
    expect(await input.getValue()).toBe("");
  });

  it("Should not create a label without name", async () => {
    await createLabel("");
    await fixture.whenStable();
    httpTestingController.expectNone({ method: "POST", url: labelUrl });
    expect(displayedLabels()).toEqual(["Courses", "Restaurant"]);
  });

  it("Should display an error when a label cannot be created", async () => {
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(HttpErrorHandler), "handleError")
      .mockImplementation(() => undefined);

    const input = await createLabel("New label");
    httpTestingController
      .expectOne({ method: "POST", url: labelUrl })
      .flush(null, { status: 500, statusText: "Server error" });
    await fixture.whenStable();

    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors de l'ajout du label."
    );
    expect(displayedLabels()).toEqual(["Courses", "Restaurant"]);
    expect(await input.getValue()).toBe("New label");
  });

  /** Clicks on the delete button of the first label, the confirmation modal answers the result. */
  function deleteFirstLabel(modalResult: string | undefined): MockInstance<MatDialog["open"]> {
    const openSpy = vi.spyOn(TestBed.inject(MatDialog), "open").mockReturnValue({
      afterClosed: () => of(modalResult)
    } as MatDialogRef<unknown>);
    getElement(fixture, ".delete-label-button", HTMLButtonElement).click();
    return openSpy;
  }

  it("Should delete a label once the deletion is confirmed", async () => {
    const openSpy = deleteFirstLabel("validate");
    expect(openSpy).toHaveBeenCalledWith(
      ConfirmModal,
      expect.objectContaining({
        data: {
          title: "Suppression d'un label",
          message: "Êtes-vous sûr de vouloir supprimer ce label ?"
        }
      })
    );
    httpTestingController.expectOne({ method: "DELETE", url: `${labelUrl}/1` }).flush(null);
    await fixture.whenStable();

    expect(displayedLabels()).toEqual(["Restaurant"]);
  });

  it("Should not delete the label when the deletion is cancelled", async () => {
    deleteFirstLabel(undefined);
    await fixture.whenStable();

    httpTestingController.expectNone({ method: "DELETE", url: `${labelUrl}/1` });
    expect(displayedLabels()).toEqual(["Courses", "Restaurant"]);
  });

  it("Should display an error when the label cannot be deleted", async () => {
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(HttpErrorHandler), "handleError")
      .mockImplementation(() => undefined);

    deleteFirstLabel("validate");
    httpTestingController
      .expectOne({ method: "DELETE", url: `${labelUrl}/1` })
      .flush(null, { status: 500, statusText: "Server error" });
    await fixture.whenStable();

    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors de la suppression du label."
    );
    expect(displayedLabels()).toEqual(["Courses", "Restaurant"]);
  });
});
