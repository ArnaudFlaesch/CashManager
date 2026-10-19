import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { MatDialogRef } from "@angular/material/dialog";

import { TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";
import { provideRouter } from "@angular/router";
import { routes } from "../app.routes";
import { provideHttpClient } from "@angular/common/http";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("Should switch between light and dark mode", () => {
    component.toggleTheme(true);
    expect(localStorage.getItem("preferredTheme")).toEqual("dark");
    component.toggleTheme(true);
    expect(localStorage.getItem("preferredTheme")).toEqual("dark");
    component.toggleTheme(false);
    expect(localStorage.getItem("preferredTheme")).toEqual("light");
  });
});
