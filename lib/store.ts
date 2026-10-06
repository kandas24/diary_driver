import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Trip } from "./summary";

export function dataFile(): string {
  const override = process.env.TRIPS_FILE;
  if (override) return override;
  return join(process.cwd(), "data", "trips.json");
}

export function loadTrips(): Trip[] {
  try {
    const parsed: unknown = JSON.parse(readFileSync(dataFile(), "utf-8"));
    return Array.isArray(parsed) ? (parsed as Trip[]) : [];
  } catch {
    return [];
  }
}

export function saveTrips(trips: Trip[]): void {
  writeFileSync(dataFile(), JSON.stringify(trips, null, 2), "utf-8");
}