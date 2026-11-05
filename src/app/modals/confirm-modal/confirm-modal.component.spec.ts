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
});
