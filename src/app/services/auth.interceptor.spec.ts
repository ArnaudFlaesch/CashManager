import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "@environments/environment";
import { authInterceptor } from "./auth.interceptor";

describe("authInterceptor", () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.removeItem("user");
  });

  function sendRequest(url: string): string | null {
    http.get(url).subscribe();
    const request = httpTestingController.expectOne(url);
    request.flush({});
    return request.request.headers.get("Authorization");
  }

  it("Should add the bearer token to backend requests", () => {
    localStorage.setItem("user", JSON.stringify({ accessToken: "token" }));
    expect(sendRequest(`${environment.backend_url}/expense/`)).toEqual("Bearer token");
  });

  it("Should not add the token to authentication requests", () => {
    localStorage.setItem("user", JSON.stringify({ accessToken: "token" }));
    expect(sendRequest(`${environment.backend_url}/auth/login`)).toBeNull();
  });

  it("Should not add the token to other hosts", () => {
    localStorage.setItem("user", JSON.stringify({ accessToken: "token" }));
    expect(sendRequest("https://example.com/api")).toBeNull();
  });

  it("Should not add a header when the user is not logged in", () => {
    expect(sendRequest(`${environment.backend_url}/expense/`)).toBeNull();
  });

  it("Should send the request without a header when the stored user is corrupted", () => {
    localStorage.setItem("user", "{not json");
    expect(sendRequest(`${environment.backend_url}/expense/`)).toBeNull();
  });
});
