"use client";

import { useCallback, useEffect, useState } from "react";
import { STRINGS, type Lang } from "../lib/i18n";
import { loadDay, today } from "../lib/day";
import type { Summary, Trip } from "../lib/summary";
import AddSheet from "../components/add-sheet";
import LangToggle from "../components/lang-toggle";
import SummaryCards from "../components/summary-cards";
import TripTimeline from "../components/trip-timeline";

export default function Page() {
  const [date, setDate] = useState(today);
  const [lang, setLang] = useState<Lang>("ru");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [failed, setFailed] = useState(false);
  const [note, setNote] = useState("");

  const t = STRINGS[lang];

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
    if (saved === "ru" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("diary-lang", lang);
  }, [lang]);

  useEffect(() => {
    load(date);
  }, [date, load, lang]);

  return (
    <main className="wrap">
      <div className="top">
        <div>
          <h1>{t.title}</h1>
          <p className="sub">{t.subtitle}</p>
        </div>
        <LangToggle lang={lang} onChange={setLang} />
      </div>
      <div className="dayrow">
        <label htmlFor="day">{t.day}</label>
        <input id="day" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      {summary && <SummaryCards summary={summary} t={t} />}
      <section className="panel" aria-label={t.trips}>
        <h2>{t.trips}</h2>
        <TripTimeline trips={trips} t={t} />
      </section>
      <div style={{ marginTop: "1rem" }}>
        <AddSheet
          t={t}
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
  );
}