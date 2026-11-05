import { describe, expect, it } from "vitest";
import { DateFormatPipe } from "./date-format.pipe";

describe("DateFormatPipe", () => {
  const pipe = new DateFormatPipe();
  const date = new Date(2022, 2, 15, 10, 30);

  it("Should format a date, or its string, in the short french format", () => {
    expect(pipe.transform(date, "short")).toEqual("15/03/2022");
    expect(pipe.transform(date.toString(), "short")).toEqual("15/03/2022");
  });

  it("Should format a date, or its string, in the full format by default", () => {
    expect(pipe.transform(date)).toEqual(date.toLocaleString());
    expect(pipe.transform(date.toString())).toEqual(date.toLocaleString());
  });
});
