import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { of } from "rxjs";
import { environment } from "@environments/environment";
import { ConfirmModal } from "@shared/confirm-modal/confirm-modal";
import { Label } from "@features/home/labels/label.model";
import { ErrorHandlerService } from "@core/error-handler-service";
import { LabelList } from "./label-list";

describe("LabelList", () => {
  let component: LabelList;
  let fixture: ComponentFixture<LabelList>;
  let httpTestingController: HttpTestingController;

  const deleteLabelUrl = `${environment.backend_url}/label/deleteLabel?labelId=1`;
  const labels: Label[] = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    fixture = TestBed.createComponent(LabelList);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.restoreAllMocks();
  });

  /** Answers the confirmation modal with the given result. */
  function mockConfirmModal(result: string | undefined): ReturnType<typeof vi.spyOn> {
    return vi
      .spyOn(TestBed.inject(MatDialog), "open")
      .mockReturnValue({ afterClosed: () => of(result) } as MatDialogRef<unknown>);
  }

  async function clickDeleteButton(): Promise<void> {
    fixture.componentRef.setInput("expenseLabels", labels);
    await fixture.whenStable();
    fixture.nativeElement.querySelector(".delete-label-button").click();
  }

  it("Should display a message when there is no label", async () => {
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector("#no-label-message")).not.toBeNull();
  });

  it("Should display the labels", async () => {
    fixture.componentRef.setInput("expenseLabels", labels);
    await fixture.whenStable();
    const names = fixture.nativeElement.querySelectorAll(".label-name");
    expect(Array.from(names, (name: HTMLElement) => name.textContent)).toEqual([
      "Courses",
      "Restaurant"
    ]);
    expect(fixture.nativeElement.querySelector("#no-label-message")).toBeNull();
  });

  it("Should delete a label once the deletion is confirmed", async () => {
    const openSpy = mockConfirmModal("validate");
    const labelDeletedSpy = vi.spyOn(component.labelDeleted, "emit");

    await clickDeleteButton();
    expect(openSpy).toHaveBeenCalledWith(
      ConfirmModal,
      expect.objectContaining({
        data: {
          title: "Suppression d'un label",
          message: "Êtes-vous sûr de vouloir supprimer ce label ?"
        }
      })
    );
    const request = httpTestingController.expectOne(deleteLabelUrl);
    expect(request.request.method).toEqual("DELETE");
    request.flush(null);

    expect(labelDeletedSpy).toHaveBeenCalledWith(1);
  });

  it("Should not delete the label when the deletion is cancelled", async () => {
    mockConfirmModal(undefined);
    const labelDeletedSpy = vi.spyOn(component.labelDeleted, "emit");

    await clickDeleteButton();

    httpTestingController.expectNone(deleteLabelUrl);
    expect(labelDeletedSpy).not.toHaveBeenCalled();
  });

  it("Should display an error when the label cannot be deleted", async () => {
    mockConfirmModal("validate");
    const labelDeletedSpy = vi.spyOn(component.labelDeleted, "emit");
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(ErrorHandlerService), "handleError")
      .mockImplementation(() => undefined);

    await clickDeleteButton();
    httpTestingController
      .expectOne(deleteLabelUrl)
      .flush(null, { status: 500, statusText: "Server error" });

    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors de la suppression du label."
    );
    expect(labelDeletedSpy).not.toHaveBeenCalled();
  });
});
