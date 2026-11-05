import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IConfirmModalData } from "@model/IConfirmModalData";

import { TestBed } from "@angular/core/testing";
import { ConfirmModalComponent } from "./confirm-modal.component";

describe("ConfirmModalComponent", () => {
  let component: ConfirmModalComponent;

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

    const fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
  });

  it("Should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("Should display the title and the message of the confirmation", async () => {
    const fixture = TestBed.createComponent(ConfirmModalComponent);
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
