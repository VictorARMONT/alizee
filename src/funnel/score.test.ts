import { describe, it, expect } from "vitest";
import { scoreArchetype, type Answers } from "@/funnel/score";

describe("scoreArchetype", () => {
  it("devuelve null sin respuestas", () => {
    expect(scoreArchetype({})).toBeNull();
  });

  it("devuelve null si ninguna respuesta puntúa arquetipo", () => {
    // relationship y profesion no tienen archetype
    const answers: Answers = { relationship: "papa" };
    expect(scoreArchetype(answers)).toBeNull();
  });

  it("gana el arquetipo con más coincidencias", () => {
    const answers: Answers = {
      proyeccion: "orden",     // lider
      decision: "oficina",     // lider
      presion: "control",      // lider
      energia: "observa",      // sabio
    };
    const res = scoreArchetype(answers);
    expect(res?.winner).toBe("lider");
    expect(res?.scores.lider).toBe(3);
    expect(res?.scores.sabio).toBe(1);
    expect(res?.tiebreakerUsed).toBe(false);
  });

  it("usa Q8/valores para desempatar (valores también suma su punto)", () => {
    const answers: Answers = {
      proyeccion: "orden",       // lider
      decision: "oficina",       // lider  → lider 2
      energia: "observa",        // sabio  → sabio 1
      valores: "profundidad",    // sabio  → sabio 2 (empate 2-2) + tiebreaker
    };
    const res = scoreArchetype(answers);
    expect(res?.scores.lider).toBe(2);
    expect(res?.scores.sabio).toBe(2);
    expect(res?.winner).toBe("sabio");
    expect(res?.tiebreakerUsed).toBe(true);
  });

  it("empate sin tiebreaker resuelve por orden canónico (determinístico)", () => {
    const answers: Answers = {
      proyeccion: "movimiento",  // explorador
      decision: "taller",        // creador → empate 1-1, sin valores
    };
    const res = scoreArchetype(answers);
    // ARCHETYPE_ORDER = [lider, explorador, creador, sabio] → explorador primero
    expect(res?.winner).toBe("explorador");
    expect(res?.tiebreakerUsed).toBe(true);
  });
});
