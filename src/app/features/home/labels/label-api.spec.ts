import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { environment } from "@environments/environment";
import { Label } from "./label";
import { LabelApi } from "./label-api";

describe("LabelApi", () => {
  let service: LabelApi;
  let httpTestingController: HttpTestingController;

  const labelUrl = `${environment.backend_url}/labels`;
  const label: Label = { id: 1, label: "Courses", userId: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(LabelApi);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("Should get the labels", async () => {
    const labels = firstValueFrom(service.getLabels());
    httpTestingController.expectOne(labelUrl).flush([label]);
    expect(await labels).toEqual([label]);
  });

  it("Should add a label", async () => {
    const added = firstValueFrom(service.addLabel("Courses"));
    const request = httpTestingController.expectOne(labelUrl);
    expect(request.request.method).toBe("POST");
    expect(request.request.body).toEqual({ newLabel: "Courses" });
    request.flush(label, { status: 201, statusText: "Created" });
    expect(await added).toEqual(label);
  });

  it("Should delete a label", async () => {
    const deleted = firstValueFrom(service.deleteLabel(1));
    const request = httpTestingController.expectOne(`${labelUrl}/1`);
    expect(request.request.method).toBe("DELETE");
    request.flush(null, { status: 204, statusText: "No Content" });
    await expect(deleted).resolves.toBeNull();
  });
});
