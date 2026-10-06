import type { Summary } from "../lib/summary";
import type { Dict as T } from "../lib/i18n";

export default function SummaryCards({ summary, t }: { summary: Summary; t: T }) {
  const cards: Array<[string, string | number, boolean]> = [
    [t.count, summary.count, false],
    [t.revenue, summary.revenue, false],
    [t.commissionLabel, summary.commission, false],
    [t.net, summary.net, true],
    [t.cash, summary.cash.total + " / " + summary.cash.count, false],
    [t.card, summary.card.total + " / " + summary.card.count, false],
  ];
  return (
    <>
      <ul className="bento" aria-live="polite">
        {cards.map(([label, value, hero]) => (
          <li key={label} className={(hero ? "card hero" : "card") + " span-2"}>
            <b>{value}</b>
            <span>{label}</span>
          </li>
        ))}
      </ul>
      <p className="sub">
        {t.peak}: {summary.peak} · {t.low}: {summary.low} · {t.avg}: {summary.avg}
      </p>
    </>
  );
}