import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadTrips } from "./store";

describe("loadTrips", () => {
  it("returns [] for missing file", () => {
    process.env.TRIPS_FILE = join(mkdtempSync(join(tmpdir(), "diary-")), "nope.json");
    expect(loadTrips()).toEqual([]);
  });

  it("returns [] for corrupt non-array content", () => {
    const file = join(mkdtempSync(join(tmpdir(), "diary-")), "trips.json");
    writeFileSync(file, '{"a": 1}', "utf-8");
    process.env.TRIPS_FILE = file;
    expect(loadTrips()).toEqual([]);
  });
});