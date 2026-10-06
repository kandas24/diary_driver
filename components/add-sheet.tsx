"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Banknote, CalendarClock, Hash, Plus, Tag } from "lucide-react";
import type { Dict as T } from "../lib/i18n";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a89fa4]">
          {icon}
        </span>
        {children}
      </span>
    </label>
  );
}

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

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const num = (k: string) => (String(f.get(k) ?? "") === "" ? undefined : Number(f.get(k)));
    const body: Record<string, unknown> = {
      start: String(f.get("start") ?? ""),
      end: String(f.get("end") ?? ""),
      amount: Number(f.get("amount")),
      payment,
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
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button type="button" size="lg" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t.addTrip}
        </Button>
      </motion.div>
      {open && (
        <div className="sheet-back" onClick={() => setOpen(false)}>
          <motion.div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t.addTrip}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <form onSubmit={submit}>
              <Field label={t.idOptional} icon={<Hash className="h-4 w-4" />}>
                <Input type="text" name="id" autoComplete="off" className="pl-9" />
              </Field>
              <Field label={t.start} icon={<CalendarClock className="h-4 w-4" />}>
                <Input type="datetime-local" name="start" required className="pl-9" />
              </Field>
              <Field label={t.end} icon={<CalendarClock className="h-4 w-4" />}>
                <Input type="datetime-local" name="end" required className="pl-9" />
              </Field>
              <Field label={t.amount} icon={<Banknote className="h-4 w-4" />}>
                <Input type="number" name="amount" min="1" step="any" required className="pl-9" />
              </Field>
              <div className="field">
                <span id="pay-label">{t.payment}</span>
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
              <Field label={t.commissionOptional} icon={<Tag className="h-4 w-4" />}>
                <Input type="number" name="commission" min="0" step="any" className="pl-9" />
              </Field>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full">
                  {t.add}
                </Button>
              </motion.div>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                {t.close}
              </Button>
              {error && (
                <div id="error" role="alert">
                  {error}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}