import { DOCUMENT } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, it } from "vitest";
import { Theme } from "./theme";

describe("Theme", () => {
  const doc = () => TestBed.inject(DOCUMENT);
  const storage = () => doc().defaultView!.localStorage;

  afterEach(() => {
    storage().removeItem("preferredTheme");
    doc().body.classList.remove("dark-mode");
  });

  it("Should use the light theme by default", () => {
    const service = TestBed.inject(Theme);
    expect(service.isDarkMode()).toEqual(false);
    expect(doc().body.classList).not.toContain("dark-mode");
  });

  it("Should apply the theme saved in the storage", () => {
    storage().setItem("preferredTheme", "dark");
    const service = TestBed.inject(Theme);
    expect(service.isDarkMode()).toEqual(true);
    expect(doc().body.classList).toContain("dark-mode");
  });

  it("Should switch between the light and dark themes", () => {
    const service = TestBed.inject(Theme);

    service.selectDarkMode(true);
    expect(service.isDarkMode()).toEqual(true);
    expect(storage().getItem("preferredTheme")).toEqual("dark");
    expect(doc().body.classList).toContain("dark-mode");

    service.selectDarkMode(false);
    expect(service.isDarkMode()).toEqual(false);
    expect(storage().getItem("preferredTheme")).toEqual("light");
    expect(doc().body.classList).not.toContain("dark-mode");
  });
});
