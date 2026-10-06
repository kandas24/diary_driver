import { randomUUID } from "node:crypto";
import type { Trip } from "./summary";

export function parseBody(raw: string): unknown {
  return JSON.parse(raw.replace(/^\uFEFF/, "") || "null");
}

export function validateTrip(data: unknown): { trip: Trip } | { error: string } {
  if (typeof data !== "object" || data === null) return { error: "body must be an object" };
  const d = data as Record<string, unknown>;
  const startRaw = d.start;
  const endRaw = d.end;
  if (typeof startRaw !== "string" || typeof endRaw !== "string") {
    return { error: "start/end must be ISO8601 datetimes" };
  }
  const startMs = Date.parse(startRaw);
  const endMs = Date.parse(endRaw);
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
    return { error: "start/end must be ISO8601 datetimes" };
  }
  if (!(endMs > startMs)) return { error: "end must be after start" };
  const amount = d.amount;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return { error: "amount must be > 0" };
  }
  if (d.payment !== "cash" && d.payment !== "card") {
    return { error: "payment must be cash or card" };
  }
  let commission: unknown = d.commission;
  if (commission === undefined) commission = 0;
  if (typeof commission !== "number" || !Number.isFinite(commission) || commission < 0) {
    return { error: "commission must be >= 0" };
  }
  let id = d.id;
  if (id === undefined || id === "") id = randomUUID().slice(0, 8);
  if (typeof id !== "string" || id === "") return { error: "id must be a string" };
  return {
    trip: {
      id,
      start: startRaw,
      end: endRaw,
      amount,
      payment: d.payment,
      commission,
    },
  };
}