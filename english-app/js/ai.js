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
Always teach AMERICAN English (United States): US spelling (color, center, realize), US vocabulary (apartment, vacation, movie, check, cell phone, line, fall) and how people really talk in the US. If the student uses British forms, point it out and give the American version.
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
      const beginner = level === "A1" || level === "A2";
      return ask({
        system: `You are Kate, a warm, patient native English teacher from the United States. Your student is a Spanish speaker at CEFR level ${level}. They understand more than they can say, so you must make it EASY for them to answer.
Scenario (stay in character for it): ${scenario}
How you talk:
- Natural American English as people really speak in the US, with contractions. ${beginner ? "Because the student is a beginner: use VERY short, simple sentences (max 10 words each), common words, and only very common expressions (like \"no worries\", \"sounds good\"). Ask only ONE simple question at a time, preferably yes/no or with an obvious answer." : "Use everyday expressions and some common slang (gonna, kinda, for sure), 1-3 short sentences."} Keep it clean.
- Always end with one question so the student keeps talking. If their answer is very short, gently ask for one more detail.
- If the student writes in Spanish, they don't know how to say it: give them the English version and invite them to say it.
OUTPUT FORMAT — always exactly this, each item on its own line:
1) Your reply in English (in character).
2) A line starting with "🇪🇸 " with the Spanish translation of your reply.
3) ONLY if the student's last message had a mistake or sounded unnatural: a line starting with "💡 " with the corrected/native sentence in English, then " — " and a short explanation in Spanish, and ask them to repeat it out loud.
4) Three lines starting with "➡️ ", each one a possible answer the student could say next, at their level (${beginner ? "very short and simple" : "natural"}), written as: English answer | traducción al español. Make them different (for example: yes / no / a detail).
Never add anything else.`,
        messages: history.map((m) => ({ role: m.role, content: m.content })),
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
