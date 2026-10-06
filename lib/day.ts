import type { Summary, Trip } from "./summary";

export function today(now: Date = new Date()): string {
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + m + "-" + d;
}

export type DayData = { trips: Trip[]; summary: Summary };

type Fetcher = (url: string) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;

export async function loadDay(fetchJson: Fetcher, date: string): Promise<DayData> {
  const res = await fetchJson("/api/trips?date=" + date);
  if (!res.ok) throw new Error("bad status");
  const data = (await res.json()) as Partial<DayData>;
  if (!Array.isArray(data.trips) || typeof data.summary !== "object" || data.summary === null) {
    throw new Error("bad shape");
  }
  return { trips: data.trips, summary: data.summary };
}

export async function loadRange(fetchJson: Fetcher, from: string, to: string): Promise<DayData> {
  const res = await fetchJson("/api/trips?from=" + from + "&to=" + to);
  if (!res.ok) throw new Error("bad status");
  const data = (await res.json()) as Partial<DayData>;
  if (!Array.isArray(data.trips) || typeof data.summary !== "object" || data.summary === null) {
    throw new Error("bad shape");
  }
  return { trips: data.trips, summary: data.summary };
}