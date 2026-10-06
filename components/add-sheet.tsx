"use client";

import { useState } from "react";
import type { Dict as T } from "../lib/i18n";

export default function AddSheet({
  t,
  onAdded,
}: {
  t: T;
  onAdded: (note: "saved" | "dupe") => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const num = (k: string) => (String(f.get(k) ?? "") === "" ? undefined : Number(f.get(k)));
    const body: Record<string, unknown> = {
      start: String(f.get("start") ?? ""),
      end: String(f.get("end") ?? ""),
      amount: Number(f.get("amount")),
      payment: String(f.get("payment")),
    };
    const id = String(f.get("id") ?? "");
    if (id) body.id = id;
    const commission = num("commission");
    if (commission !== undefined) body.commission = commission;
    let res: Response;
    try {
      res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      setError(t.serverError);
      return;
    }
    const data = await res.json().catch(() => null);
    if (res.status === 400) {
      setError((data && data.error) || "error");
      return;
    }
    onAdded(res.status === 200 ? "dupe" : "saved");
    setOpen(false);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        {t.addTrip}
      </button>
      {open && (
        <div className="sheet-back" onClick={() => setOpen(false)}>
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t.addTrip}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={submit}>
              <label className="field">
                <span>{t.idOptional}</span>
                <input type="text" name="id" autoComplete="off" />
              </label>
              <label className="field">
                <span>{t.start}</span>
                <input type="datetime-local" name="start" required />
              </label>
              <label className="field">
                <span>{t.end}</span>
                <input type="datetime-local" name="end" required />
              </label>
              <label className="field">
                <span>{t.amount}</span>
                <input type="number" name="amount" min="1" step="any" required />
              </label>
              <label className="field">
                <span>{t.payment}</span>
                <select name="payment">
                  <option value="card">{t.card}</option>
                  <option value="cash">{t.cash}</option>
                </select>
              </label>
              <label className="field">
                <span>{t.commissionOptional}</span>
                <input type="number" name="commission" min="0" step="any" />
              </label>
              <button type="submit">{t.add}</button>
              <button type="button" className="ghost" onClick={() => setOpen(false)}>
                {t.close}
              </button>
              {error && (
                <div id="error" role="alert">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}