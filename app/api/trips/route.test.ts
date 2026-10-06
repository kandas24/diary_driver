import { copyFileSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "./route";

const seed = join(process.cwd(), "data", "trips.json");

function req(url: string, init?: RequestInit): Request {
  return new Request(url, init);
}

function post(body: string): Request {
  return req("http://x/api/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

const good = {
  start: "2026-10-02T10:00:00+05:00",
  end: "2026-10-02T10:25:00+05:00",
  amount: 2000,
  payment: "card",
  commission: 300,
};

describe("trips route", () => {
  let file = "";

  beforeEach(() => {
    const dir = mkdtempSync(join(tmpdir(), "diary-"));
    file = join(dir, "trips.json");
    copyFileSync(seed, file);
    process.env.TRIPS_FILE = file;
  });

  it("returns empty summary for unknown day", async () => {
    const res = await GET(req("http://x/api/trips?date=2099-01-01"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.summary.count).toBe(0);
    expect(body.trips).toEqual([]);
  });

  it("creates a trip and persists it", async () => {
    const res = await POST(post(JSON.stringify({ ...good, id: "t-new" })));
    expect(res.status).toBe(201);
    const day = await (await GET(req("http://x/api/trips?date=2026-10-02"))).json();
    expect(day.summary.count).toBe(1);
    expect(day.summary.revenue).toBe(2000);
  });

  it("returns 200 without writing on duplicate id", async () => {
    const before = readFileSync(file, "utf-8");
    const res = await POST(post(JSON.stringify({ ...good, id: "t1" })));
    expect(res.status).toBe(200);
    expect(readFileSync(file, "utf-8")).toBe(before);
  });

  it("rejects invalid trips with 400", async () => {
    for (const patch of [{ amount: 0 }, { end: good.start }, { payment: "x" }]) {
      const res = await POST(post(JSON.stringify({ ...good, ...patch })));
      expect(res.status).toBe(400);
    }
  });

  it("creates two rows for two id-less posts", async () => {
    const a = await POST(post(JSON.stringify(good)));
    const b = await POST(post(JSON.stringify(good)));
    expect(a.status).toBe(201);
    expect(b.status).toBe(201);
    const day = await (await GET(req("http://x/api/trips?date=2026-10-02"))).json();
    expect(day.summary.count).toBe(2);
  });

  it("accepts BOM-prefixed body", async () => {
    const res = await POST(post("\uFEFF" + JSON.stringify({ ...good, id: "t-bom" })));
    expect(res.status).toBe(201);
  });

  it("rejects bad date with 400", async () => {
    const res = await GET(req("http://x/api/trips?date=nope"));
    expect(res.status).toBe(400);
  });
});