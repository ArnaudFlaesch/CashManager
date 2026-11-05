import { TestBed } from "@angular/core/testing";
import { App } from "./app";

describe("App", () => {
  let component: App;

  beforeEach(() => {
    const fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it("Should display the title", () => {
    expect(component).toBeTruthy();
  });
});
