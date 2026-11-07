import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuHarness } from "@angular/material/menu/testing";
import { MatSlideToggleHarness } from "@angular/material/slide-toggle/testing";
import { Router } from "@angular/router";
import { environment } from "@environments/environment";
import { queryElement } from "@testing/dom";
import { ImportConfigModal } from "./import-config-modal/import-config-modal";
import { Role } from "@core/auth/role";
import { HttpErrorHandler } from "@core/http-error-handler";
import { Header } from "./header";

describe("Header", () => {
  let fixture: ComponentFixture<Header>;
  let loader: HarnessLoader;
  let httpTestingController: HttpTestingController;

  const exportConfigUrl = `${environment.backend_url}/cashManagerConfig/export`;

  /** The header reads the logged in user when it is created. */
  function createComponent(): void {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    fixture = TestBed.createComponent(Header);
    loader = TestbedHarnessEnvironment.loader(fixture);
    httpTestingController = TestBed.inject(HttpTestingController);
  }

  /** Opens the user menu, rendered in an overlay. */
  async function openUserMenu(): Promise<MatMenuHarness> {
    const menu = await loader.getHarness(MatMenuHarness.with({ selector: "#cashmanager-menu" }));
    await menu.open();
    return menu;
  }

  afterEach(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("preferredTheme");
    document.body.classList.remove("dark-mode");
    vi.restoreAllMocks();
    httpTestingController.verify();
  });

  it("Should only display the notifications to the administrators", async () => {
    createComponent();
    await fixture.whenStable();
    expect(queryElement(fixture, "cash-manager-notifications")).toBeNull();
  });

  it("Should display the notifications to an administrator", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ accessToken: "token", roles: [Role.ROLE_ADMIN] })
    );
    createComponent();
    // The notifications are loaded once rendered, the page is stable once they are received
    fixture.detectChanges();
    TestBed.tick();
    httpTestingController
      .expectOne(`${environment.backend_url}/notifications/`)
      .flush({ content: [] });
    await fixture.whenStable();

    expect(queryElement(fixture, "cash-manager-notifications")).not.toBeNull();
  });

  it("Should switch between light and dark mode", async () => {
    createComponent();
    await openUserMenu();
    const themeToggle =
      await TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(MatSlideToggleHarness);
    expect(await themeToggle.isChecked()).toBe(false);

    await themeToggle.toggle();
    expect(await themeToggle.isChecked()).toBe(true);
    expect(localStorage.getItem("preferredTheme")).toBe("dark");
    expect(document.body.classList).toContain("dark-mode");

    await themeToggle.toggle();
    expect(await themeToggle.isChecked()).toBe(false);
    expect(localStorage.getItem("preferredTheme")).toBe("light");
    expect(document.body.classList).not.toContain("dark-mode");
  });

  it("Should open the import configuration modal", async () => {
    createComponent();
    const openSpy = vi.spyOn(TestBed.inject(MatDialog), "open");
    const menu = await openUserMenu();
    await menu.clickItem({ selector: "#open-import-config-modal" });
    expect(openSpy).toHaveBeenCalledWith(ImportConfigModal, { width: "640px" });
  });

  it("Should download the configuration as a file", async () => {
    createComponent();
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    // jsdom does not implement the object URLs, nor the navigation triggered by a link
    vi.spyOn(URL, "createObjectURL").mockImplementation(() => "blob:config");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      expect(this.href).toBe("blob:config");
      expect(this.download).toBe("cashManagerData.json");
    });

    const menu = await openUserMenu();
    await menu.clickItem({ selector: "#download-config-button" });
    const config = new Blob(["{}"], { type: "application/json" });
    httpTestingController.expectOne(exportConfigUrl).flush(config);

    expect(URL.createObjectURL).toHaveBeenCalledWith(config);
    expect(clickSpy).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:config");
  });

  it("Should display an error when the configuration cannot be downloaded", async () => {
    createComponent();
    const handleErrorSpy = vi
      .spyOn(TestBed.inject(HttpErrorHandler), "handleError")
      .mockImplementation(() => undefined);

    const menu = await openUserMenu();
    await menu.clickItem({ selector: "#download-config-button" });
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

    const menu = await openUserMenu();
    await menu.clickItem({ selector: "#logout-button" });
    await fixture.whenStable();

    expect(localStorage.getItem("user")).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(["login"]);
  });
});
