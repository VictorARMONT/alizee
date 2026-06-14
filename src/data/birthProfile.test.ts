import { describe, it, expect } from "vitest";
import { getKinMaya, getChineseZodiac } from "@/data/birthProfile";

describe("getKinMaya (Cholq'ij, correlación GMT 584283)", () => {
  it("2012-12-21 = 4 Ajpu' (ancla verificada)", () => {
    const k = getKinMaya("2012-12-21");
    expect(k.sealIndex).toBe(19);
    expect(k.sealName).toBe("Ajpu'");
    expect(k.tone).toBe(4);
    expect(k.kin).toBe(160);
  });

  it("tono siempre en 1-13 y sello en 0-19", () => {
    for (const date of ["1950-01-01", "1985-07-15", "2000-02-29", "2024-06-21"]) {
      const k = getKinMaya(date);
      expect(k.tone).toBeGreaterThanOrEqual(1);
      expect(k.tone).toBeLessThanOrEqual(13);
      expect(k.sealIndex).toBeGreaterThanOrEqual(0);
      expect(k.sealIndex).toBeLessThanOrEqual(19);
      expect(k.kin).toBeGreaterThanOrEqual(1);
      expect(k.kin).toBeLessThanOrEqual(260);
    }
  });
});

describe("getChineseZodiac (corrección Año Nuevo Lunar)", () => {
  it("2024-02-10 (CNY exacto) = Dragón", () => {
    expect(getChineseZodiac("2024-02-10").key).toBe("dragon");
  });

  it("antes del Año Nuevo pertenece al año anterior", () => {
    // CNY 2020 = 25 ene. 20 ene 2020 aún es año del Cerdo (2019)
    expect(getChineseZodiac("2020-01-20").key).toBe("cerdo");
    // Después del 25 ene 2020 → Rata
    expect(getChineseZodiac("2020-02-01").key).toBe("rata");
  });
});
