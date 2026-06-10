/**
 * ALIZEE — Cholq'ij / Nahuales (calendario sagrado Maya K'iche')
 *
 * El Cholq'ij es el calendario sagrado de 260 días usado por los pueblos
 * Maya K'iche' de Guatemala y sur de México. 20 nahuales × 13 tonos = 260 días.
 *
 * CÁLCULO: El índice de nahual (0-19) es idéntico al índice de sello Tzolkin
 * en birthProfile.ts — el mismo ciclo de 260 días, distinta tradición de nombres.
 *
 * Fuentes:
 *   - Instituto de Lingüística de Guatemala (ALMG)
 *   - Cosmología Maya K'iche' (Ajq'ijab' — guías espirituales mayas)
 *   - "El libro del destino" — Heriberto García Rivas
 */

export interface NahualData {
  index: number;        // 0-19
  name: string;         // nombre K'iche'
  spanishName: string;  // nombre en español
  element: "fuego" | "agua" | "aire" | "tierra";
  animal: string;       // animal o ser asociado
  symbol: string;       // glifo Unicode representativo
  essence: string;      // esencia en una línea
  gifts: string[];      // fortalezas naturales (2-3)
  shadow: string;       // desafío / lado oscuro
  mision: string;       // misión de vida
  tips: string[];       // consejos prácticos (3)
}

export const NAHUALES: NahualData[] = [
  /* 0 */ {
    index: 0,
    name: "Imox",
    spanishName: "Cocodrilo / Lagarto",
    element: "agua",
    animal: "Cocodrilo",
    symbol: "🐊",
    essence: "El subconsciente colectivo. Lo irracional que sostiene al mundo.",
    gifts: ["Intuición profunda que percibe lo invisible", "Sensibilidad para el tejido emocional de grupos", "Conexión con el mundo de los sueños y lo colectivo"],
    shadow: "Se pierde en el mundo interior; dificulad para anclar ideas en lo concreto",
    mision: "Ser puente entre lo invisible y lo visible. Sanar el tejido emocional colectivo.",
    tips: [
      "Establece rutinas físicas que te anclen: caminar, cocinar, ejercicio. Tu mente necesita ese contrapeso.",
      "Lleva un diario de sueños. Tu subconsciente te da información antes que tu mente consciente.",
      "Tu intuición es un don, no una rareza. Confía en ella, pero actúa también.",
    ],
  },

  /* 1 */ {
    index: 1,
    name: "Iq'",
    spanishName: "Viento / Espíritu",
    element: "aire",
    animal: "Colibrí",
    symbol: "💨",
    essence: "El viento que lleva ideas y las siembra en el mundo.",
    gifts: ["Comunicación que mueve e inspira", "Velocidad para captar y transmitir conceptos", "Capacidad de cambiar la atmósfera de una habitación"],
    shadow: "Inconstante — empieza mucho, termina poco. Las ideas se van tan rápido como llegan",
    mision: "Ser vehículo del pensamiento que transforma. Sembrar ideas que crezcan en otros.",
    tips: [
      "Escribe tus ideas en el momento en que llegan. El viento se las lleva si esperas.",
      "Elige una idea por semana para completar. Tu poder no está en generar — está en manifestar.",
      "Tu velocidad es un regalo para el mundo, pero primero es para ti.",
    ],
  },

  /* 2 */ {
    index: 2,
    name: "Aq'ab'al",
    spanishName: "Amanecer / Alba",
    element: "tierra",
    animal: "Conejo",
    symbol: "🌅",
    essence: "El umbral entre la oscuridad y la luz. Ve lo que otros no pueden antes del alba.",
    gifts: ["Claridad que llega después del caos", "Capacidad de ver posibilidades donde otros solo ven problemas", "Habilidad para facilitar transiciones y comienzos"],
    shadow: "Vive en el umbral — puede quedarse entre dos mundos sin cruzar a ninguno",
    mision: "Iluminar lo que está oculto. Ser catalizador de transiciones y nuevos ciclos.",
    tips: [
      "No temas el período oscuro. Siempre viene tu amanecer — es parte de tu diseño.",
      "Completa los ciclos que inicias. Tu claridad llega al final, no al principio.",
      "Eres especialmente poderoso en momentos de cambio — busca esos contextos.",
    ],
  },

  /* 3 */ {
    index: 3,
    name: "K'at",
    spanishName: "Red / Nudo",
    element: "fuego",
    animal: "Araña",
    symbol: "🕸️",
    essence: "La red que conecta. Tejedor de relaciones, recursos y comunidad.",
    gifts: ["Une personas y recursos de manera natural", "Crea redes de apoyo duraderas", "Ve las conexiones invisibles entre personas y situaciones"],
    shadow: "Puede enredarse en sus propias redes; acumula sin soltar lo que ya no sirve",
    mision: "Tejer el tejido social. Crear redes de apoyo que sostengan al colectivo.",
    tips: [
      "Aprende a soltar lo que ya no sirve — en relaciones, proyectos, objetos. Tu red se fortalece al limpiarla.",
      "Eres generoso por naturaleza. Asegúrate de que fluya en ambas direcciones.",
      "Tu mayor poder está en las conexiones que facilitas para otros, no solo para ti.",
    ],
  },

  /* 4 */ {
    index: 4,
    name: "Kan",
    spanishName: "Serpiente",
    element: "fuego",
    animal: "Serpiente Emplumada",
    symbol: "🐍",
    essence: "La energía vital. Poder, transformación y el fuego que asciende.",
    gifts: ["Fuerza vital y carisma magnético", "Capacidad de transformación profunda", "Sensualidad e inteligencia del cuerpo"],
    shadow: "Puede usar su poder para controlar. La tentación de manipular desde la sombra",
    mision: "Canalizar la energía vital hacia la elevación propia y del colectivo.",
    tips: [
      "Transforma el deseo en creación. Cuando sientes el impulso de controlar, pregúntate qué quieres crear.",
      "Tu cuerpo es tu oráculo. Escucha sus señales antes que a tu mente.",
      "La Serpiente que muerde se envenena a sí misma. Tu poder es para elevar.",
    ],
  },

  /* 5 */ {
    index: 5,
    name: "Keme",
    spanishName: "Muerte / Transformación",
    element: "agua",
    animal: "Búho",
    symbol: "💀",
    essence: "El guardián de las transiciones. La muerte que libera para el renacimiento.",
    gifts: ["No teme los finales — los abraza como parte del ciclo", "Facilita transformaciones profundas en otros", "Conexión con los ancestros y la sabiduría del linaje"],
    shadow: "Puede aferrarse a lo que ya murió, o desapegarse de todo antes de tiempo",
    mision: "Ser guardián de las transiciones. Transformar lo que termina en semilla para lo que comienza.",
    tips: [
      "Honra lo que termina. El duelo no es debilidad — es el ritual que abre el siguiente ciclo.",
      "Lo que sueltas te libera a ti también. No solo al otro.",
      "Tu relación con la muerte te da una libertad que pocos conocen — úsala para vivir más plenamente.",
    ],
  },

  /* 6 */ {
    index: 6,
    name: "Kej",
    spanishName: "Ciervo / Guardián",
    element: "tierra",
    animal: "Ciervo",
    symbol: "🦌",
    essence: "El guardián del bosque. Liderazgo con gracia, fuerza sin imposición.",
    gifts: ["Líder natural que cuida sin dominar", "Gracia y presencia que inspiran sin esfuerzo", "Conexión profunda con la naturaleza y la comunidad"],
    shadow: "Carga más responsabilidad de la que le corresponde; dificultad para delegar",
    mision: "Guiar con integridad. Ser ejemplo de que la fuerza y la ternura no se contradicen.",
    tips: [
      "El verdadero líder no carga solo. Confiar en tu manada no es debilidad — es sabiduría.",
      "Pasa tiempo en la naturaleza. Es donde te recargas y donde tu claridad regresa.",
      "Tu gracia no se impone. Las personas acuden a ti — deja que lleguen en vez de ir a buscarlas.",
    ],
  },

  /* 7 */ {
    index: 7,
    name: "Q'anil",
    spanishName: "Semilla / Abundancia",
    element: "tierra",
    animal: "Conejo / Liebre",
    symbol: "🌱",
    essence: "La semilla que siempre germina. Abundancia, fertilidad y multiplicación.",
    gifts: ["Todo lo que toca crece — en ideas, relaciones, proyectos", "Abundancia natural que desborda hacia otros", "Creatividad que se multiplica"],
    shadow: "Planta sin cosechar. Empieza sin terminar. Dispersa energía en demasiadas semillas",
    mision: "Manifestar semillas en frutos reales. Activar la abundancia no solo para sí mismo, sino para el colectivo.",
    tips: [
      "Cosecha antes de sembrar de nuevo. Tu momento de recoger es igual de sagrado que el de plantar.",
      "Elige tres proyectos y ciérralos. La abundancia se consolida con la cosecha, no con la siembra.",
      "Tu generosidad es real, pero también mereces recibir. Practica aceptar.",
    ],
  },

  /* 8 */ {
    index: 8,
    name: "Toj",
    spanishName: "Ofrenda / Lluvia",
    element: "agua",
    animal: "Jaguar del Agua",
    symbol: "🌧️",
    essence: "El equilibrio kármico. La ofrenda que restaura el balance del universo.",
    gifts: ["Sentido innato de justicia y equilibrio", "Capacidad de sanar deudas energéticas — propias y ajenas", "Generosidad profunda que no lleva cuenta"],
    shadow: "Se sacrifica en exceso. Siente que siempre debe algo — carga culpas que no son suyas",
    mision: "Restablecer el equilibrio. Devolver lo recibido. Sanar karma colectivo con su sola presencia.",
    tips: [
      "No toda deuda es tuya. Antes de pagar, pregúntate: ¿de quién es esta culpa realmente?",
      "Aprende a recibir sin sentirte en deuda. La abundancia que viene a ti también tiene su propósito.",
      "Tu equilibrio interno irradia hacia afuera. Cuídate a ti primero.",
    ],
  },

  /* 9 */ {
    index: 9,
    name: "Tz'i'",
    spanishName: "Perro / Ley",
    element: "fuego",
    animal: "Perro",
    symbol: "🐕",
    essence: "El guardián de la ley y la justicia. Fidelidad absoluta a los principios.",
    gifts: ["Fidelidad y sentido del deber inquebrantables", "Autoridad natural que se gana, no se impone", "Capacidad de sostener la justicia incluso cuando es difícil"],
    shadow: "Puede volverse rígido con las reglas. Juzga a otros desde sus propios estándares elevados",
    mision: "Ser guardián de la ley y la justicia. Proteger lo sagrado con integridad.",
    tips: [
      "La ley más alta es el amor. Sé fiel a tu corazón antes que a las reglas.",
      "Tu estándar es muy alto — recuerda que no todos están en el mismo nivel de camino. Compasión sin bajar el estándar.",
      "La fidelidad más importante es contigo mismo.",
    ],
  },

  /* 10 */ {
    index: 10,
    name: "B'atz'",
    spanishName: "Mono / Hilo del Tiempo",
    element: "fuego",
    animal: "Mono Araña",
    symbol: "🐒",
    essence: "El tejedor del tiempo. Arte, ceremonia y el hilo que conecta pasado con futuro.",
    gifts: ["Creatividad inagotable y artística", "Capacidad de tejer el tiempo a través del arte y la ceremonia", "Humor y ligereza que sanan"],
    shadow: "Se pierde en la creación sin aterrizarla. El juego puede convertirse en evasión",
    mision: "Tejer el hilo del tiempo a través del arte, la ceremonia y la alegría.",
    tips: [
      "Tu arte es medicina — para ti y para quien lo recibe. Deja de decir que es 'solo un hobby'.",
      "Completa una cosa antes de empezar la siguiente. El mono que termina lo que empieza es imparable.",
      "La risa es sagrada en tu camino. No la pierdas por ser 'serio'.",
    ],
  },

  /* 11 */ {
    index: 11,
    name: "E",
    spanishName: "Camino / Viaje",
    element: "tierra",
    animal: "Venado del Camino",
    symbol: "🛤️",
    essence: "El caminante. Su vida es el camino — guía a otros con el ejemplo de su viaje.",
    gifts: ["Siempre encuentra el camino, incluso sin mapa", "Aprende de cada persona que encuentra — todos son maestros", "Guía natural que lidera desde el ejemplo, no desde la instrucción"],
    shadow: "Se puede perder en el viaje y olvidar el destino. Caminar sin llegar",
    mision: "Recorrer su propio camino con conciencia. Guiar a otros no con palabras, sino con su manera de vivir.",
    tips: [
      "El viaje eres tú — pero llega también. Los destinos son puntos de consolidación, no de parada final.",
      "Cada persona en tu camino lleva un mensaje. Mantén los ojos abiertos.",
      "Honra tu cuerpo — es el vehículo de tu camino. Sin él, no hay viaje.",
    ],
  },

  /* 12 */ {
    index: 12,
    name: "Aj",
    spanishName: "Caña / Hogar",
    element: "aire",
    animal: "Loro Verde",
    symbol: "🌾",
    essence: "El portador del hogar. Construye espacios donde el ser humano puede florecer.",
    gifts: ["Constructor de hogares seguros — físicos y emocionales", "Autoridad serena que calma sin imponerse", "Raíces profundas que sostienen a quienes lo rodean"],
    shadow: "Puede volverse rígido con la tradición. Difícil de mover de lo conocido",
    mision: "Crear espacios de pertenencia donde las personas puedan ser quienes son.",
    tips: [
      "El hogar que construyes también te construye a ti. Cuida tu espacio como cuidas a los tuyos.",
      "La tradición es sabiduría — pero también puede ser jaula. Aprende a discernir cuál es cuál.",
      "Tu estabilidad es el regalo más grande que puedes dar a quienes te rodean.",
    ],
  },

  /* 13 */ {
    index: 13,
    name: "Ix",
    spanishName: "Jaguar / Magia",
    element: "tierra",
    animal: "Jaguar",
    symbol: "🐆",
    essence: "El nagual. Poder chamánico, magia y la capacidad de moverse entre mundos.",
    gifts: ["Poder espiritual y chamánico innato", "Intuición salvaje que no necesita explicación", "Guardián natural del mundo espiritual"],
    shadow: "Puede usar el poder oculto para fines oscuros, o temer tanto su propio poder que lo suprime",
    mision: "Ser guardián del mundo espiritual. Activar la magia con integridad al servicio del bien mayor.",
    tips: [
      "Tu poder crece con la oscuridad que integras, no con la que evitas.",
      "La magia que usas para otros regresa a ti. Úsala con intención limpia.",
      "Honra tu mundo interior — el jaguar necesita silencio y sombra para ver claramente.",
    ],
  },

  /* 14 */ {
    index: 14,
    name: "Tz'ikin",
    spanishName: "Pájaro / Águila",
    element: "aire",
    animal: "Águila",
    symbol: "🦅",
    essence: "El mensajero. Ve el panorama completo y lleva la visión entre lo humano y lo divino.",
    gifts: ["Visión de panorama que pocos tienen", "Capacidad de intermediar entre mundos y perspectivas", "Ve el futuro con claridad inusual"],
    shadow: "Puede ser demasiado idealista — pierde lo concreto por quedarse en las alturas",
    mision: "Ser mensajero entre lo humano y lo divino. Activar la visión del futuro en el colectivo.",
    tips: [
      "Aterriza tu visión en pasos concretos. El águila también necesita posarse.",
      "Comparte lo que ves, pero con compasión. No todos pueden ver desde tu altura — aún.",
      "Tu perspectiva de largo plazo es un regalo. No la cambies por la urgencia del corto plazo.",
    ],
  },

  /* 15 */ {
    index: 15,
    name: "Ajmaq",
    spanishName: "Buitre / Perdón",
    element: "agua",
    animal: "Buitre Rey",
    symbol: "🦅",
    essence: "El sanador del linaje. Perdón profundo y liberación del karma ancestral.",
    gifts: ["Capacidad de perdón que libera a todos", "Sanación de patrones transgeneracionales", "Conciencia expandida que ve los ciclos del tiempo largo"],
    shadow: "Carga culpas ajenas como propias. Dificultad para soltar el pasado — suyo y de sus ancestros",
    mision: "Sanar el linaje. Activar el perdón colectivo que libera a generaciones completas.",
    tips: [
      "El perdón es para ti primero. Sanar tu linaje empieza por soltarte tú.",
      "No todas las deudas del pasado son tuyas para pagar. Discerne con sabiduría.",
      "El buitre limpia lo que ya murió — ese es tu regalo. Sin ti, el mundo se llena de lo que ya no sirve.",
    ],
  },

  /* 16 */ {
    index: 16,
    name: "No'j",
    spanishName: "Tierra / Pensamiento",
    element: "tierra",
    animal: "Coyote",
    symbol: "🧠",
    essence: "La inteligencia cósmica. Pensamiento profundo al servicio del colectivo.",
    gifts: ["Pensamiento profundo que ve lo que otros no ven", "Sabiduría que parece innata pero viene de muchas vidas", "Acceso a la inteligencia colectiva cuando se necesita"],
    shadow: "Vive demasiado en la mente. La parálisis por análisis puede bloquearlo en el umbral de la acción",
    mision: "Activar la inteligencia al servicio del bien común. Pensar para todos, no solo para sí mismo.",
    tips: [
      "Tu mente es un instrumento, no tu identidad. Actúa también — no solo pienses.",
      "La tierra bajo tus pies es tu ancla. Camina descalzo cuando necesites claridad.",
      "El pensamiento sin acción es sueño. La acción sin pensamiento es caos. Eres el puente.",
    ],
  },

  /* 17 */ {
    index: 17,
    name: "Tijax",
    spanishName: "Pedernal / Filo",
    element: "aire",
    animal: "Murciélago",
    symbol: "🔪",
    essence: "El filo que sana. Cirugía espiritual que corta lo que ya no sirve.",
    gifts: ["Claridad quirúrgica — ve exactamente qué necesita ser cortado", "Capacidad de sanar con la palabra directa y precisa", "No teme la verdad, propia ni ajena"],
    shadow: "Puede herir con su claridad. Corta demasiado rápido, sin medir el impacto",
    mision: "Usar el filo para sanar, no para herir. La verdad dicha con amor es medicina; sin amor, es violencia.",
    tips: [
      "Tu verdad también tiene temperatura. Dila con calor.",
      "El pedernal corta — pero también enciende. Úsalo para iluminar, no solo para separar.",
      "Antes de hablar, pregúntate: ¿esto que voy a decir sirve a quien lo recibe?",
    ],
  },

  /* 18 */ {
    index: 18,
    name: "Kawoq",
    spanishName: "Tormenta / Comunidad",
    element: "agua",
    animal: "Tortuga",
    symbol: "⛈️",
    essence: "La tormenta que nutre. Servicio profundo y la construcción del hogar colectivo.",
    gifts: ["Energía inagotable para servir y nutrir a otros", "Crea comunidad donde antes no había", "El refugio que otros buscan en los momentos difíciles"],
    shadow: "Se agota sirviendo. Puede perderse en las necesidades de todos menos en las propias",
    mision: "Ser refugio para los demás. Construir comunidad desde el amor y no desde la obligación.",
    tips: [
      "Tú también necesitas refugio. Recibe de los que cuidas — deja que te cuiden.",
      "La tormenta que no se renueva se convierte en sequía. Recarga antes de dar.",
      "Sirve desde la plenitud, no desde el vacío. La diferencia la siente quien recibe.",
    ],
  },

  /* 19 */ {
    index: 19,
    name: "Ajpu'",
    spanishName: "Sol / Héroe",
    element: "fuego",
    animal: "Colibrí Solar",
    symbol: "☀️",
    essence: "El héroe solar. Nació para brillar, completar el ciclo y integrar luz y sombra.",
    gifts: ["Presencia solar que ilumina donde llega", "Valentía para enfrentar lo que otros evitan", "Energía que eleva el ambiente con sola su llegada"],
    shadow: "Puede perder de vista su propia sombra mientras ilumina a otros. El héroe que no se conoce, se destruye",
    mision: "Completar el ciclo heroico: integrar la luz y la sombra, y enseñar que ambas son sagradas.",
    tips: [
      "El sol también se pone. Honra tu noche tanto como tu día.",
      "El héroe que no conoce su sombra, eventualmente la vive. Vuélvete hacia adentro también.",
      "Brillas más cuando estás centrado que cuando estás encendido. La luz serena llega más lejos.",
    ],
  },
];

/** Devuelve el nahual por índice de sello (0-19, mismo que Tzolkin sealIndex) */
export function getNahual(sealIndex: number): NahualData {
  return NAHUALES[sealIndex % 20];
}
