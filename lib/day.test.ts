import { describe, expect, it } from "vitest";
import { loadDay, loadRange, today } from "./day";

describe("today", () => {
  it("returns local calendar day as YYYY-MM-DD", () => {
    expect(today(new Date("2026-10-07T02:00:00+05:00"))).toBe("2026-10-07");
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("loadDay", () => {
  it("throws on non-ok response", async () => {
    const bad = () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    await expect(loadDay(bad, "2026-10-01")).rejects.toThrow();
  });

  it("throws on bad shape", async () => {
    const bad = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ error: "x" }) });
    await expect(loadDay(bad, "2026-10-01")).rejects.toThrow();
  });

  it("returns trips and summary on ok", async () => {
    const data = { trips: [], summary: { count: 0 } };
    const good = () => Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
    expect(await loadDay(good, "2026-10-01")).toEqual(data);
  });

  it("loads range on ok", async () => {
    const data = { trips: [{ id: "t1" }], summary: { count: 1 } };
    const good = () => Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
    expect(await loadRange(good, "2026-10-01", "2026-10-07")).toEqual(data);
  });

  it("range throws on non-ok", async () => {
    const bad = () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    await expect(loadRange(bad, "2026-10-01", "2026-10-07")).rejects.toThrow();
  });
});