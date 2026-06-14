import { describe, it, expect } from "vitest";
import { getSunSign } from "@/data/zodiac";

describe("getSunSign", () => {
  it("null/invalid → null", () => {
    expect(getSunSign(null)).toBeNull();
    expect(getSunSign(undefined)).toBeNull();
    expect(getSunSign("no-es-fecha")).toBeNull();
  });

  it("límites de aries (21 mar – 19 abr)", () => {
    expect(getSunSign("2000-03-20")).toBe("piscis");
    expect(getSunSign("2000-03-21")).toBe("aries");
    expect(getSunSign("2000-04-19")).toBe("aries");
    expect(getSunSign("2000-04-20")).toBe("tauro");
  });

  it("capricornio cruza el año", () => {
    expect(getSunSign("2000-12-21")).toBe("sagitario");
    expect(getSunSign("2000-12-22")).toBe("capricornio");
    expect(getSunSign("2001-01-19")).toBe("capricornio");
    expect(getSunSign("2001-01-20")).toBe("acuario");
  });

  it("29 de febrero (bisiesto) → piscis", () => {
    expect(getSunSign("2000-02-29")).toBe("piscis");
  });

  it("acepta Date además de string ISO", () => {
    // mes 0-indexado en Date: 6 = julio
    expect(getSunSign(new Date(2000, 6, 25))).toBe("leo");
  });
});
