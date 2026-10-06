"use client";

import { useMemo } from "react";
import LineGraphStatistics, { type SeriesPoint } from "./ui/line-graph-statistics";
import type { Dict as T, Lang } from "../lib/i18n";
import { ru, kk } from "date-fns/locale";
import { format, parse } from "date-fns";

export type WeekPoint = {
  date: string;
  label: string;
  value: number;
  trips: number;
};

export default function WeekChart({
  data,
  selected,
  lang,
  t,
  onSelect,
}: {
  data: WeekPoint[];
  selected: string;
  lang: Lang;
  t: T;
  onSelect: (date: string) => void;
}) {
  const locale = lang === "kk" ? kk : lang === "ru" ? ru : undefined;

  const series = useMemo<SeriesPoint>(() => {
    const revenue = data.map((d) => d.value);
    const trips = data.map((d) => d.trips);
    const peak = Math.max(1, ...revenue);
    const average = Math.round(
      revenue.reduce((a, b) => a + b, 0) / Math.max(revenue.length, 1)
    );
    const first = revenue[0] ?? 0;
    const last = revenue[revenue.length - 1] ?? 0;
    const growth =
      first > 0
        ? `${last >= first ? "+" : "-"}${Math.abs(Math.round(((last - first) / first) * 100))}%`
        : "0%";
    return {
      dates: data.map((d) => {
        const day = parse(d.date, "yyyy-MM-dd", new Date());
        return format(day, "d MMM", { locale });
      }),
      revenue,
      trips,
      peak,
      average,
      growth,
    };
  }, [data, locale]);

  const selectedIndex = Math.max(
    0,
    data.findIndex((p) => p.date === selected)
  );

  return (
    <LineGraphStatistics
      data={series}
      labels={{
        heading: t.weekRevenue,
        subheading: t.weekRevenueSub,
        revenue: t.revenue,
        trips: t.tripsCount,
        peak: t.peak,
        average: t.avg,
        growth: t.growth,
        weekTotal: t.weekTotal,
      }}
      selectedIndex={selectedIndex}
      onSelect={(label) => {
        const idx = series.dates.indexOf(label);
        if (idx >= 0) onSelect(data[idx].date);
      }}
    />
  );
}