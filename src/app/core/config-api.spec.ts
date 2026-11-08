import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { environment } from "@environments/environment";
import { ConfigApi } from "./config-api";

describe("ConfigApi", () => {
  let service: ConfigApi;
  let httpTestingController: HttpTestingController;

  const configUrl = `${environment.backend_url}/cash-manager-config`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    service = TestBed.inject(ConfigApi);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("Should export the configuration as a file", async () => {
    const config = new Blob(["{}"], { type: "application/json" });
    const exportedConfig = firstValueFrom(service.exportConfig());
    const request = httpTestingController.expectOne(configUrl);
    expect(request.request.method).toBe("GET");
    expect(request.request.responseType).toBe("blob");
    request.flush(config);
    expect(await exportedConfig).toEqual(config);
  });

  it("Should import a configuration file", async () => {
    const file = new File(["{}"], "cashManagerData.json");
    const imported = firstValueFrom(service.importConfig(file));
    const request = httpTestingController.expectOne(configUrl);
    expect(request.request.method).toBe("POST");
    expect((request.request.body as FormData).get("file")).toEqual(file);
    request.flush(null, { status: 204, statusText: "No Content" });
    await expect(imported).resolves.toBeNull();
  });
});
