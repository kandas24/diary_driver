import { describe, expect, it } from "vitest";
import { plural, tripsLabel } from "./plural";

describe("plural", () => {
  it("picks russian form by last digits", () => {
    expect(plural(1, "поездка", "поездки", "поездок")).toBe("поездка");
    expect(plural(2, "поездка", "поездки", "поездок")).toBe("поездки");
    expect(plural(5, "поездка", "поездки", "поездок")).toBe("поездок");
    expect(plural(11, "поездка", "поездки", "поездок")).toBe("поездок");
    expect(plural(21, "поездка", "поездки", "поездок")).toBe("поездка");
    expect(plural(112, "поездка", "поездки", "поездок")).toBe("поездок");
  });

  it("labels trips per language", () => {
    expect(tripsLabel("ru", 1)).toBe("1 поездка");
    expect(tripsLabel("ru", 3)).toBe("3 поездки");
    expect(tripsLabel("ru", 7)).toBe("7 поездок");
    expect(tripsLabel("en", 1)).toBe("1 trip");
    expect(tripsLabel("en", 5)).toBe("5 trips");
    expect(tripsLabel("kk", 4)).toBe("4 тарих");
  });
});