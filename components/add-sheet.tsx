"use client";

import { useEffect, useState } from "react";
import { Banknote, Plus, Tag } from "lucide-react";
import type { Dict as T, Lang } from "../lib/i18n";
import { errorText } from "../lib/errors";
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
  lang,
  onAdded,
}: {
  t: T;
  lang: Lang;
  onAdded: (note: "saved" | "dupe") => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState("card");
  const [id, setId] = useState("");
  const [amount, setAmount] = useState("");
  const [commission, setCommission] = useState("");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function submit(range: {
    startDate: Date | null;
    endDate: Date | null;
    startTime?: string;
    endTime?: string;
  }) {
    setError("");
    const start = range.startDate;
    const end = range.endDate;
    if (!start || !end) {
      setError(t.errorDates);
      return;
    }
    const withTime = (d: Date, hhmm?: string) => {
      if (!hhmm) return d;
      const [h, m] = hhmm.split(":").map(Number);
      const out = new Date(d);
      out.setHours(h, m, 0, 0);
      return out;
    };
    const localIso = (d: Date) => {
      const off = d.getTimezoneOffset();
      const sign = off > 0 ? "+" : "-";
      const pad = (n: number) => String(Math.abs(n)).padStart(2, "0");
      return (
        d.getFullYear() +
        "-" +
        pad(d.getMonth() + 1) +
        "-" +
        pad(d.getDate()) +
        "T" +
        pad(d.getHours()) +
        ":" +
        pad(d.getMinutes()) +
        ":" +
        pad(d.getSeconds()) +
        sign +
        pad(Math.floor(off / 60)) +
        ":" +
        pad(off % 60)
      );
    };
    const body: Record<string, unknown> = {
      start: localIso(withTime(start, range.startTime)),
      end: localIso(withTime(end, range.endTime)),
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
      setError(errorText(data && (data as { error?: unknown }).error, lang));
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
      <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
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
              locale={lang === "kk" ? "kk-KZ" : lang === "ru" ? "ru-RU" : "en-US"}
              weekdays={t.weekdays.split(",")}
              selectDateText={t.selectDate}
              selectTimeText={t.selectTime}
              startLabel={t.startDate}
              endLabel={t.endDate}
              eventText={t.eventPrefix}
              onSchedule={(d) => {
                if (amount === "") {
                  setError(t.errorAmount);
                  return;
                }
                submit({ startDate: d.startDate, endDate: d.endDate });
              }}
              onCancel={() => setOpen(false)}
              underCalendar={(range) => (
                <div className="space-y-3">
                  <div>
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
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="btn-secondary flex-1"
                      onClick={() => setOpen(false)}
                    >
                      {t.close}
                    </button>
                    <button
                      type="button"
                      className="btn-primary flex-1"
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