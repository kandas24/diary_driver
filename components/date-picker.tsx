"use client";

import { useMemo } from "react";
import { format, parse } from "date-fns";
import { ru, kk } from "date-fns/locale";
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
  const selected = useMemo(
    () => parse(date, "yyyy-MM-dd", new Date()),
    [date]
  );
  const locale = lang === "kk" ? kk : lang === "ru" ? ru : undefined;

  return (
    <div className="datepick">
      <Calendar
        mode="single"
        locale={locale}
        selected={selected}
        onSelect={(day) => {
          if (day) onChange(format(day, "yyyy-MM-dd"));
        }}
        autoFocus
      />
    </div>
  );
}