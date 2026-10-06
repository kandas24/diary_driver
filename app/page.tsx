"use client";

import { useCallback, useEffect, useState } from "react";

import { STRINGS, type Lang } from "../lib/i18n";
import { loadDay, loadRange, today } from "../lib/day";
import type { Summary, Trip } from "../lib/summary";
import AddSheet from "../components/add-sheet";
import DatePicker from "../components/date-picker";
import LangToggle from "../components/lang-toggle";
import SummaryCards from "../components/summary-cards";
import TripsTable from "../components/trips-table";
import WeekChart, { type WeekPoint } from "../components/week-chart";
import EtchedAccretion from "../components/ui/etched-accretion";

function weekEnding(date: string): string[] {
  const out: string[] = [];
  const end = new Date(date + "T12:00:00");
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    out.push(d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"));
  }
  return out;
}

export default function Page() {
  const [date, setDate] = useState(today);
  const [lang, setLang] = useState<Lang>("ru");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [week, setWeek] = useState<WeekPoint[]>([]);
  const [failed, setFailed] = useState(false);
  const [note, setNote] = useState("");

  const t = STRINGS[lang];
  const fontClass = lang === "kk" ? "kz-font" : "";

  const load = useCallback(async (d: string) => {
    setFailed(false);
    setNote("");
    try {
      const data = await loadDay(fetch, d);
      setTrips(data.trips);
      setSummary(data.summary);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("diary-lang");
    if (saved === "ru" || saved === "en" || saved === "kk") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("diary-lang", lang);
  }, [lang]);

  useEffect(() => {
    load(date);
  }, [date, load, lang]);

  useEffect(() => {
    const days = weekEnding(date);
    loadRange(fetch, days[0], days[days.length - 1])
      .then((data) => {
        const totals = new Map<string, number>();
        for (const trip of data.trips) {
          const day = trip.start.slice(0, 10);
          totals.set(day, (totals.get(day) ?? 0) + trip.amount);
        }
        setWeek(days.map((d) => ({ date: d, label: String(Number(d.slice(8, 10))), value: totals.get(d) ?? 0 })));
      })
      .catch(() => {
        setWeek([]);
      });
  }, [date]);

  return (
    <>
      <div className="bg-hole" aria-hidden>
        <EtchedAccretion preset="crimson" height="100vh" params={{ flare: 0.6 }} />
      </div>
      <main className={fontClass ? "wrap " + fontClass : "wrap"}>
        <div className="top">
          <div>
            <h1>{t.title}</h1>
            <p className="sub">{t.subtitle}</p>
          </div>
          <LangToggle lang={lang} onChange={setLang} />
        </div>
        <DatePicker date={date} onChange={setDate} />
        {summary && <SummaryCards summary={summary} t={t} />}
        {week.length > 0 && (
          <section className="panel" aria-label={t.week} style={{ marginBottom: "0.75rem" }}>
            <WeekChart data={week} selected={date} onSelect={setDate} />
          </section>
        )}
        <section className="panel" aria-label={t.trips}>
          <h2>{t.trips}</h2>
          {trips.length === 0 ? (
            <p className="empty">{t.emptyDay}</p>
          ) : (
            <TripsTable trips={trips} t={t} />
          )}
        </section>
        <div style={{ marginTop: "1rem" }}>
          <AddSheet
            t={t}
            lang={lang}
            onAdded={(n) => {
              setNote(n === "dupe" ? t.dupe : t.saved);
              load(date);
            }}
          />
        </div>
        {failed && (
          <div id="error" role="alert">
            {t.serverError}
          </div>
        )}
        {note && (
          <div id="ok" role="status">
            {note}
          </div>
        )}
      </main>
    </>
  );
}