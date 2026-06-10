/**
 * Lookup local de signo solar (copy-padre.md sección D).
 * No usar API. El signo SOLO enriquece copy del dossier — nunca cambia
 * la recomendación de producto (eso lo decide el arquetipo).
 *
 * Si no hay fecha, getSunSign devuelve null y el dossier omite la sección
 * astral sin avisar que falta.
 */

export type SunSign =
  | "aries"
  | "tauro"
  | "geminis"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "escorpio"
  | "sagitario"
  | "capricornio"
  | "acuario"
  | "piscis";

export interface SunSignInfo {
  key: SunSign;
  name: string;
  /** Símbolo Unicode del signo */
  glyph: string;
  /** copy corto para el dossier en la revelación (lenguaje significado/ritual) */
  dossierBlurb: string;
  /** [TODO] Confirmar con fuente de numerología */
  luckyNumbers: number[];
}

interface ZodiacRange {
  sign: SunSign;
  /** mes 1-12, día 1-31 */
  fromMonth: number;
  fromDay: number;
  toMonth: number;
  toDay: number;
}

/** Rangos en orden cronológico desde aries. Capricornio cruza año. */
const RANGES: ZodiacRange[] = [
  { sign: "aries",       fromMonth: 3,  fromDay: 21, toMonth: 4,  toDay: 19 },
  { sign: "tauro",       fromMonth: 4,  fromDay: 20, toMonth: 5,  toDay: 20 },
  { sign: "geminis",     fromMonth: 5,  fromDay: 21, toMonth: 6,  toDay: 20 },
  { sign: "cancer",      fromMonth: 6,  fromDay: 21, toMonth: 7,  toDay: 22 },
  { sign: "leo",         fromMonth: 7,  fromDay: 23, toMonth: 8,  toDay: 22 },
  { sign: "virgo",       fromMonth: 8,  fromDay: 23, toMonth: 9,  toDay: 22 },
  { sign: "libra",       fromMonth: 9,  fromDay: 23, toMonth: 10, toDay: 22 },
  { sign: "escorpio",    fromMonth: 10, fromDay: 23, toMonth: 11, toDay: 21 },
  { sign: "sagitario",   fromMonth: 11, fromDay: 22, toMonth: 12, toDay: 21 },
  // Capricornio cruza año: 22 dic → 19 ene
  { sign: "capricornio", fromMonth: 12, fromDay: 22, toMonth: 1,  toDay: 19 },
  { sign: "acuario",     fromMonth: 1,  fromDay: 20, toMonth: 2,  toDay: 18 },
  { sign: "piscis",      fromMonth: 2,  fromDay: 19, toMonth: 3,  toDay: 20 },
];

export const SIGN_INFO: Record<SunSign, SunSignInfo> = {
  aries:       { key:"aries",       name:"Aries",       glyph:"♈", luckyNumbers:[1,8,17],   dossierBlurb:"Fuego que arranca. Empieza cosas y empuja al resto." },
  tauro:       { key:"tauro",       name:"Tauro",       glyph:"♉", luckyNumbers:[2,6,9],    dossierBlurb:"Tierra y constancia. Construye despacio y se queda." },
  geminis:     { key:"geminis",     name:"Géminis",     glyph:"♊", luckyNumbers:[5,7,14],   dossierBlurb:"Aire curioso. Conversa, conecta, abre puertas." },
  cancer:      { key:"cancer",      name:"Cáncer",      glyph:"♋", luckyNumbers:[2,3,15],   dossierBlurb:"Agua de hogar. Sostiene a los suyos sin pedir foco." },
  leo:         { key:"leo",         name:"Leo",         glyph:"♌", luckyNumbers:[1,3,10],   dossierBlurb:"Fuego luminoso. Brilla y hace brillar al de junto." },
  virgo:       { key:"virgo",       name:"Virgo",       glyph:"♍", luckyNumbers:[5,14,23],  dossierBlurb:"Tierra detallista. Pule, ordena, deja todo mejor de como estaba." },
  libra:       { key:"libra",       name:"Libra",       glyph:"♎", luckyNumbers:[6,15,24],  dossierBlurb:"Aire de equilibrio. Busca la forma justa." },
  escorpio:    { key:"escorpio",    name:"Escorpio",    glyph:"♏", luckyNumbers:[8,11,18],  dossierBlurb:"Agua profunda. Intensidad y lealtad sin medias tintas." },
  sagitario:   { key:"sagitario",   name:"Sagitario",   glyph:"♐", luckyNumbers:[3,7,9],    dossierBlurb:"Fuego que se mueve. Camino, sentido y horizonte." },
  capricornio: { key:"capricornio", name:"Capricornio", glyph:"♑", luckyNumbers:[4,8,13],   dossierBlurb:"Tierra que escala. Construye legados con paciencia." },
  acuario:     { key:"acuario",     name:"Acuario",     glyph:"♒", luckyNumbers:[4,7,11],   dossierBlurb:"Aire libre. Piensa distinto y abre caminos colectivos." },
  piscis:      { key:"piscis",      name:"Piscis",      glyph:"♓", luckyNumbers:[3,7,12],   dossierBlurb:"Agua intuitiva. Siente antes de ver y acompaña hondo." },
};

/**
 * Devuelve el signo solar para una fecha. Acepta:
 *  - Date
 *  - string ISO "YYYY-MM-DD" (formato del <input type="date">)
 *  - null/undefined (devuelve null)
 */
export function getSunSign(input: Date | string | null | undefined): SunSign | null {
  if (!input) return null;

  let month: number;
  let day: number;

  if (typeof input === "string") {
    // Esperamos "YYYY-MM-DD"; parse seguro sin TZ shifts
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
    if (!match) return null;
    month = parseInt(match[2], 10);
    day = parseInt(match[3], 10);
  } else {
    if (isNaN(input.getTime())) return null;
    month = input.getMonth() + 1;
    day = input.getDate();
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  for (const r of RANGES) {
    const crossesYear = r.fromMonth > r.toMonth; // p.ej. capricornio
    if (crossesYear) {
      if (
        (month === r.fromMonth && day >= r.fromDay) ||
        (month === r.toMonth && day <= r.toDay)
      ) {
        return r.sign;
      }
    } else {
      if (
        (month === r.fromMonth && day >= r.fromDay) ||
        (month === r.toMonth && day <= r.toDay) ||
        (month > r.fromMonth && month < r.toMonth)
      ) {
        return r.sign;
      }
    }
  }
  return null;
}
