/* English Coach — app principal (sin dependencias, datos en este dispositivo). */
(function () {
  "use strict";
  const C = window.CURRICULUM;
  const PLAN = window.DAY_PLAN;
  const LEVELS = ["A2", "B1", "B2", "C1"];
  const STORE_KEY = "englishCoach.v1";
  const SRS_DAYS = [0, 1, 3, 7, 14, 30, 60, 120];

  // ───────────────────────── Estado ─────────────────────────
  const defaults = () => ({
    profile: null,
    settings: { studyTime: "19:00", reviewTime: "08:00", days: [1, 2, 3, 4, 5, 6], notify: false, apiKey: "", model: "claude-opus-5-5", rate: 0.95, voice: "" },
    progress: { unit: 0, step: 0 },
    log: {},
    cards: {},
    topicStats: {},
    skillStats: { grammar: [0, 0], vocab: [0, 0], listening: [0, 0], speaking: [0, 0], writing: [0, 0] },
    mistakes: [],
    homework: [],
    streak: { count: 0, last: null },
    alarms: { study: null, review: null },
    unitScores: {}
  });

  let S = load();
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaults();
      const d = defaults();
      const parsed = JSON.parse(raw);
      return { ...d, ...parsed, settings: { ...d.settings, ...(parsed.settings || {}) }, skillStats: { ...d.skillStats, ...(parsed.skillStats || {}) } };
    } catch (e) { return defaults(); }
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* almacenamiento no disponible */ } }
  window.APP_SETTINGS = () => S.settings;

  // ───────────────────────── Utilidades ─────────────────────────
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const today = () => dateKey(new Date());
  function dateKey(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function addDays(key, n) { const d = new Date(key + "T12:00:00"); d.setDate(d.getDate() + n); return dateKey(d); }
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pct = (r, w) => (r + w ? Math.round((r / (r + w)) * 100) : null);
  const words = (t) => (t || "").toLowerCase().replace(/[^a-z0-9'\s]/g, " ").split(/\s+/).filter(Boolean);
  const ytLink = (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
  const spLink = (q) => "https://open.spotify.com/search/" + encodeURIComponent(q) + "/podcasts";
  const unitIndex = (id) => C.findIndex((u) => u.id === id);
  const curUnit = () => C[Math.min(S.progress.unit, C.length - 1)];
  const currentLevel = () => curUnit().level;
  const finished = () => S.progress.unit >= C.length;

  function dayLog(key = today()) {
    if (!S.log[key]) S.log[key] = { steps: [], minutes: 0, vocab: [], mistakes: [], speakingWords: 0, reviews: 0 };
    return S.log[key];
  }
  function similarity(a, b) {
    const x = words(a), y = words(b);
    if (!x.length || !y.length) return 0;
    const dp = Array(x.length + 1).fill(0).map(() => Array(y.length + 1).fill(0));
    for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) dp[i][j] = x[i - 1] === y[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    return Math.round((dp[x.length][y.length] / Math.max(x.length, y.length)) * 100);
  }
  function md(text) {
    // markdown mínimo y seguro para el feedback de la IA
    const lines = esc(text).split("\n");
    let html = "", inList = false;
    for (const l of lines) {
      const li = l.match(/^\s*[-*•]\s+(.*)/) || l.match(/^\s*\d+[.)]\s+(.*)/);
      if (li) { if (!inList) { html += "<ul>"; inList = true; } html += "<li>" + inline(li[1]) + "</li>"; continue; }
      if (inList) { html += "</ul>"; inList = false; }
      const h = l.match(/^#{1,4}\s+(.*)/);
      if (h) html += "<h4>" + inline(h[1]) + "</h4>";
      else if (l.trim()) html += "<p>" + inline(l) + "</p>";
    }
    if (inList) html += "</ul>";
    return html;
    function inline(s) { return s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>").replace(/`(.+?)`/g, "<code>$1</code>"); }
  }
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // ───────────────────────── Voz (TTS + reconocimiento) ─────────────────────────
  let voices = [];
  function loadVoices() { voices = (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter((v) => /^en[-_]/i.test(v.lang)); }
  if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function speak(text, rate) {
    if (!window.speechSynthesis) { toast("Tu navegador no soporta lectura en voz alta"); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = rate || S.settings.rate;
    const v = voices.find((x) => x.name === S.settings.voice) || voices.find((x) => /en-US/i.test(x.lang)) || voices[0];
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function startRecognition({ onText, onEnd }) {
    if (!SR) { toast("Reconocimiento de voz no disponible. Usa Chrome o Edge (en Android/PC) o Safari reciente."); return null; }
    const rec = new SR();
    rec.lang = "en-US"; rec.interimResults = true; rec.continuous = true;
    let finalText = "", stopped = false;
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript + " "; else interim += r[0].transcript;
      }
      onText((finalText + interim).trim());
    };
    rec.onerror = (e) => { if (e.error === "not-allowed") toast("Permite el uso del micrófono para practicar speaking"); };
    rec.onend = () => { if (!stopped) { try { rec.start(); } catch (e) { onEnd && onEnd(finalText.trim()); } } else onEnd && onEnd(finalText.trim()); };
    rec.start();
    return { stop() { stopped = true; rec.stop(); }, get text() { return finalText.trim(); } };
  }

  // ───────────────────────── Estadísticas y SRS ─────────────────────────
  function record(unitId, skill, ok, detail) {
    const t = (S.topicStats[unitId] = S.topicStats[unitId] || [0, 0]);
    t[ok ? 0 : 1]++;
    const k = S.skillStats[skill] || (S.skillStats[skill] = [0, 0]);
    k[ok ? 0 : 1]++;
    if (!ok && detail) {
      S.mistakes.unshift({ date: today(), unitId, skill, ...detail });
      S.mistakes = S.mistakes.slice(0, 200);
      dayLog().mistakes.push(detail);
    }
  }
  function addCards(unit) {
    unit.vocab.forEach(([en, es, ex]) => {
      const id = unit.id + ":" + en;
      if (!S.cards[id]) S.cards[id] = { id, en, es, ex, unitId: unit.id, box: 0, due: today() };
    });
  }
  function addMistakeCard(unitId, front, back) {
    const id = "err:" + front.slice(0, 60);
    S.cards[id] = { id, en: back, es: front, ex: "", unitId, box: 0, due: today(), mistake: true };
  }
  const dueCards = () => Object.values(S.cards).filter((c) => c.due <= today()).sort((a, b) => (a.seen || 0) - (b.seen || 0));
  function gradeCard(card, quality) {
    // quality: 0 otra vez, 1 difícil, 2 bien, 3 fácil
    if (quality === 0) card.box = 0;
    else if (quality === 1) card.box = Math.max(1, card.box);
    else card.box = Math.min(SRS_DAYS.length - 1, card.box + (quality === 3 ? 2 : 1));
    card.due = addDays(today(), quality === 0 ? 0 : SRS_DAYS[card.box] || 1);
    card.seen = Date.now(); // las falladas vuelven al final de la fila, no de inmediato
    record(card.unitId, "vocab", quality >= 2);
    dayLog().reviews++;
  }
  function touchStreak() {
    const t = today();
    if (S.streak.last === t) return;
    S.streak.count = S.streak.last === addDays(t, -1) ? S.streak.count + 1 : 1;
    S.streak.last = t;
  }
  function weakTopics(limit = 5) {
    return Object.entries(S.topicStats)
      .map(([id, [r, w]]) => ({ id, r, w, p: pct(r, w), unit: C[unitIndex(id)] }))
      .filter((x) => x.unit && x.r + x.w >= 3 && x.p < 75)
      .sort((a, b) => a.p - b.p)
      .slice(0, limit);
  }

  // ───────────────────────── Progreso ─────────────────────────
  function completeStep(minutes, score) {
    const u = curUnit();
    const step = PLAN[S.progress.step];
    const log = dayLog();
    log.steps.push({ unitId: u.id, step: step.key, title: u.title, score: score == null ? null : score });
    log.minutes += minutes || 15;
    touchStreak();
    if (step.key === "test") {
      S.unitScores[u.id] = Math.max(S.unitScores[u.id] || 0, score || 0);
      if ((score || 0) >= 70) { S.progress.unit++; S.progress.step = 0; }
      else { S.progress.step = 1; } // volver a practicar antes de repetir el examen
    } else S.progress.step++;
    save();
  }
  function lessonsDone() {
    return Object.values(S.log).reduce((n, d) => n + d.steps.length, 0);
  }
  function lastStudyDay() {
    const keys = Object.keys(S.log).filter((k) => k < today() && S.log[k].steps.length).sort();
    return keys.length ? keys[keys.length - 1] : null;
  }

  // ───────────────────────── Alarmas ─────────────────────────
  async function notify(title, body) {
    try {
      if (!("Notification" in window) || Notification.permission !== "granted") return false;
      const reg = navigator.serviceWorker && (await navigator.serviceWorker.getRegistration());
      if (reg) await reg.showNotification(title, { body, icon: "icon.svg", badge: "icon.svg", tag: "english-coach" });
      else new Notification(title, { body, icon: "icon.svg" });
      return true;
    } catch (e) { return false; }
  }
  function checkAlarms() {
    if (!S.profile) return;
    const now = new Date();
    const t = today();
    const hhmm = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    const studyDay = S.settings.days.includes(now.getDay());
    const doneToday = dayLog().steps.length > 0;
    if (S.settings.notify && studyDay && !doneToday && hhmm >= S.settings.studyTime && S.alarms.study !== t) {
      S.alarms.study = t; save();
      const u = curUnit();
      notify("⏰ Hora de tu clase de inglés", `Hoy: ${u.title} — ${PLAN[S.progress.step].name}. ¡Mantén tu racha de ${S.streak.count} días!`);
      showBanner(`⏰ Es hora de tu clase: <b>${esc(u.title)}</b> — ${PLAN[S.progress.step].name}`);
    }
    const due = dueCards().length;
    if (S.settings.notify && due && hhmm >= S.settings.reviewTime && S.alarms.review !== t) {
      S.alarms.review = t; save();
      notify("🔁 Repaso pendiente", `Tienes ${due} tarjetas para repasar (5 minutos).`);
    }
    const overdue = S.homework.filter((h) => h.status === "pending" && h.due < t).length;
    if (overdue && S.alarms.hw !== t && S.settings.notify && hhmm >= S.settings.studyTime) {
      S.alarms.hw = t; save();
      notify("📝 Tarea atrasada", `Tienes ${overdue} tarea(s) de escritura pendientes.`);
    }
  }
  function showBanner(html) { const b = $("#banner"); b.innerHTML = html + ' <button class="link" data-action="go" data-view="class">Empezar</button>'; b.hidden = false; }
  function buildICS() {
    const map = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    const byday = S.settings.days.map((d) => map[d]).join(",");
    const start = new Date();
    const stamp = (d) => d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
    const t = (hhmm) => hhmm.replace(":", "") + "00";
    const ev = (uid, summary, time, mins, desc) => [
      "BEGIN:VEVENT", "UID:" + uid + "@english-coach", "DTSTAMP:" + stamp(start) + "T000000Z",
      "DTSTART:" + stamp(start) + "T" + t(time),
      "DURATION:PT" + mins + "M", "RRULE:FREQ=WEEKLY;BYDAY=" + byday, "SUMMARY:" + summary, "DESCRIPTION:" + desc,
      "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + summary, "TRIGGER:-PT0M", "END:VALARM",
      "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + summary + " en 10 minutos", "TRIGGER:-PT10M", "END:VALARM",
      "END:VEVENT"
    ];
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//English Coach//ES", "CALSCALE:GREGORIAN",
      ...ev("study", "Clase de inglés (English Coach)", S.settings.studyTime, (S.profile && S.profile.minutes) || 30, "Abre English Coach y haz la clase del día."),
      ...ev("review", "Repaso de inglés 5 min (English Coach)", S.settings.reviewTime, 10, "Repasa tus flashcards en English Coach."),
      "END:VCALENDAR"];
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "english-coach-alarmas.ics"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  // ───────────────────────── Router ─────────────────────────
  let view = "today";
  let ctx = {}; // estado temporal de la vista
  function go(v, extra) { view = v; ctx = extra || {}; render(); window.scrollTo(0, 0); }

  function render() {
    const main = $("#main");
    document.querySelectorAll(".nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    $("#nav").hidden = !S.profile;
    $("#streak").textContent = S.profile ? "🔥 " + S.streak.count : "";
    if (!S.profile) { main.innerHTML = viewOnboarding(); return; }
    const views = { today: viewToday, class: viewClass, review: viewReview, homework: viewHomework, speaking: viewSpeaking, progress: viewProgress, settings: viewSettings, unit: viewUnitStudy };
    main.innerHTML = (views[view] || viewToday)();
    if (view === "class" || view === "unit") afterClassRender();
  }

  // ───────────────────────── Onboarding + test de nivel ─────────────────────────
  function placementQuestions() {
    const qs = [];
    LEVELS.forEach((lv) => {
      C.filter((u) => u.level === lv).filter((_, i) => i % 2 === 0).forEach((u) => qs.push({ ...u.quiz[0], level: lv, unitId: u.id }));
    });
    return qs;
  }
  function viewOnboarding() {
    if (!ctx.stage) {
      return `<section class="card hero">
        <h1>👋 Bienvenido a tu English Coach</h1>
        <p>Un plan diario de <b>A2 a C1</b>: clases cortas, repaso de lo de ayer, tareas corregidas, speaking, evaluaciones y alarmas. Todo se guarda en este dispositivo.</p>
      </section>
      <form class="card" data-form="onboard">
        <label>¿Cómo te llamas?<input name="name" required placeholder="Tu nombre"></label>
        <label>Tu meta<select name="goal"><option value="B2">B2 – comunicarme con seguridad</option><option value="C1" selected>C1 – hablar con fluidez y precisión</option></select></label>
        <label>Minutos al día que puedes estudiar<select name="minutes"><option>20</option><option selected>30</option><option>45</option><option>60</option></select></label>
        <label>Hora de tu clase diaria<input type="time" name="studyTime" value="19:00"></label>
        <label>Hora del repaso rápido<input type="time" name="reviewTime" value="08:00"></label>
        <button class="btn primary" type="submit">Continuar → test de nivel</button>
      </form>`;
    }
    if (ctx.stage === "test") {
      const q = ctx.qs[ctx.i];
      return `<section class="card">
        <div class="muted">Test de nivel · pregunta ${ctx.i + 1} de ${ctx.qs.length}</div>
        <div class="bar"><span style="width:${(ctx.i / ctx.qs.length) * 100}%"></span></div>
        <h2 class="q">${esc(q.q)}</h2>
        <div class="options">${q.o.map((o, i) => `<button class="opt" data-action="placement" data-i="${i}">${esc(o)}</button>`).join("")}</div>
        <button class="link" data-action="placement" data-i="-1">No lo sé</button>
      </section>`;
    }
    const lv = ctx.result;
    return `<section class="card hero">
      <h1>Tu punto de partida: ${lv}</h1>
      <p>${ctx.summary}</p>
      <p>Tu plan: <b>${C.length - unitIndex(lv.toLowerCase() + "-1")} unidades</b> × 5 clases hasta C1. Cada unidad: Aprende → Practica → Escucha → Habla → Evalúa.</p>
      <button class="btn primary" data-action="finishOnboard">¡Empezar mi primera clase!</button>
      <button class="link" data-action="chooseLevel">Prefiero elegir el nivel yo</button>
      ${ctx.choose ? `<div class="row">${LEVELS.map((l) => `<button class="btn" data-action="setStartLevel" data-level="${l}">${l}</button>`).join("")}</div>` : ""}
    </section>`;
  }
  function finishPlacement() {
    const by = {};
    ctx.answers.forEach((a) => { by[a.level] = by[a.level] || [0, 0]; by[a.level][a.ok ? 0 : 1]++; });
    let start = "A2";
    for (const lv of LEVELS) { const [r, w] = by[lv] || [0, 0]; start = lv; if (r / (r + w) < 0.75) break; }
    ctx.stage = "result"; ctx.result = start;
    ctx.summary = LEVELS.map((l) => `${l}: ${(by[l] || [0])[0]}/${(by[l] || [0, 0])[0] + (by[l] || [0, 0])[1]}`).join(" · ");
  }

  // ───────────────────────── HOY ─────────────────────────
  function viewToday() {
    const u = curUnit();
    const step = PLAN[S.progress.step];
    const t = today();
    const log = dayLog(t);
    const due = dueCards().length;
    const pendingHw = S.homework.filter((h) => h.status === "pending");
    const prev = lastStudyDay();
    const prevLog = prev ? S.log[prev] : null;
    const weak = weakTopics(3);
    const hour = new Date().getHours();
    const hello = hour < 12 ? "Good morning" : hour < 19 ? "Good afternoon" : "Good evening";
    const res = window.RESOURCES[currentLevel()];
    const pick = res[new Date().getDate() % res.length];
    const goalDone = log.steps.length > 0;

    return `
    <section class="card hero">
      <div class="muted">${new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}</div>
      <h1>${hello}, ${esc(S.profile.name)}!</h1>
      <div class="chips">
        <span class="chip">Nivel actual: <b>${u.level}</b></span>
        <span class="chip">Meta: <b>${S.profile.goal}</b></span>
        <span class="chip">🔥 Racha: <b>${S.streak.count}</b> días</span>
        <span class="chip">${goalDone ? "✅ Meta de hoy cumplida" : "🎯 Meta de hoy: 1 clase + repaso"}</span>
      </div>
    </section>

    ${prevLog ? `<section class="card">
      <h2>🧠 Lo que hiciste ${prev === addDays(t, -1) ? "ayer" : "la última vez (" + prev + ")"}</h2>
      <ul class="clean">${prevLog.steps.map((s) => `<li>${PLAN.find((p) => p.key === s.step).icon} ${esc(s.title)} — ${PLAN.find((p) => p.key === s.step).name}${s.score != null ? ` <span class="pill">${s.score}%</span>` : ""}</li>`).join("")}</ul>
      ${prevLog.mistakes.length ? `<p class="muted">Errores que cometiste: ${prevLog.mistakes.slice(0, 3).map((m) => `<span class="pill bad">${esc(m.q || m.front || "")}</span>`).join(" ")}</p>` : ""}
      <button class="btn" data-action="warmup">⚡ Calentamiento: 5 preguntas de lo de ${prev === addDays(t, -1) ? "ayer" : "la última vez"}</button>
    </section>` : ""}

    <section class="card accent">
      <div class="muted">Tu siguiente clase</div>
      ${finished() ? `<h2>🏆 ¡Completaste todo el plan hasta C1!</h2><p>Sigue con repaso, speaking con IA y contenido real (podcasts, series sin subtítulos).</p>` : `
      <h2>${step.icon} ${esc(u.title)} · ${step.name}</h2>
      <p>${esc(u.grammar.name)} — <span class="muted">${step.desc}</span></p>
      <div class="steps">${PLAN.map((p, i) => `<span class="dot ${i < S.progress.step ? "done" : i === S.progress.step ? "now" : ""}" title="${p.name}">${p.icon}</span>`).join("")}</div>
      <button class="btn primary big" data-action="go" data-view="class">Empezar clase</button>`}
    </section>

    <section class="grid2">
      <div class="card tile" data-action="go" data-view="review">
        <div class="big-n">${due}</div><div>tarjetas para repasar hoy</div>
      </div>
      <div class="card tile" data-action="go" data-view="homework">
        <div class="big-n">${pendingHw.length}</div><div>tareas pendientes${pendingHw.some((h) => h.due < t) ? ' <span class="pill bad">atrasada</span>' : ""}</div>
      </div>
    </section>

    ${weak.length ? `<section class="card">
      <h2>🎯 Dónde debes repasar</h2>
      ${weak.map((w) => `<div class="weak"><div><b>${esc(w.unit.grammar.name)}</b><div class="muted">${w.unit.level} · ${esc(w.unit.title)} · acierto ${w.p}%</div></div>
        <div class="row"><button class="btn small" data-action="studyUnit" data-unit="${w.id}">Repasar</button>
        <a class="btn small" target="_blank" rel="noopener" href="${ytLink(w.unit.yt)}">▶ YouTube</a></div></div>`).join("")}
    </section>` : ""}

    <section class="card">
      <h2>🎧 Recomendado para hoy (${currentLevel()})</h2>
      <p><b>${esc(pick.t)}</b></p>
      <div class="row">
        ${pick.y ? `<a class="btn small" target="_blank" rel="noopener" href="${ytLink(pick.y)}">▶ YouTube</a>` : ""}
        ${pick.s ? `<a class="btn small" target="_blank" rel="noopener" href="${spLink(pick.s)}">🎙 Spotify</a>` : ""}
        <a class="btn small" target="_blank" rel="noopener" href="${ytLink(u.yt)}">▶ Video del tema: ${esc(u.grammar.name)}</a>
      </div>
      <p class="muted">Tip: escucha 10-15 min al día. Primero con subtítulos en inglés, luego sin ellos.</p>
    </section>`;
  }

  // ───────────────────────── CLASE ─────────────────────────
  function viewClass() {
    if (finished()) return `<section class="card"><h2>🏆 Plan completado</h2><p>Repasa unidades desde Progreso → Temario o practica speaking con IA.</p></section>`;
    const u = curUnit(); const step = PLAN[S.progress.step];
    ctx.unit = u; ctx.mode = "class";
    if (!ctx.started) ctx.started = Date.now();
    const head = `<section class="card hero slim">
      <div class="muted">${u.level} · Unidad ${unitIndex(u.id) + 1}/${C.length} · Paso ${S.progress.step + 1}/5</div>
      <h1>${step.icon} ${esc(u.title)} — ${step.name}</h1>
      <div class="steps">${PLAN.map((p, i) => `<span class="dot ${i < S.progress.step ? "done" : i === S.progress.step ? "now" : ""}">${p.icon}</span>`).join("")}</div>
    </section>`;
    const body = { learn: stepLearn, practice: stepPractice, listen: stepListen, speak: stepSpeak, test: stepTest }[step.key](u);
    return head + body;
  }
  function viewUnitStudy() {
    const u = C[unitIndex(ctx.unitId)];
    ctx.unit = u; ctx.mode = "study";
    return `<section class="card hero slim"><div class="muted">Repaso libre · ${u.level}</div><h1>📚 ${esc(u.title)}</h1>
      <button class="link" data-action="go" data-view="progress">← Volver al temario</button></section>`
      + grammarBlock(u) + vocabBlock(u) + quizBlock(u, u.quiz, "studyquiz")
      + resourcesBlock(u);
  }

  function grammarBlock(u) {
    return `<section class="card">
      <h2>📐 ${esc(u.grammar.name)}</h2>
      <p>${u.grammar.explain}</p>
      <ul class="examples">${u.grammar.examples.map((e) => `<li><button class="icon" data-action="say" data-text="${esc(e)}">🔊</button> ${esc(e)}</li>`).join("")}</ul>
      ${window.AI.enabled() ? `<details><summary>🤖 Pregúntale al profesor IA sobre este tema</summary>
        <form data-form="askAI"><input name="q" placeholder="Ej: ¿cuándo uso 'since' y cuándo 'for'?" required><button class="btn small">Preguntar</button></form><div id="aiAnswer"></div></details>` : ""}
    </section>`;
  }
  function vocabBlock(u) {
    return `<section class="card">
      <h2>🗂 Vocabulario (${u.vocab.length})</h2>
      <div class="vocab">${u.vocab.map(([en, es, ex]) => `<div class="v"><div><b>${esc(en)}</b> <span class="muted">— ${esc(es)}</span><div class="ex">${esc(ex)}</div></div>
        <button class="icon" data-action="say" data-text="${esc(en + ". " + ex)}">🔊</button></div>`).join("")}</div>
    </section>`;
  }
  function resourcesBlock(u) {
    return `<section class="card"><h2>🎬 Recursos para este tema</h2>
      <div class="row"><a class="btn small" target="_blank" rel="noopener" href="${ytLink(u.yt)}">▶ YouTube: ${esc(u.grammar.name)}</a>
      <a class="btn small" target="_blank" rel="noopener" href="${spLink(u.sp)}">🎙 Spotify: ${esc(u.sp)}</a></div></section>`;
  }
  function quizBlock(u, items, name) {
    ctx.quiz = ctx.quiz || {};
    const st = (ctx.quiz[name] = ctx.quiz[name] || { items: items.map((q) => ({ ...q })), answers: {} });
    const done = Object.keys(st.answers).length === st.items.length;
    const right = Object.values(st.answers).filter((a) => a.ok).length;
    return `<section class="card" id="quiz-${name}">
      <h2>✅ Ejercicios ${done ? `<span class="pill ${right / st.items.length >= 0.7 ? "good" : "bad"}">${right}/${st.items.length}</span>` : ""}</h2>
      ${st.items.map((q, qi) => {
        const ans = st.answers[qi];
        return `<div class="qblock"><div class="q">${qi + 1}. ${esc(q.q)}</div><div class="options">
          ${q.o.map((o, oi) => `<button class="opt ${ans ? (oi === q.a ? "right" : oi === ans.pick ? "wrong" : "") : ""}" ${ans ? "disabled" : ""} data-action="answer" data-quiz="${name}" data-q="${qi}" data-o="${oi}">${esc(o)}</button>`).join("")}
        </div></div>`;
      }).join("")}
    </section>`;
  }
  function quizScore(name) {
    const st = ctx.quiz && ctx.quiz[name]; if (!st) return 0;
    const n = st.items.length; const r = Object.values(st.answers).filter((a) => a.ok).length;
    return Math.round((r / n) * 100);
  }
  function quizDone(name) { const st = ctx.quiz && ctx.quiz[name]; return st && Object.keys(st.answers).length === st.items.length; }

  function stepLearn(u) {
    return grammarBlock(u) + vocabBlock(u) + quizBlock(u, u.quiz.slice(0, 2), "learn") + `
      <section class="card"><p class="muted">Al terminar, las ${u.vocab.length} palabras se agregan a tu repaso inteligente (flashcards).</p>
      <button class="btn primary big" data-action="finishStep" data-need="learn">Terminar clase ✔</button></section>`;
  }
  function stepPractice(u) {
    if (!ctx.order) {
      ctx.order = u.grammar.examples.slice(0, 2).map((s) => ({ target: s, pieces: shuffle(s.replace(/[.?!]$/, "").split(" ")), built: [] }));
      const others = C.flatMap((x) => x.vocab.map((v) => v[0]));
      ctx.trans = shuffle(u.vocab).slice(0, 4).map(([en, es]) => ({ es, en, opts: shuffle([en, ...shuffle(others.filter((o) => o !== en)).slice(0, 3)]) }));
    }
    return quizBlock(u, u.quiz, "practice") + `
      <section class="card"><h2>🧩 Ordena la frase</h2>
      ${ctx.order.map((o, i) => `<div class="qblock"><div class="built">${o.built.map((w, j) => `<button class="chip-btn" data-action="unpick" data-i="${i}" data-j="${j}">${esc(w)}</button>`).join("") || '<span class="muted">Toca las palabras en orden…</span>'}</div>
        <div class="row">${o.pieces.map((w, j) => `<button class="chip-btn ghost" data-action="pick" data-i="${i}" data-j="${j}">${esc(w)}</button>`).join("")}</div>
        ${o.result ? `<div class="pill ${o.result === "ok" ? "good" : "bad"}">${o.result === "ok" ? "¡Correcto!" : "Correcta: " + esc(o.target)}</div>` : ""}</div>`).join("")}
      </section>
      <section class="card"><h2>🔤 ¿Cómo se dice en inglés?</h2>
      ${ctx.trans.map((t, i) => `<div class="qblock"><div class="q">${esc(t.es)}</div><div class="options">
        ${t.opts.map((o) => `<button class="opt ${t.pick ? (o === t.en ? "right" : o === t.pick ? "wrong" : "") : ""}" ${t.pick ? "disabled" : ""} data-action="trans" data-i="${i}" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div></div>`).join("")}
      </section>
      <section class="card"><h2>📝 Tarea asignada</h2><p>${esc(u.writing)}</p><p class="muted">Se guardará en Tareas con fecha de entrega en 2 días. Te la reviso cuando la envíes.</p>
      <button class="btn primary big" data-action="finishStep" data-need="practice">Terminar clase ✔</button></section>`;
  }
  function stepListen(u) {
    if (!ctx.shadow) {
      ctx.shadow = u.grammar.examples.map((s) => ({ s, said: "", score: null }));
      ctx.dict = shuffle(u.vocab.map((v) => v[2]).concat(u.grammar.examples)).slice(0, 3).map((s) => ({ s, typed: "", score: null }));
    }
    return `<section class="card"><h2>🗣 Shadowing (escucha y repite)</h2>
      <p class="muted">Escucha la frase, luego pulsa 🎙 y repítela imitando ritmo y entonación.</p>
      ${ctx.shadow.map((x, i) => `<div class="qblock"><div class="q">${esc(x.s)}</div>
        <div class="row"><button class="btn small" data-action="say" data-text="${esc(x.s)}">🔊 Normal</button>
        <button class="btn small" data-action="saySlow" data-text="${esc(x.s)}">🐢 Lento</button>
        <button class="btn small" data-action="shadow" data-i="${i}">${ctx.recording === "sh" + i ? "⏹ Parar" : "🎙 Repetir"}</button></div>
        ${x.said ? `<div class="muted">Dijiste: “${esc(x.said)}”</div>` : ""}
        ${x.score != null ? `<div class="pill ${x.score >= 80 ? "good" : x.score >= 50 ? "mid" : "bad"}">Precisión ${x.score}%</div>` : ""}</div>`).join("")}
    </section>
    <section class="card"><h2>✍️ Dictado</h2><p class="muted">Escucha y escribe exactamente lo que oyes.</p>
      ${ctx.dict.map((x, i) => `<div class="qblock"><div class="row"><button class="btn small" data-action="say" data-text="${esc(x.s)}">🔊 Escuchar</button><button class="btn small" data-action="saySlow" data-text="${esc(x.s)}">🐢</button></div>
        <form data-form="dict" data-i="${i}" class="row"><input name="t" value="${esc(x.typed)}" placeholder="Escribe lo que oyes" ${x.score != null ? "disabled" : ""}><button class="btn small" ${x.score != null ? "disabled" : ""}>Comprobar</button></form>
        ${x.score != null ? `<div class="pill ${x.score >= 80 ? "good" : "bad"}">${x.score}% — ${esc(x.s)}</div>` : ""}</div>`).join("")}
    </section>` + resourcesBlock(u) + `<section class="card"><p class="muted">Tarea de escucha: mira el video o episodio sugerido 10-15 min y anota 5 frases nuevas en tu cuaderno.</p>
      <button class="btn primary big" data-action="finishStep" data-need="listen">Terminar clase ✔</button></section>`;
  }
  function speakingPanel(prompt, id) {
    const sp = (ctx.sp = ctx.sp || {});
    const st = (sp[id] = sp[id] || { text: "", secs: 0, feedback: "", score: null });
    return `<div class="speak">
      <p class="prompt">🎯 ${esc(prompt)}</p>
      <div class="row"><button class="btn primary" data-action="rec" data-id="${id}">${ctx.recording === id ? "⏹ Terminar" : "🎙 Hablar"}</button>
      <span class="timer" id="timer-${id}">${ctx.recording === id ? "grabando…" : st.secs ? st.secs + " s" : "Meta: 60-120 s"}</span></div>
      <div class="transcript" id="tr-${id}">${esc(st.text) || '<span class="muted">Tu transcripción aparecerá aquí…</span>'}</div>
      ${st.text && ctx.recording !== id ? `<div class="chips"><span class="chip">${words(st.text).length} palabras</span><span class="chip">${st.secs ? Math.round((words(st.text).length / st.secs) * 60) : 0} palabras/min</span><span class="chip">${new Set(words(st.text)).size} palabras distintas</span></div>
        ${window.AI.enabled() ? `<button class="btn" data-action="aiSpeak" data-id="${id}" data-prompt="${esc(prompt)}">🤖 Feedback del profesor IA</button>` : `<p class="muted">Autoevaluación: ¿usaste la gramática de la unidad? ¿hablaste más de 60 s sin parar? ¿usaste 3+ palabras nuevas? (Activa el profesor IA en Ajustes para feedback detallado.)</p>`}` : ""}
      <div class="feedback" id="fb-${id}">${st.feedback ? md(st.feedback) : ""}</div>
    </div>`;
  }
  function stepSpeak(u) {
    return `<section class="card"><h2>🎤 Speaking</h2>
      <p class="muted">Tips: antes de hablar, piensa 30 s en 3 ideas. Usa la gramática <b>${esc(u.grammar.name)}</b> y al menos 3 palabras: ${u.vocab.slice(0, 5).map((v) => `<span class="pill">${esc(v[0])}</span>`).join(" ")}</p>
      ${speakingPanel(u.speaking, "unit-" + u.id)}
    </section>
    <section class="card"><h2>💬 Conversación</h2><p>Practica una conversación libre sobre este tema en la pestaña Speaking.</p>
      <button class="btn" data-action="go" data-view="speaking">Abrir conversación</button></section>
    <section class="card"><button class="btn primary big" data-action="finishStep" data-need="speak">Terminar clase ✔</button></section>`;
  }
  function stepTest(u) {
    if (!ctx.testItems) {
      const prevUnit = C[unitIndex(u.id) - 1];
      const vocabQs = shuffle(u.vocab).slice(0, 4).map(([en, es]) => {
        const others = shuffle(C.flatMap((x) => x.vocab.map((v) => v[1])).filter((x) => x !== es)).slice(0, 3);
        const o = shuffle([es, ...others]); return { q: `¿Qué significa “${en}”?`, o, a: o.indexOf(es) };
      });
      const recall = prevUnit && prevUnit.level === u.level ? [{ ...prevUnit.quiz[3], unitId: prevUnit.id }] : [];
      ctx.testItems = shuffle(u.quiz).concat(vocabQs, recall);
    }
    const hw = S.homework.find((h) => h.unitId === u.id);
    const done = quizDone("test");
    const score = done ? quizScore("test") : null;
    return quizBlock(u, ctx.testItems, "test") + `
      <section class="card"><h2>📝 Tu tarea de esta unidad</h2>
      ${hw ? (hw.status === "pending" ? `<p class="pill bad">Pendiente</p><p>Envíala antes de cerrar la unidad para recibir corrección.</p><button class="btn" data-action="openHw" data-id="${hw.id}">Hacer tarea ahora</button>` : `<p class="pill good">Entregada${hw.score != null ? " · nota " + hw.score + "/10" : ""}</p>`) : '<p class="muted">Sin tarea registrada.</p>'}
      </section>
      <section class="card">${done ? `<h2>Resultado: ${score}%</h2><p>${score >= 70 ? "🎉 ¡Unidad aprobada! Pasas a la siguiente." : "Necesitas 70% para avanzar. Volverás a <b>Practica</b> y luego repites el examen. Revisa ‘Dónde repasar’."}</p>` : '<p class="muted">Responde todas las preguntas para ver tu resultado (necesitas 70%).</p>'}
      <button class="btn primary big" data-action="finishStep" data-need="test" ${done ? "" : "disabled"}>${done && score >= 70 ? "Cerrar unidad 🏁" : "Terminar"}</button></section>`;
  }

  function afterClassRender() { /* hook para futuras animaciones */ }

  // ───────────────────────── REPASO (SRS) ─────────────────────────
  function viewReview() {
    if (ctx.warm) return viewWarmup();
    const due = dueCards();
    if (!due.length) {
      const total = Object.keys(S.cards).length;
      return `<section class="card hero"><h1>🔁 Repaso</h1><p>${total ? "¡Al día! No tienes tarjetas pendientes hoy. 🎉" : "Aún no tienes tarjetas. Haz tu primera clase y se crearán automáticamente."}</p>
        <p class="muted">Total de tarjetas: ${total} · Dominadas (caja ≥4): ${Object.values(S.cards).filter((c) => c.box >= 4).length}</p></section>` + mistakesBlock();
    }
    const card = due[0];
    const showBack = ctx.flip;
    return `<section class="card"><div class="muted">${due.length} pendientes · repetición espaciada</div>
      <div class="flash" data-action="flip">
        <div class="front">${esc(card.es)}${card.mistake ? ' <span class="pill bad">tu error</span>' : ""}</div>
        ${showBack ? `<div class="back"><b>${esc(card.en)}</b>${card.ex ? `<div class="ex">${esc(card.ex)}</div>` : ""}</div>` : '<div class="muted">Di la respuesta en voz alta en inglés y toca para ver…</div>'}
      </div>
      ${showBack ? `<div class="row center"><button class="icon" data-action="say" data-text="${esc(card.en + (card.ex ? ". " + card.ex : ""))}">🔊</button></div>
      <div class="grade"><button class="btn bad" data-action="grade" data-q="0">Otra vez</button><button class="btn mid" data-action="grade" data-q="1">Difícil</button>
      <button class="btn good" data-action="grade" data-q="2">Bien</button><button class="btn" data-action="grade" data-q="3">Fácil</button></div>` : ""}
    </section>` + mistakesBlock();
  }
  function mistakesBlock() {
    if (!S.mistakes.length) return "";
    return `<section class="card"><h2>❌ Tus errores recientes</h2><ul class="clean">${S.mistakes.slice(0, 10).map((m) => `<li><span class="muted">${m.date}</span> ${esc(m.q || "")} → <b>${esc(m.correct || "")}</b>${m.pick ? ` <span class="muted">(pusiste: ${esc(m.pick)})</span>` : ""}</li>`).join("")}</ul></section>`;
  }
  function viewWarmup() {
    const w = ctx.warm;
    if (w.i >= w.items.length) {
      return `<section class="card hero"><h1>⚡ Calentamiento terminado</h1><p>${w.right}/${w.items.length} correctas.</p><button class="btn primary" data-action="go" data-view="class">Ir a la clase de hoy</button></section>`;
    }
    const q = w.items[w.i];
    return `<section class="card"><div class="muted">Calentamiento · ${w.i + 1}/${w.items.length}</div><h2 class="q">${esc(q.q)}</h2>
      <div class="options">${q.o.map((o, i) => `<button class="opt" data-action="warmAns" data-i="${i}">${esc(o)}</button>`).join("")}</div></section>`;
  }
  function buildWarmup() {
    const prev = lastStudyDay(); const log = prev && S.log[prev];
    const ids = log ? [...new Set(log.steps.map((s) => s.unitId))] : [curUnit().id];
    let items = [];
    ids.forEach((id) => { const u = C[unitIndex(id)]; if (u) items = items.concat(u.quiz.map((q) => ({ ...q, unitId: id }))); });
    ids.forEach((id) => { const u = C[unitIndex(id)]; if (u) u.vocab.slice(0, 4).forEach(([en, es]) => { const others = shuffle(C.flatMap((x) => x.vocab.map((v) => v[0])).filter((x) => x !== en)).slice(0, 3); const o = shuffle([en, ...others]); items.push({ q: `“${es}” en inglés:`, o, a: o.indexOf(en), unitId: id }); }); });
    return { items: shuffle(items).slice(0, 5), i: 0, right: 0 };
  }

  // ───────────────────────── TAREAS ─────────────────────────
  function viewHomework() {
    if (ctx.hwId) {
      const h = S.homework.find((x) => x.id === ctx.hwId);
      const u = C[unitIndex(h.unitId)];
      const draft = h.submission || "";
      return `<section class="card"><button class="link" data-action="go" data-view="homework">← Todas las tareas</button>
        <h2>📝 ${esc(u.title)} (${u.level})</h2><p>${esc(h.task)}</p>
        <p class="muted">Usa: <b>${esc(u.grammar.name)}</b> · Vocabulario: ${u.vocab.map((v) => esc(v[0])).join(", ")}</p>
        <form data-form="hw" data-id="${h.id}">
          <textarea name="text" rows="10" placeholder="Write in English here...">${esc(draft)}</textarea>
          <div class="row"><span class="muted" id="wc">${words(draft).length} palabras</span>
          <button class="btn" name="act" value="save">Guardar borrador</button>
          <button class="btn primary" name="act" value="submit">Entregar y revisar</button></div>
        </form>
        <div class="feedback" id="hwfb">${h.feedback ? md(h.feedback) : ""}</div>
      </section>`;
    }
    const list = S.homework.slice().sort((a, b) => (a.status === "pending" ? -1 : 1) - (b.status === "pending" ? -1 : 1) || a.due.localeCompare(b.due));
    return `<section class="card hero slim"><h1>📝 Tareas</h1><p class="muted">Se asignan en el paso “Practica” de cada unidad. Entrega antes de la fecha para mantener el ritmo.</p></section>
      ${list.length ? list.map((h) => { const u = C[unitIndex(h.unitId)]; return `<section class="card hw" data-action="openHw" data-id="${h.id}">
        <div><b>${esc(u.title)}</b> <span class="muted">${u.level}</span><div class="muted">Entrega: ${h.due}</div></div>
        <span class="pill ${h.status === "pending" ? (h.due < today() ? "bad" : "mid") : "good"}">${h.status === "pending" ? (h.due < today() ? "Atrasada" : "Pendiente") : "Revisada" + (h.score != null ? " · " + h.score + "/10" : "")}</span></section>`; }).join("") : '<section class="card"><p>No tienes tareas todavía.</p></section>'}`;
  }
  function autoReview(u, text) {
    const w = words(text);
    const target = /(\d+)(?:-(\d+))?\s*palabras/.exec(u.writing);
    const min = target ? parseInt(target[1], 10) : 100;
    const used = u.vocab.filter(([en]) => text.toLowerCase().includes(en.toLowerCase().split(" (")[0].split(" / ")[0]));
    const connectors = ["however", "although", "because", "so", "then", "also", "moreover", "therefore", "despite", "while", "when", "but", "first", "finally"].filter((c) => w.includes(c));
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 2);
    const avg = sentences.length ? Math.round(w.length / sentences.length) : 0;
    const lowerI = (text.match(/\bi\b/g) || []).length;
    let score = 4;
    if (w.length >= min) score += 2; else if (w.length >= min * 0.7) score += 1;
    if (used.length >= 3) score += 2; else if (used.length >= 1) score += 1;
    if (connectors.length >= 3) score += 1;
    if (avg >= 8 && avg <= 25) score += 1;
    score = Math.min(10, score);
    const fb = `## Revisión automática (sin IA)
- Extensión: **${w.length} palabras** (objetivo: ${min}+) ${w.length >= min ? "✅" : "⚠️ escribe un poco más"}
- Vocabulario de la unidad usado (${used.length}): ${used.map((v) => v[0]).join(", ") || "ninguno — intenta incluir al menos 3"}
- Conectores (${connectors.length}): ${connectors.join(", ") || "ninguno — usa because, however, although…"}
- Longitud media de frase: ${avg} palabras ${avg > 25 ? "(frases muy largas, divídelas)" : ""}
${lowerI ? `- ⚠️ Escribiste “i” en minúscula ${lowerI} vez/veces: en inglés el pronombre **I** siempre va en mayúscula.` : ""}
## Autocorrección
- ¿Usaste correctamente: ${u.grammar.name}?
- Lee tu texto en voz alta (o con 🔊) y marca lo que suena raro.
- Para corrección real de errores gramaticales y versión mejorada, activa el Profesor IA en Ajustes.
SCORE: ${score}/10`;
    return { text: fb, score };
  }

  // ───────────────────────── SPEAKING ─────────────────────────
  const SCENARIOS = [
    "Small talk with a new colleague on your first day at work.",
    "A job interview for a position you would love.",
    "Ordering food and complaining politely about a wrong order in a restaurant.",
    "Checking in at a hotel and asking for recommendations.",
    "Talking with a friend about a movie or series you watched.",
    "A doctor's appointment: describe your symptoms.",
    "Negotiating the price of a used car.",
    "A debate about technology and its impact on society."
  ];
  function viewSpeaking() {
    const done = C.slice(0, Math.max(1, S.progress.unit + 1));
    if (!ctx.freePrompt) ctx.freePrompt = done[Math.floor(Math.random() * done.length)].speaking;
    const chat = (ctx.chat = ctx.chat || { scenario: SCENARIOS[0], history: [] });
    return `<section class="card hero slim"><h1>🎤 Speaking</h1><p class="muted">Practica todos los días: 2 minutos hablando valen más que 20 leyendo.</p></section>
      <section class="card"><h2>🎯 Reto libre</h2>${speakingPanel(ctx.freePrompt, "free")}
        <button class="link" data-action="newPrompt">Otro tema</button></section>
      <section class="card"><h2>💬 Conversación con profesor IA</h2>
        ${window.AI.enabled() ? `
        <label>Situación<select data-action="scenario">${SCENARIOS.map((s) => `<option ${s === chat.scenario ? "selected" : ""}>${esc(s)}</option>`).join("")}</select></label>
        <div class="chat" id="chat">${chat.history.length ? chat.history.map((m) => `<div class="msg ${m.role}">${m.role === "assistant" ? `<button class="icon" data-action="say" data-text="${esc(m.content.split("💡")[0])}">🔊</button>` : ""}${md(m.content)}</div>`).join("") : '<p class="muted">Pulsa 🎙 y saluda para empezar (o escribe).</p>'}</div>
        <form data-form="chat" class="row"><input name="m" id="chatInput" placeholder="Speak or type in English…" autocomplete="off">
          <button type="button" class="btn small" data-action="chatMic">${ctx.recording === "chat" ? "⏹" : "🎙"}</button><button class="btn small primary">Enviar</button></form>
        <button class="link" data-action="resetChat">Reiniciar conversación</button>`
        : `<p>Para conversar con un profesor que te responde con voz y te corrige en tiempo real, añade tu API key de Claude en <a href="#" data-action="go" data-view="settings">Ajustes</a>.</p>
           <p class="muted">Sin IA puedes: hacer shadowing en cada clase, el reto libre de arriba y practicar con los podcasts recomendados (repite en voz alta lo que oyes).</p>`}
      </section>`;
  }

  // ───────────────────────── PROGRESO ─────────────────────────
  function viewProgress() {
    const unitsDone = Math.min(S.progress.unit, C.length);
    const byLevel = LEVELS.map((l) => { const us = C.filter((u) => u.level === l); const d = us.filter((u) => unitIndex(u.id) < unitsDone).length; return { l, d, n: us.length }; });
    const last30 = Array.from({ length: 35 }, (_, i) => addDays(today(), i - 34));
    const totalMin = Object.values(S.log).reduce((n, d) => n + (d.minutes || 0), 0);
    const skills = { grammar: "Gramática", vocab: "Vocabulario", listening: "Escucha", speaking: "Speaking", writing: "Escritura" };
    const weak = weakTopics(6);
    return `<section class="card hero slim"><h1>📈 Tu progreso</h1>
      <div class="chips"><span class="chip">Clases: <b>${lessonsDone()}</b></span><span class="chip">Horas: <b>${(totalMin / 60).toFixed(1)}</b></span><span class="chip">Palabras: <b>${Object.keys(S.cards).length}</b></span><span class="chip">🔥 <b>${S.streak.count}</b></span></div></section>
      <section class="card"><h2>Camino a ${S.profile.goal}</h2>
        ${byLevel.map((b) => `<div class="lvl"><b>${b.l}</b><div class="bar"><span style="width:${(b.d / b.n) * 100}%"></span></div><span class="muted">${b.d}/${b.n}</span></div>`).join("")}
        <p class="muted">Estimado: ${Math.max(0, (C.length - unitsDone) * 5)} clases restantes hasta terminar C1 (≈ ${Math.ceil(((C.length - unitsDone) * 5) / Math.max(1, S.settings.days.length))} semanas a tu ritmo). Complementa con 15 min de escucha diaria para llegar de verdad.</p></section>
      <section class="card"><h2>Habilidades</h2>
        ${Object.entries(skills).map(([k, name]) => { const [r, w] = S.skillStats[k] || [0, 0]; const p = pct(r, w); return `<div class="lvl"><span>${name}</span><div class="bar"><span style="width:${p || 0}%" class="${p != null && p < 70 ? "low" : ""}"></span></div><span class="muted">${p == null ? "—" : p + "%"}</span></div>`; }).join("")}
      </section>
      <section class="card"><h2>Constancia (últimas 5 semanas)</h2><div class="heat">${last30.map((d) => { const l = S.log[d]; const n = l ? l.steps.length + (l.reviews ? 1 : 0) : 0; return `<span class="h${Math.min(3, n)}" title="${d}"></span>`; }).join("")}</div></section>
      ${weak.length ? `<section class="card"><h2>🎯 Temas a reforzar</h2>${weak.map((w) => `<div class="weak"><div><b>${esc(w.unit.grammar.name)}</b><div class="muted">${w.unit.level} · ${w.p}% acierto (${w.r + w.w} intentos)</div></div>
        <div class="row"><button class="btn small" data-action="studyUnit" data-unit="${w.id}">Repasar</button><a class="btn small" target="_blank" rel="noopener" href="${ytLink(w.unit.yt)}">▶</a><a class="btn small" target="_blank" rel="noopener" href="${spLink(w.unit.sp)}">🎙</a></div></div>`).join("")}</section>` : ""}
      <section class="card"><h2>📚 Temario completo</h2>
        ${LEVELS.map((l) => `<h3>${l}</h3><div class="units">${C.filter((u) => u.level === l).map((u) => { const i = unitIndex(u.id); const st = i < unitsDone ? "done" : i === S.progress.unit ? "now" : "locked"; return `<button class="unit ${st}" data-action="studyUnit" data-unit="${u.id}" ${st === "locked" ? "disabled" : ""}><b>${esc(u.title)}</b><span>${esc(u.grammar.name)}</span>${S.unitScores[u.id] ? `<span class="pill good">${S.unitScores[u.id]}%</span>` : ""}</button>`; }).join("")}</div>`).join("")}
      </section>
      <section class="card"><h2>📚 Recursos por nivel</h2>${LEVELS.map((l) => `<details ${l === currentLevel() ? "open" : ""}><summary>${l}</summary><ul class="clean">${window.RESOURCES[l].map((r) => `<li>${esc(r.t)} ${r.y ? `<a target="_blank" rel="noopener" href="${ytLink(r.y)}">▶ YouTube</a>` : ""} ${r.s ? `<a target="_blank" rel="noopener" href="${spLink(r.s)}">🎙 Spotify</a>` : ""}</li>`).join("")}</ul></details>`).join("")}</section>`;
  }

  // ───────────────────────── AJUSTES ─────────────────────────
  function viewSettings() {
    const s = S.settings;
    const dn = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const perm = "Notification" in window ? Notification.permission : "unsupported";
    return `<section class="card hero slim"><h1>⚙️ Ajustes</h1></section>
      <form class="card" data-form="settings">
        <h2>⏰ Horario y alarmas</h2>
        <label>Hora de la clase<input type="time" name="studyTime" value="${s.studyTime}"></label>
        <label>Hora del repaso rápido<input type="time" name="reviewTime" value="${s.reviewTime}"></label>
        <div class="days">${dn.map((d, i) => `<label class="day"><input type="checkbox" name="day" value="${i}" ${s.days.includes(i) ? "checked" : ""}>${d}</label>`).join("")}</div>
        <label class="inline"><input type="checkbox" name="notify" ${s.notify ? "checked" : ""}> Notificaciones en este dispositivo ${perm === "denied" ? '<span class="pill bad">bloqueadas por el navegador</span>' : ""}</label>
        <p class="muted">Las notificaciones del navegador solo funcionan con la app abierta o instalada. Para alarmas 100% fiables en el celular, descarga el calendario y ábrelo con Google Calendar / Calendario de iPhone:</p>
        <button type="button" class="btn" data-action="ics">📅 Descargar alarmas (.ics)</button>
        <h2>🔊 Voz</h2>
        <label>Velocidad de lectura<input type="range" name="rate" min="0.6" max="1.2" step="0.05" value="${s.rate}"></label>
        <label>Voz<select name="voice"><option value="">Automática</option>${voices.map((v) => `<option ${v.name === s.voice ? "selected" : ""}>${esc(v.name)}</option>`).join("")}</select></label>
        <h2>🤖 Profesor IA (opcional)</h2>
        <p class="muted">Con una API key de Claude (console.anthropic.com) obtienes: corrección detallada de tareas, feedback de speaking y conversación por voz. Se guarda solo en este navegador. Tiene costo por uso según tu cuenta de Anthropic.</p>
        <label>API key<input type="password" name="apiKey" value="${esc(s.apiKey)}" placeholder="sk-ant-..." autocomplete="off"></label>
        <label>Modelo<select name="model">
          <option value="claude-opus-5-5" ${s.model === "claude-opus-5-5" ? "selected" : ""}>Claude Opus 5.5 — mejor calidad</option>
          <option value="claude-sonnet-5-5" ${s.model === "claude-sonnet-5-5" ? "selected" : ""}>Claude Sonnet 5.5 — equilibrado</option>
          <option value="claude-haiku-5-5" ${s.model === "claude-haiku-5-5" ? "selected" : ""}>Claude Haiku 5.5 — más económico</option></select></label>
        <h2>👤 Perfil</h2>
        <label>Nombre<input name="name" value="${esc(S.profile.name)}"></label>
        <label>Meta<select name="goal"><option ${S.profile.goal === "B2" ? "selected" : ""}>B2</option><option ${S.profile.goal === "C1" ? "selected" : ""}>C1</option></select></label>
        <button class="btn primary big">Guardar ajustes</button>
      </form>
      <section class="card"><h2>💾 Copia de seguridad</h2><p class="muted">Tus datos viven en este dispositivo. Exporta para pasarlos a otro.</p>
        <div class="row"><button class="btn" data-action="export">Exportar</button><label class="btn">Importar<input type="file" accept="application/json" data-action="import" hidden></label>
        <button class="btn bad" data-action="reset">Borrar todo</button></div></section>`;
  }

  // ───────────────────────── Eventos ─────────────────────────
  let recHandle = null, recStart = 0, recTimer = null;
  function stopRec() { if (recHandle) recHandle.stop(); recHandle = null; clearInterval(recTimer); }

  document.addEventListener("click", async (e) => {
    const el = e.target.closest("[data-action]");
    if (!el || el.tagName === "SELECT" || (el.tagName === "INPUT" && el.type === "file")) return;
    const a = el.dataset.action;
    if (el.tagName === "A" && a !== "go") return;
    if (a === "go") { e.preventDefault(); stopRec(); $("#banner").hidden = true; return go(el.dataset.view); }

    switch (a) {
      case "say": speak(el.dataset.text); break;
      case "saySlow": speak(el.dataset.text, 0.7); break;
      case "placement": {
        const q = ctx.qs[ctx.i]; const i = +el.dataset.i;
        ctx.answers.push({ level: q.level, ok: i === q.a }); ctx.i++;
        if (ctx.i >= ctx.qs.length) finishPlacement();
        render(); break;
      }
      case "chooseLevel": ctx.choose = true; render(); break;
      case "setStartLevel": ctx.result = el.dataset.level; finishOnboarding(); break;
      case "finishOnboard": finishOnboarding(); break;
      case "answer": {
        const st = ctx.quiz[el.dataset.quiz]; const qi = +el.dataset.q; const oi = +el.dataset.o; const q = st.items[qi];
        if (st.answers[qi]) break;
        const ok = oi === q.a; st.answers[qi] = { pick: oi, ok };
        const u = ctx.unit; const uid = q.unitId || u.id;
        record(uid, "grammar", ok, ok ? null : { q: q.q, correct: q.o[q.a], pick: q.o[oi] });
        if (!ok) addMistakeCard(uid, q.q.replace("___", "…"), q.q.replace("___", q.o[q.a]));
        save(); rerenderKeepScroll(); break;
      }
      case "pick": case "unpick": {
        const o = ctx.order[+el.dataset.i]; if (o.result) break;
        if (a === "pick") { o.built.push(o.pieces.splice(+el.dataset.j, 1)[0]); }
        else { o.pieces.push(o.built.splice(+el.dataset.j, 1)[0]); }
        if (!o.pieces.length) { const ok = o.built.join(" ") === o.target.replace(/[.?!]$/, ""); o.result = ok ? "ok" : "bad"; record(ctx.unit.id, "grammar", ok, ok ? null : { q: "Ordenar: " + o.target, correct: o.target, pick: o.built.join(" ") }); save(); }
        rerenderKeepScroll(); break;
      }
      case "trans": {
        const t = ctx.trans[+el.dataset.i]; if (t.pick) break; t.pick = el.dataset.v;
        const ok = t.pick === t.en; record(ctx.unit.id, "vocab", ok, ok ? null : { q: t.es, correct: t.en, pick: t.pick }); save(); rerenderKeepScroll(); break;
      }
      case "shadow": {
        const id = "sh" + el.dataset.i; const x = ctx.shadow[+el.dataset.i];
        if (ctx.recording === id) { stopRec(); ctx.recording = null; rerenderKeepScroll(); break; }
        stopRec(); ctx.recording = id; if (window.speechSynthesis) window.speechSynthesis.cancel();
        recHandle = startRecognition({
          onText: (t) => { x.said = t; },
          onEnd: (t) => { x.said = t || x.said; x.score = similarity(x.s, x.said); record(ctx.unit.id, "listening", x.score >= 70); dayLog().speakingWords += words(x.said).length; save(); ctx.recording = null; rerenderKeepScroll(); }
        });
        if (!recHandle) ctx.recording = null;
        rerenderKeepScroll(); break;
      }
      case "rec": {
        const id = el.dataset.id; const st = ctx.sp[id];
        if (ctx.recording === id) { stopRec(); break; }
        stopRec(); ctx.recording = id; recStart = Date.now(); st.text = ""; st.feedback = "";
        recHandle = startRecognition({
          onText: (t) => { st.text = t; const tr = $("#tr-" + id); if (tr) tr.textContent = t; },
          onEnd: (t) => { st.text = t || st.text; st.secs = Math.round((Date.now() - recStart) / 1000); ctx.recording = null; record(ctx.unit ? ctx.unit.id : curUnit().id, "speaking", words(st.text).length >= 40); dayLog().speakingWords += words(st.text).length; save(); rerenderKeepScroll(); }
        });
        if (!recHandle) { ctx.recording = null; break; }
        rerenderKeepScroll();
        recTimer = setInterval(() => { const tm = $("#timer-" + id); if (tm) tm.textContent = "⏺ " + Math.round((Date.now() - recStart) / 1000) + " s"; }, 500);
        break;
      }
      case "aiSpeak": {
        const id = el.dataset.id; const st = ctx.sp[id]; const fb = $("#fb-" + id);
        el.disabled = true; fb.innerHTML = '<p class="muted">El profesor está escuchando tu respuesta…</p>';
        try {
          const r = await window.AI.reviewSpeaking({ level: currentLevel(), prompt: el.dataset.prompt, transcript: st.text, seconds: st.secs });
          st.feedback = r.text; st.score = r.score; if (r.score != null) record(ctx.unit ? ctx.unit.id : curUnit().id, "speaking", r.score >= 7);
          save(); fb.innerHTML = md(r.text);
        } catch (err) { fb.innerHTML = `<p class="pill bad">${esc(err.message)}</p>`; }
        el.disabled = false; break;
      }
      case "finishStep": {
        const need = el.dataset.need; const u = curUnit();
        if (need === "learn") { if (!quizDone("learn")) return toast("Responde los ejercicios primero"); addCards(u); }
        if (need === "practice") {
          if (!quizDone("practice")) return toast("Completa los ejercicios primero");
          if (!S.homework.find((h) => h.unitId === u.id)) S.homework.push({ id: u.id + "-" + Date.now(), unitId: u.id, task: u.writing, assigned: today(), due: addDays(today(), 2), status: "pending" });
          addCards(u);
        }
        if (need === "listen" && !ctx.shadow.some((x) => x.score != null) && !ctx.dict.some((x) => x.score != null)) return toast("Haz al menos un shadowing o dictado");
        if (need === "speak" && !(ctx.sp && Object.values(ctx.sp).some((s) => s.text))) return toast("Graba tu respuesta primero 🎙");
        const score = need === "test" ? quizScore("test") : need === "learn" || need === "practice" ? quizScore(need) : null;
        const mins = Math.max(5, Math.round((Date.now() - (ctx.started || Date.now())) / 60000));
        const wasUnit = S.progress.unit;
        completeStep(mins, score);
        if (need === "test") toast(S.progress.unit > wasUnit ? "🏁 ¡Unidad aprobada!" : "Repasa y vuelve a intentarlo 💪");
        else toast("✅ Clase completada. ¡Bien hecho!");
        go("today"); break;
      }
      case "flip": ctx.flip = true; render(); break;
      case "grade": { const c = dueCards()[0]; if (c) { gradeCard(c, +el.dataset.q); touchStreak(); save(); } ctx.flip = false; render(); break; }
      case "warmup": go("review", { warm: buildWarmup() }); break;
      case "warmAns": {
        const w = ctx.warm; const q = w.items[w.i]; const ok = +el.dataset.i === q.a;
        if (ok) w.right++; record(q.unitId, "grammar", ok, ok ? null : { q: q.q, correct: q.o[q.a], pick: q.o[+el.dataset.i] });
        toast(ok ? "✅ Correcto" : "❌ Era: " + q.o[q.a]); w.i++; save(); render(); break;
      }
      case "openHw": stopRec(); go("homework", { hwId: el.dataset.id }); break;
      case "studyUnit": go("unit", { unitId: el.dataset.unit }); break;
      case "newPrompt": { const done = C.slice(0, S.progress.unit + 1); ctx.freePrompt = done[Math.floor(Math.random() * done.length)].speaking; ctx.sp = {}; render(); break; }
      case "resetChat": ctx.chat.history = []; render(); break;
      case "chatMic": {
        const input = $("#chatInput");
        if (ctx.recording === "chat") { stopRec(); ctx.recording = null; el.textContent = "🎙"; break; }
        stopRec(); ctx.recording = "chat"; el.textContent = "⏹";
        recHandle = startRecognition({ onText: (t) => { input.value = t; }, onEnd: (t) => { ctx.recording = null; el.textContent = "🎙"; if (t) { input.value = t; sendChat(t); } } });
        if (!recHandle) { ctx.recording = null; el.textContent = "🎙"; }
        break;
      }
      case "ics": buildICS(); break;
      case "export": {
        const blob = new Blob([JSON.stringify({ ...S, settings: { ...S.settings, apiKey: "" } }, null, 1)], { type: "application/json" });
        const l = document.createElement("a"); l.href = URL.createObjectURL(blob); l.download = "english-coach-backup-" + today() + ".json"; l.click(); break;
      }
      case "reset": if (confirm("¿Borrar todo tu progreso? No se puede deshacer.")) { S = defaults(); save(); go("today"); } break;
    }
  });

  function rerenderKeepScroll() { const y = window.scrollY; render(); window.scrollTo(0, y); }

  async function sendChat(text) {
    const chat = ctx.chat; if (!text.trim()) return;
    chat.history.push({ role: "user", content: text.trim() });
    render(); const box = $("#chat"); box.insertAdjacentHTML("beforeend", '<div class="msg assistant muted">…</div>'); box.scrollTop = box.scrollHeight;
    try {
      const reply = await window.AI.chat({ level: currentLevel(), scenario: chat.scenario, history: chat.history });
      chat.history.push({ role: "assistant", content: reply });
      dayLog().speakingWords += words(text).length; touchStreak(); save();
      render(); speak(reply.split("💡")[0]);
      const b = $("#chat"); if (b) b.scrollTop = b.scrollHeight;
    } catch (err) { chat.history.pop(); render(); toast(err.message); }
  }

  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset.action === "scenario") { ctx.chat = { scenario: el.value, history: [] }; render(); }
    if (el.dataset.action === "import" && el.files[0]) {
      const r = new FileReader();
      r.onload = () => { try { const d = JSON.parse(r.result); const key = S.settings.apiKey; S = { ...defaults(), ...d }; S.settings.apiKey = key; save(); toast("Datos importados"); go("today"); } catch (err) { toast("Archivo no válido"); } };
      r.readAsText(el.files[0]);
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target.name === "text" && $("#wc")) $("#wc").textContent = words(e.target.value).length + " palabras";
  });

  document.addEventListener("submit", async (e) => {
    const f = e.target; const kind = f.dataset.form; if (!kind) return;
    e.preventDefault();
    const fd = new FormData(f);
    if (kind === "onboard") {
      S.profile = { name: fd.get("name").trim(), goal: fd.get("goal"), minutes: +fd.get("minutes"), created: today() };
      S.settings.studyTime = fd.get("studyTime") || "19:00"; S.settings.reviewTime = fd.get("reviewTime") || "08:00";
      const tmp = S.profile; S.profile = null; // aún en onboarding
      ctx = { stage: "test", qs: placementQuestions(), i: 0, answers: [], pending: tmp };
      render(); return;
    }
    if (kind === "dict") {
      const x = ctx.dict[+f.dataset.i]; x.typed = fd.get("t"); x.score = similarity(x.s, x.typed);
      record(ctx.unit.id, "listening", x.score >= 80, x.score >= 80 ? null : { q: "Dictado", correct: x.s, pick: x.typed }); save(); rerenderKeepScroll(); return;
    }
    if (kind === "askAI") {
      const out = $("#aiAnswer"); out.innerHTML = '<p class="muted">Pensando…</p>';
      try { out.innerHTML = md(await window.AI.explain({ level: currentLevel(), question: `Tema: ${ctx.unit.grammar.name}. Pregunta del estudiante: ${fd.get("q")}. Responde breve con 3 ejemplos.` })); }
      catch (err) { out.innerHTML = `<p class="pill bad">${esc(err.message)}</p>`; }
      return;
    }
    if (kind === "hw") {
      const h = S.homework.find((x) => x.id === f.dataset.id); const text = fd.get("text") || "";
      h.submission = text; save();
      if (e.submitter && e.submitter.value === "save") { toast("Borrador guardado"); return; }
      if (words(text).length < 20) { toast("Escribe al menos 20 palabras"); return; }
      const u = C[unitIndex(h.unitId)]; const out = $("#hwfb");
      e.submitter.disabled = true;
      let r;
      if (window.AI.enabled()) {
        out.innerHTML = '<p class="muted">El profesor está corrigiendo tu tarea…</p>';
        try { r = await window.AI.reviewWriting({ level: u.level, unit: u, task: h.task, text }); }
        catch (err) { toast(err.message); r = autoReview(u, text); r.text = `> ⚠️ ${err.message}\n\n` + r.text; }
      } else r = autoReview(u, text);
      h.feedback = r.text; h.score = r.score; h.status = "reviewed"; h.reviewed = today();
      record(u.id, "writing", (r.score || 0) >= 7);
      dayLog().minutes += 20; touchStreak(); save();
      out.innerHTML = md(r.text); e.submitter.disabled = false; toast("Tarea revisada ✔"); return;
    }
    if (kind === "chat") { const v = fd.get("m"); f.reset(); stopRec(); ctx.recording = null; sendChat(v); return; }
    if (kind === "settings") {
      const s = S.settings;
      s.studyTime = fd.get("studyTime"); s.reviewTime = fd.get("reviewTime");
      s.days = fd.getAll("day").map(Number); s.rate = parseFloat(fd.get("rate")); s.voice = fd.get("voice");
      s.apiKey = (fd.get("apiKey") || "").trim(); s.model = fd.get("model");
      S.profile.name = fd.get("name") || S.profile.name; S.profile.goal = fd.get("goal");
      const wantNotify = fd.get("notify") === "on";
      if (wantNotify && "Notification" in window && Notification.permission !== "granted") {
        const p = await Notification.requestPermission(); s.notify = p === "granted";
        if (p === "granted") notify("✅ Alarmas activadas", `Te avisaré a las ${s.studyTime} para tu clase.`);
      } else s.notify = wantNotify;
      save(); toast("Ajustes guardados"); render(); return;
    }
  });

  function finishOnboarding() {
    const p = ctx.pending || { name: "Student", goal: "C1", minutes: 30, created: today() };
    p.startLevel = ctx.result;
    S.profile = p;
    S.progress = { unit: unitIndex(ctx.result.toLowerCase() + "-1"), step: 0 };
    save(); go("class");
  }

  // ───────────────────────── Inicio ─────────────────────────
  document.querySelectorAll(".nav button").forEach((b) => b.addEventListener("click", () => { stopRec(); go(b.dataset.view); }));
  $("#settingsBtn").addEventListener("click", () => S.profile && go("settings"));
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
  render();
  checkAlarms();
  setInterval(checkAlarms, 30000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { checkAlarms(); if (view === "today") render(); } });
})();
