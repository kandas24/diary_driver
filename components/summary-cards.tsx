import { plural } from "../lib/plural";
import type { Summary } from "../lib/summary";
import type { Dict as T, Lang } from "../lib/i18n";

export default function SummaryCards({
  summary,
  t,
  lang,
}: {
  summary: Summary;
  t: T;
  lang: Lang;
}) {
  const tripsWord = (n: number) => {
    if (lang === "kk") return plural(n, "тарих", "тарих", "тарих");
    if (lang === "en") return n === 1 ? "trip" : "trips";
    return plural(n, "поездка", "поездки", "поездок");
  };
  const cards: Array<{
    label: string;
    value: string | number;
    hero?: boolean;
    count?: number;
  }> = [
    { label: t.count, value: summary.count },
    { label: t.revenue, value: summary.revenue },
    { label: t.commissionLabel, value: summary.commission },
    { label: t.net, value: summary.net, hero: true },
    { label: t.cash, value: summary.cash.total, count: summary.cash.count },
    { label: t.card, value: summary.card.total, count: summary.card.count },
  ];
  return (
    <>
      <ul className="bento" aria-live="polite">
        {cards.map((card) => (
          <li
            key={card.label}
            className={(card.hero ? "card hero" : "card") + " span-2"}
          >
            <div className="card-value">
              <b>{card.value}</b>
              {card.count !== undefined && (
                <span className="card-count">
                  {card.count} {tripsWord(card.count)}
                </span>
              )}
            </div>
            <span>{card.label}</span>
          </li>
        ))}
      </ul>
      <p className="sub">
        {t.peak}: {summary.peak} · {t.low}: {summary.low} · {t.avg}: {summary.avg}
      </p>
    </>
  );
}