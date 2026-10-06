import { NextResponse } from "next/server";
import { loadTrips, saveTrips } from "../../../lib/store";
import { calcSummary } from "../../../lib/summary";
import { parseBody, validateTrip } from "../../../lib/validate";

export const runtime = "nodejs";

export async function GET(req: Request): Promise<NextResponse> {
  const params = new URL(req.url).searchParams;
  const date = params.get("date") ?? "";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const isDay = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
  const all = loadTrips();
  if (from !== "" || to !== "") {
    if (!isDay(from) || !isDay(to) || to < from) {
      return NextResponse.json({ error: "from/to query params required, YYYY-MM-DD" }, { status: 400 });
    }
    const trips = all.filter((t) => {
      const day = t.start.slice(0, 10);
      return day >= from && day <= to;
    });
    return NextResponse.json({ from, to, trips, summary: calcSummary(trips) });
  }
  if (!isDay(date)) {
    return NextResponse.json({ error: "date query param required, YYYY-MM-DD" }, { status: 400 });
  }
  const trips = all.filter((t) => t.start.startsWith(date));
  return NextResponse.json({ date, trips, summary: calcSummary(trips) });
}

export async function POST(req: Request): Promise<NextResponse> {
  let data: unknown;
  try {
    data = parseBody(await req.text());
  } catch {
    return NextResponse.json({ error: "body must be JSON" }, { status: 400 });
  }
  const checked = validateTrip(data);
  if ("error" in checked) return NextResponse.json({ error: checked.error }, { status: 400 });
  const trips = loadTrips();
  const found = trips.find((t) => t.id === checked.trip.id);
  if (found) return NextResponse.json(found);
  trips.push(checked.trip);
  saveTrips(trips);
  return NextResponse.json(checked.trip, { status: 201 });
}