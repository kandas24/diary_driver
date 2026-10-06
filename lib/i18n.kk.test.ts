import { describe, expect, it } from "vitest";
import { STRINGS } from "./i18n";

const RU_WORDS = [
  "Тарих",
  "Наличные",
  "Комиссия",
  "Поездка",
  "Сумма",
  "Платеж",
  "Сегодня",
  "Неделя",
  "Время",
];

describe("kazakh strings", () => {
  it("keeps russian words out of the kk dictionary", () => {
    const leaked: string[] = [];
    for (const [key, value] of Object.entries(STRINGS.kk)) {
      for (const word of RU_WORDS) {
        if (value.includes(word)) leaked.push(`${key}=${value}`);
      }
    }
    expect(leaked).toEqual([]);
  });

  it("uses sapar for trip and kolma-kol for cash", () => {
    expect(STRINGS.kk.trips).toBe("Сапарлар");
    expect(STRINGS.kk.addTrip).toBe("Сапар қосу");
    expect(STRINGS.kk.cash).toBe("Қолма-қол");
  });

  it("defines the same keys in every language", () => {
    const base = Object.keys(STRINGS.ru).sort();
    expect(Object.keys(STRINGS.en).sort()).toEqual(base);
    expect(Object.keys(STRINGS.kk).sort()).toEqual(base);
  });
});