"use client";

import { useMemo } from "react";
import { format, parse } from "date-fns";
import { Calendar } from "./ui/calendar";

export default function DatePicker({
  date,
  onChange,
}: {
  date: string;
  onChange: (d: string) => void;
}) {
  const value = useMemo(() => {
    const day = parse(date, "yyyy-MM-dd", new Date());
    return { start: day, end: day };
  }, [date]);

  return (
    <div className="datepick">
      <Calendar
        horizontalLayout
        showTimeInput={false}
        value={value}
        onChange={(range) => {
          if (range?.start) onChange(format(range.start, "yyyy-MM-dd"));
        }}
      />
    </div>
  );
}