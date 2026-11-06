import { submit } from "@angular/forms/signals";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { fr } from "date-fns/locale/fr";
import { environment } from "@environments/environment";
import { Label } from "./labels/label";
import { Home } from "./home";
import { HttpErrorHandler } from "@core/http-error-handler";

describe("Home", () => {
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

  let component: Home;
  let fixture: ComponentFixture<Home>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideDateFnsAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: fr },
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
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
    expect(component["expenseLabels"].value()).toEqual(labelData);

    component["labelModel"].update((model) => ({ ...model, label: "New label" }));
    const submitted = submit(component["labelForm"]);
    const createLabelRequest = httpTestingController.expectOne(
      environment.backend_url + labelPath + "addLabel"
    );

    const newLabel = { id: 2, label: "New label" } as Label;
    createLabelRequest.flush(newLabel);
    expect(await submitted).toEqual(true);
    expect(component["expenseLabels"].value()).toEqual([...labelData, newLabel]);
    expect(component["labelModel"]().label).toEqual("");
  });

  it("Should not create a label without name", async () => {
    TestBed.tick();
    httpTestingController.expectOne(environment.backend_url + labelPath).flush(labelData);
    httpTestingController
      .match((request) => request.url.includes("/expense/"))
      .forEach((request) => request.flush([]));
    await fixture.whenStable();

    expect(await submit(component["labelForm"])).toEqual(false);
    httpTestingController.expectNone(environment.backend_url + labelPath + "addLabel");
  });

  it("Should display an error when a label cannot be created", async () => {
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(HttpErrorHandler), "handleError")
      .mockImplementation(() => undefined);
    TestBed.tick();
    httpTestingController.expectOne(environment.backend_url + labelPath).flush(labelData);
    httpTestingController
      .match((request) => request.url.includes("/expense/"))
      .forEach((request) => request.flush([]));
    await fixture.whenStable();

    component["labelModel"].set({ label: "New label" });
    const submitted = submit(component["labelForm"]);
    httpTestingController
      .expectOne(environment.backend_url + labelPath + "addLabel")
      .flush(null, { status: 500, statusText: "Server error" });

    expect(await submitted).toEqual(true);
    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors de l'ajout du label."
    );
    expect(component["expenseLabels"].value()).toEqual(labelData);
  });

  it("Should remove a deleted label from the list", async () => {
    TestBed.tick();
    httpTestingController.expectOne(environment.backend_url + labelPath).flush(labelData);
    httpTestingController
      .match((request) => request.url.includes("/expense/"))
      .forEach((request) => request.flush([]));
    await fixture.whenStable();

    component["removeLabel"](labelData[0].id);
    expect(component["expenseLabels"].value()).toEqual([labelData[1]]);
  });
});
