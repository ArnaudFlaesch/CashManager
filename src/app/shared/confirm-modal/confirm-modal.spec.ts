import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConfirmModalData } from "./confirm-modal-data";

import { TestBed } from "@angular/core/testing";
import { ConfirmModal } from "./confirm-modal";

describe("ConfirmModal", () => {
  let component: ConfirmModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: "Titre du dialog",
            message: "Message du dialog"
          } satisfies ConfirmModalData
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ConfirmModal);
    component = fixture.componentInstance;
  });

  it("Should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("Should display the title and the message of the confirmation", async () => {
    const fixture = TestBed.createComponent(ConfirmModal);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector("h1")?.textContent).toBe("Titre du dialog");
    expect(element.querySelector("mat-dialog-content")?.textContent.trim()).toBe(
      "Message du dialog"
    );
    expect(element.querySelector("#cancel-action")?.textContent.trim()).toBe("Annuler");
    expect(element.querySelector("#validate-action")?.textContent.trim()).toBe("Valider");
  });
});
