import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatMenuHarness } from "@angular/material/menu/testing";
import { MatSlideToggleHarness } from "@angular/material/slide-toggle/testing";

import { HeaderActions } from "./header-actions";

describe("HeaderActions", () => {
  let fixture: ComponentFixture<HeaderActions>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    fixture = TestBed.createComponent(HeaderActions);
    loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();
  });

  async function openUserMenu(): Promise<MatMenuHarness> {
    const menu = await loader.getHarness(MatMenuHarness.with({ selector: "#cashmanager-menu" }));
    await menu.open();
    return menu;
  }

  it("Should display the theme and emit the toggled one", async () => {
    const darkModeToggledSpy = vi.spyOn(fixture.componentInstance.darkModeToggled, "emit");
    fixture.componentRef.setInput("isDarkMode", true);
    await openUserMenu();

    // The menu is rendered in an overlay, outside of the component
    const toggle =
      await TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(MatSlideToggleHarness);
    expect(await toggle.isChecked()).toBe(true);
    await toggle.toggle();

    expect(darkModeToggledSpy).toHaveBeenCalledWith(false);
  });

  it.each([
    ["#download-config-button", "configDownloadRequested"],
    ["#open-import-config-modal", "configImportRequested"],
    ["#logout-button", "logoutRequested"]
  ] as const)("Should emit when %s is clicked", async (selector, outputName) => {
    const outputSpy = vi.spyOn(fixture.componentInstance[outputName], "emit");
    const menu = await openUserMenu();

    await menu.clickItem({ selector });

    expect(outputSpy).toHaveBeenCalled();
  });
});
