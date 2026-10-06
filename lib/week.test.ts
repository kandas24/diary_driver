import { describe, expect, it } from "vitest";
import { weekMondayToSunday } from "./week";

describe("week range", () => {
  it("keeps monday to sunday regardless of the picked day", () => {
    const fromMonday = weekMondayToSunday("2026-10-05");
    expect(fromMonday).toEqual([
      "2026-10-05",
      "2026-10-06",
      "2026-10-07",
      "2026-10-08",
      "2026-10-09",
      "2026-10-10",
      "2026-10-11",
    ]);
    expect(weekMondayToSunday("2026-10-08")).toEqual(fromMonday);
    expect(weekMondayToSunday("2026-10-11")).toEqual(fromMonday);
  });

  it("starts the week on monday for a sunday date", () => {
    expect(weekMondayToSunday("2026-10-11")[0]).toBe("2026-10-05");
  });

  it("crosses month boundaries", () => {
    expect(weekMondayToSunday("2026-11-03")).toEqual([
      "2026-11-02",
      "2026-11-03",
      "2026-11-04",
      "2026-11-05",
      "2026-11-06",
      "2026-11-07",
      "2026-11-08",
    ]);
  });
});