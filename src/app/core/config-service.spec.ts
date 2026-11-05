import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { environment } from "@environments/environment";
import { ConfigService } from "./config-service";

describe("ConfigService", () => {
  let service: ConfigService;
  let httpTestingController: HttpTestingController;

  const configUrl = `${environment.backend_url}/cashManagerConfig`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(ConfigService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("Should export the configuration as a file", async () => {
    const config = new Blob(["{}"], { type: "application/json" });
    const exportedConfig = firstValueFrom(service.exportConfig());
    const request = httpTestingController.expectOne(`${configUrl}/export`);
    expect(request.request.method).toEqual("GET");
    expect(request.request.responseType).toEqual("blob");
    request.flush(config);
    expect(await exportedConfig).toEqual(config);
  });

  it("Should import a configuration file", async () => {
    const file = new File(["{}"], "cashManagerData.json");
    const imported = firstValueFrom(service.importConfig(file));
    const request = httpTestingController.expectOne(`${configUrl}/import`);
    expect(request.request.method).toEqual("POST");
    expect((request.request.body as FormData).get("file")).toEqual(file);
    request.flush(true);
    expect(await imported).toEqual(true);
  });
});
