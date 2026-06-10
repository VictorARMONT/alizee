export type GenerationKey =
  | "silenciosa"
  | "boomers"
  | "genx"
  | "millennial"
  | "genz"
  | "alpha";

export interface GenerationProfile {
  key: GenerationKey;
  name: string;
  birthYears: string;
  blurb: string;
  giftTendency: string;
}

const GENERATIONS: Record<GenerationKey, GenerationProfile> = {
  silenciosa: {
    key: "silenciosa",
    name: "Generación Silenciosa",
    birthYears: "1928–1945",
    blurb: "Construyeron con disciplina y silencio. Valoran lo que dura, lo que tiene historia.",
    giftTendency: "Artesanía, permanencia, objetos que envejecen bien.",
  },
  boomers: {
    key: "boomers",
    name: "Baby Boomer",
    birthYears: "1946–1964",
    blurb: "Trabajaron duro, construyeron familia y legado. El reconocimiento importa.",
    giftTendency: "Confort premium, experiencias significativas, reconocimiento de trayectoria.",
  },
  genx: {
    key: "genx",
    name: "Generación X",
    birthYears: "1965–1980",
    blurb: "Independientes y prácticos, con cultura pop tatuada en el ADN. Adaptables sin hacer drama.",
    giftTendency: "Gadgets de calidad, objetos con historia, experiencias únicas.",
  },
  millennial: {
    key: "millennial",
    name: "Millennial",
    birthYears: "1981–1996",
    blurb: "Nativos del internet y la crisis. Prefieren vivir experiencias antes que acumular cosas.",
    giftTendency: "Personalización, marcas con historia, experiencias que se recuerdan.",
  },
  genz: {
    key: "genz",
    name: "Generación Z",
    birthYears: "1997–2012",
    blurb: "Pragmáticos y directos. Prefieren lo auténtico a lo perfecto, y lo útil a lo decorativo.",
    giftTendency: "Utilidad, estética que sorprende, personalización extrema.",
  },
  alpha: {
    key: "alpha",
    name: "Generación Alpha",
    birthYears: "2013–presente",
    blurb: "Los primeros nativos digitales completos. Creativos, visuales, acostumbrados a la personalización.",
    giftTendency: "Experiencias interactivas, tecnología, sorpresa.",
  },
};

export function getGeneration(birthDateISO: string): GenerationProfile | null {
  const year = new Date(birthDateISO + "T12:00:00Z").getUTCFullYear();
  if (isNaN(year)) return null;
  if (year <= 1945) return GENERATIONS.silenciosa;
  if (year <= 1964) return GENERATIONS.boomers;
  if (year <= 1980) return GENERATIONS.genx;
  if (year <= 1996) return GENERATIONS.millennial;
  if (year <= 2012) return GENERATIONS.genz;
  return GENERATIONS.alpha;
}
