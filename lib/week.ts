export function weekMondayToSunday(date: string): string[] {
  const out: string[] = [];
  const day = new Date(date + "T12:00:00");
  const shift = day.getDay() === 0 ? -6 : 1 - day.getDay();
  const monday = new Date(day);
  monday.setDate(monday.getDate() + shift);
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    out.push(
      d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
    );
  }
  return out;
}