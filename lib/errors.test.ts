import { describe, expect, it } from "vitest";
import { ERROR_TEXT, errorText } from "./errors";

const CODES = Object.keys(ERROR_TEXT.ru).sort();

describe("error text", () => {
  it("translates every validator code in all languages", () => {
    expect(Object.keys(ERROR_TEXT.en).sort()).toEqual(CODES);
    expect(Object.keys(ERROR_TEXT.kk).sort()).toEqual(CODES);
    for (const [lang, table] of Object.entries(ERROR_TEXT)) {
      for (const code of CODES) {
        expect(table[code], `${lang}:${code}`).toBeTruthy();
      }
    }
  });

  it("maps end must be after start to readable text", () => {
    expect(errorText("end must be after start", "ru")).toBe(
      "Окончание должно быть позже начала"
    );
    expect(errorText("end must be after start", "en")).toBe(
      "End must be later than start"
    );
  });

  it("never leaks a raw english code to ru users", () => {
    for (const code of CODES) {
      expect(errorText(code, "ru")).not.toBe(code);
    }
  });

  it("passes unknown codes through", () => {
    expect(errorText("something else", "en")).toBe("something else");
    expect(errorText(undefined, "en")).toBe("");
  });
});