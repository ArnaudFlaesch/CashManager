import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { environment } from "@environments/environment";
import { Label } from "@model/Label";
import { LabelService } from "./label.service";

describe("LabelService", () => {
  let service: LabelService;
  let httpTestingController: HttpTestingController;

  const labelUrl = `${environment.backend_url}/label`;
  const label: Label = { id: 1, label: "Courses", userId: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(LabelService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("Should get the labels", async () => {
    const labels = firstValueFrom(service.getLabels());
    httpTestingController.expectOne(`${labelUrl}/`).flush([label]);
    expect(await labels).toEqual([label]);
  });

  it("Should add a label", async () => {
    const added = firstValueFrom(service.addLabel("Courses"));
    const request = httpTestingController.expectOne(`${labelUrl}/addLabel`);
    expect(request.request.method).toEqual("POST");
    expect(request.request.body).toEqual({ newLabel: "Courses" });
    request.flush(label);
    expect(await added).toEqual(label);
  });

  it("Should delete a label", async () => {
    const deleted = firstValueFrom(service.deleteLabel(1));
    const request = httpTestingController.expectOne(`${labelUrl}/deleteLabel?labelId=1`);
    expect(request.request.method).toEqual("DELETE");
    request.flush(null);
    expect(await deleted).toBeNull();
  });
});
