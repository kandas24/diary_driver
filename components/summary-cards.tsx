import type { Summary } from "../lib/summary";
import type { Dict as T } from "../lib/i18n";

export default function SummaryCards({ summary, t }: { summary: Summary; t: T }) {
  const cards: Array<{ label: string; value: string | number; hero?: boolean }> = [
    { label: t.count, value: summary.count },
    { label: t.revenue, value: summary.revenue },
    { label: t.commissionLabel, value: summary.commission },
    { label: t.net, value: summary.net, hero: true },
    { label: `${summary.cash.count} ${t.cashTrips}`, value: summary.cash.total },
    { label: `${summary.card.count} ${t.cardTrips}`, value: summary.card.total },
  ];
  return (
    <>
      <ul className="bento" aria-live="polite">
        {cards.map((card) => (
          <li
            key={card.label}
            className={(card.hero ? "card hero" : "card") + " span-2"}
          >
            <b>{card.value}</b>
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