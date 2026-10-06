"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format, parse } from "date-fns";
import { ru, kk } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Calendar } from "./ui/calendar";
import type { Lang } from "../lib/i18n";

export default function DatePicker({
  date,
  lang,
  onChange,
}: {
  date: string;
  lang: Lang;
  onChange: (d: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = useMemo(
    () => parse(date, "yyyy-MM-dd", new Date()),
    [date]
  );
  const locale = lang === "kk" ? kk : lang === "ru" ? ru : undefined;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="datepick" ref={ref}>
      <button
        type="button"
        className="datepick-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        <CalendarDays className="h-4 w-4" />
        <span>{format(selected, "d MMMM yyyy", { locale })}</span>
      </button>
      {open && (
        <div className="datepick-panel" role="dialog">
          <Calendar
            mode="single"
            locale={locale}
            selected={selected}
            onSelect={(day) => {
              if (day) {
                onChange(format(day, "yyyy-MM-dd"));
                setOpen(false);
              }
            }}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}