import { describe, expect, it } from "vitest";
import { STRINGS } from "./i18n";

describe("i18n", () => {
  it("has matching ru and en keys", () => {
    const ru = Object.keys(STRINGS.ru).sort();
    const en = Object.keys(STRINGS.en).sort();
    expect(en).toEqual(ru);
    expect(ru.length).toBeGreaterThan(0);
  });
});