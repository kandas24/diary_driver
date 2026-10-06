"use client";

import { useState } from "react";
import { Banknote, Plus, Tag } from "lucide-react";
import type { Dict as T } from "../lib/i18n";
import { MeetingScheduler } from "./ui/meeting-scheduler";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function AddSheet({
  t,
  onAdded,
}: {
  t: T;
  onAdded: (note: "saved" | "dupe") => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState("card");
  const [id, setId] = useState("");
  const [amount, setAmount] = useState("");
  const [commission, setCommission] = useState("");

  async function submit(range: { startDate: Date | null; endDate: Date | null }) {
    setError("");
    const start = range.startDate;
    const end = range.endDate;
    if (!start || !end) {
      setError(t.errorDates);
      return;
    }
    const body: Record<string, unknown> = {
      start: start.toISOString(),
      end: end.toISOString(),
      amount: Number(amount),
      payment,
    };
    if (id) body.id = id;
    if (commission !== "") body.commission = Number(commission);
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
    setAmount("");
    setCommission("");
    setId("");
  }

  return (
    <>
      <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        {t.addTrip}
      </button>
      {open && (
        <div className="sheet-back" onClick={() => setOpen(false)}>
          <div
            className="sheet sheet-plain"
            role="dialog"
            aria-modal="true"
            aria-label={t.addTrip}
            onClick={(e) => e.stopPropagation()}
          >
            <MeetingScheduler
              title={t.addTrip}
              description={t.sheetHint}
              scheduleButtonText={t.add}
              cancelButtonText={t.close}
              showFooter={false}
              onSchedule={(d) => {
                if (amount === "") {
                  setError(t.errorAmount);
                  return;
                }
                submit({ startDate: d.startDate, endDate: d.endDate });
              }}
              onCancel={() => setOpen(false)}
              underCalendar={(range) => (
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <div className="flex-1">
                    <span className="text-sm font-medium">{t.idOptional}</span>
                    <div className="mt-2">
                      <Input
                        type="text"
                        autoComplete="off"
                        value={id}
                        placeholder={t.idPlaceholder}
                        onChange={(e) => setId(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 md:w-auto">
                    <button
                      type="button"
                      className="btn-secondary md:w-32"
                      onClick={() => setOpen(false)}
                    >
                      {t.close}
                    </button>
                    <button
                      type="button"
                      className="btn-primary md:w-32"
                      onClick={() => {
                        if (amount === "") {
                          setError(t.errorAmount);
                          return;
                        }
                        submit(range);
                      }}
                    >
                      {t.add}
                    </button>
                  </div>
                </div>
              )}
            >
              <div className="space-y-4 pt-4">
                <div>
                  <span className="text-sm font-medium">{t.amount}</span>
                  <div className="relative mt-2">
                    <Banknote className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      step="any"
                      value={amount}
                      placeholder={t.amountPlaceholder}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <span id="pay-label" className="text-sm font-medium">
                    {t.payMethod}
                  </span>
                  <div className="mt-2">
                    <Select value={payment} onValueChange={setPayment}>
                      <SelectTrigger aria-labelledby="pay-label">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">{t.card}</SelectItem>
                        <SelectItem value="cash">{t.cash}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">{t.commissionOptional}</span>
                  <div className="relative mt-2">
                    <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={commission}
                      placeholder={t.commissionPlaceholder}
                      onChange={(e) => setCommission(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                {error && (
                  <div id="error" role="alert">
                    {error}
                  </div>
                )}
              </div>
            </MeetingScheduler>
          </div>
        </div>
      )}
    </>
  );
}