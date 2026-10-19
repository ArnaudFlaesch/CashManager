import { MatDialogRef } from "@angular/material/dialog";

import { TestBed } from "@angular/core/testing";
import { LabelListComponent } from "./label-list.component";
import { provideHttpClientTesting } from "@angular/common/http/testing";

import { provideHttpClient } from "@angular/common/http";

describe("LabelListComponent", () => {
  let component: LabelListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LabelListComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
