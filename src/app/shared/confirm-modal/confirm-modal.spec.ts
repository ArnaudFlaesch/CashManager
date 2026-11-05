import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IConfirmModalData } from "./confirm-modal-data.model";

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
          } as IConfirmModalData
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
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector("h1")?.textContent).toEqual("Titre du dialog");
    expect(element.querySelector("mat-dialog-content")?.textContent?.trim()).toEqual(
      "Message du dialog"
    );
    expect(element.querySelector("#cancel-action")?.textContent?.trim()).toEqual("Annuler");
    expect(element.querySelector("#validate-action")?.textContent?.trim()).toEqual("Valider");
  });
});
