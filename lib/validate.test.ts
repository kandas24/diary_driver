import { describe, expect, it } from "vitest";
import { parseBody, validateTrip } from "./validate";

const good = {
  start: "2026-10-02T10:00:00+05:00",
  end: "2026-10-02T10:25:00+05:00",
  amount: 2000,
  payment: "card",
  commission: 300,
};

describe("validateTrip", () => {
  it("rejects zero, negative and non-finite amounts", () => {
    for (const amount of [0, -5, NaN, Infinity]) {
      const r = validateTrip({ ...good, amount });
      expect("error" in r, `amount ${String(amount)}`).toBe(true);
    }
  });

  it("rejects end before start including cross-tz", () => {
    expect("error" in validateTrip({ ...good, end: good.start })).toBe(true);
    expect(
      "error" in
        validateTrip({
          ...good,
          start: "2026-10-02T10:00:00+05:00",
          end: "2026-10-02T06:00:00+01:00",
        })
    ).toBe(true);
  });

  it("rejects bad payment and bad commission", () => {
    expect("error" in validateTrip({ ...good, payment: "crypto" })).toBe(true);
    expect("error" in validateTrip({ ...good, commission: -1 })).toBe(true);
    expect("error" in validateTrip({ ...good, commission: NaN })).toBe(true);
  });

  it("defaults missing commission to 0 and generates id", () => {
    const { start, end, amount, payment } = good;
    const r = validateTrip({ start, end, amount, payment });
    expect("trip" in r).toBe(true);
    if ("trip" in r) {
      expect(r.trip.commission).toBe(0);
      expect(r.trip.id).toMatch(/^[0-9a-f]{8}$/);
    }
  });
});

describe("parseBody", () => {
  it("strips BOM and parses", () => {
    expect(parseBody("\uFEFF" + JSON.stringify(good))).toEqual(good);
  });

  it("throws on garbage", () => {
    expect(() => parseBody("{nope")).toThrow();
  });
});