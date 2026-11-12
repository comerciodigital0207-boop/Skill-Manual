/* Profesor IA opcional (Claude). Si no hay API key, la app funciona igual con corrección automática.
   La key se guarda solo en este navegador y se envía únicamente a api.anthropic.com. */
(function () {
  const SDK_URL = "https://esm.sh/@anthropic-ai/sdk@1.2.0";
  const FALLBACK_MODELS = ["claude-opus-5-5", "claude-sonnet-5-5"]; // admiten fallbacks "default"
  let clientPromise = null;
  let clientKey = null;

  async function getClient(apiKey) {
    if (!clientPromise || clientKey !== apiKey) {
      clientKey = apiKey;
      clientPromise = import(SDK_URL).then((mod) => {
        const Anthropic = mod.default || mod.Anthropic;
        return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      });
    }
    return clientPromise;
  }

  function textOf(msg) {
    return (msg.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  }

  async function ask({ system, messages, effort = "medium", maxTokens = 4000 }) {
    if (window.AI_BACKEND) return window.AI_BACKEND({ system, messages, effort });
    const s = window.APP_SETTINGS();
    if (!s.apiKey) throw new Error("NO_KEY");
    const client = await getClient(s.apiKey);
    const model = s.model || "claude-opus-5-5";
    const params = {
      model,
      max_tokens: maxTokens,
      system,
      messages,
      output_config: { effort }
    };
    let msg;
    try {
      if (FALLBACK_MODELS.includes(model)) {
        msg = await client.beta.messages.create({
          ...params,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default"
        });
      } else {
        msg = await client.messages.create(params);
      }
    } catch (err) {
      const status = err && err.status;
      if (status === 401) throw new Error("La API key no es válida. Revísala en Ajustes.");
      if (status === 429) throw new Error("Demasiadas solicitudes o sin saldo. Intenta en un minuto o revisa tu cuenta de Anthropic.");
      if (status === 400) throw new Error("Solicitud rechazada (400): " + (err.message || ""));
      if (status >= 500) throw new Error("El servicio de IA no está disponible ahora. Intenta de nuevo.");
      throw new Error("No se pudo conectar con la IA: " + (err && err.message ? err.message : err));
    }
    if (msg.stop_reason === "refusal") throw new Error("La IA no pudo responder a esta solicitud.");
    return textOf(msg);
  }

  function teacherSystem(level) {
    return `You are a warm, demanding and precise English teacher for a native Spanish speaker.
The student's current CEFR level is ${level}; their goal is to reach B2 and then C1, with the priority of understanding and communicating well.
Write your explanations in Spanish, but keep every English example, correction and model sentence in English.
Be specific: quote the student's exact words, show the corrected version, and explain the rule in one short sentence.
Prioritize errors that block communication, then grammar, then naturalness. Don't overwhelm: at most 8 errors.
Format with short headings and bullet points (plain markdown, no tables).`;
  }

  function parseScore(text) {
    const m = text.match(/SCORE:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);
    return m ? Math.max(0, Math.min(10, parseFloat(m[1]))) : null;
  }

  window.AI = {
    enabled() { return !!window.AI_BACKEND || !!window.APP_SETTINGS().apiKey; },

    async reviewWriting({ level, unit, task, text }) {
      const out = await ask({
        system: teacherSystem(level),
        effort: "medium",
        messages: [{
          role: "user",
          content: `Unidad: "${unit.title}" — gramática objetivo: ${unit.grammar.name}.
Vocabulario objetivo: ${unit.vocab.map((v) => v[0]).join(", ")}.
Tarea: ${task}

Texto del estudiante:
"""
${text}
"""

Corrige la tarea con estas secciones:
## Nota y nivel estimado (CEFR)
## Texto corregido
## Errores (error → corrección → por qué)
## Lo que hiciste bien
## Cómo sonar más natural (2-3 frases reescritas a un nivel superior)
## Qué repasar (temas concretos)
Termina con una última línea exactamente así: SCORE: X/10`
        }]
      });
      return { text: out, score: parseScore(out) };
    },

    async reviewSpeaking({ level, prompt, transcript, seconds }) {
      const wpm = seconds > 0 ? Math.round((transcript.split(/\s+/).filter(Boolean).length / seconds) * 60) : 0;
      const out = await ask({
        system: teacherSystem(level),
        effort: "medium",
        messages: [{
          role: "user",
          content: `Esto es la transcripción automática (reconocimiento de voz) de lo que el estudiante DIJO en voz alta. Ignora la puntuación y las mayúsculas; si una palabra parece mal reconocida, puede ser un problema de pronunciación: menciónalo.
Consigna de speaking: ${prompt}
Duración: ${seconds} s (~${wpm} palabras por minuto).

Transcripción:
"""
${transcript}
"""

Da feedback de speaking con estas secciones:
## Nota y nivel estimado (CEFR)
## Fluidez y estructura (¿se entiende? ¿organiza las ideas?)
## Errores de gramática y vocabulario (error → corrección → por qué)
## Posibles problemas de pronunciación
## Versión mejorada (cómo lo diría alguien de nivel B2/C1, máximo 120 palabras)
## Frases útiles para la próxima vez (5)
Termina con una última línea exactamente así: SCORE: X/10`
        }]
      });
      return { text: out, score: parseScore(out) };
    },

    async chat({ level, scenario, history }) {
      return ask({
        system: `You are Kate, a warm but demanding native English teacher from the United States. Your student is a Spanish speaker at CEFR level ${level} who wants to reach B2/C1 and speak naturally.
Scenario for this conversation: ${scenario}
Rules:
- Reply like a real person in the United States talks in everyday life: casual American English, contractions, common everyday slang and expressions (gonna, wanna, kinda, "no worries", "for sure", "I'm good", "what's up"), never textbook-sounding. Keep it clean (no profanity). 1-3 short sentences, adapted to ${level} (just slightly above their level).
- When you use slang or an idiom the student may not know, add its meaning in Spanish in parentheses the first time.
- Always end with a question so the student keeps talking. If their answer is very short (fewer than 6 words), ask them to say more ("Tell me more!", "Why?").
- If the student's last message had ANY grammar, word-choice or unnatural-phrasing mistake, add a final separate line starting with "💡" with: the corrected sentence in English, a 1-sentence explanation in Spanish of why, and ask them to repeat the corrected sentence out loud. If the message was correct but sounds like a textbook or a learner, give the way someone from the US would actually say it.
- If the student writes in Spanish, answer in English and show how to say what they meant.
- Never break character except for the 💡 line.`,
        messages: history,
        effort: "low",
        maxTokens: 1000
      });
    },

    async explain({ level, question }) {
      return ask({
        system: teacherSystem(level),
        messages: [{ role: "user", content: question }],
        effort: "low",
        maxTokens: 2000
      });
    }
  };
})();
