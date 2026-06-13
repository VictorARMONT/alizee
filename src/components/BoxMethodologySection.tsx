import { ScrollReveal } from "@/components/ScrollReveal";

/**
 * Sección pública (home) — transparencia total ANTES de comprar:
 *   1. Qué trae el box, en detalle, SIN revelar el regalo único y secreto.
 *   2. Cómo lo analizamos: disciplinas, modelos de datos y técnicas.
 *
 * Eje narrativo (decisión de Victor): la convergencia entre disciplinas
 * independientes — triangulación / validez convergente — es la prueba.
 */

interface BoxItem {
  glyph: string;
  title: string;
  detail: string;
  /** ítem secreto: se muestra como caja cerrada, sin revelar contenido */
  secret?: boolean;
}

const BOX_ITEMS: BoxItem[] = [
  {
    glyph: "▲",
    title: "Pieza personalizada · diseño único",
    detail:
      "Un objeto diseñado a partir de su lectura: arquetipo, signo, animal y sistemas de identidad. Puede ser una escultura, una funda, una pieza en resina — el formato se elige según quién es él. No hay dos iguales.",
  },
  {
    glyph: "◈",
    title: "Piedra de poder · natural",
    detail:
      "No una piedra al azar: la familia mineral en la que coinciden más sistemas independientes (mes GIA, signo, planeta regente, año chino, nahual maya). La que más disciplinas confirman es la que llega en el box.",
  },
  {
    glyph: "◆",
    title: "Dossier de análisis · impreso",
    detail:
      "Su lectura completa en papel: arquetipo, signo, nahual, números, lugar de poder y la afirmación personal. Pensado para leerse despacio, no para tirarse.",
  },
  {
    glyph: "✦",
    title: "Vela ritual",
    detail:
      "Copal mexicano o palo santo según su arquetipo. El activo de marca más universal en México: protección y arraigo.",
  },
  {
    glyph: "◎",
    title: "Pieza ancla + complemento",
    detail:
      "Una pieza principal (reloj o piel según arquetipo) y un complemento curado (fragancia o destilado). El arquetipo decide el contenido; el nivel del box, la profundidad.",
  },
  {
    glyph: "✕",
    title: "El regalo único y secreto",
    detail:
      "Una pieza más, curada a su lectura exacta. No la revelamos aquí — es el clímax al abrir el box. Va incluida, no se elige, y nunca se repite igual.",
    secret: true,
  },
];

interface Discipline {
  name: string;
  field: string;
}

const DISCIPLINES: Discipline[] = [
  { name: "Arquetipos",          field: "Psicología junguiana" },
  { name: "Eneagrama",           field: "Tipología de la personalidad" },
  { name: "Diseño Humano",       field: "Sistema energético contemporáneo" },
  { name: "Astrología occidental", field: "Signo solar · efemérides" },
  { name: "Jyotish",             field: "Astrología india · planeta regente" },
  { name: "Zodíaco chino + Saju", field: "Calendario lunar · elementos" },
  { name: "Calendario maya",     field: "Tzolkin / Cholq'ij · nahual" },
  { name: "Gemología (GIA)",     field: "Birthstones estándar de industria" },
  { name: "Lapidaria histórica", field: "Occidental, védica y mesoamericana" },
  { name: "Astrocartografía",    field: "Líneas planetarias · lugar de poder" },
];

interface DataModel {
  input: string;
  output: string;
  note: string;
}

const DATA_MODELS: DataModel[] = [
  { input: "Fecha", output: "Signo solar", note: "Rangos de efemérides tropicales" },
  { input: "Año", output: "Animal chino + Saju", note: "Tabla exacta de Año Nuevo Lunar 1924–2030" },
  { input: "Fecha", output: "Kin maya / nahual", note: "Dreamspell con ajuste de bisiestos" },
  { input: "Respuestas del quiz", output: "Arquetipo", note: "Scoring ponderado con desempate" },
];

const TECHNIQUES: { title: string; body: string }[] = [
  {
    title: "Triangulación (validez convergente)",
    body: "Cruzamos sistemas que se construyeron sin contacto entre sí. Cuando coinciden, la afirmación gana fuerza — no porque lo digamos, sino porque varios marcos llegan al mismo punto por su cuenta.",
  },
  {
    title: "Normalización por familia mineral",
    body: "Rubí y Zafiro son el mismo mineral (corindón); Amatista, Ágata y Citrino son cuarzo. Agrupamos por familia para detectar coincidencias reales entre sistemas que usan nombres distintos.",
  },
  {
    title: "Fidelidad a las fuentes",
    body: "Cada dato cita su sistema de origen (GIA 1912, Jyotish, lapidaria maya…). No mezclamos ni inventamos correspondencias: si una tradición no lo respalda, no entra.",
  },
];

export function BoxMethodologySection() {
  return (
    <>
      {/* ── QUÉ TRAE EL BOX ── */}
      <ScrollReveal delay={80}>
        <section className="px-5 mt-12 flex flex-col gap-5">
          <SectionLabel>Qué trae el box</SectionLabel>
          <h2 className="text-[24px] font-bold tracking-tight leading-tight text-[var(--brand-fg)] -mt-1">
            Todo lo que recibe — sin spoilers del regalo secreto.
          </h2>
          <p className="text-[14px] leading-relaxed text-[var(--brand-fg-muted)] -mt-1">
            Cada box es un objeto físico real, no una tarjeta digital. Esto es lo que llega a su puerta:
          </p>
          <div className="flex flex-col gap-3">
            {BOX_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 items-start rounded-[var(--radius-md)] border p-4"
                style={
                  item.secret
                    ? { borderColor: "rgba(233,30,140,0.35)", background: "linear-gradient(135deg, rgba(249,115,22,0.05) 0%, rgba(233,30,140,0.07) 100%)" }
                    : { borderColor: "var(--brand-border)", background: "var(--brand-surface)" }
                }
              >
                <span
                  className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-[15px]"
                  style={
                    item.secret
                      ? { background: "linear-gradient(135deg, #F97316 0%, #E91E8C 100%)", color: "#fff" }
                      : { background: "var(--brand-bg)", color: "var(--brand-primary)", border: "1px solid var(--brand-border)" }
                  }
                >
                  {item.glyph}
                </span>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[15px] font-semibold text-[var(--brand-fg)]">{item.title}</p>
                    {item.secret && (
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(233,30,140,0.12)", color: "var(--brand-primary)" }}
                      >
                        Sorpresa
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] leading-relaxed text-[var(--brand-fg-muted)] mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── CÓMO LO ANALIZAMOS ── */}
      <ScrollReveal delay={80}>
        <section className="px-5 mt-12 flex flex-col gap-5">
          <SectionLabel>Cómo lo analizamos</SectionLabel>
          <h2 className="text-[24px] font-bold tracking-tight leading-tight text-[var(--brand-fg)] -mt-1">
            La coincidencia entre sistemas distintos es la prueba.
          </h2>
          <p className="text-[14px] leading-relaxed text-[var(--brand-fg-muted)] -mt-1">
            Leemos a la persona desde varias disciplinas que nacieron por separado. Mientras más sistemas
            independientes apuntan a lo mismo, más confiable es la lectura. A eso le llamamos triangulación.
          </p>

          {/* Disciplinas */}
          <div className="rounded-[var(--radius-md)] border bg-[var(--brand-surface)] p-5" style={{ borderColor: "var(--brand-border)" }}>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)] mb-3">
              Disciplinas y áreas de conocimiento
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
              {DISCIPLINES.map((d) => (
                <div key={d.name} className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-[5px] h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-primary)" }} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--brand-fg)] leading-tight">{d.name}</p>
                    <p className="text-[11px] text-[var(--brand-fg-muted)] leading-snug">{d.field}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modelos de datos */}
          <div className="rounded-[var(--radius-md)] border bg-[var(--brand-surface)] p-5" style={{ borderColor: "var(--brand-border)" }}>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)] mb-3">
              Modelos de datos
            </p>
            <div className="flex flex-col gap-2.5">
              {DATA_MODELS.map((m) => (
                <div key={m.output} className="flex flex-col gap-0.5">
                  <p className="text-[13px] text-[var(--brand-fg)] leading-tight">
                    <span className="font-medium">{m.input}</span>
                    <span className="mx-1.5" style={{ color: "var(--brand-primary)" }}>→</span>
                    <span className="font-semibold">{m.output}</span>
                  </p>
                  <p className="text-[11px] text-[var(--brand-fg-muted)] leading-snug">{m.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Técnicas */}
          <div className="flex flex-col gap-3">
            {TECHNIQUES.map((t) => (
              <div
                key={t.title}
                className="rounded-[var(--radius-md)] border bg-[var(--brand-surface)] p-4 flex flex-col gap-1"
                style={{ borderColor: "var(--brand-border)" }}
              >
                <p className="text-[14px] font-semibold text-[var(--brand-fg)]">{t.title}</p>
                <p className="text-[13px] leading-relaxed text-[var(--brand-fg-muted)]">{t.body}</p>
              </div>
            ))}
          </div>

          {/* Ejemplo de convergencia */}
          <div
            className="rounded-[var(--radius-lg)] overflow-hidden p-5 flex flex-col gap-2"
            style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(233,30,140,0.08) 100%)", border: "1px solid rgba(233,30,140,0.18)" }}
          >
            <p className="text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "var(--brand-primary)" }}>
              Ejemplo real
            </p>
            <p className="text-[13px] leading-relaxed text-[var(--brand-fg)]">
              Un nacido en febrero, signo Acuario, año del Dragón: la gemología (GIA) marca <strong>Amatista</strong>,
              la lapidaria del signo marca <strong>Amatista</strong>, y la tradición china del Dragón también marca
              <strong> Amatista</strong>. Tres sistemas que no se hablan, mismo cuarzo. Esa es su piedra — y por eso lo es.
            </p>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.26em] font-semibold" style={{ color: "var(--brand-primary)" }}>
      {children}
    </p>
  );
}
