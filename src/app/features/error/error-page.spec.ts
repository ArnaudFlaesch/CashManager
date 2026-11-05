import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { ErrorPage } from "./error-page";

describe("ErrorPage", () => {
  let component: ErrorPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(ErrorPage);
    component = fixture.componentInstance;
  });

  it("should create the app", () => {
    expect(component).toBeTruthy();
  });

  it("Should display the error and a link to the home page", async () => {
    const fixture = TestBed.createComponent(ErrorPage);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector("h1")?.textContent).toEqual("Une erreur est survenue");
    expect(element.querySelector("a")?.getAttribute("href")).toEqual("/home");
  });
});
