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

export interface TotemProfile {
  /* Capas físicas del tótem — de abajo hacia arriba */
  pedestal: TotemLayer;   // elemento zodiacal
  base: TotemLayer;       // signo solar
  cuerpo: TotemLayer;     // sello maya
  frente: TotemLayer;     // animal de arquetipo
  corona: TotemLayer;     // animal chino

  /* Datos complementarios */
  stone: StoneRecommendation;
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
   CAPA 3 — CUERPO: Sello Maya Tzolkin (20 variantes)
   Fuente: iconografía Tzolkin clásico. Animales según correspondencia
   Maya-Quiché documentada (Tedlock 1992, Argüelles 1987).
   ================================================================ */

interface SealTotemData {
  name: string;
  animal: string;
  energyKey: string;   // palabra clave de la energía del sello
  description: string;
  printNote: string;
}

const SEAL_TOTEM: Record<number, SealTotemData> = {
  0:  { name:"Dragón",   animal:"Caimán",           energyKey:"Ser",          description:"Caimán primordial. Nacimiento, nutrición, sangre.",           printNote:"Cuerpo de caimán enroscado. Escamas en relieve." },
  1:  { name:"Viento",   animal:"Quetzal",           energyKey:"Espíritu",     description:"Quetzal en vuelo. Comunicación, aliento, cambio.",             printNote:"Plumas de quetzal en movimiento espiral ascendente." },
  2:  { name:"Noche",    animal:"Jaguar Nocturno",   energyKey:"Sueño",        description:"Jaguar de la noche. Introspección, abundancia interior.",       printNote:"Jaguar en reposo. Manchas en patrón geométrico." },
  3:  { name:"Semilla",  animal:"Lagarto Verde",     energyKey:"Florecimiento",description:"Lagarto sobre semilla. Potencial, targeting, fertilidad.",      printNote:"Lagarto con semilla germinando entre sus garras." },
  4:  { name:"Serpiente",animal:"Serpiente de Cascabel", energyKey:"Fuerza",   description:"Cascabel enrollada. Fuerza vital, instinto, kundalini.",        printNote:"Serpiente enroscada en espiral ascendente." },
  5:  { name:"Muerte",   animal:"Lechuza Blanca",    energyKey:"Igualdad",     description:"Lechuza de la transición. Fin que abre otro ciclo.",            printNote:"Lechuza con alas desplegadas sobre cráneo estilizado." },
  6:  { name:"Mano",     animal:"Venado",            energyKey:"Conocimiento", description:"Venado con manos. Sanación, logro, gracia natural.",            printNote:"Mano abierta con cornamenta de venado integrada." },
  7:  { name:"Estrella", animal:"Conejo Lunar",      energyKey:"Elegancia",    description:"Conejo de la luna. Belleza, armonía, arte.",                   printNote:"Conejo en estrella de 8 puntas. Textura lunar." },
  8:  { name:"Luna",     animal:"Delfín",            energyKey:"Purificación", description:"Delfín bajo luna. Flujo emocional, acción universal.",          printNote:"Delfín saltando en arco lunar." },
  9:  { name:"Perro",    animal:"Xoloitzcuintle",    energyKey:"Amor",         description:"Xolo guía de almas. Lealtad, amor incondicional, guía.",        printNote:"Xoloitzcuintle sentado, oreja erguida, collar de jade." },
  10: { name:"Mono",     animal:"Mono Araña",        energyKey:"Juego",        description:"Mono araña. Arte, humor, magia creativa.",                      printNote:"Mono araña con herramientas de artesano." },
  11: { name:"Camino",   animal:"Armadillo",         energyKey:"Servicio",     description:"Armadillo en camino. Viaje interior, guía de la humanidad.",    printNote:"Armadillo en sendero espiral. Escudo en relieve." },
  12: { name:"Caña",     animal:"Colibrí",           energyKey:"Inteligencia", description:"Colibrí en caña. Tenacidad, profecia, tubo hacia lo divino.",   printNote:"Colibrí dentro de caña de maíz estilizada." },
  13: { name:"Jaguar",   animal:"Jaguar",            energyKey:"Magia",        description:"Jaguar chamán. Visión mágica, integridad, mundo interior.",     printNote:"Cabeza de jaguar frontal. Rosetas en relieve profundo." },
  14: { name:"Águila",   animal:"Águila Real",       energyKey:"Visión",       description:"Águila real. Visión creativa, mente global.",                   printNote:"Águila con alas extendidas. Vista de plumas detallada." },
  15: { name:"Guerrero", animal:"Zopilote Real",     energyKey:"Inteligencia", description:"Zopilote sagrado. Cuestión, purificación, valentía.",           printNote:"Zopilote con escudo circular en pecho." },
  16: { name:"Tierra",   animal:"Oso Hormiguero",    energyKey:"Navegación",   description:"Oso hormiguero. Evolución, navegación sincrónica.",             printNote:"Oso hormiguero con mapa de coordenadas en el lomo." },
  17: { name:"Espejo",   animal:"Halcón Peregrino",  energyKey:"Sin fin",      description:"Halcón espejo. Reflexión, verdad de pedernal, infinito.",       printNote:"Halcón en espejo de obsidiana. Simetría perfecta." },
  18: { name:"Tormenta", animal:"Tortuga Cósmica",   energyKey:"Auto-generación", description:"Tortuga del trueno. Catálisis, energía del rayo.",           printNote:"Tortuga con caparazón-mapa celeste. Rayos en relieve." },
  19: { name:"Sol",      animal:"Puma Solar",        energyKey:"Fuego Universal", description:"Puma del sol. Iluminación, vida universal, ascensión.",       printNote:"Puma en postura solar. Corona de rayos integrada." },
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
    id: `sello-${kinData.sealIndex}`,
    label: `Sello ${sealData.name} · Kin ${kinData.kin}`,
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

  // Si las tres piedras coinciden o son de la misma familia → "convergencia"
  // (útil para el copy del dossier)

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

export { ZODIAC_TOTEM, SEAL_TOTEM, BIRTHSTONES_BY_MONTH, ZODIAC_STONES, ARCHETYPE_STONES };
export type { ZodiacTotemData, SealTotemData, ArchetypeTotemData, StoneData, SacredPlaceData };
