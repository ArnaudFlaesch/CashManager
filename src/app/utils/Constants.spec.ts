import { describe, expect, it } from "vitest";
import { getChartOptions } from "./Constants";

describe("Constants", () => {
  it("Should return chart options with colors matching the theme", () => {
    const lightOptions = getChartOptions(false);
    expect(lightOptions?.color).toEqual("#6b7280");
    expect(lightOptions?.scales?.["y"]?.grid?.color).toEqual("rgb(148 163 184 / 25%)");

    const darkOptions = getChartOptions(true);
    expect(darkOptions?.color).toEqual("#9ca3af");
    expect(darkOptions?.scales?.["y"]?.grid?.color).toEqual("rgb(148 163 184 / 15%)");
  });
});
