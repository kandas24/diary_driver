"use client";

import { useMemo } from "react";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  parse,
  subMonths,
} from "date-fns";
import { ru, kk } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dict as T, Lang } from "../lib/i18n";

const WEEKDAYS: Record<Lang, string[]> = {
  ru: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
  en: ["mo", "tu", "we", "th", "fr", "sa", "su"],
  kk: ["дс", "ср", "бс", "ср", "жм", "сб", "жс"],
};

export default function DateStrip({
  date,
  lang,
  t,
  onChange,
}: {
  date: string;
  lang: Lang;
  t: T;
  onChange: (d: string) => void;
}) {
  const locale = lang === "kk" ? kk : lang === "ru" ? ru : undefined;
  const fmt = (pattern: string, d: Date) => format(d, pattern, { locale });
  const selected = useMemo(
    () => parse(date, "yyyy-MM-dd", new Date()),
    [date]
  );
  const weekStart = useMemo(() => {
    const day = selected.getDay();
    const shift = day === 0 ? -6 : 1 - day;
    return addDays(selected, shift);
  }, [selected]);

  const shift = (n: number) =>
    onChange(format(addDays(selected, n), "yyyy-MM-dd"));
  const monthShift = (n: number) =>
    onChange(format(n > 0 ? addMonths(selected, 1) : subMonths(selected, 1), "yyyy-MM-dd"));

  return (
    <div className="strip">
      <div className="strip-head">
        <button type="button" onClick={() => monthShift(-1)} aria-label={t.prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="strip-month">
          {fmt("LLLL yyyy", selected)}
        </span>
        <button type="button" onClick={() => monthShift(1)} aria-label={t.nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="strip-days">
        {Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map((d, i) => {
          const iso = format(d, "yyyy-MM-dd");
          const active = isSameDay(d, selected);
          const isToday = isSameDay(d, new Date());
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onChange(iso)}
              aria-pressed={active}
              className={active ? "day active" : isToday ? "day today" : "day"}
            >
              <span className="day-week">{WEEKDAYS[lang][i]}</span>
              <span className="day-num">{format(d, "d")}</span>
            </button>
          );
        })}
      </div>
      <div className="strip-nav">
        <button type="button" onClick={() => shift(-7)}>
          {t.prevWeek}
        </button>
        <button type="button" onClick={() => onChange(format(new Date(), "yyyy-MM-dd"))}>
          {t.today}
        </button>
        <button type="button" onClick={() => shift(7)}>
          {t.nextWeek}
        </button>
      </div>
    </div>
  );
}