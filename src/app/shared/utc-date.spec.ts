import { describe, expect, it } from "vitest";
import { formatDateWithOffsetToUtc } from "./utc-date";

describe("Date utils", () => {
  it("Should shift the date by the timezone offset, so that its UTC day stays the same", () => {
    const date = new Date(2022, 8, 9);
    const utcDate = formatDateWithOffsetToUtc(date);

    // Written without negation, as the offset is 0 in UTC and -0 is not equal to 0
    expect(date.getTime() - utcDate.getTime()).toEqual(date.getTimezoneOffset() * 60 * 1000);
    expect(utcDate.toISOString().slice(0, 10)).toBe("2022-09-09");
    // The given date is not modified
    expect(date).toEqual(new Date(2022, 8, 9));
  });
});
