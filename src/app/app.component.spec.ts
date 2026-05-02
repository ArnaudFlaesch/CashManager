import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [],
      imports: []
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it("Should display the title", () => {
    expect(component).toBeTruthy();
  });
});
