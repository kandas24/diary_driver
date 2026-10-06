import { describe, expect, it } from "vitest";
import { calcSummary } from "./summary";

const t1 = { id: "t1", start: "2026-10-01T08:10:00+05:00", end: "2026-10-01T08:32:00+05:00", amount: 2400, payment: "card" as const, commission: 360 };
const t2 = { id: "t2", start: "2026-10-01T09:05:00+05:00", end: "2026-10-01T09:20:00+05:00", amount: 1500, payment: "cash" as const, commission: 225 };

describe("calcSummary", () => {
  it("computes seed summary", () => {
    expect(calcSummary([t1, t2])).toEqual({
      count: 2,
      revenue: 3900,
      commission: 585,
      net: 3315,
      cash: { count: 1, total: 1500 },
      card: { count: 1, total: 2400 },
    });
  });

  it("returns zeros for empty day", () => {
    expect(calcSummary([])).toEqual({
      count: 0,
      revenue: 0,
      commission: 0,
      net: 0,
      cash: { count: 0, total: 0 },
      card: { count: 0, total: 0 },
    });
  });
});