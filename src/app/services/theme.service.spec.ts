import { TestBed } from "@angular/core/testing";
import { ThemeService } from "./theme.service";

describe("ThemeService", () => {
  afterEach(() => {
    localStorage.removeItem("preferredTheme");
    document.body.classList.remove("dark-mode");
  });

  it("Should use the light theme by default", () => {
    const service = TestBed.inject(ThemeService);
    expect(service.isDarkMode()).toEqual(false);
    expect(document.body.classList).not.toContain("dark-mode");
  });

  it("Should apply the theme saved in the storage", () => {
    localStorage.setItem("preferredTheme", "dark");
    const service = TestBed.inject(ThemeService);
    expect(service.isDarkMode()).toEqual(true);
    expect(document.body.classList).toContain("dark-mode");
  });

  it("Should switch between the light and dark themes", () => {
    const service = TestBed.inject(ThemeService);

    service.selectDarkMode(true);
    expect(service.isDarkMode()).toEqual(true);
    expect(localStorage.getItem("preferredTheme")).toEqual("dark");
    expect(document.body.classList).toContain("dark-mode");

    service.selectDarkMode(false);
    expect(service.isDarkMode()).toEqual(false);
    expect(localStorage.getItem("preferredTheme")).toEqual("light");
    expect(document.body.classList).not.toContain("dark-mode");
  });
});
