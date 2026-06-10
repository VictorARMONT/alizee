/**
 * Astrocartografía simplificada.
 * Usa signo solar (→ planeta regente) + hora de nacimiento (→ ángulo dominante)
 * para determinar qué líneas planetarias son más fuertes y mapearlas a ciudades.
 *
 * Sin ephemeris: personalización por combinación planeta-ángulo-elemento.
 * Resultado siempre determinista para los mismos datos de entrada.
 */

import type { SunSign } from "@/data/zodiac";
import type { ArchetypeKey } from "@/data/questions";

type Planet =
  | "sol" | "luna" | "mercurio" | "venus" | "marte"
  | "jupiter" | "saturno" | "urano" | "neptuno" | "pluton";

export type AstroAngle = "MC" | "ASC" | "DSC" | "IC";
type Element = "fuego" | "tierra" | "aire" | "agua";

/* ── Datos de planetas ── */

interface PlanetMeta {
  symbol: string;
  name: string;
}

const PLANETS: Record<Planet, PlanetMeta> = {
  sol:      { symbol: "☉", name: "Sol" },
  luna:     { symbol: "☽", name: "Luna" },
  mercurio: { symbol: "☿", name: "Mercurio" },
  venus:    { symbol: "♀", name: "Venus" },
  marte:    { symbol: "♂", name: "Marte" },
  jupiter:  { symbol: "♃", name: "Júpiter" },
  saturno:  { symbol: "♄", name: "Saturno" },
  urano:    { symbol: "♅", name: "Urano" },
  neptuno:  { symbol: "♆", name: "Neptuno" },
  pluton:   { symbol: "♇", name: "Plutón" },
};

/* ── Planeta regente por signo ── */

const SIGN_RULERS: Record<SunSign, Planet> = {
  aries:       "marte",
  tauro:       "venus",
  geminis:     "mercurio",
  cancer:      "luna",
  leo:         "sol",
  virgo:       "mercurio",
  libra:       "venus",
  escorpio:    "pluton",
  sagitario:   "jupiter",
  capricornio: "saturno",
  acuario:     "urano",
  piscis:      "neptuno",
};

const SIGN_ELEMENTS: Record<SunSign, Element> = {
  aries: "fuego", leo: "fuego", sagitario: "fuego",
  tauro: "tierra", virgo: "tierra", capricornio: "tierra",
  geminis: "aire", libra: "aire", acuario: "aire",
  cancer: "agua", escorpio: "agua", piscis: "agua",
};

/* ── Ángulo dominante según hora de nacimiento ── */

function getBirthAngle(timeStr: string): AstroAngle {
  const h = parseInt(timeStr.split(":")[0], 10);
  if (h >= 4 && h < 10) return "ASC";
  if (h >= 10 && h < 16) return "MC";
  if (h >= 16 && h < 22) return "DSC";
  return "IC";
}

export const ANGLE_LABELS: Record<AstroAngle, string> = {
  MC:  "Medio Cielo · carrera y reconocimiento",
  ASC: "Ascendente · nueva identidad y energía",
  DSC: "Descendente · vínculos y relaciones clave",
  IC:  "Fondo del Cielo · raíces y hogar verdadero",
};

/* ── Base de ciudades por planeta ── */

export interface AstroPlace {
  city: string;
  flag: string;
}

const PLANET_CITIES: Record<Planet, AstroPlace[]> = {
  sol: [
    { city: "Los Ángeles", flag: "🇺🇸" },
    { city: "Dubai",       flag: "🇦🇪" },
    { city: "Miami",       flag: "🇺🇸" },
    { city: "Roma",        flag: "🇮🇹" },
    { city: "Sydney",      flag: "🇦🇺" },
    { city: "Madrid",      flag: "🇪🇸" },
    { city: "Las Vegas",   flag: "🇺🇸" },
  ],
  luna: [
    { city: "Ámsterdam",    flag: "🇳🇱" },
    { city: "Estambul",     flag: "🇹🇷" },
    { city: "Vancouver",    flag: "🇨🇦" },
    { city: "Dublín",       flag: "🇮🇪" },
    { city: "Lisboa",       flag: "🇵🇹" },
    { city: "Buenos Aires", flag: "🇦🇷" },
    { city: "Kioto",        flag: "🇯🇵" },
  ],
  mercurio: [
    { city: "Nueva York",       flag: "🇺🇸" },
    { city: "Londres",          flag: "🇬🇧" },
    { city: "Berlín",           flag: "🇩🇪" },
    { city: "Viena",            flag: "🇦🇹" },
    { city: "Boston",           flag: "🇺🇸" },
    { city: "Singapur",         flag: "🇸🇬" },
    { city: "Barcelona",        flag: "🇪🇸" },
    { city: "Ciudad de México", flag: "🇲🇽" },
  ],
  venus: [
    { city: "París",          flag: "🇫🇷" },
    { city: "Roma",           flag: "🇮🇹" },
    { city: "Medellín",       flag: "🇨🇴" },
    { city: "Bali",           flag: "🇮🇩" },
    { city: "Florencia",      flag: "🇮🇹" },
    { city: "Praga",          flag: "🇨🇿" },
    { city: "Tulum",          flag: "🇲🇽" },
    { city: "Río de Janeiro", flag: "🇧🇷" },
  ],
  marte: [
    { city: "Ciudad de México", flag: "🇲🇽" },
    { city: "São Paulo",        flag: "🇧🇷" },
    { city: "Tel Aviv",         flag: "🇮🇱" },
    { city: "Chicago",          flag: "🇺🇸" },
    { city: "Berlín",           flag: "🇩🇪" },
    { city: "Seúl",             flag: "🇰🇷" },
    { city: "Montreal",         flag: "🇨🇦" },
  ],
  jupiter: [
    { city: "Dublín",      flag: "🇮🇪" },
    { city: "Ámsterdam",   flag: "🇳🇱" },
    { city: "Porto",       flag: "🇵🇹" },
    { city: "Florencia",   flag: "🇮🇹" },
    { city: "Austin",      flag: "🇺🇸" },
    { city: "Guadalajara", flag: "🇲🇽" },
    { city: "Budapest",    flag: "🇭🇺" },
    { city: "Nueva Delhi", flag: "🇮🇳" },
  ],
  saturno: [
    { city: "Ginebra",   flag: "🇨🇭" },
    { city: "Zúrich",    flag: "🇨🇭" },
    { city: "Frankfurt", flag: "🇩🇪" },
    { city: "Boston",    flag: "🇺🇸" },
    { city: "Seúl",      flag: "🇰🇷" },
    { city: "Bruselas",  flag: "🇧🇪" },
    { city: "Tokio",     flag: "🇯🇵" },
  ],
  urano: [
    { city: "San Francisco", flag: "🇺🇸" },
    { city: "Tokio",         flag: "🇯🇵" },
    { city: "Estocolmo",     flag: "🇸🇪" },
    { city: "Berlín",        flag: "🇩🇪" },
    { city: "Reikiavik",     flag: "🇮🇸" },
    { city: "Ámsterdam",     flag: "🇳🇱" },
    { city: "Seattle",       flag: "🇺🇸" },
  ],
  neptuno: [
    { city: "Bali",          flag: "🇮🇩" },
    { city: "Lisboa",        flag: "🇵🇹" },
    { city: "Nueva Orleans", flag: "🇺🇸" },
    { city: "Marrakech",     flag: "🇲🇦" },
    { city: "Kioto",         flag: "🇯🇵" },
    { city: "Tulum",         flag: "🇲🇽" },
    { city: "Mykonos",       flag: "🇬🇷" },
  ],
  pluton: [
    { city: "El Cairo",  flag: "🇪🇬" },
    { city: "Hong Kong", flag: "🇭🇰" },
    { city: "Tokio",     flag: "🇯🇵" },
    { city: "Chicago",   flag: "🇺🇸" },
    { city: "São Paulo", flag: "🇧🇷" },
    { city: "Moscú",     flag: "🇷🇺" },
  ],
};

/* ── Lógica de selección de ciudades ── */

/**
 * Picks N cities from a list, using a numeric seed for deterministic offset.
 * Seed keeps output personalized without randomness.
 */
function pick(cities: AstroPlace[], n: number, seed: number): AstroPlace[] {
  const offset = seed % Math.max(1, cities.length - n + 1);
  return cities.slice(offset, offset + n);
}

/** Simple hash from birth date string → stable seed integer */
function dateSeed(birthDate: string): number {
  return birthDate.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

/* ── Planetas "desafiantes" por elemento ── */

const CHALLENGING_BY_ELEMENT: Record<Element, Planet[]> = {
  fuego: ["saturno", "neptuno"],
  tierra: ["neptuno", "urano"],
  aire:   ["saturno", "pluton"],
  agua:   ["marte",   "saturno"],
};

/* ── Tipos de salida ── */

export interface AstroCategory {
  icon: string;
  label: string;
  planetSymbol: string;
  planetName: string;
  angle: AstroAngle;
  headline: string;
  places: AstroPlace[];
  note: string;
}

export interface AstrocartographyResult {
  rulingPlanetSymbol: string;
  rulingPlanetName: string;
  dominantAngle: AstroAngle;
  dominantAngleLabel: string;
  estudiar: AstroCategory;
  trabajar: AstroCategory;
  romance: AstroCategory;
  pareja: AstroCategory;
  vivir: AstroCategory;
  evitar: AstroCategory;
}

/* ── Función principal ── */

export function getAstrocartography(
  birthDate: string,
  birthTime: string,
  sunSign: SunSign | null,
  archetypeKey: ArchetypeKey,
): AstrocartographyResult {
  const seed    = dateSeed(birthDate);
  const angle   = getBirthAngle(birthTime);
  const element = sunSign ? SIGN_ELEMENTS[sunSign] : "fuego";
  const ruler   = sunSign ? SIGN_RULERS[sunSign] : "sol";

  const rp = PLANETS[ruler];

  // Archetype secondary planet influence
  const ARCHETYPE_PLANET: Record<ArchetypeKey, Planet> = {
    lider:      "sol",
    explorador: "jupiter",
    creador:    "mercurio",
    sabio:      "saturno",
  };
  const secondary = ARCHETYPE_PLANET[archetypeKey];

  // Each category picks from 2 planets (primary + secondary blend)
  // Offset by seed so cities differ per person

  const estudiar: AstroCategory = {
    icon: "◎",
    label: "Estudiar",
    planetSymbol: PLANETS.mercurio.symbol,
    planetName: "Mercurio",
    angle: "MC",
    headline: "Donde su mente opera al máximo",
    places: [
      ...pick(PLANET_CITIES.mercurio, 2, seed),
      ...pick(PLANET_CITIES.jupiter,  1, seed + 1),
    ],
    note: `Mercurio MC activa claridad intelectual y reconocimiento académico. ${rp.name} (su regente) añade profundidad al proceso de aprendizaje.`,
  };

  const trabajar: AstroCategory = {
    icon: "◆",
    label: "Trabajar",
    planetSymbol: PLANETS.sol.symbol,
    planetName: "Sol",
    angle: "MC",
    headline: "Donde su carrera tiene mayor proyección",
    places: [
      ...pick(PLANET_CITIES[ruler],    2, seed + 2),
      ...pick(PLANET_CITIES[secondary], 1, seed + 3),
    ],
    note: `${rp.name} MC (su regente natal) proyecta su nombre con autoridad. Lugares donde su arquetipo es reconocido y valorado.`,
  };

  // Romance & pareja depend on angle: DSC is the relationship descendant
  const romancePrimary: Planet = (element === "fuego" || element === "tierra") ? "venus" : "neptuno";
  const romance: AstroCategory = {
    icon: "♡",
    label: "Buscar pareja (citas)",
    planetSymbol: PLANETS[romancePrimary].symbol,
    planetName: PLANETS[romancePrimary].name,
    angle: "DSC",
    headline: "Donde el magnetismo personal se amplifica",
    places: [
      ...pick(PLANET_CITIES[romancePrimary], 2, seed + 4),
      ...pick(PLANET_CITIES.venus,           1, seed + 5),
    ],
    note: `${PLANETS[romancePrimary].name} DSC amplifica atracción y conexión. En estas ciudades el encuentro con personas afines es más probable.`,
  };

  const pareja: AstroCategory = {
    icon: "◈",
    label: "Buscar esposo / esposa",
    planetSymbol: PLANETS.jupiter.symbol,
    planetName: "Júpiter",
    angle: angle === "DSC" ? "DSC" : "ASC",
    headline: "Donde los vínculos duraderos nacen",
    places: [
      ...pick(PLANET_CITIES.jupiter, 2, seed + 6),
      ...pick(PLANET_CITIES.venus,   1, seed + 7),
    ],
    note: `Júpiter trae expansión y propósito al vínculo. Saturno da estructura. Ciudades donde los compromisos se construyen con raíces.`,
  };

  const vivirPrimary: Planet = (angle === "IC" || element === "agua") ? "luna" : "jupiter";
  const vivir: AstroCategory = {
    icon: "⌂",
    label: "Mudarse a vivir",
    planetSymbol: PLANETS[vivirPrimary].symbol,
    planetName: PLANETS[vivirPrimary].name,
    angle: "IC",
    headline: "Donde el cuerpo y el alma se sienten en casa",
    places: [
      ...pick(PLANET_CITIES[vivirPrimary], 2, seed + 8),
      ...pick(PLANET_CITIES.luna,          1, seed + 9),
    ],
    note: `${PLANETS[vivirPrimary].name} IC crea sensación real de pertenencia. No es turismo — es el lugar donde uno se despierta y reconoce el espacio como propio.`,
  };

  // Challenging: planets in tension with the element
  const challengingPlanets = CHALLENGING_BY_ELEMENT[element];
  const cp1 = challengingPlanets[0];
  const cp2 = challengingPlanets[1] ?? "marte";

  const evitar: AstroCategory = {
    icon: "⚠",
    label: "Lugares que limitan",
    planetSymbol: PLANETS[cp1].symbol,
    planetName: PLANETS[cp1].name,
    angle: "MC",
    headline: "Donde la energía fluye en contra",
    places: [
      ...pick(PLANET_CITIES[cp1], 2, seed + 10),
      ...pick(PLANET_CITIES[cp2], 1, seed + 11),
    ],
    note: `${PLANETS[cp1].name} y ${PLANETS[cp2].name} en tensión con ${element}. No es imposible vivir o trabajar ahí, pero el esfuerzo es mayor y el reconocimiento más lento.`,
  };

  return {
    rulingPlanetSymbol: rp.symbol,
    rulingPlanetName:   rp.name,
    dominantAngle:      angle,
    dominantAngleLabel: ANGLE_LABELS[angle],
    estudiar,
    trabajar,
    romance,
    pareja,
    vivir,
    evitar,
  };
}
