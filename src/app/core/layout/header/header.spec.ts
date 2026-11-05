import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { environment } from "@environments/environment";
import { ImportConfigModal } from "./import-config-modal/import-config-modal";
import { RoleEnum } from "@core/auth/role.enum";
import { ErrorHandlerService } from "@core/error-handler-service";
import { Header } from "./header";

describe("Header", () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let httpTestingController: HttpTestingController;

  const exportConfigUrl = `${environment.backend_url}/cashManagerConfig/export`;

  /** The header reads the logged in user when it is created. */
  function createComponent(): void {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("preferredTheme");
    vi.restoreAllMocks();
    httpTestingController.verify();
  });

  it("Should only display the notifications to the administrators", async () => {
    createComponent();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector("cash-manager-notifications")).toBeNull();
  });

  it("Should display the notifications to an administrator", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ accessToken: "token", roles: [RoleEnum.ROLE_ADMIN] })
    );
    createComponent();
    // The notifications are loaded once rendered, the page is stable once they are received
    fixture.detectChanges();
    TestBed.tick();
    httpTestingController
      .expectOne(`${environment.backend_url}/notifications/`)
      .flush({ content: [] });
    await fixture.whenStable();

    expect(component.canUserSeeNotifications()).toEqual(true);
    expect(fixture.nativeElement.querySelector("cash-manager-notifications")).not.toBeNull();
  });

  it("Should switch between light and dark mode", () => {
    createComponent();
    component.toggleTheme(true);
    expect(component.isDarkMode()).toEqual(true);
    expect(localStorage.getItem("preferredTheme")).toEqual("dark");
    component.toggleTheme(false);
    expect(component.isDarkMode()).toEqual(false);
    expect(localStorage.getItem("preferredTheme")).toEqual("light");
  });

  it("Should open the import configuration modal", () => {
    createComponent();
    const openSpy = vi.spyOn(TestBed.inject(MatDialog), "open");
    component.openImportConfigModal();
    expect(openSpy).toHaveBeenCalledWith(ImportConfigModal, { width: "640px" });
  });

  it("Should download the configuration as a file", () => {
    createComponent();
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    // jsdom does not implement the object URLs, nor the navigation triggered by a link
    URL.createObjectURL = vi.fn(() => "blob:config");
    URL.revokeObjectURL = vi.fn();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      expect(this.href).toEqual("blob:config");
      expect(this.download).toEqual("cashManagerData.json");
    });

    component.downloadConfig();
    const config = new Blob(["{}"], { type: "application/json" });
    httpTestingController.expectOne(exportConfigUrl).flush(config);

    expect(URL.createObjectURL).toHaveBeenCalledWith(config);
    expect(clickSpy).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:config");
  });

  it("Should display an error when the configuration cannot be downloaded", () => {
    createComponent();
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(ErrorHandlerService), "handleError")
      .mockImplementation(() => undefined);

    component.downloadConfig();
    httpTestingController
      .expectOne(exportConfigUrl)
      .flush(null, { status: 500, statusText: "Server error" });

    expect(handleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
      "Erreur lors de l'export de la configuration."
    );
  });

  it("Should log the user out and redirect to the login page", async () => {
    localStorage.setItem("user", JSON.stringify({ accessToken: "token", roles: [] }));
    createComponent();
    const navigateSpy = vi.spyOn(TestBed.inject(Router), "navigate").mockResolvedValue(true);

    await component.logout();

    expect(localStorage.getItem("user")).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(["login"]);
  });
});
