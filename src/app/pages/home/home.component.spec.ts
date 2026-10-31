import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { fr } from "date-fns/locale/fr";
import { environment } from "../../../environments/environment";
import { Label } from "@model/Label";
import { HomeComponent } from "./home.component";
import { provideHttpClient } from "@angular/common/http";

describe("HomeComponent", () => {
  const labelData = [
    {
      id: 1,
      label: "Courses",
      userId: 1
    },
    {
      id: 2,
      label: "Restaurant",
      userId: 1
    }
  ];
  const labelPath = "/label/";

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideDateFnsAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: fr },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("Should create component and get label list", async () => {
    TestBed.tick();
    const getLabelsRequest = httpTestingController.expectOne(environment.backend_url + labelPath);

    getLabelsRequest.flush(labelData);
    httpTestingController
      .match((request) => request.url.includes("/expense/"))
      .forEach((request) => request.flush([]));
    await fixture.whenStable();
    expect(component.labels.value()).toEqual(labelData);

    component.labelModel.update((model) => ({ ...model, label: "New label" }));
    const submitted = component.handleCreateLabel();
    const createLabelRequest = httpTestingController.expectOne(
      environment.backend_url + labelPath + "addLabel"
    );

    const newLabel = { id: 2, label: "New label" } as Label;
    createLabelRequest.flush(newLabel);
    expect(await submitted).toEqual(true);
    expect(component.labels.value()).toEqual([...labelData, newLabel]);
    expect(component.labelModel().label).toEqual("");
  });
});
