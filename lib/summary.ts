export type Payment = "cash" | "card";

export type Trip = {
  id: string;
  start: string;
  end: string;
  amount: number;
  payment: Payment;
  commission: number;
};

export type Summary = {
  count: number;
  revenue: number;
  commission: number;
  net: number;
  cash: { count: number; total: number };
  card: { count: number; total: number };
  peak: number;
  low: number;
  avg: number;
};

export function calcSummary(trips: Trip[]): Summary {
  let cashCount = 0;
  let cashTotal = 0;
  let cardCount = 0;
  let cardTotal = 0;
  let revenue = 0;
  let commission = 0;
  const amounts: number[] = [];
  for (const t of trips) {
    revenue += t.amount;
    commission += t.commission;
    amounts.push(t.amount);
    if (t.payment === "cash") {
      cashCount += 1;
      cashTotal += t.amount;
    } else {
      cardCount += 1;
      cardTotal += t.amount;
    }
  }
  return {
    count: trips.length,
    revenue,
    commission,
    net: revenue - commission,
    cash: { count: cashCount, total: cashTotal },
    card: { count: cardCount, total: cardTotal },
    peak: amounts.length ? Math.max(...amounts) : 0,
    low: amounts.length ? Math.min(...amounts) : 0,
    avg: amounts.length ? Math.round((revenue / amounts.length) * 100) / 100 : 0,
  };
}