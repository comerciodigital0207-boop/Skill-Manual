/* Adaptador para correr English Coach como Artifact de claude.ai.
   - Micrófono: dictado de Claude (en lugar de SpeechRecognition del navegador).
   - Profesor IA: la cuenta de Claude de quien abre la página (sin API key).
   - Progreso: se guarda también en la base de datos privada del Artifact.
   - Archivos (.ics y copia de seguridad): descarga con confirmación. */
(function () {
  "use strict";
  window.ARTIFACT_MODE = true;
  const use = (name) => (window.claude && window.claude.use ? window.claude.use(name).catch(() => null) : Promise.resolve(null));
  const toast = (msg) => { const t = document.getElementById("toast"); if (!t) return; t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 3000); };

  // ── Dictado → interfaz compatible con SpeechRecognition ──
  let dict = null;
  function result(text, isFinal) { const r = [{ transcript: text }]; r.isFinal = isFinal; return r; }
  class DictationRecognition {
    constructor() { this.onresult = null; this.onend = null; this.onerror = null; this._used = false; this._ended = false; this._off = []; }
    start() {
      if (!dict || this._used) throw new Error("unavailable"); // la app pasa a modo escritura
      this._used = true;
      const emit = (text, isFinal) => this.onresult && this.onresult({ resultIndex: 0, results: [result(text, isFinal)] });
      this._off.push(dict.onFinal(({ text }) => emit(text, true)));
      this._off.push(dict.onPartial(({ text }) => emit(text, false)));
      this._off.push(dict.onState(({ state }) => { if (state === "idle") this._end(); }));
      dict.start({ language: "en" }).catch((e) => {
        const code = e && e.code;
        if (code !== "stopped" && code !== "dismissed" && this.onerror) this.onerror({ error: code === "not_granted" ? "not-allowed" : "audio-capture" });
        else if (code === "dismissed") toast("Cerraste el permiso del micrófono. Toca Grabar otra vez o escribe tu respuesta.");
        this._end();
      });
    }
    stop() { if (dict) dict.stop().catch(() => {}); }
    _end() {
      if (this._ended) return; this._ended = true;
      this._off.forEach((off) => { try { off(); } catch (e) { /* ignorar */ } });
      if (this.onend) this.onend();
    }
  }
  window.SpeechRecognition = DictationRecognition;
  window.webkitSpeechRecognition = DictationRecognition;

  window.MIC_STATE = "checking";
  use("dictation").then((d) => {
    dict = d; window.MIC_STATE = d ? "yes" : "no";
    if (window.APP_RERENDER) window.APP_RERENDER();
  });

  // ── Voces de Claude para leer en inglés (más naturales); si no hay, la app usa las del navegador ──
  use("tts").then((t) => { if (t) window.APP_TTS = t; });

  // ── Profesor IA con la cuenta de Claude del usuario ──
  use("sample").then((sample) => {
    if (!sample) return;
    window.AI_BACKEND = async ({ system, messages, effort }) => {
      const turns = messages.map((m) => ({ role: m.role, content: String(m.content) }));
      turns[0] = { role: "user", content: "INSTRUCTIONS (follow them exactly):\n" + system + "\n\n---\n\n" + turns[0].content };
      try {
        const out = await sample(turns, { modelTier: effort === "low" ? "quick" : "default", cache: false });
        return (out.text || "").trim();
      } catch (e) {
        const code = e && e.code;
        if (code === "not_granted") throw new Error("Permiso denegado para usar Claude en esta página. Puedes activarlo en el menú de permisos del Artifact.");
        if (code === "rate_limited") throw new Error("Llegaste al límite de uso de Claude por ahora. Intenta más tarde.");
        throw new Error("El profesor IA no respondió" + (e && e.message ? ": " + e.message : "."));
      }
    };
    if (window.APP_RERENDER) window.APP_RERENDER();
  });

  // ── Descargas con confirmación ──
  use("downloads").then((dl) => {
    if (!dl) { window.APP_SAVE_FILE = () => toast("Las descargas no están disponibles en esta vista."); return; }
    window.APP_SAVE_FILE = (filename, text) => {
      dl.save({ filename, data: text }).catch((e) => {
        if (e && e.code === "rejected_extension") toast("Este tipo de archivo no se puede descargar aquí.");
        else if (e && e.code !== "declined" && e.code !== "cancelled") toast("No se pudo guardar el archivo.");
      });
    };
  });

  // ── Progreso en la base de datos privada del usuario ──
  Promise.all([use("db"), use("user")]).then(async ([db, user]) => {
    if (!db || !user) return;
    let id;
    try { id = await user.id(); } catch (e) { return; }
    if (!id) return;
    const ref = db.collection("data/users/" + id).doc("state");
    let writing = false, pending = null, timer = null;
    const flush = async () => {
      if (writing || !pending) return;
      writing = true; const data = pending; pending = null;
      try { await ref.set({ json: JSON.stringify({ ...data, settings: { ...data.settings, apiKey: "" } }), updatedAt: data.updatedAt || Date.now() }); }
      catch (e) { /* se reintenta con el próximo cambio */ }
      writing = false; if (pending) flush();
    };
    window.APP_PERSIST = (state) => { pending = state; clearTimeout(timer); timer = setTimeout(flush, 1500); };
    try {
      const snap = await Promise.race([ref.get(), new Promise((r) => setTimeout(() => r(null), 10000))]);
      const doc = snap && (typeof snap.data === "function" ? snap.data() : snap.data);
      if (doc && doc.json && window.APP_HYDRATE) window.APP_HYDRATE(JSON.parse(doc.json));
    } catch (e) { /* sin copia en la nube todavía */ }
  });
})();
