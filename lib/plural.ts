export function plural(
  n: number,
  one: string,
  few: string,
  many: string
): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function tripsLabel(lang: string, n: number): string {
  if (lang === "kk") return n + " тарих";
  if (lang === "en") return n + (n === 1 ? " trip" : " trips");
  return n + " " + plural(n, "поездка", "поездки", "поездок");
}