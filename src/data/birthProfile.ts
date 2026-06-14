/**
 * ALIZEE — Calculadora de perfil natal
 *
 * Sistemas:
 *   1. Signo solar       → zodiac.ts (existente)
 *   2. Animal chino      → ciclo 12 años con tabla de Año Nuevo Lunar exacta
 *   3. Cholq'ij maya     → conteo Tzolk'in AUTÉNTICO, correlación GMT 584283
 *                          (estándar académico). NO es Dreamspell/Argüelles.
 *
 * Human Design → necesita hora + lugar exactos (stub en fase 2).
 *
 * COPY PENDIENTE: places y advice son placeholder hasta que Victor entregue
 * lectura completa estilo terapeuta.
 */

/* ================================================================
   HELPERS COMPARTIDOS
   ================================================================ */

function dateToJDN(isoDate: string): number {
  const REF_JDN = 2451545; // JDN para 2000-01-01
  const refMs   = new Date("2000-01-01T12:00:00Z").getTime();
  const birthMs = new Date(isoDate + "T12:00:00Z").getTime();
  return REF_JDN + Math.round((birthMs - refMs) / 86_400_000);
}

/* ================================================================
   ZODÍACO CHINO
   Corrección lunar: tabla exacta de fechas del Año Nuevo Chino.
   Sin tabla → year-boundary es aproximado; con tabla → fiel al original.
   ================================================================ */

export type ChineseAnimalKey =
  | "rata" | "buey" | "tigre" | "conejo" | "dragon" | "serpiente"
  | "caballo" | "cabra" | "mono" | "gallo" | "perro" | "cerdo";

export interface ChineseZodiacInfo {
  key: ChineseAnimalKey;
  name: string;
  glyph: string;
  luckyNumbers: number[];
  places: string;
  advice: string;
}

const CHINESE_ANIMAL_ORDER: ChineseAnimalKey[] = [
  "rata","buey","tigre","conejo","dragon","serpiente",
  "caballo","cabra","mono","gallo","perro","cerdo",
];
const CHINESE_BASE_YEAR = 2020; // 2020 = Rata

/**
 * Fechas exactas del primer día del Año Nuevo Lunar (Gregoriano).
 * Fuente: Hong Kong Observatory / calendario astronómico.
 * Cubre 1924-2030 — suficiente para los casos de uso de ALIZEE.
 */
const CNY_DATES: Record<number, string> = {
  1924:"1924-02-05", 1925:"1925-01-24", 1926:"1926-02-13", 1927:"1927-02-02",
  1928:"1928-01-23", 1929:"1929-02-10", 1930:"1930-01-30", 1931:"1931-02-17",
  1932:"1932-02-06", 1933:"1933-01-26", 1934:"1934-02-14", 1935:"1935-02-04",
  1936:"1936-01-24", 1937:"1937-02-11", 1938:"1938-01-31", 1939:"1939-02-19",
  1940:"1940-02-08", 1941:"1941-01-27", 1942:"1942-02-15", 1943:"1943-02-05",
  1944:"1944-01-25", 1945:"1945-02-13", 1946:"1946-02-02", 1947:"1947-01-22",
  1948:"1948-02-10", 1949:"1949-01-29", 1950:"1950-02-17", 1951:"1951-02-06",
  1952:"1952-01-27", 1953:"1953-02-14", 1954:"1954-02-03", 1955:"1955-01-24",
  1956:"1956-02-12", 1957:"1957-01-31", 1958:"1958-02-18", 1959:"1959-02-08",
  1960:"1960-01-28", 1961:"1961-02-15", 1962:"1962-02-05", 1963:"1963-01-25",
  1964:"1964-02-13", 1965:"1965-02-02", 1966:"1966-01-21", 1967:"1967-02-09",
  1968:"1968-01-30", 1969:"1969-02-17", 1970:"1970-02-06", 1971:"1971-01-27",
  1972:"1972-02-15", 1973:"1973-02-03", 1974:"1974-01-23", 1975:"1975-02-11",
  1976:"1976-01-31", 1977:"1977-02-18", 1978:"1978-02-07", 1979:"1979-01-28",
  1980:"1980-02-16", 1981:"1981-02-05", 1982:"1982-01-25", 1983:"1983-02-13",
  1984:"1984-02-02", 1985:"1985-02-20", 1986:"1986-02-09", 1987:"1987-01-29",
  1988:"1988-02-17", 1989:"1989-02-06", 1990:"1990-01-27", 1991:"1991-02-15",
  1992:"1992-02-04", 1993:"1993-01-23", 1994:"1994-02-10", 1995:"1995-01-31",
  1996:"1996-02-19", 1997:"1997-02-07", 1998:"1998-01-28", 1999:"1999-02-16",
  2000:"2000-02-05", 2001:"2001-01-24", 2002:"2002-02-12", 2003:"2003-02-01",
  2004:"2004-01-22", 2005:"2005-02-09", 2006:"2006-01-29", 2007:"2007-02-18",
  2008:"2008-02-07", 2009:"2009-01-26", 2010:"2010-02-14", 2011:"2011-02-03",
  2012:"2012-01-23", 2013:"2013-02-10", 2014:"2014-01-31", 2015:"2015-02-19",
  2016:"2016-02-08", 2017:"2017-01-28", 2018:"2018-02-16", 2019:"2019-02-05",
  2020:"2020-01-25", 2021:"2021-02-12", 2022:"2022-02-01", 2023:"2023-01-22",
  2024:"2024-02-10", 2025:"2025-01-29", 2026:"2026-02-17", 2027:"2027-02-06",
  2028:"2028-01-26", 2029:"2029-02-13", 2030:"2030-02-03",
};

export const CHINESE_ZODIAC: Record<ChineseAnimalKey, ChineseZodiacInfo> = {
  rata:      { key:"rata",      name:"Rata",      glyph:"鼠", luckyNumbers:[2,3,7],   places:"// TODO", advice:"// TODO — copy terapeuta" },
  buey:      { key:"buey",      name:"Buey",      glyph:"牛", luckyNumbers:[1,4,8],   places:"// TODO", advice:"// TODO" },
  tigre:     { key:"tigre",     name:"Tigre",     glyph:"虎", luckyNumbers:[1,3,4],   places:"// TODO", advice:"// TODO" },
  conejo:    { key:"conejo",    name:"Conejo",    glyph:"兔", luckyNumbers:[3,4,6],   places:"// TODO", advice:"// TODO" },
  dragon:    { key:"dragon",    name:"Dragón",    glyph:"龙", luckyNumbers:[1,6,7],   places:"// TODO", advice:"// TODO" },
  serpiente: { key:"serpiente", name:"Serpiente", glyph:"蛇", luckyNumbers:[2,8,9],   places:"// TODO", advice:"// TODO" },
  caballo:   { key:"caballo",   name:"Caballo",   glyph:"马", luckyNumbers:[2,3,7],   places:"// TODO", advice:"// TODO" },
  cabra:     { key:"cabra",     name:"Cabra",     glyph:"羊", luckyNumbers:[2,7,9],   places:"// TODO", advice:"// TODO" },
  mono:      { key:"mono",      name:"Mono",      glyph:"猴", luckyNumbers:[4,7,9],   places:"// TODO", advice:"// TODO" },
  gallo:     { key:"gallo",     name:"Gallo",     glyph:"鸡", luckyNumbers:[5,7,8],   places:"// TODO", advice:"// TODO" },
  perro:     { key:"perro",     name:"Perro",     glyph:"狗", luckyNumbers:[3,4,9],   places:"// TODO", advice:"// TODO" },
  cerdo:     { key:"cerdo",     name:"Cerdo",     glyph:"猪", luckyNumbers:[2,5,8],   places:"// TODO", advice:"// TODO" },
};

/**
 * Retorna el animal chino con corrección de Año Nuevo Lunar.
 * Nacidos antes del primer día del Año Nuevo de su año calendario
 * pertenecen al año chino anterior.
 */
export function getChineseZodiac(birthDateISO: string): ChineseZodiacInfo {
  const year = new Date(birthDateISO + "T12:00:00Z").getUTCFullYear();
  const cnyDate = CNY_DATES[year];
  // Si la fecha cae antes del Año Nuevo Lunar de ese año → año chino anterior
  const effectiveYear = (cnyDate && birthDateISO < cnyDate) ? year - 1 : year;
  const idx = ((effectiveYear - CHINESE_BASE_YEAR) % 12 + 12) % 12;
  return CHINESE_ZODIAC[CHINESE_ANIMAL_ORDER[idx]];
}

/* ================================================================
   CHOLQ'IJ / TZOLK'IN MAYA — conteo auténtico (correlación GMT 584283)
   Estándar académico (Goodman–Martínez–Thompson). NO usa el sistema
   Dreamspell de Argüelles (que reancla en 1987 y descarta Feb 29).
   Aquí cada día gregoriano avanza el ciclo de 260 días sin excepciones,
   como lo cuentan los Ajq'ijab' (guías mayas) hasta hoy.
   Ancla verificada: JDN 584283 = "4 Ajaw" = 13.0.0.0.0 = 2012-12-21.
   Nombres de nahual y tono en K'iche' (no en español Dreamspell).
   ================================================================ */

export type KinColor = "rojo" | "blanco" | "azul" | "amarillo";

export interface KinMayaInfo {
  kin: number;        // 1–260
  sealIndex: number;  // 0–19
  sealName: string;
  tone: number;       // 1–13
  toneName: string;
  color: KinColor;
  glyph: string;
}

/**
 * Nombres de nahual en K'iche' (no Dreamspell). Mismo orden canónico que
 * NAHUALES en cholqij.ts — el índice 0-19 es la única fuente de verdad y ambos
 * módulos lo comparten. (Yucateco entre paréntesis para referencia.)
 */
const SEAL_NAMES: string[] = [
  "Imox",     // 0  (Imix)
  "Iq'",      // 1  (Ik')
  "Aq'ab'al", // 2  (Ak'b'al)
  "K'at",     // 3  (K'an)
  "Kan",      // 4  (Chikchan)
  "Keme",     // 5  (Kimi)
  "Kej",      // 6  (Manik')
  "Q'anil",   // 7  (Lamat)
  "Toj",      // 8  (Muluk)
  "Tz'i'",    // 9  (Ok)
  "B'atz'",   // 10 (Chuwen)
  "E",        // 11 (Eb')
  "Aj",       // 12 (Ben)
  "Ix",       // 13 (Ix)
  "Tz'ikin",  // 14 (Men)
  "Ajmaq",    // 15 (Kib')
  "No'j",     // 16 (Kab'an)
  "Tijax",    // 17 (Etz'nab')
  "Kawoq",    // 18 (Kawak)
  "Ajpu'",    // 19 (Ajaw)
];

// Color direccional auténtico maya: Este-rojo, Norte-blanco, Oeste-azul/negro,
// Sur-amarillo, ciclando por día-signo desde Imox. (Predate a Dreamspell.)
const SEAL_COLORS: KinColor[] = [
  "rojo","blanco","azul","amarillo",
  "rojo","blanco","azul","amarillo",
  "rojo","blanco","azul","amarillo",
  "rojo","blanco","azul","amarillo",
  "rojo","blanco","azul","amarillo",
];

/**
 * Glyphs únicos por sello — sin conflicto con elementos de marca (◆ ◈ ◉ ◊ ✦).
 * Sustituir con SVG oficial cuando Victor entregue assets.
 */
const SEAL_GLYPHS: string[] = [
  "⬡",  // 0  Imox
  "∿",  // 1  Iq'
  "☾",  // 2  Aq'ab'al
  "⬦",  // 3  K'at
  "∞",  // 4  Kan
  "▲",  // 5  Keme
  "✶",  // 6  Kej
  "★",  // 7  Q'anil
  "☽",  // 8  Toj
  "◯",  // 9  Tz'i'
  "✿",  // 10 B'atz'
  "⊙",  // 11 E       ← era ◆ (conflicto de marca — corregido)
  "▽",  // 12 Aj
  "◼",  // 13 Ix
  "◣",  // 14 Tz'ikin
  "◤",  // 15 Ajmaq
  "⊕",  // 16 No'j
  "⊗",  // 17 Tijax
  "❋",  // 18 Kawoq
  "☉",  // 19 Ajpu'
];

// Tonos 1-13 en K'iche' (numerales mayas). El Dreamspell los renombra
// (Magnético, Lunar…); esos nombres son invención de Argüelles, no tradición.
const TONE_NAMES: string[] = [
  "Jun",        // 1
  "Keb'",       // 2
  "Oxib'",      // 3
  "Kajib'",     // 4
  "Job'",       // 5
  "Waqib'",     // 6
  "Wuqub'",     // 7
  "Wajxaqib'",  // 8
  "B'elejeb'",  // 9
  "Lajuj",      // 10
  "Junlajuj",   // 11
  "Kab'lajuj",  // 12
  "Oxlajuj",    // 13
];

/**
 * Calcula el día del Cholq'ij (Tzolk'in) en el conteo AUTÉNTICO, correlación
 * GMT 584283 — el mismo que siguen los Ajq'ijab' mayas hoy. Cada día gregoriano
 * avanza el ciclo de 260 sin excepciones (sin "día fuera del tiempo").
 *
 * Verificación: JDN 584283 = "4 Ajaw" (13.0.0.0.0 = 2012-12-21). Su posición
 * dentro del ciclo 0-259 es 159; de ahí el ancla. Probado también contra
 * 2012-12-21 → 4 Ajpu' (tono 4, sello 19).
 *
 * Nota: `kin` (1-260) se conserva como "día del ciclo" para orden/render; el
 * concepto "Kin N" como tal es Dreamspell, así que la UI lo muestra como día
 * del Cholq'ij o como "tono + nahual" (forma K'iche' real).
 */
export function getKinMaya(birthDateISO: string): KinMayaInfo {
  const GMT_CORR  = 584283; // correlación Goodman–Martínez–Thompson
  const TZ_ANCHOR = 159;    // posición 0-259 de "4 Ajaw" (JDN 584283) en el ciclo

  const jdn   = dateToJDN(birthDateISO);
  const tzPos = (((jdn - GMT_CORR + TZ_ANCHOR) % 260) + 260) % 260;

  const kin       = tzPos + 1;        // día 1-260 del Cholq'ij
  const sealIndex = tzPos % 20;       // 0 Imox … 19 Ajpu'
  const tone      = (tzPos % 13) + 1; // 1-13

  return {
    kin,
    sealIndex,
    sealName:  SEAL_NAMES[sealIndex],
    tone,
    toneName:  TONE_NAMES[tone - 1],
    color:     SEAL_COLORS[sealIndex],
    glyph:     SEAL_GLYPHS[sealIndex],
  };
}

/* ================================================================
   HUMAN DESIGN (stub — necesita hora + lugar)
   ================================================================ */
export const HUMAN_DESIGN_PLACEHOLDER = {
  note: "Necesita hora y lugar exactos de nacimiento.",
  types: ["Generador","Generador Manifesto","Manifestador","Proyector","Reflector"],
} as const;

/* ================================================================
   ESTACIONES — hemisferio norte (México)
   ================================================================ */

export type SeasonKey = "primavera" | "verano" | "otono" | "invierno";

export interface SeasonProfile {
  key: SeasonKey;
  name: string;
  glyph: string;
  blurb: string;
}

const SEASONS: Record<SeasonKey, SeasonProfile> = {
  primavera: { key:"primavera", name:"Primavera", glyph:"◈", blurb:"Nacido al inicio. Energía de arranque, apertura y renovación." },
  verano:    { key:"verano",    name:"Verano",    glyph:"◉", blurb:"Nacido en el pico. Intensidad, presencia, calor que contagia." },
  otono:     { key:"otono",     name:"Otoño",     glyph:"◊", blurb:"Nacido en el cierre. Profundidad, cosecha, lo que ya está construido." },
  invierno:  { key:"invierno",  name:"Invierno",  glyph:"✦", blurb:"Nacido en el silencio. Introspección, resiliencia, raíz." },
};

export function getSeason(birthDateISO: string): SeasonProfile | null {
  const match = /^\d{4}-(\d{2})-\d{2}/.exec(birthDateISO);
  if (!match) return null;
  const month = parseInt(match[1], 10);
  if (month >= 3 && month <= 5)  return SEASONS.primavera;
  if (month >= 6 && month <= 8)  return SEASONS.verano;
  if (month >= 9 && month <= 11) return SEASONS.otono;
  return SEASONS.invierno;
}

/* ================================================================
   CÁPSULA DEL TIEMPO — contexto cultural por década (México)
   ================================================================ */

export interface CapsulaTiempo {
  decade: string;
  era: string;
  musicaRef: string;
  culturaRef: string;
  techRef: string;
}

const CAPSULAS: Record<number, CapsulaTiempo> = {
  1940: { decade:"40s", era:"Edad de oro del cine mexicano",     musicaRef:"Bolero, danzón y big band",                              culturaRef:"Época de oro del cine: Cantinflas, María Félix",        techRef:"Radio como medio masivo, primeras grabaciones en vinilo" },
  1950: { decade:"50s", era:"Milagro económico",                  musicaRef:"Rock'n'roll llegando, bolero en su cima",                 culturaRef:"Milagro económico mexicano, TV llegando a hogares",     techRef:"Televisión en blanco y negro, primeros electrodomésticos" },
  1960: { decade:"60s", era:"Revolución cultural",                musicaRef:"Los Beatles, Chavela Vargas, La Sonora Santanera",        culturaRef:"Olimpiadas México '68, movimiento estudiantil",         techRef:"Primera transmisión a color en TV mexicana" },
  1970: { decade:"70s", era:"Disco y boom petrolero",             musicaRef:"Juan Gabriel, Camilo Sesto, rock progresivo",            culturaRef:"Boom petrolero, telenovelas en su época dorada",        techRef:"Calculadoras de bolsillo, primeros videojuegos Atari" },
  1980: { decade:"80s", era:"MTV y rock en español",              musicaRef:"Mecano, Timbiriche, Soda Stereo, rock en tu idioma",     culturaRef:"Terremoto del '85, entrada de México al GATT",         techRef:"Computadora personal, walkman, Atari/NES" },
  1990: { decade:"90s", era:"Grunge, internet y Selena",          musicaRef:"Selena, Café Tacvba, Nirvana, Maná",                    culturaRef:"TLC/NAFTA, Zapatistas, internet llegando a México",    techRef:"Tamagotchi, Gameboy, primer correo electrónico" },
  2000: { decade:"2000s", era:"Era digital temprana",             musicaRef:"Reggaetón, pop latino, rock alternativo",                culturaRef:"Y2K, 9/11, primer smartphone, MSN Messenger",         techRef:"iPod, YouTube naciendo, banda ancha en México" },
  2010: { decade:"2010s", era:"Streaming y redes sociales",       musicaRef:"Trap, reggaetón global, K-pop",                         culturaRef:"Redes sociales como eje de vida, movimientos digitales",techRef:"iPhone, Instagram, Spotify, apps para todo" },
  2020: { decade:"2020s", era:"Post-pandemia e IA",               musicaRef:"Corridos tumbados, Bad Bunny, IA generativa en música", culturaRef:"Pandemia, trabajo remoto, polarización global",        techRef:"TikTok, ChatGPT, realidad aumentada" },
};

export function getCapsulaTiempo(birthDateISO: string): CapsulaTiempo | null {
  const year = new Date(birthDateISO + "T12:00:00Z").getUTCFullYear();
  if (isNaN(year)) return null;
  const decade  = Math.floor(year / 10) * 10;
  const clamped = Math.max(1940, Math.min(2020, decade));
  return CAPSULAS[clamped] ?? null;
}
