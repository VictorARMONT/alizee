/**
 * ALIZEE — Sistema de Tótem de Identidad
 *
 * Estructura física del tótem (5 capas apilables para impresión 3D):
 *
 *   CORONA   → Animal chino        (12 variantes) — remate superior
 *   FRENTE   → Animal de arquetipo (4 variantes)  — emblema frontal principal
 *   CUERPO   → Sello maya Tzolkin  (20 variantes) — forma central del objeto
 *   BASE     → Signo solar         (12 variantes) — relieve de la base
 *   PEDESTAL → Elemento zodiacal   (4 variantes)  — geometría exterior del pedestal
 *
 *   Piezas maestras: 4 + 12 + 20 + 4 + 12 = 52
 *   Combinaciones únicas: 4 × 12 × 20 × 4 × 12 = 46,080
 *
 * Piedra acompañante: sistema de 3 capas (mes → signo → arquetipo).
 * Lugar de poder: viene de la línea planetaria dominante en astrocartografía.
 *
 * Fuentes:
 *   - Sellos mayas: iconografía Tzolkin Clásico (Lounsbury/Thompson)
 *   - Animales de poder: tradición chamánica mesoamericana + arquetipo ALIZEE
 *   - Piedras (3 capas, de mayor a menor oficialidad):
 *       1. Mes  → birthstones oficiales, lista Jewelers of America 1912, mantenida por GIA/AGS (estándar de industria)
 *       2. Signo → tradición lapidaria zodiacal occidental, listas históricas pre-1912 (sin estándar único)
 *       3. Arquetipo → curaduría propia ALIZEE sobre correspondencias minerales tradicionales
 *   - Animales zodiacales: sincretismo occidental-nahua
 */

import type { SunSign } from "@/data/zodiac";
import type { ArchetypeKey } from "@/data/questions";
import type { ChineseAnimalKey } from "@/data/birthProfile";
import { getSunSign } from "@/data/zodiac";
import { getKinMaya, getChineseZodiac } from "@/data/birthProfile";
import { scoreArchetype } from "@/funnel/score";
import type { Answers } from "@/store/funnel";

/* ================================================================
   TIPOS
   ================================================================ */

export type ZodiacElement = "fuego" | "tierra" | "aire" | "agua";

export interface TotemLayer {
  id: string;
  label: string;
  symbol: string;       // Unicode / glifo imprimible
  animal?: string;      // animal o ser asociado
  description: string;  // qué representa esta capa
  printNote?: string;   // instrucción para el modelado 3D
}

export interface StoneRecommendation {
  primary: { name: string; reason: string; source: string };
  secondary: { name: string; reason: string; source: string };
  intention: { name: string; reason: string; source: string };
}

/** Una piedra propuesta por UNA disciplina independiente. */
export interface DisciplineStone {
  discipline: string;  // nombre legible de la disciplina
  stone: string;
  family: string;
  reason: string;
  source: string;
}

/**
 * Resultado de triangulación / validez convergente.
 * Cuenta cuántas disciplinas independientes coinciden en la misma familia
 * mineral. Más coincidencia entre sistemas que no se hablan = señal más fuerte.
 */
export interface ConvergenceResult {
  disciplines: DisciplineStone[];   // todas las disciplinas reales evaluadas
  total: number;                    // nº de disciplinas independientes
  dominantFamily: string;           // familia mineral más recurrente
  dominantStone: string;            // piedra representativa de esa familia (la del box)
  agreement: number;                // nº de disciplinas que caen en la familia dominante
  agreeingDisciplines: string[];    // cuáles coinciden
  strength: "alta" | "media" | "baja";
}

export interface TotemProfile {
  /* Capas físicas del tótem — de abajo hacia arriba */
  pedestal: TotemLayer;   // elemento zodiacal
  base: TotemLayer;       // signo solar
  cuerpo: TotemLayer;     // sello maya
  frente: TotemLayer;     // animal de arquetipo
  corona: TotemLayer;     // animal chino

  /* Datos complementarios */
  stone: StoneRecommendation;
  convergence: ConvergenceResult;
  sacredPlace: { type: string; examples: string[]; planet: string };

  /* Descripción narrativa del tótem completo */
  narrative: string;
}

/* ================================================================
   CAPA 1 — PEDESTAL: Elemento zodiacal (4 variantes)
   ================================================================ */

const ELEMENT_LAYER: Record<ZodiacElement, TotemLayer> = {
  fuego: {
    id: "fuego",
    label: "Fuego",
    symbol: "▲",
    animal: "Salamandra",
    description: "Energía iniciadora, voluntad, acción directa.",
    printNote: "Pedestal triangular / piramidal. Textura escalonada tipo templo.",
  },
  tierra: {
    id: "tierra",
    label: "Tierra",
    symbol: "■",
    animal: "Tortuga",
    description: "Estabilidad, materia, construcción a largo plazo.",
    printNote: "Pedestal cuadrado. Textura de roca o raíz.",
  },
  aire: {
    id: "aire",
    label: "Aire",
    symbol: "○",
    animal: "Mariposa",
    description: "Pensamiento, comunicación, conexión entre mundos.",
    printNote: "Pedestal circular / toroide. Superficie lisa con líneas de viento.",
  },
  agua: {
    id: "agua",
    label: "Agua",
    symbol: "☽",
    animal: "Delfín",
    description: "Emoción, intuición, profundidad y ciclos lunares.",
    printNote: "Pedestal semiesférico / ola. Textura de agua en movimiento.",
  },
};

export const SIGN_ELEMENTS: Record<SunSign, ZodiacElement> = {
  aries: "fuego", leo: "fuego", sagitario: "fuego",
  tauro: "tierra", virgo: "tierra", capricornio: "tierra",
  geminis: "aire", libra: "aire", acuario: "aire",
  cancer: "agua", escorpio: "agua", piscis: "agua",
};

/* ================================================================
   CAPA 2 — BASE: Signo solar (12 variantes)
   ================================================================ */

interface ZodiacTotemData {
  symbol: string;
  animal: string;          // animal principal occidental
  animalNahua?: string;    // equivalente mesoamericano (opcional, enriquece copy)
  stone: string;           // piedra zodiacal tradicional
  birthstone: string;      // birthstone por mes (GIA)
  description: string;
  printNote: string;
}

const ZODIAC_TOTEM: Record<SunSign, ZodiacTotemData> = {
  aries: {
    symbol: "♈", animal: "Carnero", animalNahua: "Caimán (Cipactli)",
    stone: "Diamante / Rubí", birthstone: "Diamante",
    description: "Fuerza iniciadora, voluntad pura, apertura del ciclo.",
    printNote: "Relieve de cuernos de carnero en arco sobre la base.",
  },
  tauro: {
    symbol: "♉", animal: "Toro", animalNahua: "Venado (Malinalli)",
    stone: "Esmeralda / Cuarzo Rosa", birthstone: "Esmeralda",
    description: "Persistencia, sensorialidad, construcción material.",
    printNote: "Relieve de cabeza de toro de frente, cuernos laterales.",
  },
  geminis: {
    symbol: "♊", animal: "Mariposa", animalNahua: "Quetzal",
    stone: "Ágata / Citrino", birthstone: "Perla / Alejandrita",
    description: "Dualidad, adaptabilidad, mente en movimiento.",
    printNote: "Relieve de alas simétricas de mariposa. Doble plano.",
  },
  cancer: {
    symbol: "♋", animal: "Cangrejo", animalNahua: "Tortuga (Ayotl)",
    stone: "Piedra Luna / Perla", birthstone: "Rubí",
    description: "Protección, memoria, raíz emocional.",
    printNote: "Relieve de caparazón de tortuga / espiral de cangrejo.",
  },
  leo: {
    symbol: "♌", animal: "León", animalNahua: "Águila Solar (Cuauhtli)",
    stone: "Rubí / Ojo de Tigre", birthstone: "Peridoto",
    description: "Presencia solar, creatividad, liderazgo natural.",
    printNote: "Relieve de melena solar. Corona de rayos en el borde.",
  },
  virgo: {
    symbol: "♍", animal: "Abeja", animalNahua: "Xoloitzcuintle",
    stone: "Sardónice / Jade", birthstone: "Zafiro",
    description: "Precisión, servicio, atención al detalle sagrado.",
    printNote: "Relieve de espiga de trigo o panal hexagonal.",
  },
  libra: {
    symbol: "♎", animal: "Colibrí", animalNahua: "Jaguar Nocturno",
    stone: "Ópalo / Turmalina", birthstone: "Ópalo / Turmalina",
    description: "Equilibrio, belleza, justicia relacional.",
    printNote: "Balanza simétrica con alas de colibrí como platillos.",
  },
  escorpio: {
    symbol: "♏", animal: "Escorpión", animalNahua: "Jaguar (Ocelotl)",
    stone: "Obsidiana / Granate", birthstone: "Topacio",
    description: "Transformación profunda, poder interno, regeneración.",
    printNote: "Escorpión de cola curvada. Textura de escamas.",
  },
  sagitario: {
    symbol: "♐", animal: "Coyote", animalNahua: "Coyote (Coyotl)",
    stone: "Turquesa / Lapislázuli", birthstone: "Tanzanita / Topacio",
    description: "Búsqueda de verdad, expansión, camino sin límites.",
    printNote: "Flecha apuntando hacia arriba con cola de coyote.",
  },
  capricornio: {
    symbol: "♑", animal: "Armadillo", animalNahua: "Cocodrilo",
    stone: "Granate / Onix", birthstone: "Granate",
    description: "Estructura, paciencia, ascenso metódico.",
    printNote: "Escamas de armadillo en patrón geométrico ascendente.",
  },
  acuario: {
    symbol: "♒", animal: "Delfín", animalNahua: "Mono (Ozomatli)",
    stone: "Amatista / Aguamarina", birthstone: "Amatista",
    description: "Visión futura, comunidad, disrupción necesaria.",
    printNote: "Dos líneas de agua ondeadas. Espiral de delfín.",
  },
  piscis: {
    symbol: "♓", animal: "Tortuga Marina", animalNahua: "Conejo (Tochtli)",
    stone: "Aguamarina / Piedra Luna", birthstone: "Aguamarina",
    description: "Disolución de límites, compasión, memoria del agua.",
    printNote: "Dos peces en espiral. Caparazón de tortuga marina.",
  },
};

/* ================================================================
   CAPA 3 — CUERPO: Nahual del Cholq'ij / Tzolk'in (20 variantes)
   Nombres en K'iche' (mismo orden canónico que cholqij.ts y que
   getKinMaya().sealIndex, conteo GMT auténtico). Animales/energía según
   correspondencia Maya-K'iche' documentada (Tedlock 1992; ALMG).
   ================================================================ */

interface SealTotemData {
  name: string;
  animal: string;
  energyKey: string;   // palabra clave de la energía del sello
  description: string;
  printNote: string;
}

const SEAL_TOTEM: Record<number, SealTotemData> = {
  0:  { name:"Imox",     animal:"Cocodrilo",         energyKey:"Origen",       description:"Cocodrilo primordial. Subconsciente colectivo, nutrición, vida.", printNote:"Cuerpo de cocodrilo enroscado. Escamas en relieve." },
  1:  { name:"Iq'",      animal:"Colibrí",           energyKey:"Espíritu",     description:"Viento que siembra ideas. Comunicación, aliento, cambio.",      printNote:"Plumas en movimiento espiral ascendente." },
  2:  { name:"Aq'ab'al", animal:"Conejo",            energyKey:"Amanecer",     description:"Umbral del alba. Introspección, lo que se ve antes de la luz.", printNote:"Conejo en reposo. Patrón de aurora geométrico." },
  3:  { name:"K'at",     animal:"Araña",             energyKey:"Red",          description:"Red que conecta. Comunidad, recursos, fertilidad.",             printNote:"Telaraña tejida con semillas en los nudos." },
  4:  { name:"Kan",      animal:"Serpiente Emplumada", energyKey:"Fuerza",     description:"Energía vital que asciende. Instinto, transformación.",         printNote:"Serpiente enroscada en espiral ascendente." },
  5:  { name:"Keme",     animal:"Búho",              energyKey:"Transición",   description:"Guardián de los finales. Lo que muere abre otro ciclo.",        printNote:"Búho con alas desplegadas sobre cráneo estilizado." },
  6:  { name:"Kej",      animal:"Venado",            energyKey:"Guardián",     description:"Venado guardián. Liderazgo con gracia, fuerza sin imposición.", printNote:"Venado con cornamenta integrada y manos abiertas." },
  7:  { name:"Q'anil",   animal:"Conejo / Liebre",   energyKey:"Semilla",      description:"Semilla que germina. Abundancia, fertilidad, arte.",            printNote:"Conejo en estrella de 8 puntas. Textura de grano." },
  8:  { name:"Toj",      animal:"Jaguar del Agua",   energyKey:"Ofrenda",      description:"Equilibrio kármico. Ofrenda, lluvia, flujo emocional.",         printNote:"Jaguar bajo arco de lluvia." },
  9:  { name:"Tz'i'",    animal:"Perro",             energyKey:"Ley",          description:"Guardián de la ley. Lealtad, justicia, amor incondicional.",    printNote:"Perro sentado, oreja erguida, collar de jade." },
  10: { name:"B'atz'",   animal:"Mono Araña",        energyKey:"Hilo del tiempo", description:"Tejedor del tiempo. Arte, humor, ceremonia.",                printNote:"Mono araña con herramientas de artesano." },
  11: { name:"E",        animal:"Venado del Camino", energyKey:"Camino",       description:"El caminante. Viaje, guía por el ejemplo.",                     printNote:"Sendero espiral con huellas en relieve." },
  12: { name:"Aj",       animal:"Loro Verde",        energyKey:"Hogar",        description:"Caña / hogar. Pertenencia, autoridad serena, raíces.",          printNote:"Caña de maíz estilizada con loro posado." },
  13: { name:"Ix",       animal:"Jaguar",            energyKey:"Magia",        description:"Nagual jaguar. Visión chamánica, magia, mundo interior.",       printNote:"Cabeza de jaguar frontal. Rosetas en relieve profundo." },
  14: { name:"Tz'ikin",  animal:"Águila",            energyKey:"Visión",       description:"Mensajero alado. Visión de panorama, puente entre mundos.",     printNote:"Águila con alas extendidas. Plumas detalladas." },
  15: { name:"Ajmaq",    animal:"Buitre Rey",        energyKey:"Perdón",       description:"Sanador del linaje. Perdón, liberación del karma ancestral.",   printNote:"Buitre rey con escudo circular en pecho." },
  16: { name:"No'j",     animal:"Coyote",            energyKey:"Pensamiento",  description:"Inteligencia cósmica. Pensamiento al servicio del colectivo.",  printNote:"Coyote con mapa de coordenadas en el lomo." },
  17: { name:"Tijax",    animal:"Murciélago",        energyKey:"Filo",         description:"Pedernal que sana. Corta lo que ya no sirve, verdad precisa.",  printNote:"Filo de obsidiana en simetría perfecta." },
  18: { name:"Kawoq",    animal:"Tortuga",           energyKey:"Comunidad",    description:"Tormenta que nutre. Servicio, refugio, hogar colectivo.",       printNote:"Tortuga con caparazón-mapa celeste. Rayos en relieve." },
  19: { name:"Ajpu'",    animal:"Colibrí Solar",     energyKey:"Sol",          description:"Héroe solar. Iluminación, integración de luz y sombra.",        printNote:"Colibrí en postura solar. Corona de rayos integrada." },
};

/* ================================================================
   CAPA 4 — FRENTE: Animal de poder por arquetipo (4 variantes)
   ================================================================ */

interface ArchetypeTotemData {
  animal: string;
  sigilShape: string;    // descripción geométrica del sigilo para 3D
  qualities: string[];
  shadow: string;        // sombra del arquetipo (para honestidad del sistema)
  description: string;
  printNote: string;
}

export const ARCHETYPE_TOTEM: Record<ArchetypeKey, ArchetypeTotemData> = {
  lider: {
    animal: "Águila Real",
    sigilShape: "Círculo solar con ala desplegada y rayo central descendente",
    qualities: ["Autoridad", "Protección", "Visión estratégica", "Legado"],
    shadow: "Control excesivo, dificultad para delegar, impaciencia con el proceso",
    description: "El Águila Real domina el espacio aéreo con presencia, no con ruido. Ve el panorama completo antes de actuar. Su autoridad no se impone — se reconoce.",
    printNote: "Águila frontal con escudo en pecho. Alas extendidas encuadran el emblema. 4 plumas por ala como símbolo de los cuatro rumbos.",
  },
  explorador: {
    animal: "Lobo Gris",
    sigilShape: "Luna creciente con estrella polar y huella de lobo en cruce de caminos",
    qualities: ["Libertad", "Instinto", "Adaptabilidad", "Olfato para lo nuevo"],
    shadow: "Compromiso difícil, fomo crónico, relaciones superficiales por miedo a quedarse",
    description: "El Lobo conoce el territorio sin necesitar mapa. Su manada lo sigue porque él fue primero. Actúa por instinto cuando otros aún analizan.",
    printNote: "Lobo aullando en perfil. Luna creciente en la espalda. Textura de pelaje en relieve.",
  },
  creador: {
    animal: "Jaguar",
    sigilShape: "Roseta de jaguar inscrita en cuadrado con herramientas en los vértices",
    qualities: ["Precisión", "Paciencia", "Oficio", "Potencia silenciosa"],
    shadow: "Perfeccionismo paralizante, dificultad para mostrar trabajo inacabado, solitario",
    description: "El Jaguar construye en silencio. Su fuerza no se anuncia — se muestra en lo que hace. El resultado habla; él, poco.",
    printNote: "Jaguar en postura de acecho. Rosetas de jaguar como patrón de fondo del emblema.",
  },
  sabio: {
    animal: "Búho Cornudo",
    sigilShape: "Ojo de búho con pupila espiral y tres plumas descendentes",
    qualities: ["Observación", "Profundidad", "Silencio estratégico", "Criterio propio"],
    shadow: "Parálisis por análisis, distancia emocional, superioridad intelectual no declarada",
    description: "El Búho no necesita preguntarlo todo — ya lo sabe. Su silencio no es ausencia: es filtro. Lo que dice, vale.",
    printNote: "Búho frontal. Ojos grandes con espiral de pupila. Plumas asimétricas como libro abierto.",
  },
};

/* ================================================================
   CAPA 5 — CORONA: Animal chino (12 variantes)
   Datos base ya en birthProfile.ts — aquí se agrega el printNote.
   ================================================================ */

export const CHINESE_PRINT_NOTES: Record<ChineseAnimalKey, string> = {
  rata:      "Rata de frente con orejas grandes. Moneda en boca — símbolo de abundancia.",
  buey:      "Buey con yugo decorativo. Nariz anillada. Textura de cuero en relieve.",
  tigre:     "Tigre en salto. Rayas en relieve profundo. Cola enroscada en corona.",
  conejo:    "Conejo sentado. Orejas largas forman la silueta del remate superior.",
  dragon:    "Dragón chino enroscado. Escamas en espiral ascendente.",
  serpiente: "Serpiente en S vertical. Escamas hexagonales. Lengua bífida discreta.",
  caballo:   "Caballo en carrera. Crin al viento forma el remate de la corona.",
  cabra:     "Cabra montesa. Cuernos curvados hacia afuera forman asa de corona.",
  mono:      "Mono sentado con fruta en mano. Cola forma el límite circular.",
  gallo:     "Gallo erguido. Cresta en relieve como corona natural.",
  perro:     "Perro sentado, orejas erguidas. Collar con símbolo de fidelidad.",
  cerdo:     "Cerdo próspero de frente. Orejas hacia arriba, manos con moneda.",
};

/* ================================================================
   PIEDRAS — Sistema de 3 capas
   ================================================================ */

interface StoneData {
  name: string;
  color: string;
  family: string;
  properties: string;
  sourceSystem: string;
}

const BIRTHSTONES_BY_MONTH: Record<number, StoneData> = {
  1:  { name:"Granate",      color:"Rojo profundo",   family:"Granate",      properties:"Vitalidad, protección, conexión con raíces.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · enero" },
  2:  { name:"Amatista",     color:"Violeta",          family:"Cuarzo",       properties:"Calma mental, claridad espiritual, intuición.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · febrero" },
  3:  { name:"Aguamarina",   color:"Azul celeste",     family:"Berilo",       properties:"Comunicación clara, fluidez, coraje tranquilo.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · marzo" },
  4:  { name:"Diamante",     color:"Transparente",     family:"Carbono",      properties:"Claridad, fuerza, amplificación de intención.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · abril" },
  5:  { name:"Esmeralda",    color:"Verde intenso",    family:"Berilo",       properties:"Crecimiento, amor, abundancia, renovación.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · mayo" },
  6:  { name:"Perla",        color:"Blanco nacarado",  family:"Orgánica",     properties:"Pureza, sabiduría acumulada, ciclos lunares.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · junio" },
  7:  { name:"Rubí",         color:"Rojo fuego",       family:"Corindón",     properties:"Pasión, protección, fuerza solar, coraje.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · julio" },
  8:  { name:"Peridoto",     color:"Verde oliva",      family:"Olivino",      properties:"Limpieza energética, prosperidad, alegría.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · agosto" },
  9:  { name:"Zafiro",       color:"Azul real",        family:"Corindón",     properties:"Sabiduría, devoción, honestidad, claridad mental.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · septiembre" },
  10: { name:"Ópalo",        color:"Multicolor",       family:"Ópalo",        properties:"Creatividad, espontaneidad, magia cotidiana.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · octubre" },
  11: { name:"Topacio",      color:"Amarillo / azul",  family:"Silicato",     properties:"Abundancia, alegría, manifestación.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · noviembre" },
  12: { name:"Turquesa",     color:"Azul turquesa",    family:"Fosfato",      properties:"Protección en viaje, comunicación, equilibrio.", sourceSystem:"Birthstone oficial — Jewelers of America (1912) · GIA · diciembre" },
};

const ZODIAC_STONES: Record<SunSign, StoneData> = {
  aries:       { name:"Rubí",        color:"Rojo",         family:"Corindón",  properties:"Coraje, iniciativa, fuego interno.",        sourceSystem:"Tradición lapidaria zodiacal occidental (listas históricas pre-1912)" },
  tauro:       { name:"Esmeralda",   color:"Verde",        family:"Berilo",    properties:"Abundancia material, arraigo, sensorialidad.", sourceSystem:"Tradición lapidaria zodiacal occidental (listas históricas pre-1912)" },
  geminis:     { name:"Ágata",       color:"Multicolor",   family:"Cuarzo",    properties:"Claridad mental, dualidad integrada.",      sourceSystem:"Tradición lapidaria zodiacal occidental (listas históricas pre-1912)" },
  cancer:      { name:"Piedra Luna", color:"Blanco azul",  family:"Feldespato",properties:"Intuición, ciclos emocionales, hogar.",     sourceSystem:"Tradición lapidaria zodiacal occidental (listas históricas pre-1912)" },
  leo:         { name:"Ojo de Tigre",color:"Dorado café",  family:"Cuarzo",    properties:"Confianza, visión, poder solar.",           sourceSystem:"Tradición lapidaria zodiacal occidental (listas históricas pre-1912)" },
  virgo:       { name:"Jade",        color:"Verde claro",  family:"Piroxeno",  properties:"Sabiduría práctica, armonía, salud.",       sourceSystem:"Tradición lapidaria zodiacal occidental (listas históricas pre-1912)" },
  libra:       { name:"Ópalo",       color:"Multicolor",   family:"Ópalo",     properties:"Equilibrio, belleza, justicia.",            sourceSystem:"Tradición lapidaria zodiacal occidental (listas históricas pre-1912)" },
  escorpio:    { name:"Obsidiana",   color:"Negro",        family:"Vidrio volcánico", properties:"Protección, verdad, transformación.",  sourceSystem:"Tradición zodiacal occidental + lapidaria mexica (obsidiana)" },
  sagitario:   { name:"Turquesa",    color:"Azul turquesa",family:"Fosfato",   properties:"Expansión, protección en viaje, verdad.",   sourceSystem:"Tradición lapidaria zodiacal occidental (listas históricas pre-1912)" },
  capricornio: { name:"Granate",     color:"Rojo oscuro",  family:"Granate",   properties:"Estructura, disciplina, logro.",           sourceSystem:"Tradición lapidaria zodiacal occidental (listas históricas pre-1912)" },
  acuario:     { name:"Amatista",    color:"Violeta",      family:"Cuarzo",    properties:"Visión colectiva, innovación, despertar.",  sourceSystem:"Tradición lapidaria zodiacal occidental (listas históricas pre-1912)" },
  piscis:      { name:"Aguamarina",  color:"Azul suave",   family:"Berilo",    properties:"Compasión, disolución de límites, fe.",    sourceSystem:"Tradición lapidaria zodiacal occidental (listas históricas pre-1912)" },
};

const ARCHETYPE_STONES: Record<ArchetypeKey, StoneData> = {
  lider:      { name:"Pirita",          color:"Dorado metálico",family:"Sulfuro",  properties:"Voluntad, autoridad, protección física.",     sourceSystem:"Curaduría ALIZEE — correspondencia mineral tradicional" },
  explorador: { name:"Ágata de Fuego",  color:"Naranja ámbar",  family:"Cuarzo",   properties:"Aventura, instinto, protección en movimiento.",sourceSystem:"Curaduría ALIZEE — correspondencia mineral tradicional" },
  creador:    { name:"Cuarzo Ahumado",  color:"Café translúcido",family:"Cuarzo",  properties:"Enfoque, presencia en el trabajo, grounding.", sourceSystem:"Curaduría ALIZEE — correspondencia mineral tradicional" },
  sabio:      { name:"Amatista Oscura", color:"Violeta profundo",family:"Cuarzo",  properties:"Profundidad mental, calma, conexión interna.", sourceSystem:"Curaduría ALIZEE — correspondencia mineral tradicional" },
};

/* ----------------------------------------------------------------
   SISTEMA 4 — Piedra planetaria védica (signo → planeta regente → navaratna)
   Sistema reglado real: cada signo tropical tiene un planeta regente
   tradicional, y el Jyotish (astrología india) asigna a cada graha una de
   las 9 navaratna. Independiente de la lapidaria occidental y de GIA.
   Fuente: Jyotish / sistema Navaratna (regencias tradicionales).
   ---------------------------------------------------------------- */
const PLANETARY_STONES: Record<SunSign, StoneData & { planet: string }> = {
  aries:       { planet:"Marte",    name:"Coral Rojo",      color:"Rojo coral",   family:"Orgánica",  properties:"Coraje, energía de Marte, protección.",         sourceSystem:"Jyotish — Marte (Mangal) · navaratna" },
  tauro:       { planet:"Venus",    name:"Diamante",        color:"Transparente", family:"Carbono",   properties:"Placer, valor, amor de Venus (Shukra).",        sourceSystem:"Jyotish — Venus (Shukra) · navaratna" },
  geminis:     { planet:"Mercurio", name:"Esmeralda",       color:"Verde",        family:"Berilo",    properties:"Mente, palabra, agilidad de Mercurio.",         sourceSystem:"Jyotish — Mercurio (Budha) · navaratna" },
  cancer:      { planet:"Luna",     name:"Perla",           color:"Blanco nácar", family:"Orgánica",  properties:"Emoción, calma, ciclo lunar (Chandra).",        sourceSystem:"Jyotish — Luna (Chandra) · navaratna" },
  leo:         { planet:"Sol",      name:"Rubí",            color:"Rojo fuego",   family:"Corindón",  properties:"Autoridad solar, vitalidad (Surya).",           sourceSystem:"Jyotish — Sol (Surya) · navaratna" },
  virgo:       { planet:"Mercurio", name:"Esmeralda",       color:"Verde",        family:"Berilo",    properties:"Precisión, análisis, palabra de Mercurio.",     sourceSystem:"Jyotish — Mercurio (Budha) · navaratna" },
  libra:       { planet:"Venus",    name:"Diamante",        color:"Transparente", family:"Carbono",   properties:"Belleza, equilibrio, amor de Venus.",           sourceSystem:"Jyotish — Venus (Shukra) · navaratna" },
  escorpio:    { planet:"Marte",    name:"Coral Rojo",      color:"Rojo coral",   family:"Orgánica",  properties:"Intensidad, poder y empuje de Marte.",          sourceSystem:"Jyotish — Marte (Mangal) · navaratna" },
  sagitario:   { planet:"Júpiter",  name:"Zafiro Amarillo", color:"Amarillo oro", family:"Corindón",  properties:"Expansión, sabiduría, suerte de Júpiter.",      sourceSystem:"Jyotish — Júpiter (Guru) · navaratna" },
  capricornio: { planet:"Saturno",  name:"Zafiro Azul",     color:"Azul real",    family:"Corindón",  properties:"Disciplina, estructura, karma de Saturno.",     sourceSystem:"Jyotish — Saturno (Shani) · navaratna" },
  acuario:     { planet:"Saturno",  name:"Zafiro Azul",     color:"Azul real",    family:"Corindón",  properties:"Visión, prueba y madurez de Saturno.",          sourceSystem:"Jyotish — Saturno (Shani) · navaratna" },
  piscis:      { planet:"Júpiter",  name:"Zafiro Amarillo", color:"Amarillo oro", family:"Corindón",  properties:"Fe, compasión, abundancia de Júpiter.",         sourceSystem:"Jyotish — Júpiter (Guru) · navaratna" },
};

/* ----------------------------------------------------------------
   SISTEMA 5 — Piedra del año chino (animal → piedra de la suerte)
   Tradición popular china, sin estándar gemológico único; las atribuciones
   de Perro y Cerdo varían entre fuentes. Sistema independiente del resto.
   Fuente: tradición china de piedras de la suerte (KarmaWeather y otras).
   ---------------------------------------------------------------- */
const CHINESE_STONES: Record<ChineseAnimalKey, StoneData> = {
  rata:      { name:"Granate",  color:"Rojo profundo", family:"Granate",  properties:"Coraje, estabilidad, éxito.",        sourceSystem:"Tradición china — piedra de la suerte (Rata)" },
  buey:      { name:"Jade",     color:"Verde",         family:"Piroxeno", properties:"Calma, prosperidad, constancia.",    sourceSystem:"Tradición china — piedra de la suerte (Buey)" },
  tigre:     { name:"Zafiro",   color:"Azul real",     family:"Corindón", properties:"Fortuna, protección, valentía.",     sourceSystem:"Tradición china — piedra de la suerte (Tigre)" },
  conejo:    { name:"Perla",    color:"Blanco nácar",  family:"Orgánica", properties:"Suerte, protección, ternura.",       sourceSystem:"Tradición china — piedra de la suerte (Conejo)" },
  dragon:    { name:"Amatista", color:"Violeta",       family:"Cuarzo",   properties:"Crecimiento espiritual, éxito.",     sourceSystem:"Tradición china — piedra de la suerte (Dragón)" },
  serpiente: { name:"Ópalo",    color:"Multicolor",    family:"Ópalo",    properties:"Sabiduría, fortuna, protección.",    sourceSystem:"Tradición china — piedra de la suerte (Serpiente)" },
  caballo:   { name:"Topacio",  color:"Amarillo",      family:"Silicato", properties:"Abundancia, energía, éxito.",        sourceSystem:"Tradición china — piedra de la suerte (Caballo)" },
  cabra:     { name:"Esmeralda",color:"Verde",         family:"Berilo",   properties:"Paz, abundancia, creatividad.",      sourceSystem:"Tradición china — piedra de la suerte (Cabra)" },
  mono:      { name:"Turquesa", color:"Azul turquesa", family:"Fosfato",  properties:"Suerte, protección, optimismo.",     sourceSystem:"Tradición china — piedra de la suerte (Mono)" },
  gallo:     { name:"Citrino",  color:"Amarillo miel", family:"Cuarzo",   properties:"Riqueza, poder personal, suerte.",   sourceSystem:"Tradición china — piedra de la suerte (Gallo)" },
  perro:     { name:"Diamante", color:"Transparente",  family:"Carbono",  properties:"Lealtad, claridad, protección.",     sourceSystem:"Tradición china — piedra de la suerte (Perro · varía por fuente)" },
  cerdo:     { name:"Rubí",     color:"Rojo fuego",    family:"Corindón", properties:"Prosperidad, calidez, fortuna.",     sourceSystem:"Tradición china — piedra de la suerte (Cerdo · varía por fuente)" },
};

/* ----------------------------------------------------------------
   SISTEMA 6 — Piedra mesoamericana por nahual (sello Tzolkin 0-19)
   Restringido a la paleta lapidaria real Maya/Mexica documentada:
     Jade/jadeíta (chalchihuitl) — agua sagrada, aliento, vida, realeza
     Obsidiana (itztli)         — "piedra que habla", corte, espejo, inframundo
     Turquesa (xihuitl)         — "año/tiempo", cielo, fuego solar
     Pirita                     — espejo solar tolteca, reflexión
     Ámbar (apozonalli)         — sol atrapado, calor, resina viva
   Cada nahual recibe la piedra más fiel a su esencia documentada.
   Fuente: arqueología mesoamericana (jade, obsidiana, turquesa, pirita).
   ---------------------------------------------------------------- */
const NAHUAL_STONES: Record<number, StoneData> = {
  0:  { name:"Jade",     color:"Verde agua",   family:"Piroxeno",        properties:"Agua primordial, origen y vida.",            sourceSystem:"Lapidaria Maya — chalchihuitl (jade)" },
  1:  { name:"Turquesa", color:"Azul cielo",   family:"Fosfato",         properties:"Aliento y viento, puente entre mundos.",     sourceSystem:"Lapidaria Mexica — xihuitl (turquesa)" },
  2:  { name:"Obsidiana",color:"Negro",        family:"Vidrio volcánico",properties:"Umbral noche-luz, espejo del alba.",         sourceSystem:"Lapidaria Mexica — itztli (obsidiana)" },
  3:  { name:"Ámbar",    color:"Naranja miel", family:"Orgánica",        properties:"Semilla de luz, calor que germina.",         sourceSystem:"Lapidaria Mexica — apozonalli (ámbar)" },
  4:  { name:"Ámbar",    color:"Naranja fuego",family:"Orgánica",        properties:"Fuego vital que asciende, fuerza serpiente.", sourceSystem:"Lapidaria Mexica — apozonalli (ámbar)" },
  5:  { name:"Obsidiana",color:"Negro",        family:"Vidrio volcánico",properties:"Inframundo, transición, lo que muere y libera.",sourceSystem:"Lapidaria Mexica — itztli (obsidiana)" },
  6:  { name:"Jade",     color:"Verde",        family:"Piroxeno",        properties:"Naturaleza, sostén, liderazgo que cuida.",   sourceSystem:"Lapidaria Maya — chalchihuitl (jade)" },
  7:  { name:"Jade",     color:"Verde claro",  family:"Piroxeno",        properties:"Fertilidad, crecimiento, abundancia.",       sourceSystem:"Lapidaria Maya — chalchihuitl (jade)" },
  8:  { name:"Jade",     color:"Verde agua",   family:"Piroxeno",        properties:"Lluvia, equilibrio, ofrenda.",               sourceSystem:"Lapidaria Maya — chalchihuitl (jade)" },
  9:  { name:"Obsidiana",color:"Negro",        family:"Vidrio volcánico",properties:"Espejo de la verdad, ley y justicia.",       sourceSystem:"Lapidaria Mexica — itztli (obsidiana)" },
  10: { name:"Turquesa", color:"Azul turquesa",family:"Fosfato",         properties:"Hilo del tiempo (xihuitl = 'año'), arte.",   sourceSystem:"Lapidaria Mexica — xihuitl (turquesa)" },
  11: { name:"Turquesa", color:"Azul cielo",   family:"Fosfato",         properties:"Camino, viaje, protección del andar.",       sourceSystem:"Lapidaria Mexica — xihuitl (turquesa)" },
  12: { name:"Jade",     color:"Verde",        family:"Piroxeno",        properties:"Hogar, raíz, pertenencia.",                  sourceSystem:"Lapidaria Maya — chalchihuitl (jade)" },
  13: { name:"Obsidiana",color:"Negro",        family:"Vidrio volcánico",properties:"Jaguar de Tezcatlipoca, magia, espejo humeante.",sourceSystem:"Lapidaria Mexica — itztli (obsidiana)" },
  14: { name:"Turquesa", color:"Azul cielo",   family:"Fosfato",         properties:"Cielo, visión, mensajero entre mundos.",     sourceSystem:"Lapidaria Mexica — xihuitl (turquesa)" },
  15: { name:"Obsidiana",color:"Negro",        family:"Vidrio volcánico",properties:"Limpieza de lo muerto, perdón, sombra.",     sourceSystem:"Lapidaria Mexica — itztli (obsidiana)" },
  16: { name:"Pirita",   color:"Dorado",       family:"Sulfuro",         properties:"Espejo de la mente, reflexión, pensamiento.",sourceSystem:"Lapidaria tolteca — pirita (espejo)" },
  17: { name:"Obsidiana",color:"Negro",        family:"Vidrio volcánico",properties:"Pedernal/itztli: la piedra que corta y predice.",sourceSystem:"Lapidaria Mexica — itztli (obsidiana)" },
  18: { name:"Jade",     color:"Verde agua",   family:"Piroxeno",        properties:"Tormenta que nutre, comunidad, refugio.",    sourceSystem:"Lapidaria Maya — chalchihuitl (jade)" },
  19: { name:"Pirita",   color:"Dorado solar", family:"Sulfuro",         properties:"Espejo solar tolteca, héroe del Sol.",       sourceSystem:"Lapidaria tolteca — pirita (espejo solar)" },
};

/* ----------------------------------------------------------------
   NORMALIZACIÓN DE FAMILIA MINERAL — para detectar convergencia entre
   sistemas que nombran piedras distintas pero de la misma familia
   (ej. Rubí y Zafiro = Corindón; Amatista, Ágata, Citrino = Cuarzo).
   ---------------------------------------------------------------- */
const FAMILY_OF: Record<string, string> = {
  "Rubí":"Corindón", "Zafiro":"Corindón", "Zafiro Azul":"Corindón", "Zafiro Amarillo":"Corindón",
  "Esmeralda":"Berilo", "Aguamarina":"Berilo",
  "Amatista":"Cuarzo", "Amatista Oscura":"Cuarzo", "Citrino":"Cuarzo", "Ágata":"Cuarzo",
  "Ágata de Fuego":"Cuarzo", "Ojo de Tigre":"Cuarzo", "Cuarzo Ahumado":"Cuarzo",
  "Cuarzo":"Cuarzo", "Cuarzo Blanco":"Cuarzo",
  "Diamante":"Carbono",
  "Perla":"Orgánica", "Coral Rojo":"Orgánica", "Ámbar":"Orgánica",
  "Piedra Luna":"Feldespato",
  "Peridoto":"Olivino",
  "Topacio":"Silicato",
  "Granate":"Granate",
  "Ópalo":"Ópalo",
  "Turquesa":"Fosfato",
  "Obsidiana":"Vidrio volcánico",
  "Jade":"Piroxeno",
  "Pirita":"Sulfuro",
  "Onix":"Cuarzo", "Sardónice":"Cuarzo", "Lapislázuli":"Lazurita",
};

function familyOf(stone: string): string {
  return FAMILY_OF[stone] ?? stone;
}

/* ================================================================
   MOTOR DE CONVERGENCIA — triangulación entre disciplinas
   ================================================================ */

/**
 * Reúne la piedra que propone cada EJE natal independiente y mide su intersección.
 *
 * Honestidad del conteo: un "eje" es una coordenada de nacimiento distinta
 * (mes, signo solar, año chino, día del Cholq'ij). Un mismo eje puede tener varias
 * lecturas tradicionales —el signo solar lo leen tanto la lapidaria occidental como
 * el Jyotish— pero esas dos NO son pruebas independientes: salen del mismo dato.
 * Por eso la convergencia cuenta EJES, no lecturas: el signo vota una sola vez.
 * La curaduría ALIZEE (arquetipo) tampoco entra: no es disciplina externa.
 */
export function computeConvergence(
  sign: SunSign | null,
  chineseKey: ChineseAnimalKey | null,
  sealIndex: number | null,
  month: number | null,
): ConvergenceResult {
  interface Reading { discipline: string; stone: string; family: string; reason: string; source: string }
  interface Axis { id: string; readings: Reading[] }

  const axes: Axis[] = [];

  if (month && BIRTHSTONES_BY_MONTH[month]) {
    const s = BIRTHSTONES_BY_MONTH[month];
    axes.push({ id: "mes", readings: [
      { discipline: "Mes de nacimiento (GIA)", stone: s.name, family: familyOf(s.name), reason: s.properties, source: s.sourceSystem },
    ] });
  }
  if (sign) {
    const z = ZODIAC_STONES[sign];
    const p = PLANETARY_STONES[sign];
    axes.push({ id: "signo", readings: [
      { discipline: "Signo · lapidaria occidental", stone: z.name, family: familyOf(z.name), reason: z.properties, source: z.sourceSystem },
      { discipline: `Signo · Jyotish (${p.planet})`, stone: p.name, family: familyOf(p.name), reason: p.properties, source: p.sourceSystem },
    ] });
  }
  if (chineseKey) {
    const c = CHINESE_STONES[chineseKey];
    axes.push({ id: "chino", readings: [
      { discipline: "Año chino", stone: c.name, family: familyOf(c.name), reason: c.properties, source: c.sourceSystem },
    ] });
  }
  if (sealIndex != null && NAHUAL_STONES[sealIndex]) {
    const n = NAHUAL_STONES[sealIndex];
    axes.push({ id: "maya", readings: [
      { discipline: "Nahual · lapidaria mesoamericana", stone: n.name, family: familyOf(n.name), reason: n.properties, source: n.sourceSystem },
    ] });
  }

  // Familia dominante: la familia con más lecturas (solo para ELEGIR la piedra del box).
  const allReadings = axes.flatMap((a) => a.readings);
  const familyCount = new Map<string, Reading[]>();
  for (const r of allReadings) {
    const list = familyCount.get(r.family) ?? [];
    list.push(r);
    familyCount.set(r.family, list);
  }
  let dominantFamily = allReadings[0]?.family ?? "Cuarzo";
  let best = 0;
  for (const [fam, list] of familyCount) {
    if (list.length > best) { best = list.length; dominantFamily = fam; }
  }

  // Piedra representativa: la más repetida dentro de la familia dominante.
  const inFamily = familyCount.get(dominantFamily) ?? [];
  const stoneCount = new Map<string, number>();
  for (const r of inFamily) stoneCount.set(r.stone, (stoneCount.get(r.stone) ?? 0) + 1);
  let dominantStone = inFamily[0]?.stone ?? "Cuarzo";
  let bestStone = 0;
  for (const [name, n] of stoneCount) {
    if (n > bestStone) { bestStone = n; dominantStone = name; }
  }

  // Una fila por EJE para el dossier: la lectura representativa (la que cae en la
  // familia dominante si existe; si no, la primera). Así "X de Y" == filas marcadas.
  const disciplines: DisciplineStone[] = axes.map((a) => {
    const rep = a.readings.find((r) => r.family === dominantFamily) ?? a.readings[0];
    const corroborated = a.readings.length > 1 && a.readings.every((r) => r.family === rep.family);
    return {
      discipline: corroborated ? `${rep.discipline} (+ corrobora otra tradición)` : rep.discipline,
      stone: rep.stone,
      family: rep.family,
      reason: rep.reason,
      source: rep.source,
    };
  });

  // CONVERGENCIA: por ejes independientes. Un eje coincide si alguna de sus
  // lecturas cae en la familia dominante.
  const total = axes.length;
  const agreeing = axes.filter((a) => a.readings.some((r) => r.family === dominantFamily));
  const agreement = agreeing.length;
  const strength: ConvergenceResult["strength"] =
    agreement >= 3 ? "alta" : agreement === 2 ? "media" : "baja";

  return {
    disciplines,
    total,
    dominantFamily,
    dominantStone,
    agreement,
    agreeingDisciplines: disciplines.filter((d) => d.family === dominantFamily).map((d) => d.discipline),
    strength,
  };
}

/* ================================================================
   LUGARES DE PODER — conectado a astrocartografía
   ================================================================ */

interface SacredPlaceData {
  type: string;
  description: string;
  examples: string[];
  physicalFeature: string; // cómo se imprime en el pedestal del tótem
}

export const PLANET_SACRED_PLACES: Record<string, SacredPlaceData> = {
  sol:      { type:"Montaña sagrada",    description:"Cimas donde la luz llega primero. Lugar de reconocimiento y propósito.",   examples:["Teotihuacán","Machu Picchu","Monte Olimpo","Fuji"],    physicalFeature:"Pirámide escalonada en el pedestal" },
  luna:     { type:"Lago o cenote",      description:"Aguas quietas que reflejan el interior. Lugar de memoria y sueño.",        examples:["Cenotes de Yucatán","Lago Titicaca","Lago Baikal"],     physicalFeature:"Espejo de agua circular en el pedestal" },
  mercurio: { type:"Biblioteca / ágora", description:"Lugar de intercambio, ideas y conexión. Donde el pensamiento se acelera.", examples:["Londres","Nueva York","Alejandría"],                   physicalFeature:"Arcos de conocimiento en el pedestal" },
  venus:    { type:"Jardín o templo",    description:"Espacio de belleza y encuentro. Donde el amor florece.",                   examples:["París","Jardines de Versalles","Bali","Tulum"],          physicalFeature:"Jardín en flor grabado en el pedestal" },
  marte:    { type:"Volcán activo",      description:"Lugar de transformación por fuego. Alta energía, acción pura.",            examples:["Popocatépetl","Etna","Kilauea"],                         physicalFeature:"Volcán en erupción estilizado en pedestal" },
  jupiter:  { type:"Templo o catedral",  description:"Lugar de expansión y sabiduría. Donde la visión se agranda.",              examples:["Roma","Atenas","Chichén Itzá","Angkor Wat"],            physicalFeature:"Templo con columnas en el pedestal" },
  saturno:  { type:"Cueva o caverna",    description:"Lugar de silencio y estructura profunda. Donde se trabaja sin testigos.",  examples:["Cueva de Altamira","Cuevas de Belize"],                 physicalFeature:"Cueva geométrica en el pedestal" },
  urano:    { type:"Observatorio",       description:"Lugar de visión futura y ruptura. Donde se ven los patrones.",             examples:["San Francisco","Reikiavik","Tokio"],                    physicalFeature:"Cúpula de observatorio en el pedestal" },
  neptuno:  { type:"Océano o bahía",     description:"Donde los límites desaparecen. Lugar de inspiración y disolución.",       examples:["Lisboa","Bali","Isla Mujeres","Mykonos"],               physicalFeature:"Olas concéntricas en el pedestal" },
  pluton:   { type:"Pirámide o cripta",  description:"Lugar de poder profundo y transformación total.",                          examples:["El Cairo","Teotihuacán","Stonehenge"],                  physicalFeature:"Pirámide con cámara interior en pedestal" },
};

/* ================================================================
   FUNCIÓN PRINCIPAL: getTotemProfile()
   ================================================================ */

function getBirthMonth(birthDate: string): number {
  return parseInt(birthDate.slice(5, 7), 10);
}

export function getTotemProfile(
  birthDate: string,
  answers: Answers,
  dominantPlanet: string = "sol", // viene de astrocartography.ts
): TotemProfile {
  const sign       = getSunSign(birthDate);
  const kinData    = getKinMaya(birthDate);
  const chinese    = getChineseZodiac(birthDate);
  const archResult = scoreArchetype(answers);
  const archetype  = archResult?.winner ?? "lider";
  const month      = getBirthMonth(birthDate);

  const element    = sign ? SIGN_ELEMENTS[sign] : "fuego";
  const zodiacData = sign ? ZODIAC_TOTEM[sign] : ZODIAC_TOTEM.leo;
  const sealData   = SEAL_TOTEM[kinData.sealIndex];
  const archData   = ARCHETYPE_TOTEM[archetype];
  const sacredData = PLANET_SACRED_PLACES[dominantPlanet] ?? PLANET_SACRED_PLACES.sol;

  // Pedestal
  const pedestal: TotemLayer = {
    ...ELEMENT_LAYER[element],
  };

  // Base
  const base: TotemLayer = {
    id: sign ?? "leo",
    label: `${zodiacData.symbol} ${sign ?? "Leo"}`,
    symbol: zodiacData.symbol,
    animal: zodiacData.animal,
    description: zodiacData.description,
    printNote: zodiacData.printNote,
  };

  // Cuerpo
  const cuerpo: TotemLayer = {
    id: `nahual-${kinData.sealIndex}`,
    label: `Nahual ${sealData.name} · tono ${kinData.tone} ${kinData.toneName}`,
    symbol: kinData.glyph,
    animal: sealData.animal,
    description: sealData.description,
    printNote: sealData.printNote,
  };

  // Frente
  const frente: TotemLayer = {
    id: archetype,
    label: archData.animal,
    symbol: "◆",
    animal: archData.animal,
    description: archData.description,
    printNote: archData.printNote,
  };

  // Corona
  const corona: TotemLayer = {
    id: chinese.key,
    label: chinese.name,
    symbol: chinese.glyph,
    animal: chinese.name,
    description: `${chinese.name} del zodíaco chino.`,
    printNote: CHINESE_PRINT_NOTES[chinese.key],
  };

  // Piedras
  const birthstone = BIRTHSTONES_BY_MONTH[month];
  const zodiacStone = sign ? ZODIAC_STONES[sign] : ZODIAC_STONES.leo;
  const archetypeStone = ARCHETYPE_STONES[archetype];

  const stone: StoneRecommendation = {
    primary:   { name: birthstone.name,     reason: `Nacido en mes ${month}. ${birthstone.properties}`,     source: birthstone.sourceSystem },
    secondary: { name: zodiacStone.name,    reason: `Signo ${sign ?? "Leo"}. ${zodiacStone.properties}`,    source: zodiacStone.sourceSystem },
    intention: { name: archetypeStone.name, reason: `Arquetipo ${archetype}. ${archetypeStone.properties}`, source: archetypeStone.sourceSystem },
  };

  // Triangulación entre disciplinas independientes → piedra del box
  const convergence = computeConvergence(sign, chinese.key, kinData.sealIndex, month);

  const narrative = [
    `Tótem de Identidad — ${archData.animal} ${zodiacData.symbol}`,
    ``,
    `PEDESTAL (${pedestal.label}): ${pedestal.description}`,
    `BASE (${base.label}): ${zodiacData.animal}${zodiacData.animalNahua ? ` / ${zodiacData.animalNahua}` : ""}. ${base.description}`,
    `CUERPO (${cuerpo.label}): ${sealData.animal}. ${sealData.description}`,
    `FRENTE (${frente.animal}): ${frente.description}`,
    `CORONA (${corona.label}): ${chinese.name} del zodíaco chino.`,
    ``,
    `PIEDRA PRIMARIA: ${stone.primary.name} — ${stone.primary.reason} [${stone.primary.source}]`,
    `PIEDRA ZODIACAL: ${stone.secondary.name} — ${stone.secondary.reason} [${stone.secondary.source}]`,
    `PIEDRA DE INTENCIÓN: ${stone.intention.name} — ${stone.intention.reason} [${stone.intention.source}]`,
    ``,
    `LUGAR DE PODER: ${sacredData.type}`,
    `Ejemplos: ${sacredData.examples.join(", ")}`,
  ].join("\n");

  return {
    pedestal,
    base,
    cuerpo,
    frente,
    corona,
    stone,
    convergence,
    sacredPlace: {
      type: sacredData.type,
      examples: sacredData.examples,
      planet: dominantPlanet,
    },
    narrative,
  };
}

/* ================================================================
   EXPORTACIONES ADICIONALES para uso en dossier / UI
   ================================================================ */

export { ZODIAC_TOTEM, SEAL_TOTEM, BIRTHSTONES_BY_MONTH, ZODIAC_STONES, ARCHETYPE_STONES, PLANETARY_STONES, CHINESE_STONES, NAHUAL_STONES };
export type { ZodiacTotemData, SealTotemData, ArchetypeTotemData, StoneData, SacredPlaceData };
