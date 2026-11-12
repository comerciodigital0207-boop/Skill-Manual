/* English Coach — app principal (sin dependencias, datos en este dispositivo). */
(function () {
  "use strict";
  const C = window.CURRICULUM;
  const PLAN = window.DAY_PLAN;
  const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
  const STORE_KEY = "englishCoach.v1";
  const SRS_DAYS = [0, 1, 3, 7, 14, 30, 60, 120];
  const TEACHER = "Kate";      // profesora nativa (personaje de la app)
  const PASS = 80;             // % mínimo para aprobar una unidad (dominio antes de avanzar)
  const DAILY_XP = 60;         // meta diaria de puntos
  const LOCK_DUE = 10;         // con tantas tarjetas pendientes, primero repaso

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
    unitScores: {},
    explanations: {},
    scenes: {},
    badges: {},
    curriculumVersion: 2
  });

  let S = load();
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaults();
      return mergeState(JSON.parse(raw));
    } catch (e) { return defaults(); }
  }
  function save() {
    S.updatedAt = Date.now();
    if (S.profile) { const cs = Object.values(S.cards); dayLog().snap = [cs.length, cs.filter((c) => c.box >= 4).length]; }
    trimState();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* almacenamiento no disponible */ }
    if (window.APP_PERSIST) window.APP_PERSIST(S); // copia en la nube cuando la app corre como Artifact
  }
  function trimState() {
    const keys = Object.keys(S.log).sort();
    keys.slice(0, Math.max(0, keys.length - 180)).forEach((k) => delete S.log[k]);
    if (S.mistakes.length > 120) S.mistakes = S.mistakes.slice(0, 120);
  }
  function mergeState(parsed) {
    // v1 no tenía nivel A1: las posiciones guardadas se corren 8 unidades
    if (parsed && parsed.profile && !parsed.curriculumVersion && parsed.progress) {
      parsed = { ...parsed, progress: { ...parsed.progress, unit: (parsed.progress.unit || 0) + 8 }, curriculumVersion: 2 };
    }
    const d = defaults();
    return { ...d, ...parsed, settings: { ...d.settings, ...(parsed.settings || {}) }, skillStats: { ...d.skillStats, ...(parsed.skillStats || {}) } };
  }
  // Permite restaurar un estado guardado fuera del navegador (más reciente gana)
  window.APP_HYDRATE = (remote) => {
    if (!remote || (S.updatedAt || 0) >= (remote.updatedAt || 0)) return false;
    const key = S.settings.apiKey;
    S = mergeState(remote); S.settings.apiKey = key || S.settings.apiKey || "";
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* ignorar */ }
    render(); return true;
  };
  window.APP_RERENDER = () => { if (view !== "speaking" || !ctx.recording) render(); };
  function saveFile(filename, text, type) {
    if (window.APP_SAVE_FILE) return window.APP_SAVE_FILE(filename, text, type);
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
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
  function pickVoice(i) {
    const us = voices.filter((x) => /en[-_]US/i.test(x.lang));
    const pool = us.length ? us : voices;
    if (!i) return pool.find((x) => x.name === S.settings.voice) || pool[0];
    return pool[i % pool.length] || pool[0];
  }
  // Lee varias líneas seguidas; cada personaje con una voz distinta cuando es posible
  function speakLines(lines, onLine) {
    const tts = window.APP_TTS;
    if (tts) {
      const names = ["buttery", "airy", "glassy", "rounded"];
      tts.speak(lines.map((l, i) => ({ text: l.text, voice: names[l.voice % names.length], rate: S.settings.rate, language: "en", id: String(i) }))).catch(() => {});
      return;
    }
    if (!window.speechSynthesis) { toast("Tu navegador no soporta lectura en voz alta"); return; }
    speechSynthesis.cancel();
    lines.forEach((l, i) => {
      const u = new SpeechSynthesisUtterance(l.text); u.lang = "en-US"; u.rate = S.settings.rate;
      const v = pickVoice(l.voice); if (v) u.voice = v;
      if (l.voice && (!v || pickVoice(0) === v)) u.pitch = l.voice % 2 ? 1.25 : 0.85;
      if (onLine) u.onstart = () => onLine(i);
      speechSynthesis.speak(u);
    });
  }
  function speak(text, rate) {
    if (window.APP_TTS) { window.APP_TTS.speak(text, { rate: rate || S.settings.rate, language: "en" }).catch(() => {}); return; }
    if (!window.speechSynthesis) { toast("Tu navegador no soporta lectura en voz alta"); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = rate || S.settings.rate;
    const v = voices.find((x) => x.name === S.settings.voice) || voices.find((x) => /en-US/i.test(x.lang)) || voices[0];
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  function speakEs(text) {
    if (window.APP_TTS) { window.APP_TTS.speak(text, { language: "es" }).catch(() => {}); return; }
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = "es-ES"; u.rate = 1;
    const v = speechSynthesis.getVoices().find((x) => /^es[-_]/i.test(x.lang)); if (v) u.voice = v;
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
    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      micBroken = true; // a partir de ahora, modo escribir con instrucciones claras
      toast(e.error === "not-allowed" ? "No hay permiso para el micrófono. Te paso al modo escribir." : "El micrófono no funcionó. Te paso al modo escribir.");
    };
    rec.onend = () => { if (!stopped) { try { rec.start(); } catch (e) { onEnd && onEnd(finalText.trim()); } } else onEnd && onEnd(finalText.trim()); };
    try { rec.start(); } catch (e) { micBroken = true; toast("El micrófono no está disponible aquí. Te paso al modo escribir."); setTimeout(rerenderKeepScroll, 50); return null; }
    return { stop() { stopped = true; rec.stop(); }, get text() { return finalText.trim(); } };
  }

  // ───────────────────────── Estadísticas y SRS ─────────────────────────
  function record(unitId, skill, ok, detail) {
    const t = (S.topicStats[unitId] = S.topicStats[unitId] || [0, 0]);
    t[ok ? 0 : 1]++;
    const k = S.skillStats[skill] || (S.skillStats[skill] = [0, 0]);
    k[ok ? 0 : 1]++;
    const dl = dayLog(); if (ok) dl.r = (dl.r || 0) + 1; else dl.w = (dl.w || 0) + 1;
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
  const overdueCards = () => Object.values(S.cards).filter((c) => c.due < today()).length;
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
      if ((score || 0) >= PASS) { S.progress.unit++; S.progress.step = 0; }
      else { S.progress.step = 1; } // volver a practicar antes de repetir el examen
    } else S.progress.step++;
    save();
  }
  function dayXP(l) {
    if (!l) return 0;
    return l.steps.length * 20 + (l.reviews || 0) * 2 + Math.min(30, Math.floor((l.speakingWords || 0) / 3)) + (l.listened ? 10 : 0) + (l.drills || 0) * 2 + (l.hw || 0) * 15 + (l.scenes || 0) * 15 + (l.convs || 0) * 15;
  }
  function weekStats(offset = 0) {
    const start = (S.profile && S.profile.created) || today();
    const end = addDays(today(), -7 * offset);
    const days = Array.from({ length: 7 }, (_, i) => addDays(end, i - 6)).filter((d) => d >= start);
    if (!days.length) return null;
    const planned = days.filter((d) => S.settings.days.includes(new Date(d + "T12:00:00").getDay())).length || 1;
    const logs = days.map((d) => S.log[d]).filter(Boolean);
    const studied = logs.filter((l) => dayXP(l) >= 20).length;
    const xp = logs.reduce((n, l) => n + dayXP(l), 0);
    const minutes = logs.reduce((n, l) => n + (l.minutes || 0), 0);
    const speak = logs.reduce((n, l) => n + (l.speakingWords || 0), 0);
    const hw = logs.reduce((n, l) => n + (l.hw || 0), 0);
    const score = Math.round(100 * (0.4 * Math.min(1, studied / planned) + 0.3 * Math.min(1, xp / (DAILY_XP * planned)) + 0.3 * Math.min(1, speak / 300)));
    const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 55 ? "C" : score >= 35 ? "D" : "F";
    const r = logs.reduce((n, l) => n + (l.r || 0), 0), w = logs.reduce((n, l) => n + (l.w || 0), 0);
    const snaps = days.map((d) => S.log[d] && S.log[d].snap).filter(Boolean);
    return { planned, studied, xp, minutes, speak, hw, score, grade, acc: pct(r, w), end, snap: snaps.length ? snaps[snaps.length - 1] : null };
  }
  function goalPlan() {
    const goal = (S.profile && S.profile.goal) || "C1";
    const lastIdx = C.reduce((m, u, i) => (u.level === goal ? i : m), C.length - 1);
    const remaining = Math.max(0, (lastIdx + 1 - S.progress.unit) * 5 - S.progress.step);
    const steps14 = Array.from({ length: 14 }, (_, i) => S.log[addDays(today(), -i)]).reduce((n, l) => n + (l ? l.steps.length : 0), 0);
    const pace = steps14 / 2; // clases por semana (últimas 2 semanas)
    const date = S.settings.goalDate || "";
    const weeksLeft = date ? Math.max(0.5, (new Date(date + "T12:00:00") - new Date(today() + "T12:00:00")) / (7 * 864e5)) : null;
    const needed = weeksLeft ? Math.ceil(remaining / weeksLeft) : null;
    const projected = pace > 0 ? addDays(today(), Math.ceil((remaining / pace) * 7)) : null;
    return { goal, remaining, pace, date, needed, projected };
  }
  const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
  function objectives() {
    const w = weekStats() || { studied: 0, planned: 1, speak: 0 };
    const xp = dayXP(S.log[today()]);
    const od = overdueCards();
    const lateHw = S.homework.filter((h) => h.status === "pending" && h.due < today()).length;
    const g = goalPlan();
    const st = (ok, partial) => (ok ? ["good", "✅", "Cumplido"] : partial ? ["mid", "⏳", "En curso"] : ["bad", "⚠️", "Atrasado"]);
    const list = [
      { name: "Meta diaria de puntos", val: `${xp} / ${DAILY_XP} ⚡`, p: xp / DAILY_XP, s: st(xp >= DAILY_XP, true) },
      { name: "Días de estudio esta semana", val: `${w.studied} / ${w.planned}`, p: w.studied / w.planned, s: st(w.studied >= w.planned, w.studied > 0) },
      { name: "Speaking esta semana", val: `${w.speak} / 300 palabras`, p: w.speak / 300, s: st(w.speak >= 300, w.speak > 0) },
      { name: "Repaso al día", val: od ? `${od} tarjetas atrasadas` : "Sin atrasos", p: od ? Math.max(0, 1 - od / 20) : 1, s: st(!od, od < LOCK_DUE) },
      { name: "Tareas al día", val: lateHw ? `${lateHw} atrasada(s)` : "Sin atrasos", p: lateHw ? 0 : 1, s: st(!lateHw, false) }
    ];
    if (g.needed != null) list.push({ name: `Ritmo para llegar a ${g.goal}`, val: `${g.pace.toFixed(1)} / ${g.needed} clases por semana`, p: g.needed ? g.pace / g.needed : 1, s: g.pace >= g.needed ? ["good", "✅", "Vas a tiempo"] : g.pace >= g.needed * 0.75 ? ["mid", "⏳", "Ritmo justo"] : ["bad", "⚠️", "Vas con retraso"] });
    return list;
  }
  function scoreNow() {
    const o = objectives();
    return Math.round((o.reduce((n, x) => n + Math.min(1, Math.max(0, x.p)), 0) / o.length) * 100);
  }
  // Gráfica de barras de una sola serie con línea de meta (SVG, sin librerías)
  function barChart({ data, goal, goalLabel, max, fmt = (v) => v }) {
    const W = 320, H = 150, L = 28, B = 22, T = 14, iw = W - L - 6, ih = H - B - T;
    const raw = Math.max(max || 0, goal || 0, ...data.map((d) => d.v || 0), 1);
    const step = Math.pow(10, Math.floor(Math.log10(raw))) / 2;
    const top = max && raw <= max ? max : Math.ceil((raw * 1.08) / step) * step; // tope redondo
    const y = (v) => T + ih - (v / top) * ih;
    const bw = Math.min(26, iw / data.length - 6);
    const ticks = [0, Math.round(top / 2), Math.round(top)];
    const last = data.map((d) => d.v != null).lastIndexOf(true);
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img">
      ${ticks.map((t) => `<line x1="${L}" x2="${W - 4}" y1="${y(t)}" y2="${y(t)}" class="grid"/><text x="${L - 4}" y="${y(t) + 3}" class="tick" text-anchor="end">${t}</text>`).join("")}
      ${data.map((d, i) => { const x = L + 3 + i * (iw / data.length) + (iw / data.length - bw) / 2; const h = d.v ? Math.max(2, (d.v / top) * ih) : 0;
        return `<g class="bcol"><rect x="${x - 3}" y="${T}" width="${bw + 6}" height="${ih}" fill="transparent"><title>${esc(d.tip)}</title></rect>
          ${h ? `<path d="M${x},${T + ih} V${T + ih - h + 4} q0,-4 4,-4 h${bw - 8} q4,0 4,4 V${T + ih} Z" class="mark"><title>${esc(d.tip)}</title></path>` : ""}
          ${i === last && d.v != null ? `<text x="${x + bw / 2}" y="${y(d.v) - 4}" text-anchor="middle" class="vlabel">${fmt(d.v)}</text>` : ""}
          <text x="${x + bw / 2}" y="${H - 6}" text-anchor="middle" class="tick">${esc(d.label)}</text></g>`; }).join("")}
      ${goal ? `<line x1="${L}" x2="${W - 4}" y1="${y(goal)}" y2="${y(goal)}" class="goal"/><text x="${L + 4}" y="${y(goal) - 4}" text-anchor="start" class="goal-l">${esc(goalLabel)}</text>` : ""}
    </svg></div>
    <details class="tableview"><summary>Ver como tabla</summary><table>${data.map((d) => `<tr><td>${esc(d.label)}</td><td>${d.v == null ? "—" : esc(fmt(d.v))}</td></tr>`).join("")}</table></details>`;
  }
  function scoreboard(compact) {
    const now = scoreNow();
    const prev = weekStats(1);
    const o = objectives();
    const okN = o.filter((x) => x.s[0] === "good").length;
    const wk = weekStats();
    const delta = prev && wk ? wk.score - prev.score : null;
    if (compact) {
      return `<section class="card score-mini" data-action="go" data-view="progress">
        <div class="score-num">${now}<span>/100</span></div>
        <div><b>Marcador de evolución</b><div class="muted">${okN} de ${o.length} objetivos cumplidos${delta != null ? ` · semana ${delta >= 0 ? "↑ +" : "↓ "}${delta}` : ""}</div>
        <div class="bar"><span style="width:${now}%"></span></div></div></section>`;
    }
    const g = goalPlan();
    const weeks = Array.from({ length: 8 }, (_, i) => weekStats(7 - i));
    const wlab = (w) => new Date(w.end + "T12:00:00").toLocaleDateString("es", { day: "numeric", month: "numeric" });
    const xpData = weeks.map((w) => w ? { label: wlab(w), v: w.xp, tip: `Semana al ${wlab(w)}: ${w.xp} puntos (${w.studied}/${w.planned} días)` } : { label: "", v: null, tip: "Sin datos" });
    const accData = weeks.map((w) => w ? { label: wlab(w), v: w.acc, tip: w.acc == null ? `Semana al ${wlab(w)}: sin ejercicios` : `Semana al ${wlab(w)}: ${w.acc}% de acierto` } : { label: "", v: null, tip: "Sin datos" });
    const vocData = weeks.map((w) => w ? { label: wlab(w), v: w.snap ? w.snap[0] : null, tip: w.snap ? `Semana al ${wlab(w)}: ${w.snap[0]} tarjetas, ${w.snap[1]} dominadas` : "Sin datos" } : { label: "", v: null, tip: "Sin datos" });
    const planned = (wk && wk.planned) || S.settings.days.length;
    return `<section class="card scoreboard">
      <h2>🏆 Marcador de evolución</h2>
      <div class="score-head"><div class="score-num big">${now}<span>/100</span></div>
        <div><div><b>${okN} de ${o.length}</b> objetivos cumplidos</div>
        ${delta != null ? `<div class="${delta >= 0 ? "up" : "down"}">${delta >= 0 ? "↑ +" : "↓ "}${delta} puntos vs. la semana pasada</div>` : '<div class="muted">La comparación semanal aparece desde tu segunda semana.</div>'}</div></div>
      <div class="objs">${o.map((x) => `<div class="obj"><div class="obj-top"><span>${esc(x.name)}</span><span class="pill ${x.s[0]}">${x.s[1]} ${x.s[2]}</span></div>
        <div class="obj-val">${esc(x.val)}</div><div class="bar"><span class="${x.s[0] === "bad" ? "low" : ""}" style="width:${Math.round(Math.min(1, Math.max(0, x.p)) * 100)}%"></span></div></div>`).join("")}</div>
    </section>
    <section class="card"><h2>🎯 Tu meta: ${g.goal}</h2>
      <p>Te faltan <b>${g.remaining} clases</b> para terminar ${g.goal}. Tu ritmo actual: <b>${g.pace.toFixed(1)} clases por semana</b>.</p>
      ${g.projected ? `<p>A este ritmo terminarías el <b>${fmtDate(g.projected)}</b>.</p>` : `<p class="muted">Completa clases esta semana para calcular tu fecha estimada.</p>`}
      ${g.date ? `<p>Tu fecha meta es el <b>${fmtDate(g.date)}</b>: necesitas <b>${g.needed} clases por semana</b>. ${g.pace >= g.needed ? "✅ Vas a tiempo." : `⚠️ Te faltan ${(g.needed - g.pace).toFixed(1)} clases por semana para llegar.`}</p>` : `<p class="muted">Pon una fecha meta y ${TEACHER} te dirá cada semana si vas a tiempo.</p>`}
      <form data-form="goalDate" class="row"><input type="date" name="goalDate" value="${g.date}" min="${addDays(today(), 7)}" aria-label="Fecha meta"><button class="btn small">${g.date ? "Cambiar fecha" : "Guardar fecha meta"}</button></form>
    </section>
    <section class="card"><h2>⚡ Puntos por semana</h2><p class="muted">La línea es tu meta semanal (${DAILY_XP} puntos × ${planned} días).</p>
      ${barChart({ data: xpData, goal: DAILY_XP * planned, goalLabel: "meta " + DAILY_XP * planned })}</section>
    <section class="card"><h2>✅ Acierto por semana</h2><p class="muted">Porcentaje de respuestas correctas. La línea marca el ${PASS}% que pide el examen.</p>
      ${barChart({ data: accData, goal: PASS, goalLabel: PASS + "%", max: 100, fmt: (v) => v + "%" })}</section>
    <section class="card"><h2>🗂 Vocabulario acumulado</h2><p class="muted">Total de tarjetas al final de cada semana.</p>
      ${barChart({ data: vocData })}</section>`;
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
    saveFile("english-coach-alarmas.ics", lines.join("\r\n"), "text/calendar");
  }

  // ───────────────────────── Router ─────────────────────────
  let view = "today";
  let ctx = {}; // estado temporal de la vista
  function go(v, extra) { view = v; ctx = extra || {}; render(); window.scrollTo(0, 0); }

  function render() {
    const main = $("#main");
    document.querySelectorAll(".nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    $("#nav").hidden = !S.profile;
    $("#streak").textContent = S.profile ? "🔥 " + S.streak.count + "  ⚡ " + dayXP(S.log[today()]) + "/" + DAILY_XP : "";
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
        <p>Un plan diario <b>desde cero (A1) hasta C1</b>, pensado para que <b>hables y entiendas</b> desde el primer día: frases reales, escucha, repetición en voz alta y repaso de lo de ayer.</p>
      </section>
      <form class="card" data-form="onboard">
        <label>¿Cómo te llamas?<input name="name" required placeholder="Tu nombre"></label>
        <label>¿Cómo está tu inglés hoy?<select name="base">
          <option value="zero">Muy básico: entiendo y hablo muy poco (empiezo por los fundamentos)</option>
          <option value="test">Tengo bases: quiero hacer el test de nivel</option></select></label>
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
  // ¿Qué hago ahora? Una sola recomendación, en el orden del método
  function nextActivity() {
    const l = dayLog(); const due = dueCards().length; const u = curUnit(); const step = PLAN[S.progress.step];
    if (overdueCards() >= LOCK_DUE || (due > 0 && !l.reviews)) return { icon: "🔁", label: `Repaso: ${due} tarjeta${due === 1 ? "" : "s"}`, why: "Primero repasas lo anterior para no olvidarlo. Son unos 5 minutos.", view: "review" };
    if (!l.steps.length && !finished()) return { icon: step.icon, label: `Clase: ${u.title} · ${step.name}`, why: step.desc, view: "class" };
    const hw = S.homework.find((h) => h.status === "pending" && h.due <= today());
    if (hw) return { icon: "📝", label: "Entregar tu tarea", why: "Tienes una tarea que vence hoy o ya venció.", view: "homework", extra: { hwId: hw.id } };
    if (!l.scenes) {
      const lv = LEVELS.indexOf(currentLevel());
      const sc = SCENES().find((x) => !(S.scenes || {})[x.id] && LEVELS.indexOf(x.level) <= lv + 1) || SCENES()[0];
      if (sc) return { icon: sc.icon, label: `Vida real: ${sc.title}`, why: "Escucha y actúa una situación real en EE. UU. (5 minutos).", view: "speaking", extra: { stab: "real", sceneId: sc.id } };
    }
    if (!finished() && dayXP(l) < DAILY_XP) return { icon: step.icon, label: `Clase: ${u.title} · ${step.name}`, why: "Sigue avanzando hasta tu meta de " + DAILY_XP + " ⚡.", view: "class" };
    return { icon: "🏆", label: "¡Meta cumplida! ¿Una clase más?", why: "Ya cumpliste hoy. Todo lo que hagas extra suma.", view: finished() ? "speaking" : "class" };
  }
  function ring(value, max, label) {
    const r = 34, c = 2 * Math.PI * r, p = Math.min(1, value / max);
    return `<svg class="ring" viewBox="0 0 84 84" role="img" aria-label="${esc(label)}"><circle cx="42" cy="42" r="${r}" class="ring-bg"/>
      <circle cx="42" cy="42" r="${r}" class="ring-fg ${p >= 1 ? "full" : ""}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" transform="rotate(-90 42 42)"/>
      <text x="42" y="40" text-anchor="middle" class="ring-n">${value}</text><text x="42" y="55" text-anchor="middle" class="ring-l">/${max} ⚡</text></svg>`;
  }
  function levelProgress(lv) {
    const us = C.filter((u) => u.level === lv); const first = unitIndex(us[0].id);
    const done = Math.max(0, Math.min(us.length, S.progress.unit - first));
    const steps = done * 5 + (S.progress.unit >= first && S.progress.unit < first + us.length ? S.progress.step : 0);
    return { us, done, pct: Math.round((steps / (us.length * 5)) * 100) };
  }
  function pathNodes(lv, full) {
    const { us } = levelProgress(lv);
    return `<div class="${full ? "path-full" : "path"}">${us.map((u) => { const i = unitIndex(u.id); const st = i < S.progress.unit ? "done" : i === S.progress.unit ? "now" : "locked";
      const can = (window.CAN_DO || {})[u.id] || u.title;
      return full ? `<div class="pnode ${st}"><span class="pdot">${st === "done" ? "✓" : st === "now" ? "▶" : "🔒"}</span><div><b>${esc(u.title)}</b><div class="muted">${st === "done" ? "✅ Ya puedes: " : st === "now" ? "Aprendiendo: " : "Desbloquearás: "}${esc(can)}</div>
          ${st === "now" ? `<div class="mini-steps">${PLAN.map((p, k) => `<span class="${k < S.progress.step ? "d" : k === S.progress.step ? "n" : ""}" title="${p.name}">${p.icon}</span>`).join("")}</div>` : ""}</div></div>`
        : `<span class="pdot ${st}" title="${esc(u.title)}">${st === "done" ? "✓" : st === "now" ? "▶" : ""}</span>`; }).join(full ? "" : '<span class="pline"></span>')}</div>`;
  }
  const BADGES = [
    ["first", "🎉", "Primera clase", () => lessonsDone() >= 1],
    ["streak3", "🔥", "3 días seguidos", () => S.streak.count >= 3],
    ["streak7", "🔥", "Una semana seguida", () => S.streak.count >= 7],
    ["streak30", "🏅", "30 días seguidos", () => S.streak.count >= 30],
    ["words25", "🗂", "25 palabras", () => Object.keys(S.cards).length >= 25],
    ["words100", "📚", "100 palabras", () => Object.keys(S.cards).length >= 100],
    ["words300", "🧠", "300 palabras", () => Object.keys(S.cards).length >= 300],
    ["mastered25", "💪", "25 palabras dominadas", () => Object.values(S.cards).filter((c) => c.box >= 4).length >= 25],
    ["conv1", "💬", "Primera conversación con " + TEACHER, () => Object.values(S.log).some((l) => l.convs)],
    ["scene1", "🇺🇸", "Primera escena real", () => Object.keys(S.scenes || {}).length >= 1],
    ["scenes5", "🗽", "5 escenas reales", () => Object.keys(S.scenes || {}).length >= 5],
    ["scenesAll", "🌎", "Todas las escenas", () => Object.keys(S.scenes || {}).length >= SCENES().length],
    ["speak500", "🎤", "500 palabras habladas", () => Object.values(S.log).reduce((n, l) => n + (l.speakingWords || 0), 0) >= 500],
    ["unit1", "🏁", "Primera unidad aprobada", () => Object.keys(S.unitScores).length >= 1],
    ["perfect", "💯", "Examen perfecto", () => Object.values(S.unitScores).some((x) => x >= 100)],
    ["hw5", "📝", "5 tareas entregadas", () => S.homework.filter((h) => h.status !== "pending").length >= 5],
    ...LEVELS.map((lv) => ["lvl" + lv, "🎓", "Nivel " + lv + " completo", () => { const us = C.filter((u) => u.level === lv); return S.progress.unit > unitIndex(us[us.length - 1].id); }])
  ];
  function newBadges() {
    S.badges = S.badges || {}; const got = [];
    BADGES.forEach(([id, icon, name, test]) => { try { if (!S.badges[id] && test()) { S.badges[id] = today(); got.push([icon, name]); } } catch (e) { /* ignorar */ } });
    return got;
  }
  // Pantalla de celebración: puntos ganados, avance del día, logros y lo que ya puedes hacer
  function celebrate({ icon, title, sub, xpBefore, canDo, closeLabel }) {
    const xpNow = dayXP(S.log[today()]);
    const gained = Math.max(0, xpNow - (xpBefore || 0));
    const badges = newBadges(); save();
    const nx = nextActivity();
    const el = $("#celebrate");
    el.innerHTML = `<div class="cel-card" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <canvas id="confetti" aria-hidden="true"></canvas>
      <div class="cel-icon">${icon}</div><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ""}
      ${gained ? `<div class="cel-xp">+${gained} ⚡</div>` : ""}
      <div class="cel-goal"><span>Meta de hoy</span><div class="bar"><span id="celbar" style="width:${Math.min(100, ((xpBefore || 0) / DAILY_XP) * 100)}%"></span></div><b>${xpNow}/${DAILY_XP} ⚡${xpNow >= DAILY_XP ? " ✅" : ""}</b></div>
      ${canDo ? `<div class="cel-can">🔓 <b>Desbloqueaste:</b> ya puedes ${esc(canDo.charAt(0).toLowerCase() + canDo.slice(1))}</div>` : ""}
      ${badges.map(([i, n]) => `<div class="cel-badge">${i} <b>¡Nuevo logro!</b> ${esc(n)}</div>`).join("")}
      <div class="cel-btns">${closeLabel ? `<button class="btn" data-action="celClose">${esc(closeLabel)}</button>` : `<button class="btn" data-action="celHome">Ir al inicio</button>`}
      <button class="btn primary" data-action="celNext">▶ Siguiente: ${esc(nx.label)}</button></div></div>`;
    el.hidden = false;
    requestAnimationFrame(() => { const b = $("#celbar"); if (b) b.style.width = Math.min(100, (xpNow / DAILY_XP) * 100) + "%"; });
    confetti();
  }
  function confetti() {
    const cv = $("#confetti"); if (!cv || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    const ctx2 = cv.getContext("2d"); const W = (cv.width = cv.offsetWidth), H = (cv.height = cv.offsetHeight);
    const cs = getComputedStyle(document.documentElement);
    const cols = ["--primary", "--good", "--mid", "--bad"].map((v) => cs.getPropertyValue(v).trim() || "#2f5bea");
    const ps = Array.from({ length: 70 }, () => ({ x: W / 2, y: H * 0.25, vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 7 - 2, r: Math.random() * 4 + 3, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6 }));
    let t = 0;
    (function tick() { ctx2.clearRect(0, 0, W, H); ps.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.a += 0.2; ctx2.save(); ctx2.translate(p.x, p.y); ctx2.rotate(p.a); ctx2.fillStyle = p.c; ctx2.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx2.restore(); });
      if (++t < 90) requestAnimationFrame(tick); else ctx2.clearRect(0, 0, W, H); })();
  }
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
    const goalDone = dayXP(log) >= DAILY_XP;

    const nx = nextActivity();
    const lp = levelProgress(currentLevel());
    const nextCan = (window.CAN_DO || {})[u.id];
    return `
    <section class="card hero home">
      <div class="muted">${new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}</div>
      <h1>${hello}, ${esc(S.profile.name.split(" ")[0])}!</h1>
      <div class="home-top">${ring(dayXP(log), DAILY_XP, "Puntos de hoy")}
        <div class="home-stats"><div class="hs"><span class="hs-n">🔥 ${S.streak.count}</span><span class="muted">días seguidos</span></div>
          <div class="hs"><span class="hs-n">${u.level} · ${lp.pct}%</span><span class="muted">del nivel ${u.level}</span></div>
          <div class="hs"><span class="hs-n">${goalDone ? "✅" : "🎯"}</span><span class="muted">${goalDone ? "meta de hoy cumplida" : "meta de hoy: " + DAILY_XP + " ⚡"}</span></div></div></div>
      <button class="btn primary big continue" data-action="nextAct"><span>${nx.icon}</span> ${esc(nx.label)}</button>
      <p class="muted center">${esc(nx.why)}</p>
    </section>

    ${currentLevel() === "A2" && !Object.keys(S.unitScores).some((k) => k.startsWith("a2")) ? `<section class="card hint">
      <b>¿Te sientes con muy poca base?</b> Te recomiendo empezar por <b>A1 · Fundamentos</b>: clases paso a paso desde cero, con el porqué de cada cosa.
      <button class="btn primary" data-action="changeLevel" data-level="A1">Empezar en A1</button></section>` : ""}

    ${routineCard(log, due)}

    <section class="card path-card" data-action="go" data-view="progress">
      <div class="row between"><h2>🗺 Mi camino · ${u.level}</h2><span class="muted">${lp.done}/${lp.us.length} unidades</span></div>
      ${pathNodes(u.level, false)}
      ${nextCan ? `<p>🔓 <b>Próximo logro:</b> ${esc(nextCan)}</p>` : ""}
    </section>

    ${teacherCard()}

    <details class="more"><summary>Ver más: marcador, lo de ayer, recomendados…</summary>
    ${scoreboard(true)}

    ${currentLevel() === "A2" && !Object.keys(S.unitScores).some((k) => k.startsWith("a2")) ? `<section class="card hint">
      <b>¿Te sientes con muy poca base?</b> Te recomiendo empezar por <b>A1 · Fundamentos</b>: clases paso a paso desde cero, con el porqué de cada cosa.
      <button class="btn primary" data-action="changeLevel" data-level="A1">Empezar en A1</button></section>` : ""}

    ${routineCard(log, due)}

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
    </section></details>`;
  }

  // ───────────────────────── MÉTODO: rutina diaria ─────────────────────────
  function routineCard(log, due) {
    const blocks = [
      { done: log.reviews > 0 || (!due && Object.keys(S.cards).length > 0), icon: "🔁", t: "Repaso", m: "5 min", d: "Tarjetas de ayer en voz alta", act: `data-action="go" data-view="review"` },
      { done: log.steps.length > 0, icon: "📘", t: "Clase del día", m: "10-15 min", d: "Un paso del plan", act: `data-action="go" data-view="class"` },
      { done: !!log.listened, icon: "🎧", t: "Escucha real", m: "10 min", d: "Video o podcast del tema, repitiendo frases", act: `data-action="listened" href="${ytLink(curUnit().yt)}" target="_blank" rel="noopener"`, a: true },
      { done: log.speakingWords >= 30, icon: "🎤", t: "Habla", m: "5 min", d: "Una escena de la vida real en EE. UU., en voz alta", act: `data-action="go" data-view="speaking"` }
    ];
    const n = blocks.filter((b) => b.done).length;
    return `<section class="card">
      <h2>🗓 Tu rutina de hoy (30 min) <span class="pill ${n === 4 ? "good" : ""}">${n}/4</span></h2>
      <div class="routine">${blocks.map((b) => { const tag = b.a ? "a" : "button"; return `<${tag} class="rblock ${b.done ? "done" : ""}" ${b.act}><span class="ri">${b.done ? "✅" : b.icon}</span><span><b>${b.t}</b> <span class="muted">${b.m}</span><br><span class="muted">${b.d}</span></span></${tag}>`; }).join("")}</div>
      <details><summary>¿Por qué este método funciona?</summary>
        <p class="muted">La app combina los métodos con más evidencia de resultados:</p>
        <ul class="clean">
          <li><b>Recuerdo activo con voz:</b> en el entrenamiento ves el español y lo dices en inglés antes de ver la respuesta. Obligar al cerebro a producir la frase la fija mucho más que leerla.</li>
          <li><b>Dominio antes de avanzar:</b> no pasas de unidad sin ${PASS}% en el examen, la tarea entregada y el speaking hecho.</li>
          <li><b>Frases completas, no palabras sueltas:</b> los nativos hablan en bloques (“Can I have…?”, “I'm from…”). Memoriza bloques y podrás armar frases sin traducir.</li>
          <li><b>Escuchar mucho y entender:</b> el oído va primero. 10 minutos diarios de inglés real que casi entiendes valen más que una hora de gramática.</li>
          <li><b>Repetir en voz alta (shadowing):</b> imitar audio de nativos entrena pronunciación, ritmo y confianza al mismo tiempo.</li>
          <li><b>Hablar desde el día 1:</b> equivocarse es parte del método. Primero repites un ejemplo, después lo dices con tu vida.</li>
          <li><b>Repaso espaciado:</b> repasar justo antes de olvidar fija lo aprendido para siempre. Por eso cada día empiezas con lo de ayer.</li>
          <li><b>Poco pero todos los días:</b> 30 minutos diarios superan a 3 horas un solo día. La racha 🔥 y la meta de ${DAILY_XP} puntos ⚡ te mantienen constante.</li>
          <li><b>Feedback inmediato con el porqué:</b> cada error se explica al momento y vuelve a tu repaso hasta que lo domines.</li>
        </ul></details>
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
    const due = overdueCards();
    if (due >= LOCK_DUE) {
      return head + `<section class="card lock"><div class="teacher-line"><span class="avatar">👩‍🏫</span><div><b>${TEACHER}:</b> “Stop! First, your review.”
        <div class="muted">Tienes <b>${due}</b> tarjetas atrasadas de días anteriores. Lo que no repasas se olvida: la clase nueva se abre cuando bajes de ${LOCK_DUE}.</div></div></div>
        <button class="btn primary big" data-action="go" data-view="review">Ir al repaso</button></section>`;
    }
    const body = { learn: stepLearn, practice: stepPractice, listen: stepListen, speak: stepSpeak, test: stepTest }[step.key](u);
    return head + teacherSays(step.key, u) + body;
  }
  function teacherSays(key, u) {
    const lines = {
      learn: [`Today we're learning: ${u.title}. Listen to every example and repeat it out loud. Don't just read!`, `Hoy aprendemos “${u.title}”. Escucha cada ejemplo y repítelo en voz alta. ¡No solo lo leas!`],
      practice: [`Now, practice. When you see Spanish, say it in English out loud before you look at the answer.`, `Ahora practicamos. Cuando veas la frase en español, dila en inglés EN VOZ ALTA antes de ver la respuesta.`],
      listen: [`Listening time. Copy my rhythm and my sounds. Imitate me like an actor.`, `Hora de escuchar. Copia mi ritmo y mis sonidos. Imítame como si fueras actor o actriz.`],
      speak: [`Your turn to speak. Mistakes are OK, silence is not. Talk for at least one minute.`, `Te toca hablar. Equivocarse está bien, quedarse en silencio no. Habla al menos un minuto.`],
      test: [`Test day. You need ${PASS} percent to pass. I know you can do it.`, `Día de examen. Necesitas ${PASS}% para pasar. Sé que puedes.`]
    }[key];
    return `<section class="card teacher"><div class="teacher-line"><span class="avatar">👩‍🏫</span>
      <div><b>${TEACHER}</b> <button class="icon" data-action="say" data-text="${esc(lines[0])}" aria-label="Escuchar">🔊</button>
      <div class="en">“${esc(lines[0])}”</div><div class="muted">${esc(lines[1])}</div></div></div></section>`;
  }
  function teacherCard() {
    const t = today(); const due = overdueCards();
    const name = S.profile.name.split(" ")[0];
    const msgs = [];
    const yest = addDays(t, -1);
    const yestPlanned = S.settings.days.includes(new Date(yest + "T12:00:00").getDay());
    if (yestPlanned && dayXP(S.log[yest]) < 20 && Object.keys(S.log).length > 1) msgs.push(["bad", "Ayer no estudiaste. Hoy no hay excusas: completa la rutina entera y recupera el ritmo."]);
    if (due >= LOCK_DUE) msgs.push(["bad", `Tienes ${due} tarjetas atrasadas. Tu clase nueva está bloqueada hasta que hagas el repaso.`]);
    const late = S.homework.filter((h) => h.status === "pending" && h.due < t);
    if (late.length) msgs.push(["bad", `Tu tarea de “${C[unitIndex(late[0].unitId)].title}” está atrasada. Sin tarea no puedes presentar el examen de la unidad.`]);
    const weak = weakTopics(1)[0];
    if (weak) msgs.push(["mid", `Tu punto débil ahora es “${weak.unit.grammar.name}” (${weak.p}% de acierto). Repásalo hoy.`]);
    const w = weekStats() || { speak: 0 };
    if (w.speak < 150 && Object.keys(S.log).length > 2) msgs.push(["mid", `Esta semana hablaste solo ${w.speak} palabras. La meta es 300: para hablar, hay que hablar.`]);
    if (!msgs.length) msgs.push(["good", S.streak.count >= 3 ? `¡${S.streak.count} días seguidos! Así se aprende. Sigue exactamente así.` : "Vamos paso a paso. Haz tu rutina de hoy completa y mañana estarás mejor que hoy."]);
    const hello = `Hi ${name}! Ready for today's class? Let's go!`;
    return `<section class="card teacher">
      <div class="teacher-line"><span class="avatar">👩‍🏫</span><div><b>${TEACHER}, tu profesora</b> <button class="icon" data-action="say" data-text="${esc(hello)}" aria-label="Escuchar">🔊</button>
      <div class="en">“${esc(hello)}”</div></div></div>
      <ul class="tmsgs">${msgs.slice(0, 3).map(([k, m]) => `<li class="${k}">${esc(m)}</li>`).join("")}</ul>
    </section>`;
  }
  function viewUnitStudy() {
    const u = C[unitIndex(ctx.unitId)];
    ctx.unit = u; ctx.mode = "study";
    return `<section class="card hero slim"><div class="muted">Repaso libre · ${u.level}</div><h1>📚 ${esc(u.title)}</h1>
      <button class="link" data-action="go" data-view="progress">← Volver al temario</button></section>`
      + grammarBlock(u) + vocabBlock(u) + quizBlock(u, u.quiz, "studyquiz")
      + resourcesBlock(u);
  }

  function explainedLesson(u) {
    const ex = (window.EXPLAIN || {})[u.id];
    if (ex) {
      return `<div class="lesson">
        <h3>1. ¿Para qué sirve?</h3><p>${ex.purpose}</p>
        <h3>2. El orden de la frase</h3>
        ${ex.formulas.map((f) => `<div class="formula"><div class="flabel">${esc(f.label)}</div>
          <div class="parts">${f.parts.map((p, i) => `${i ? '<span class="plus">+</span>' : ""}<span class="part">${esc(p)}</span>`).join("")}</div>
          <div class="fex"><button class="icon" data-action="say" data-text="${esc(f.ex)}">🔊</button> <b>${esc(f.ex)}</b> <span class="muted">→ ${esc(f.es)}</span></div></div>`).join("")}
        ${ex.table ? `<div class="tablewrap"><table>${ex.table.map(([a, b]) => `<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td></tr>`).join("")}</table></div>` : ""}
        <h3>3. ¿Por qué es así?</h3><p>${ex.why}</p>
        <h3>4. Diferencias con el español</h3><p>${ex.spanish}</p>
        <h3>5. Errores típicos (evítalos)</h3>
        <div class="mistakes">${ex.mistakes.map(([bad, good, why]) => `<div class="mk"><div class="bad-l">❌ ${esc(bad)}</div><div class="good-l">✅ ${esc(good)}</div><div class="muted">${esc(why)}</div></div>`).join("")}</div>
        <h3>6. Ejemplos para escuchar y repetir</h3>
      </div>`;
    }
    const cached = S.explanations[u.id];
    return `<p>${u.grammar.explain}</p>
      <div class="lesson">${cached ? md(cached) : window.AI.enabled()
        ? `<button class="btn" data-action="explainUnit" data-unit="${u.id}">🤖 Explícame esta clase paso a paso (orden de la frase, por qué, errores típicos)</button><div id="explain-${u.id}"></div>`
        : ""}</div>`;
  }
  function grammarBlock(u) {
    return `<section class="card">
      <h2>📐 ${esc(u.grammar.name)}</h2>
      ${explainedLesson(u)}
      <ul class="examples">${u.grammar.examples.map((e) => `<li><button class="icon" data-action="say" data-text="${esc(e)}">🔊</button> ${esc(e)}</li>`).join("")}</ul>
      ${u.sound ? `<div class="sound"><b>🗣 Suena como nativo:</b> ${u.sound}</div>` : ""}
      <p class="muted">Escucha cada ejemplo y repítelo en voz alta 3 veces, imitando el ritmo. Así se aprende a hablar, no solo a leer.</p>
      ${window.AI.enabled() ? `<details><summary>🤖 Pregúntale al profesor IA sobre este tema</summary>
        <form data-form="askAI"><input name="q" placeholder="Ej: ¿cuándo uso 'since' y cuándo 'for'?" required><button class="btn small">Preguntar</button></form><div id="aiAnswer"></div></details>` : ""}
    </section>`;
  }
  // Ficha de contexto de una palabra: cuándo, hablado vs. escrito, cómo suena, diálogo, cómo armar frases, ojo
  function vocabContext(unitId, en) {
    const u = C[unitIndex(unitId)]; if (!u) return null;
    const i = u.vocab.findIndex((v) => v[0] === en);
    return i >= 0 && window.CONTEXT && window.CONTEXT[unitId] ? window.CONTEXT[unitId][i] : null;
  }
  function contextHTML(c) {
    return `<div class="ctx">
      <div class="ctx-row"><span>📍</span><div><b>Cuándo la usas:</b> ${esc(c.when)}</div></div>
      <div class="ctx-row"><span>🗣</span><div><b>Hablado:</b> ${esc(c.spoken)}</div></div>
      <div class="ctx-row"><span>✍️</span><div><b>Escrito:</b> ${esc(c.written)}</div></div>
      <div class="ctx-row"><span>👂</span><div><b>Cómo suena:</b> ${c.sound}</div></div>
      <div class="ctx-dialog"><b>💬 En una conversación real:</b>
        ${c.dialog.map(([who, line]) => `<div class="cline"><span class="who">${esc(who)}</span><button class="icon" data-action="say" data-text="${esc(line)}" aria-label="Escuchar">🔊</button><span class="ctext">${esc(line)}</span></div>`).join("")}
        <button class="link small" data-action="sayDialog" data-lines="${esc(JSON.stringify(c.dialog.map((d) => d[1])))}">▶ Escuchar el diálogo completo</button></div>
      <div class="ctx-row build"><span>🧩</span><div><b>Arma tu frase:</b> ${c.build}</div></div>
      <div class="ctx-row watch"><span>⚠️</span><div><b>Ojo:</b> ${esc(c.watch)}</div></div>
    </div>`;
  }
  function vocabBlock(u) {
    const has = !!(window.CONTEXT && window.CONTEXT[u.id]);
    return `<section class="card">
      <h2>🗂 Vocabulario en contexto (${u.vocab.length})</h2>
      <p class="muted">${has ? "Toca cada palabra para ver <b>cuándo se usa, cómo se dice al hablar y al escribir, un diálogo real y cómo armar tus frases</b>." : window.AI.enabled() ? `Toca “Contexto” en cada palabra y ${TEACHER} te explica cuándo y cómo usarla.` : ""}</p>
      <div class="vocab">${u.vocab.map(([en, es, ex], i) => { const c = has ? window.CONTEXT[u.id][i] : null; const key = "word:" + u.id + ":" + i; const ai = S.explanations[key];
        return `<details class="vctx" ${ctx.openWord === key ? "open" : ""}><summary class="v"><div><b>${esc(en)}</b> <span class="muted">— ${esc(es)}</span><div class="ex">${esc(ex)}</div></div>
          <span class="vbtns"><button class="icon" data-action="say" data-text="${esc(en + ". " + ex)}" aria-label="Escuchar">🔊</button>${c || ai || window.AI.enabled() ? '<span class="ctx-tag">Contexto ▾</span>' : ""}</span></summary>
          ${c ? contextHTML(c) : ai ? `<div class="ctx">${md(ai)}</div>` : window.AI.enabled() ? `<div class="ctx"><button class="btn small" data-action="wordAI" data-unit="${u.id}" data-i="${i}">🤖 Explícame “${esc(en)}” en contexto</button><div id="wctx-${u.id}-${i}"></div></div>` : ""}
        </details>`; }).join("")}</div>
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
        </div>${ans ? `<div class="why ${ans.ok ? "ok" : "no"}"><b>${ans.ok ? "✅ ¡Correcto!" : "❌ La respuesta es: " + esc(q.o[q.a])}</b>
          ${q.w ? `<div><b>¿Por qué?</b> ${q.w}</div>` : ans.why ? md(ans.why) : window.AI.enabled() ? `<button class="link" data-action="whyAI" data-quiz="${name}" data-q="${qi}">🤖 ¿Por qué? Explícamelo</button>` : ""}</div>` : ""}</div>`;
      }).join("")}
    </section>`;
  }
  function quizScore(name) {
    const st = ctx.quiz && ctx.quiz[name]; if (!st) return 0;
    const n = st.items.length; const r = Object.values(st.answers).filter((a) => a.ok).length;
    return Math.round((r / n) * 100);
  }
  function quizDone(name) { const st = ctx.quiz && ctx.quiz[name]; return st && Object.keys(st.answers).length === st.items.length; }

  function nativeBlock(u) {
    const pairs = ((window.NATIVE || {}).units || {})[u.id];
    if (!pairs) {
      return window.AI.enabled() ? `<section class="card native"><h2>🇺🇸 Así lo dice un nativo</h2>
        ${S.explanations["native:" + u.id] ? md(S.explanations["native:" + u.id]) : `<p class="muted">Pídele a ${TEACHER} las formas naturales y la jerga de EE. UU. para este tema.</p>
        <button class="btn" data-action="nativeAI" data-unit="${u.id}">🤖 ¿Cómo lo dice un nativo de EE. UU.?</button><div id="native-${u.id}"></div>`}</section>` : "";
    }
    return `<section class="card native"><h2>🇺🇸 Así lo dice un nativo</h2>
      <p class="muted">Lo de la izquierda es correcto, pero suena a libro. Lo de la derecha es como hablan de verdad en EE. UU. Escúchalo y repítelo.</p>
      ${pairs.map(([learner, nat, why]) => `<div class="npair"><div class="nlearner">📘 ${esc(learner)}</div>
        <div class="nnative"><button class="icon" data-action="say" data-text="${esc(nat.split(" / ")[0])}" aria-label="Escuchar">🔊</button> 🇺🇸 <b>${esc(nat)}</b></div>
        <div class="muted">${esc(why)}</div></div>`).join("")}
    </section>`;
  }
  function stepLearn(u) {
    return grammarBlock(u) + nativeBlock(u) + vocabBlock(u) + quizBlock(u, u.quiz.slice(0, 2), "learn") + `
      <section class="card"><p class="muted">Al terminar, las ${u.vocab.length} palabras se agregan a tu repaso inteligente (flashcards).</p>
      <button class="btn primary big" data-action="finishStep" data-need="learn">Terminar clase ✔</button></section>`;
  }
  function stepPractice(u) {
    if (!ctx.order) {
      ctx.order = u.grammar.examples.slice(0, 2).map((s) => ({ target: s, pieces: shuffle(s.replace(/[.?!]$/, "").split(" ")), built: [] }));
      const others = C.flatMap((x) => x.vocab.map((v) => v[0]));
      ctx.trans = shuffle(u.vocab).slice(0, 4).map(([en, es]) => ({ es, en, opts: shuffle([en, ...shuffle(others.filter((o) => o !== en)).slice(0, 3)]) }));
    }
    return drillBlock(u) + quizBlock(u, u.quiz, "practice") + `
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
  // Entrenamiento de recuerdo activo con voz: ves español → lo dices en inglés en voz alta → escuchas la respuesta.
  // Los fallos vuelven más adelante en la misma sesión (repetición graduada) y pasan a tu repaso.
  function buildDrill(u) {
    const ex = (window.EXPLAIN || {})[u.id];
    let items = u.vocab.map(([en, es]) => ({ es, en }));
    if (ex) items = items.concat(ex.formulas.map((f) => ({ es: f.es.replace(/\s*\+\s*/g, " ").replace(/\(.*?\)/g, "").trim(), en: f.ex })));
    items = shuffle(items).slice(0, 8);
    const prev = C[unitIndex(u.id) - 1];
    if (prev) items = items.concat(shuffle(prev.vocab).slice(0, 2).map(([en, es]) => ({ es, en, old: true })));
    return { queue: items, i: 0, phase: "prompt", right: 0, wrong: 0, done: false, total: items.length };
  }
  function drillBlock(u) {
    const d = (ctx.drill = ctx.drill || buildDrill(u));
    if (d.done) return `<section class="card drill"><h2>🎯 Entrenamiento con ${TEACHER} ✅</h2><p>Primera vez correctas: <b>${d.right}</b> · repetidas hasta dominarlas: <b>${d.wrong}</b>. Lo que fallaste quedó en tu repaso.</p></section>`;
    const it = d.queue[d.i];
    const left = d.queue.length - d.i;
    return `<section class="card drill"><h2>🎯 Entrenamiento con ${TEACHER} <span class="pill">${left} por dominar</span></h2>
      <p class="muted">Método de recuerdo activo: lee la frase en español, <b>dila en inglés en voz alta</b> y solo después mira la respuesta. Las que falles vuelven a salir hasta que las domines.</p>
      <div class="flash drillcard">
        <div class="muted">${it.old ? "Repaso de la unidad anterior · " : ""}¿Cómo se dice en inglés?</div>
        <div class="front">${esc(it.es)} <button class="icon" data-action="sayEs" data-text="${esc(it.es)}" aria-label="Escuchar en español">🔊</button></div>
        ${d.phase === "reveal" ? `<div class="back"><b>${esc(it.en)}</b> <button class="icon" data-action="say" data-text="${esc(it.en)}">🔊</button></div><div class="muted">Repítela 2 veces imitando el audio.</div>` : `<div class="muted">🗣 Dila en voz alta ahora…</div>`}
      </div>
      ${d.phase === "reveal" ? `<div class="grade two"><button class="btn bad" data-action="drillGrade" data-ok="0">❌ Me equivoqué</button><button class="btn good" data-action="drillGrade" data-ok="1">✅ La dije bien</button></div>`
        : `<button class="btn primary big" data-action="drillReveal">Ya la dije → ver respuesta</button>`}
    </section>`;
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
  // ¿Se puede usar el micrófono aquí? "yes" | "no" | "checking"
  let micBroken = false;
  function micMode() {
    if (micBroken) return "no";
    if (window.ARTIFACT_MODE) return window.MIC_STATE || "checking";
    return SR ? "yes" : "no";
  }
  const minWords = (u) => (u.level === "A1" ? 25 : 45);
  function speakingPanel(u, id) {
    const sp = (ctx.sp = ctx.sp || {});
    const st = (sp[id] = sp[id] || { text: "", secs: 0, feedback: "", score: null });
    ctx.writeMode = ctx.writeMode || {};
    const mic = micMode();
    const writing = mic === "no" || ctx.writeMode[id];
    const n = words(st.text).length, need = minWords(u);
    const recording = ctx.recording === id;
    const es = (window.SPEAKING_ES || {})[u.id] || "";
    return `<div class="speak">
      <div class="sstep"><span class="snum">1</span><div class="sbody"><b>Qué te piden</b>
        <p class="prompt"><button class="icon" data-action="say" data-text="${esc(u.speaking)}" aria-label="Escuchar">🔊</button> ${esc(u.speaking)}</p>
        ${es ? `<p class="muted">🇪🇸 ${esc(es)}</p>` : ""}</div></div>

      <div class="sstep"><span class="snum">2</span><div class="sbody"><b>Prepárate (30 segundos)</b>
        <p>Piensa 3 ideas sobre el tema. Intenta usar estas palabras: ${u.vocab.slice(0, 5).map((v) => `<span class="pill">${esc(v[0])}</span>`).join(" ")}</p>
        ${u.model ? `<div class="model"><b>Ejemplo para guiarte:</b> escúchalo y repítelo 2 veces. Luego dilo cambiando los datos por los tuyos.
          <p><button class="icon" data-action="say" data-text="${esc(u.model)}" aria-label="Escuchar ejemplo">🔊</button> ${esc(u.model)}</p></div>` : ""}</div></div>

      <div class="sstep"><span class="snum">3</span><div class="sbody"><b>Responde en voz alta</b> <span class="muted">(mínimo ${need} palabras)</span>
        ${writing ? `
          <div class="notice">${mic === "no" ? `<b>🎙 El micrófono no funciona en este dispositivo</b> (o no diste permiso). No pasa nada, hazlo así:` : `<b>✍️ Modo escribir:</b>`}
            <ol><li><b>Di tu respuesta en voz alta</b>, aunque nadie te escuche. Hablar es la práctica más importante.</li>
            <li><b>Escríbela aquí abajo</b>, igual a como la dijiste, para revisarla.</li></ol>
            <p class="muted">💡 Truco: en el celular, toca el 🎤 de tu teclado y dicta en inglés. Así escribe por ti.</p></div>
          <form data-form="typedSpeak" data-id="${id}"><textarea name="t" rows="5" placeholder="Write your answer in English here…">${esc(st.text)}</textarea>
            <button class="btn primary">Listo, revisar mi respuesta</button></form>
          ${mic !== "no" ? `<button class="link" data-action="writeMode" data-id="${id}" data-on="0">🎙 Mejor usar el micrófono</button>` : ""}`
        : mic === "checking" ? `<p class="muted">Revisando el micrófono…</p><button class="link" data-action="writeMode" data-id="${id}" data-on="1">✍️ Prefiero escribir mi respuesta</button>`
        : `<p>Toca <b>Grabar</b>, habla en inglés y toca <b>Terminar</b> cuando acabes. Lo que digas aparecerá escrito.</p>
          <div class="row"><button class="btn primary big-rec ${recording ? "rec-on" : ""}" data-action="rec" data-id="${id}">${recording ? "⏹ Terminar" : "🎙 Grabar"}</button>
          <span class="timer" id="timer-${id}">${recording ? "⏺ grabando…" : st.secs ? st.secs + " s" : "Meta: 1 a 2 minutos"}</span></div>
          <div class="transcript" id="tr-${id}">${esc(st.text) || '<span class="muted">Aquí aparecerá lo que digas…</span>'}</div>
          <button class="link" data-action="writeMode" data-id="${id}" data-on="1">¿El micrófono no funciona? Escribe tu respuesta</button>`}
      </div></div>

      <div class="sstep ${st.text && !recording ? "" : "dim"}"><span class="snum">4</span><div class="sbody"><b>Tu resultado</b>
        ${st.text && !recording ? `
          <p>${n >= need ? `<span class="pill good">✅ ${n} palabras: cumples el mínimo</span>` : `<span class="pill bad">${n} de ${need} palabras: te faltan ${need - n}</span>`}</p>
          ${n < need ? `<p class="muted">${TEACHER}: “Say more! Añade detalles: ¿cuándo?, ¿dónde?, ¿con quién?, ¿por qué?”</p>` : ""}
          <p class="muted">Revisa: ¿usaste la gramática de la clase? ¿usaste palabras nuevas? ¿lo dijiste en voz alta?</p>
          ${window.AI.enabled() ? `<button class="btn" data-action="aiSpeak" data-id="${id}" data-unit="${u.id}">🤖 Que ${TEACHER} corrija mi respuesta</button>` : ""}
          <div class="feedback" id="fb-${id}">${st.feedback ? md(st.feedback) : ""}</div>`
        : `<p class="muted">Aparece cuando termines el paso 3.</p>`}
      </div></div>
    </div>`;
  }
  function stepSpeak(u) {
    return `<section class="card"><h2>🎤 Speaking: ${esc(u.title)}</h2>
      ${speakingPanel(u, "unit-" + u.id)}
    </section>
    <section class="card"><button class="btn primary big" data-action="finishStep" data-need="speak">Terminar clase ✔</button>
      <p class="muted center">Para terminar necesitas al menos ${minWords(u)} palabras en el paso 3.</p></section>`;
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
    const hwPending = hw && hw.status === "pending";
    const done = quizDone("test");
    const score = done ? quizScore("test") : null;
    return quizBlock(u, ctx.testItems, "test") + `
      <section class="card"><h2>📝 Tu tarea de esta unidad</h2>
      ${hw ? (hw.status === "pending" ? `<p class="pill bad">Pendiente</p><p>Envíala antes de cerrar la unidad para recibir corrección.</p><button class="btn" data-action="openHw" data-id="${hw.id}">Hacer tarea ahora</button>` : `<p class="pill good">Entregada${hw.score != null ? " · nota " + hw.score + "/10" : ""}</p>`) : '<p class="muted">Sin tarea registrada.</p>'}
      </section>
      <section class="card">${done ? `<h2>Resultado: ${score}%</h2><p>${score >= PASS ? "🎉 ¡Unidad aprobada! Pasas a la siguiente." : `Necesitas ${PASS}% para avanzar. ${TEACHER} no te deja pasar con bases flojas: vuelves a <b>Practica</b> y luego repites el examen.`}</p>` : `<p class="muted">Responde todas las preguntas para ver tu resultado (necesitas ${PASS}%).</p>`}
      ${hwPending ? `<p class="pill bad">Primero entrega tu tarea de esta unidad: sin tarea no se presenta el examen.</p>` : ""}
      <button class="btn primary big" data-action="finishStep" data-need="test" ${done && !hwPending ? "" : "disabled"}>${done && score >= PASS ? "Cerrar unidad 🏁" : "Terminar"}</button></section>`;
  }

  function afterClassRender() { /* hook para futuras animaciones */ }

  // ───────────────────────── REPASO (SRS) ─────────────────────────
  function reviewTabs() {
    const n = dueCards().length, total = Object.keys(S.cards).length, tab = ctx.tab || "today";
    return `<div class="tabs" role="tablist">
      <button class="${tab === "today" ? "on" : ""}" data-action="tab" data-tab="today">🔁 Repasar hoy <span class="pill">${n}</span></button>
      <button class="${tab === "vocab" ? "on" : ""}" data-action="tab" data-tab="vocab">🗂 Mi vocabulario <span class="pill">${total}</span></button></div>`;
  }
  function cardStatus(c) {
    if (c.box >= 4) return ["good", "Dominada"];
    if (c.box === 0 && !c.seen) return ["", "Nueva"];
    return ["mid", "Aprendiendo"];
  }
  function viewVocab() {
    const f = ctx.vfilter || "all";
    const all = Object.values(S.cards);
    const filters = [["all", "Todas"], ["learning", "Por dominar"], ["mastered", "Dominadas"], ["mistakes", "Mis errores"], ["mine", "Conversaciones y mías"]];
    const pass = (c) => f === "all" ? true : f === "mastered" ? c.box >= 4 : f === "learning" ? c.box < 4 && !c.mistake : f === "mistakes" ? !!c.mistake : f === "mine" ? ["custom", "conv", "real"].includes(c.unitId) : true;
    const list = all.filter(pass);
    const groups = {};
    list.forEach((c) => { (groups[c.unitId] = groups[c.unitId] || []).push(c); });
    const rank = (g) => ({ conv: -3, real: -2, custom: -1 }[g] || 0);
    const order = Object.keys(groups).sort((a, b) => rank(a) - rank(b) || unitIndex(b) - unitIndex(a));
    const fmt = (d) => d <= today() ? "hoy" : d === addDays(today(), 1) ? "mañana" : new Date(d + "T12:00:00").toLocaleDateString("es", { day: "numeric", month: "short" });
    return `<section class="card">
      <div class="vstats"><div><b>${all.length}</b><span>tarjetas</span></div><div><b>${all.filter((c) => c.box >= 4).length}</b><span>dominadas</span></div><div><b>${all.filter((c) => c.box < 4).length}</b><span>por dominar</span></div><div><b>${all.filter((c) => c.mistake).length}</b><span>errores</span></div></div>
      <input id="vsearch" type="search" placeholder="Buscar en inglés o en español…" autocomplete="off">
      <div class="row">${filters.map(([k, n]) => `<button class="chip-btn ${f === k ? "" : "ghost"}" data-action="vfilter" data-f="${k}">${n}</button>`).join("")}</div>
      ${list.length && f !== "mastered" ? `<button class="btn small" data-action="studyFiltered">▶ Repasar estas ${list.length} ahora</button>` : ""}
    </section>
    <details class="card addword"><summary><b>➕ Agregar mi propia palabra o frase</b></summary>
      <form data-form="addCard" class="addform">
        <label>En inglés<input name="en" required placeholder="Ej: I'm looking forward to it"></label>
        <label>En español<input name="es" required placeholder="Ej: tengo muchas ganas"></label>
        <label>Ejemplo (opcional)<input name="ex" placeholder="Ej: The trip? I'm looking forward to it!"></label>
        <button class="btn primary">Guardar tarjeta</button></form></details>
    ${list.length ? order.map((id) => { const u = C[unitIndex(id)];
      const special = { custom: "✍️ Mis palabras", conv: "💬 De mis conversaciones con " + TEACHER, real: "🇺🇸 De la vida real (escenas)" };
      return `<section class="card vgroup"><h3>${special[id] || (u ? `${u.level} · ${esc(u.title)}` : esc(id))} <span class="muted">(${groups[id].length})</span></h3>
        ${groups[id].map((c) => { const [k, label] = cardStatus(c);
          return `<div class="vrow" data-search="${esc((c.en + " " + c.es + " " + (c.ex || "")).toLowerCase())}">
            <button class="icon" data-action="say" data-text="${esc(c.en + (c.ex ? ". " + c.ex : ""))}" aria-label="Escuchar">🔊</button>
            <div class="vtext"><b>${esc(c.en)}</b> <span class="muted">— ${esc(c.es)}</span>${c.ex ? `<div class="ex">${esc(c.ex)}</div>` : ""}
              ${(() => { const cx = vocabContext(c.unitId, c.en); return cx ? `<details class="mini-ctx"><summary>Ver contexto</summary>${contextHTML(cx)}</details>` : ""; })()}</div>
            <div class="vmeta"><span class="pill ${k}">${c.mistake ? "Error · " : ""}${label}</span><span class="muted">Repaso: ${fmt(c.due)}</span>
            ${["custom", "conv", "real"].includes(c.unitId) || c.mistake ? `<button class="link small" data-action="delCard" data-id="${esc(c.id)}">Quitar</button>` : ""}</div>
          </div>`; }).join("")}</section>`; }).join("")
      : `<section class="card"><p>${all.length ? "No hay tarjetas con este filtro." : "Todavía no tienes tarjetas. Se crean solas al terminar la clase “Aprende” de cada unidad, y también puedes agregar las tuyas."}</p></section>`}`;
  }
  function viewReview() {
    if (ctx.warm) return viewWarmup();
    if ((ctx.tab || "today") === "vocab") return reviewTabs() + viewVocab();
    return reviewTabs() + viewReviewToday();
  }
  function viewReviewToday() {
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
        ${showBack ? (() => { const cx = vocabContext(card.unitId, card.en); return cx ? `<div class="card-when">📍 ${esc(cx.when)}<br>🧩 ${cx.build}<br>⚠️ ${esc(cx.watch)}</div>` : ""; })() : ""}
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
    const sentencesTarget = /(\d+)(?:-(\d+))?\s*(?:frases|líneas)/.exec(u.writing);
    const min = target ? parseInt(target[1], 10) : sentencesTarget ? parseInt(sentencesTarget[1], 10) * 6 : 100;
    const core = (en) => en.toLowerCase().split(" (")[0].split(" / ")[0].replace(/\.\.\.|…/g, "").trim();
    const used = u.vocab.filter(([en]) => core(en) && text.toLowerCase().includes(core(en)));
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
  // Situaciones de conversación: qué es, tu objetivo y frases para arrancar
  const SCENARIOS = [
    { en: "Ordering at a coffee shop in Los Angeles. The student is the customer; you are the barista.", es: "Pedir en una cafetería", icon: "☕", goal: "Pedir una bebida, decir el tamaño y pagar.", starters: [["Hi! Can I get a coffee, please?", "¡Hola! ¿Me das un café, por favor?"], ["A medium, please.", "Uno mediano, por favor."], ["How much is it?", "¿Cuánto es?"], ["That's it, thanks.", "Eso es todo, gracias."]] },
    { en: "Small talk with the student's neighbor in the elevator of their apartment building in Miami.", es: "Saludar a tu vecino", icon: "👋", goal: "Saludar, hablar del clima y despedirte.", starters: [["Hi! How's it going?", "¡Hola! ¿Cómo va todo?"], ["Pretty good, thanks. And you?", "Bastante bien, gracias. ¿Y tú?"], ["It's so hot today!", "¡Qué calor hace hoy!"], ["Have a good one!", "¡Que te vaya bien!"]] },
    { en: "Checking out at a grocery store in Texas. You are the cashier.", es: "Pagar en el supermercado", icon: "🛒", goal: "Responder las preguntas del cajero y pagar.", starters: [["Yes, I found everything, thanks.", "Sí, encontré todo, gracias."], ["No, I don't have a rewards card.", "No, no tengo tarjeta de puntos."], ["Yes, I need a bag, please.", "Sí, necesito una bolsa, por favor."], ["Debit, please.", "Débito, por favor."]] },
    { en: "Ordering dinner at a diner in New York; you are the server.", es: "Pedir comida en un restaurante", icon: "🍔", goal: "Pedir mesa, bebida, comida y la cuenta.", starters: [["Hi, a table for two, please.", "Hola, una mesa para dos, por favor."], ["Can I get a lemonade?", "¿Me trae una limonada?"], ["I'll have the burger, please.", "Quiero la hamburguesa, por favor."], ["Can we get the check, please?", "¿Nos trae la cuenta, por favor?"]] },
    { en: "First day at a new job in an American office; you are a friendly coworker.", es: "Primer día de trabajo", icon: "💼", goal: "Presentarte, decir de dónde eres y aceptar una invitación.", starters: [["Hi, I'm new here. My name is…", "Hola, soy nueva aquí. Me llamo…"], ["I'm from Colombia.", "Soy de Colombia."], ["Nice to meet you!", "¡Mucho gusto!"], ["Sure, sounds good!", "¡Claro, suena bien!"]] },
    { en: "The student calls a doctor's office to make an appointment; you are the receptionist.", es: "Pedir una cita médica por teléfono", icon: "📞", goal: "Pedir una cita y elegir día y hora.", starters: [["Hi, I'd like to make an appointment.", "Hola, quisiera pedir una cita."], ["Yes, I'm a new patient.", "Sí, soy paciente nueva."], ["Afternoons are better for me.", "Las tardes me quedan mejor."], ["That works, thank you.", "Me sirve, gracias."]] },
    { en: "Chatting with a new friend at a house party about work, hobbies and weekend plans.", es: "Conocer a alguien en una fiesta", icon: "🎉", goal: "Presentarte, hablar de tu trabajo y de lo que te gusta.", starters: [["Hi, I'm…. How do you know Sarah?", "Hola, soy…. ¿De dónde conoces a Sarah?"], ["I work in…", "Trabajo en…"], ["I like music and movies.", "Me gusta la música y el cine."], ["It was great talking to you!", "¡Fue un gusto hablar contigo!"]] },
    { en: "A simple job interview for a position the student would love at an American company; you are the interviewer.", es: "Entrevista de trabajo", icon: "🧑‍💼", goal: "Hablar de ti, tu experiencia y por qué quieres el trabajo.", starters: [["Thank you for having me.", "Gracias por recibirme."], ["I have three years of experience in…", "Tengo tres años de experiencia en…"], ["I'm a hard worker and I learn fast.", "Soy trabajadora y aprendo rápido."], ["I really want to grow with your company.", "De verdad quiero crecer con su empresa."]] },
    { en: "Returning something the student bought at a store and asking for a refund; you are the store clerk.", es: "Devolver algo en una tienda", icon: "🧾", goal: "Explicar el problema y pedir que te devuelvan el dinero.", starters: [["Hi, I'd like to return this.", "Hola, quisiera devolver esto."], ["It doesn't fit.", "No me queda bien."], ["Here's my receipt.", "Aquí está mi recibo."], ["Can I get a refund?", "¿Me pueden devolver el dinero?"]] },
    { en: "Talking with a friend about a TV show you both watched.", es: "Hablar de una serie con una amiga", icon: "📺", goal: "Decir qué viste, si te gustó y por qué.", starters: [["I watched a really good show.", "Vi una serie muy buena."], ["It's about…", "Se trata de…"], ["I loved it!", "¡Me encantó!"], ["You have to watch it!", "¡Tienes que verla!"]] }
  ];
  const LIFELINES = [["Sorry, I don't understand.", "Perdón, no entiendo."], ["Can you say that again, please?", "¿Puedes repetirlo, por favor?"], ["Can you speak more slowly?", "¿Puedes hablar más despacio?"], ["How do you say … in English?", "¿Cómo se dice … en inglés?"], ["What does … mean?", "¿Qué significa …?"], ["Give me a second.", "Dame un segundo."]];
  // Guarda una frase en las tarjetas (no duplica). group: "conv" (conversaciones) | "real" (vida real) | "custom"
  function addCard(group, en, es, ex) {
    en = (en || "").trim(); es = (es || "").trim(); if (!en || !es) return false;
    const id = group + ":" + en.toLowerCase().replace(/[^a-z0-9' ]/g, "").slice(0, 60);
    if (S.cards[id]) return false;
    S.cards[id] = { id, en, es, ex: ex || "", unitId: group, box: 0, due: addDays(today(), 1) };
    return true;
  }
  // Separa el mensaje de Kate en: inglés, traducción, corrección y respuestas sugeridas
  function parseKate(text) {
    const out = { en: [], es: "", tip: "", options: [] };
    text.split("\n").map((l) => l.trim()).filter(Boolean).forEach((l) => {
      if (l.startsWith("🏁")) out.end = true;
      else if (l.startsWith("🇪🇸")) out.es = l.replace(/^🇪🇸\s*/, "");
      else if (l.startsWith("💡")) out.tip = l.replace(/^💡\s*/, "");
      else if (l.startsWith("➡️") || l.startsWith("➡")) { const [en, es] = l.replace(/^➡️?\s*/, "").split("|").map((x) => x.trim()); if (en) out.options.push([en, es || ""]); }
      else out.en.push(l.replace(/^\d\)\s*/, ""));
    });
    out.en = out.en.join(" ");
    return out;
  }
  const firstName = () => ((S.profile && S.profile.name) || "Ana").split(" ")[0];
  const sceneText = (t) => t.replace(/\bAna\b/g, firstName());
  const SCENES = () => (window.NATIVE || {}).scenes || [];
  function sceneList() {
    const done = S.scenes || {};
    const lvl = LEVELS.indexOf(currentLevel());
    return `<section class="card"><h2>🇺🇸 Vida real en EE. UU.</h2>
      <p class="muted">Situaciones del día a día, con la forma en que hablan de verdad. En cada escena: <b>1. Escucha</b> sin leer → <b>2. Entiende</b> (preguntas) → <b>3. Actúa tu papel</b> en voz alta.</p>
      <div class="scenes">${SCENES().map((sc) => { const d = done[sc.id]; const hard = LEVELS.indexOf(sc.level) > lvl + 1;
        return `<button class="scene ${d ? "done" : ""}" data-action="openScene" data-id="${sc.id}"><span class="sicon">${sc.icon}</span>
          <span class="sbody"><b>${esc(sc.title)}</b><span class="muted">${sc.level}${hard ? " · un poco difícil para ti todavía" : ""}</span></span>
          <span>${d ? `<span class="pill good">✅ ${d.score}%</span>` : ""}</span></button>`; }).join("")}</div></section>
    <section class="card"><h2>🗣 Cómo suena el inglés de verdad</h2>
      <p class="muted">Al hablar rápido, los estadounidenses juntan palabras. Si no conoces estas formas, no entiendes a los nativos aunque sepas el vocabulario. Úsalas al hablar, no en textos formales.</p>
      <div class="reds">${(window.NATIVE.reductions || []).map(([r, full, ex]) => `<div class="red"><button class="icon" data-action="say" data-text="${esc(ex)}" aria-label="Escuchar">🔊</button>
        <div><b>${esc(r)}</b> <span class="muted">= ${esc(full)}</span><div class="ex">${esc(ex)}</div></div></div>`).join("")}</div>
      <button class="btn small" data-action="addReductions">➕ Agregar estas formas a mis tarjetas</button></section>`;
  }
  function sceneView(sc) {
    const st = (ctx.sc = ctx.sc && ctx.sc.id === sc.id ? ctx.sc : { id: sc.id, mode: "listen", show: false, es: false, quiz: {}, i: 0, phase: "prompt", ok: 0, miss: 0 });
    const lines = sc.lines.map(([who, en, es, spoken]) => ({ who, en: sceneText(en), es: sceneText(es), spoken: spoken ? sceneText(spoken) : null }));
    const speakers = [...new Set(lines.map((l) => l.who))];
    const tabs = [["listen", "1. Escucha"], ["quiz", "2. Entiende"], ["role", "3. Actúa"]];
    let body = "";
    if (st.mode === "listen") {
      body = `<p>${st.show ? "Ahora lee mientras escuchas. Repite en voz alta las frases que te cuesten." : "Primero <b>escucha sin leer</b>, como en la vida real. Intenta entender la idea general. Luego muestra el texto."}</p>
        <button class="btn primary big" data-action="playScene">▶ Escuchar la conversación</button>
        <div class="row"><button class="btn small" data-action="sceneToggle" data-k="show">${st.show ? "🙈 Ocultar texto" : "👀 Mostrar texto"}</button>
        ${st.show ? `<button class="btn small" data-action="sceneToggle" data-k="es">${st.es ? "Ocultar traducción" : "🇪🇸 Ver traducción"}</button>` : ""}</div>
        ${st.show ? `<div class="dialog">${lines.map((l, i) => `<div class="dline ${l.who === "Tú" ? "me" : ""}"><span class="who">${esc(l.who === "Tú" ? "Tú" : l.who)}</span>
          <div><button class="icon" data-action="say" data-text="${esc(l.spoken || l.en)}" aria-label="Escuchar">🔊</button> ${esc(l.en)}${st.es ? `<div class="muted">${esc(l.es)}</div>` : ""}${l.spoken && st.es ? `<div class="muted">Dicho completo: ${esc(l.spoken)}</div>` : ""}</div></div>`).join("")}</div>
        <h3>Expresiones nativas de esta escena</h3>
        <div class="exprs">${sc.expressions.map(([e, m]) => `<div><button class="icon" data-action="say" data-text="${esc(e)}">🔊</button> <b>${esc(e)}</b> <span class="muted">— ${esc(m)}</span></div>`).join("")}</div>
        <button class="btn small" data-action="addSceneCards" data-id="${sc.id}">➕ Agregar estas expresiones a mis tarjetas</button>
        <p class="muted">Al terminar la escena, estas expresiones y tus frases se guardan solas en tus tarjetas.</p>` : ""}
        <button class="btn big" data-action="sceneMode" data-m="quiz">Siguiente: 2. Entiende →</button>`;
    } else if (st.mode === "quiz") {
      const answered = Object.keys(st.quiz).length;
      body = `<p>¿Entendiste? Si dudas, vuelve a escuchar (puedes hacerlo las veces que quieras).</p>
        <button class="btn small" data-action="playScene">▶ Escuchar otra vez</button>
        ${sc.quiz.map(([q, opts, a], qi) => { const pick = st.quiz[qi];
          return `<div class="qblock"><div class="q">${qi + 1}. ${esc(q)}</div><div class="options">${opts.map((o, oi) => `<button class="opt ${pick != null ? (oi === a ? "right" : oi === pick ? "wrong" : "") : ""}" ${pick != null ? "disabled" : ""} data-action="sceneQuiz" data-q="${qi}" data-o="${oi}">${esc(o)}</button>`).join("")}</div></div>`; }).join("")}
        ${answered === sc.quiz.length ? `<button class="btn primary big" data-action="sceneMode" data-m="role">Siguiente: 3. Actúa tu papel →</button>` : ""}`;
    } else {
      if (st.i >= lines.length) {
        const mine = lines.filter((l) => l.who === "Tú").length;
        const score = Math.round((st.ok / Math.max(1, mine)) * 100);
        body = `<div class="flash"><div class="front">🎬 ¡Escena completada!</div><div>Dijiste bien a la primera <b>${st.ok} de ${mine}</b> frases (${score}%).</div>
          <div class="muted">${score >= 80 ? `${TEACHER}: “That was so natural! Nice job.”` : `${TEACHER}: “Good try! Do it one more time and it'll sound way better.”`}</div></div>
          <div class="row"><button class="btn" data-action="sceneRestart">🔁 Repetir la escena</button><button class="btn primary" data-action="sceneBack">Elegir otra escena</button></div>`;
      } else {
        const l = lines[st.i];
        const prev = lines.slice(Math.max(0, st.i - 2), st.i);
        body = `<p class="muted">Tú haces el papel de <b>“Tú”</b>. Cuando sea tu turno, verás en español lo que debes decir: <b>dilo en inglés en voz alta</b> y luego compara con la versión nativa.</p>
          <div class="dialog">${prev.map((p) => `<div class="dline ${p.who === "Tú" ? "me" : ""} past"><span class="who">${esc(p.who)}</span><div>${esc(p.en)}</div></div>`).join("")}
          ${l.who !== "Tú" ? `<div class="dline"><span class="who">${esc(l.who)}</span><div><button class="icon" data-action="say" data-text="${esc(l.spoken || l.en)}">🔊</button> <b>${esc(l.en)}</b><div class="muted">${esc(l.es)}</div></div></div>`
            : `<div class="dline me turn"><span class="who">Tú</span><div><div class="muted">Tu turno. Di en inglés:</div><b>🇪🇸 ${esc(l.es)}</b>
              ${st.phase === "reveal" ? `<div class="native-say"><button class="icon" data-action="say" data-text="${esc(l.spoken || l.en)}">🔊</button> 🇺🇸 <b>${esc(l.en)}</b></div>` : ""}</div></div>`}</div>
          ${l.who !== "Tú" ? `<button class="btn primary big" data-action="sceneNext">Siguiente →</button>`
            : st.phase === "reveal" ? `<div class="grade two"><button class="btn bad" data-action="sceneGrade" data-ok="0">🔁 La repito</button><button class="btn good" data-action="sceneGrade" data-ok="1">✅ La dije bien</button></div>`
            : `<button class="btn primary big" data-action="sceneReveal">Ya la dije → escuchar cómo lo dice un nativo</button>`}
          <div class="muted center">Línea ${st.i + 1} de ${lines.length}</div>`;
      }
    }
    return `<section class="card hero slim"><button class="link" data-action="sceneBack">← Todas las escenas</button>
      <h1>${sc.icon} ${esc(sc.title)}</h1><p class="muted">${esc(sc.setting)} · Nivel ${sc.level}</p>
      <div class="tip">💡 <b>Tip cultural:</b> ${esc(sc.tip)}</div></section>
      <div class="tabs three">${tabs.map(([k, n]) => `<button class="${st.mode === k ? "on" : ""}" data-action="sceneMode" data-m="${k}">${n}</button>`).join("")}</div>
      <section class="card">${body}</section>`;
  }
  function viewSpeaking() {
    const done = C.slice(0, Math.max(1, S.progress.unit + 1));
    if (!ctx.freeUnit) ctx.freeUnit = done[Math.floor(Math.random() * done.length)].id;
    const fu = C[unitIndex(ctx.freeUnit)];
    const chat = (ctx.chat = ctx.chat || { si: 0, history: [] });
    const stab = ctx.stab || "real";
    if (stab === "real" && ctx.sceneId) { const sc = SCENES().find((x) => x.id === ctx.sceneId); if (sc) return sceneView(sc); }
    const tabs = `<div class="tabs three">${[["real", "🇺🇸 Vida real"], ["reto", "🎯 Reto"], ["chat", "💬 Conversar"]].map(([k, n]) => `<button class="${stab === k ? "on" : ""}" data-action="stab" data-t="${k}">${n}</button>`).join("")}</div>`;
    const head = `<section class="card hero slim"><h1>🎤 Escucha y habla</h1><p class="muted">Practica como se habla en la vida real en EE. UU. 2 minutos hablando valen más que 20 leyendo.</p></section>` + tabs;
    if (stab === "real") return head + sceneList();
    if (stab === "reto") return head + `
      <section class="card"><h2>🎯 Reto de speaking</h2>
        <p class="muted">Practica hablar 1 o 2 minutos sobre un tema de tus clases. Sigue los 4 pasos en orden.</p>
        ${speakingPanel(fu, "free")}
        <button class="btn small" data-action="newPrompt">🔄 Darme otro tema</button></section>`;
    return head + `
      ${chatSection(chat)}`;
  }
  function chatSection(chat) {
    if (!window.AI.enabled()) {
      return `<section class="card"><h2>💬 Conversa con ${TEACHER}</h2>
        <p>${window.ARTIFACT_MODE ? "El profesor IA no está disponible en esta vista. Abre la app con tu cuenta de Claude iniciada." : `Para conversar con ${TEACHER}, añade tu API key de Claude en <a href="#" data-action="go" data-view="settings">Ajustes</a>.`}</p>
        <p class="muted">Mientras tanto, practica con las escenas de <b>🇺🇸 Vida real</b>: tienen la conversación completa y te dicen qué decir en cada turno.</p></section>`;
    }
    const sc = SCENARIOS[chat.si || 0];
    const msgs = chat.history.filter((m) => !m.hidden);
    const last = [...chat.history].reverse().find((m) => m.role === "assistant");
    const lastK = last ? parseKate(last.content) : null;
    const lifelines = `<details class="lifelines"><summary>🛟 Frases salvavidas (si te quedas sin palabras)</summary>
      <div class="chips-col">${LIFELINES.map(([en, es]) => `<button class="sugg" data-action="useSugg" data-text="${esc(en)}"><b>${esc(en)}</b><span>${esc(es)}</span></button>`).join("")}</div></details>`;
    if (!chat.history.length) {
      return `<section class="card"><h2>💬 Conversa con ${TEACHER}</h2>
        <p class="muted">Elige una situación. ${TEACHER} habla primero y en cada turno te sugiere qué responder. Tú solo eliges, lo dices en voz alta y lo envías.</p>
        <div class="scen-grid">${SCENARIOS.map((x, i) => `<button class="scen ${i === (chat.si || 0) ? "on" : ""}" data-action="pickScen" data-i="${i}"><span>${x.icon}</span>${esc(x.es)}</button>`).join("")}</div>
      </section>
      <section class="card prep"><h2>${sc.icon} ${esc(sc.es)}</h2>
        <p>🎯 <b>Tu objetivo:</b> ${esc(sc.goal)}</p>
        <p><b>Frases que te van a servir</b> (escúchalas y repítelas antes de empezar):</p>
        <div class="chips-col">${sc.starters.map(([en, es]) => `<div class="starter"><button class="icon" data-action="say" data-text="${esc(en)}" aria-label="Escuchar">🔊</button><div><b>${esc(en)}</b><div class="muted">${esc(es)}</div></div></div>`).join("")}</div>
        ${lifelines}
        <button class="btn primary big" data-action="startChat">▶ Empezar: ${TEACHER} habla primero</button>
      </section>`;
    }
    return `<section class="card"><div class="row between"><h2>${sc.icon} ${esc(sc.es)}</h2><button class="link small" data-action="resetChat">Cambiar situación</button></div>
      <p class="muted">🎯 ${esc(sc.goal)}</p>
      <div class="chat" id="chat">${msgs.map((m) => {
        if (m.role === "user") return `<div class="msg user">${esc(m.content.split("\n(Note for Kate")[0])}</div>`;
        const k = parseKate(m.content);
        return `<div class="msg assistant"><div><button class="icon" data-action="say" data-text="${esc(k.en)}" aria-label="Escuchar">🔊</button> ${esc(k.en)}</div>
          ${k.es ? `<details class="tr"><summary>🇪🇸 Ver en español</summary>${esc(k.es)}</details>` : ""}
          ${k.tip ? `<div class="kate-tip">💡 ${esc(k.tip)}</div>` : ""}</div>`;
      }).join("")}${ctx.chatBusy ? `<div class="msg assistant muted">${TEACHER} está escribiendo…</div>` : ""}</div>
      ${chat.ended ? `<div class="chat-end">${ctx.chatBusy ? `<p class="muted">${TEACHER} está preparando tu resumen…</p>` : `<h3>🏁 Conversación terminada</h3>
          ${chat.summary && chat.summary.note ? `<p>👩‍🏫 ${esc(chat.summary.note)}</p>` : ""}
          ${chat.summary && chat.summary.items.length ? `<p><b>Frases para repasar</b> (ya están en tus tarjetas 🗂):</p>
          <div class="chips-col">${chat.summary.items.map(([en, es, when]) => `<div class="starter"><button class="icon" data-action="say" data-text="${esc(en)}" aria-label="Escuchar">🔊</button><div><b>${esc(en)}</b><div class="muted">${esc(es)}${when ? " · " + esc(when) : ""}</div></div></div>`).join("")}</div>` : ""}
          <div class="row"><button class="btn primary" data-action="restartChat">🔁 Repetir esta conversación</button><button class="btn" data-action="resetChat">Otra situación</button></div>`}</div>` : ""}
      ${!chat.ended && lastK && lastK.options.length && !ctx.chatBusy ? `<div class="sugg-box"><b>¿Qué puedes responder?</b> <span class="muted">Toca una, escúchala, <b>dila en voz alta</b> y envíala (o cámbiala a tu gusto).</span>
        <div class="chips-col">${lastK.options.map(([en, es]) => `<button class="sugg" data-action="useSugg" data-text="${esc(en)}"><b>${esc(en)}</b><span>${esc(es)}</span></button>`).join("")}</div></div>` : ""}
      ${chat.ended ? "" : `<form data-form="chat" class="row chat-form"><input name="m" id="chatInput" placeholder="Escribe en inglés (o en español si no sabes cómo decirlo)" autocomplete="off">
        ${micMode() === "yes" ? `<button type="button" class="btn small" data-action="chatMic">${ctx.recording === "chat" ? "⏹" : "🎙"}</button>` : ""}<button class="btn small primary">Enviar</button></form>
      <p class="muted">💬 ¿No sabes cómo decir algo? <b>Escríbelo en español</b> y ${TEACHER} te enseña cómo se dice en inglés.${micMode() === "no" ? " (El micrófono no funciona aquí: dicta con el 🎤 del teclado del celular.)" : ""}</p>
      ${lifelines}
      <button class="btn small" data-action="endChat">🏁 Terminar la conversación</button>`}
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
      <section class="card"><h2>🗺 Mi camino</h2>
        <div class="lvl-tabs">${LEVELS.map((lv) => { const p = levelProgress(lv); return `<button class="${(ctx.pathLv || currentLevel()) === lv ? "on" : ""}" data-action="pathLv" data-lv="${lv}"><b>${lv}</b><span>${p.pct}%</span></button>`; }).join("")}</div>
        ${pathNodes(ctx.pathLv || currentLevel(), true)}</section>
      ${(newBadges(), "")}
      <section class="card"><h2>🏅 Mis logros <span class="muted">(${Object.keys(S.badges || {}).length}/${BADGES.length})</span></h2>
        <div class="badges">${BADGES.map(([id, icon, name]) => { const d = (S.badges || {})[id]; return `<div class="badge ${d ? "on" : ""}" title="${d ? "Logrado el " + d : "Por lograr"}"><span>${d ? icon : "🔒"}</span><b>${esc(name)}</b></div>`; }).join("")}</div></section>
      ${scoreboard(false)}
      ${(() => { const w = weekStats() || { grade: "C", studied: 0, planned: 1, xp: 0, speak: 0, minutes: 0, hw: 0 }; const verdict = { A: `Excelente. Así se llega a ${S.profile.goal}.`, B: "Bien, pero puedes más. Completa todos los días planeados.", C: "Te falta constancia. Esta semana: rutina completa todos los días.", D: "Así no vas a avanzar. Vuelve a lo básico: 30 minutos diarios, sin excepción.", F: "Semana perdida. Hoy empezamos de nuevo: no rompas la racha." }[w.grade];
        return `<section class="card report"><h2>📋 Boletín semanal de ${TEACHER}</h2>
        <div class="report-row"><div class="grade-big g-${w.grade}">${w.grade}</div>
        <div><div>Días estudiados: <b>${w.studied}/${w.planned}</b></div><div>Puntos: <b>${w.xp}</b> / ${DAILY_XP * w.planned}</div><div>Palabras de speaking: <b>${w.speak}</b> / 300</div><div>Minutos: <b>${w.minutes}</b> · Tareas: <b>${w.hw}</b></div></div></div>
        <p class="teacher-verdict">👩‍🏫 “${verdict}”</p></section>`; })()}
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
        ${window.ARTIFACT_MODE ? `<p class="muted">${window.AI.enabled() ? "✅ Activo: el profesor usa tu cuenta de Claude. La primera vez te pedirá permiso." : "No disponible en esta vista. Ábrela con tu cuenta de Claude iniciada."}</p>` : `
        <p class="muted">Con una API key de Claude (console.anthropic.com) obtienes: corrección detallada de tareas, feedback de speaking y conversación por voz. Se guarda solo en este navegador. Tiene costo por uso según tu cuenta de Anthropic.</p>
        <label>API key<input type="password" name="apiKey" value="${esc(s.apiKey)}" placeholder="sk-ant-..." autocomplete="off"></label>
        <label>Modelo<select name="model">
          <option value="claude-opus-5-5" ${s.model === "claude-opus-5-5" ? "selected" : ""}>Claude Opus 5.5 — mejor calidad</option>
          <option value="claude-sonnet-5-5" ${s.model === "claude-sonnet-5-5" ? "selected" : ""}>Claude Sonnet 5.5 — equilibrado</option>
          <option value="claude-haiku-5-5" ${s.model === "claude-haiku-5-5" ? "selected" : ""}>Claude Haiku 5.5 — más económico</option></select></label>`}
        <h2>📍 Mi nivel</h2>
        <p class="muted">Estás en <b>${currentLevel()}</b> · ${esc(curUnit().title)}. Si te parece muy difícil o muy fácil, cambia el punto de inicio (no pierdes tu repaso ni tus tareas).</p>
        <div class="row"><select id="levelSel">${LEVELS.map((l) => `<option ${l === currentLevel() ? "selected" : ""} value="${l}">${l}${l === "A1" ? " – Fundamentos (desde cero)" : ""}</option>`).join("")}</select>
        <button type="button" class="btn" data-action="changeLevel">Empezar en este nivel</button></div>
        <h2>👤 Perfil</h2>
        <label>Nombre<input name="name" value="${esc(S.profile.name)}"></label>
        <label>Meta<select name="goal"><option ${S.profile.goal === "B2" ? "selected" : ""}>B2</option><option ${S.profile.goal === "C1" ? "selected" : ""}>C1</option></select></label>
        <button class="btn primary big">Guardar ajustes</button>
      </form>
      <section class="card"><h2>💾 Copia de seguridad</h2><p class="muted">${window.ARTIFACT_MODE ? "Tu progreso se guarda en tu cuenta de Claude y en este navegador." : "Tus datos viven en este dispositivo."} Exporta para guardar una copia o pasarla a otro dispositivo.</p>
        <div class="row"><button class="btn" data-action="export">Exportar</button><label class="btn">Importar<input type="file" accept="application/json" data-action="import" hidden></label>
        <button class="btn bad" data-action="reset">${ctx.confirmReset ? "Sí, borrar todo" : "Borrar todo"}</button>
        ${ctx.confirmReset ? '<button class="btn" data-action="cancelReset">Cancelar</button>' : ""}</div>
        ${ctx.confirmReset ? '<p class="pill bad">Se borrará todo tu progreso y no se puede deshacer.</p>' : ""}</section>`;
  }

  // ───────────────────────── Eventos ─────────────────────────
  let recHandle = null, recStart = 0, recTimer = null;
  function stopRec() { if (recHandle) recHandle.stop(); recHandle = null; clearInterval(recTimer); }

  document.addEventListener("click", async (e) => {
    const el = e.target.closest("[data-action]");
    if (!el || el.tagName === "SELECT" || (el.tagName === "INPUT" && el.type === "file")) return;
    const a = el.dataset.action;
    if (el.closest("summary") && el.tagName === "BUTTON") e.preventDefault();
    if (el.tagName === "A" && a !== "go" && a !== "listened") return;
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
      case "sayEs": speakEs(el.dataset.text); break;
      case "sayDialog": { const ls = JSON.parse(el.dataset.lines); speakLines(ls.map((t, i) => ({ text: t, voice: i % 2 }))); break; }
      case "wordAI": {
        const u = C[unitIndex(el.dataset.unit)]; const i = +el.dataset.i; const [en, es, ex] = u.vocab[i]; const out = $(`#wctx-${u.id}-${i}`);
        el.disabled = true; out.innerHTML = '<p class="muted">Preparando la explicación…</p>';
        try {
          const txt = await window.AI.explain({ level: u.level, question: `Explica la palabra o frase "${en}" (significa: ${es}; ejemplo: "${ex}") a una persona hispanohablante de nivel ${u.level}, en inglés de Estados Unidos y con mucho contexto real.
Usa exactamente estas secciones, cortas y claras:
## 📍 Cuándo la usas (situaciones reales concretas)
## 🗣 Hablado vs ✍️ escrito (cómo la dicen al hablar en EE. UU. y cómo se escribe en un mensaje o un email)
## 👂 Cómo suena (pronunciación aproximada en español y si se une con otras palabras)
## 💬 En una conversación real (diálogo de 3 o 4 líneas en EE. UU., con traducción de cada línea)
## 🧩 Arma tu frase (el patrón y 3 ejemplos que pueda adaptar a su vida)
## ⚠️ Ojo (confusiones o errores típicos de hispanohablantes)` });
          S.explanations["word:" + u.id + ":" + i] = txt; ctx.openWord = "word:" + u.id + ":" + i; save(); rerenderKeepScroll();
        } catch (err) { out.innerHTML = `<p class="pill bad">${esc(err.message)}</p>`; el.disabled = false; }
        break;
      }
      case "nextAct": case "celNext": { $("#celebrate").hidden = true; const nx = nextActivity(); stopRec(); go(nx.view, nx.extra); break; }
      case "celHome": $("#celebrate").hidden = true; go("today"); break;
      case "celClose": $("#celebrate").hidden = true; break;
      case "pathLv": ctx.pathLv = el.dataset.lv; rerenderKeepScroll(); break;
      case "stab": ctx.stab = el.dataset.t; ctx.sceneId = null; ctx.sc = null; stopRec(); ctx.recording = null; render(); break;
      case "openScene": ctx.stab = "real"; ctx.sceneId = el.dataset.id; ctx.sc = null; render(); window.scrollTo(0, 0); break;
      case "sceneBack": ctx.sceneId = null; ctx.sc = null; if (window.speechSynthesis) speechSynthesis.cancel(); render(); window.scrollTo(0, 0); break;
      case "sceneMode": ctx.sc.mode = el.dataset.m; if (el.dataset.m === "role") { ctx.sc.i = 0; ctx.sc.phase = "prompt"; ctx.sc.ok = 0; ctx.sc.finished = false; window.scrollTo(0, 0); afterSceneStep(); break; } render(); window.scrollTo(0, 0); break;
      case "sceneToggle": ctx.sc[el.dataset.k] = !ctx.sc[el.dataset.k]; rerenderKeepScroll(); break;
      case "playScene": {
        const sc = SCENES().find((x) => x.id === ctx.sceneId);
        const who = [...new Set(sc.lines.map((l) => l[0]))];
        speakLines(sc.lines.map((l) => ({ text: sceneText(l[3] || l[1]), voice: who.indexOf(l[0]) })));
        const lg = dayLog(); if (!lg.listened) { lg.listened = true; lg.minutes += 5; save(); }
        break;
      }
      case "sceneQuiz": {
        const sc = SCENES().find((x) => x.id === ctx.sceneId); const qi = +el.dataset.q; const oi = +el.dataset.o;
        if (ctx.sc.quiz[qi] != null) break; ctx.sc.quiz[qi] = oi;
        record(curUnit().id, "listening", oi === sc.quiz[qi][2]); save(); rerenderKeepScroll(); break;
      }
      case "sceneNext": ctx.sc.i++; ctx.sc.phase = "prompt"; afterSceneStep(); break;
      case "sceneReveal": {
        const sc = SCENES().find((x) => x.id === ctx.sceneId); const l = sc.lines[ctx.sc.i];
        ctx.sc.phase = "reveal"; speak(sceneText(l[3] || l[1])); rerenderKeepScroll(); break;
      }
      case "sceneGrade": {
        const ok = el.dataset.ok === "1";
        if (ok) { if (!ctx.sc.missed) ctx.sc.ok++; ctx.sc.missed = false; ctx.sc.i++; ctx.sc.phase = "prompt"; }
        else { ctx.sc.missed = true; ctx.sc.phase = "prompt"; toast("Escúchala otra vez y repítela 🔁"); }
        record(curUnit().id, "speaking", ok); dayLog().speakingWords += 4; save(); afterSceneStep(); break;
      }
      case "sceneRestart": ctx.sc.i = 0; ctx.sc.ok = 0; ctx.sc.phase = "prompt"; ctx.sc.finished = false; afterSceneStep(); break;
      case "addSceneCards": {
        const sc = SCENES().find((x) => x.id === el.dataset.id); let n = 0;
        sc.expressions.forEach(([e, m]) => { if (addCard("real", e, m, "📍 " + sc.title)) n++; });
        save(); toast(n ? `${n} expresiones agregadas a tus tarjetas` : "Ya estaban en tus tarjetas"); break;
      }
      case "addReductions": {
        let n = 0;
        window.NATIVE.reductions.forEach(([r, full, ex]) => { const id = "native:" + r; if (!S.cards[id]) { S.cards[id] = { id, en: r, es: "= " + full, ex, unitId: "custom", box: 0, due: today() }; n++; } });
        save(); toast(n ? `${n} formas agregadas a tus tarjetas` : "Ya estaban en tus tarjetas"); break;
      }
      case "nativeAI": {
        const u = C[unitIndex(el.dataset.unit)]; const out = $("#native-" + u.id);
        el.disabled = true; out.innerHTML = '<p class="muted">Preparando…</p>';
        try {
          const txt = await window.AI.explain({ level: u.level, question: `Tema de la clase: "${u.grammar.name}" (${u.title}). Ejemplos de libro: ${u.grammar.examples.join(" | ")}.
Muestra cómo hablan de verdad en Estados Unidos sobre este tema, en lenguaje cotidiano y jerga actual (sin groserías):
## Suena a libro → Así lo dice un nativo (5 pares: frase de libro → frase nativa de EE. UU. → explicación corta en español)
## Expresiones y jerga útiles (5, con significado y ejemplo)
## Cómo se pronuncia al hablar rápido (reducciones como gonna, wanna, contracciones)
## Mini diálogo real (6 líneas en una situación cotidiana en EE. UU., con traducción)` });
          S.explanations["native:" + u.id] = txt; save(); rerenderKeepScroll();
        } catch (err) { out.innerHTML = `<p class="pill bad">${esc(err.message)}</p>`; el.disabled = false; }
        break;
      }
      case "tab": ctx.tab = el.dataset.tab; ctx.flip = false; render(); break;
      case "vfilter": ctx.vfilter = el.dataset.f; render(); break;
      case "studyFiltered": {
        const f = ctx.vfilter || "all"; let n = 0;
        Object.values(S.cards).forEach((c) => { const ok = f === "all" ? true : f === "learning" ? c.box < 4 && !c.mistake : f === "mistakes" ? !!c.mistake : f === "mine" ? ["custom", "conv", "real"].includes(c.unitId) : c.box >= 4; if (ok && c.due > today()) { c.due = today(); n++; } });
        save(); ctx.tab = "today"; render(); toast(n ? `${n} tarjetas añadidas al repaso de hoy` : "Ya estaban en tu repaso de hoy"); break;
      }
      case "delCard": {
        if (ctx.confirmDel !== el.dataset.id) { ctx.confirmDel = el.dataset.id; el.textContent = "¿Seguro? Toca otra vez"; break; }
        delete S.cards[el.dataset.id]; ctx.confirmDel = null; save(); rerenderKeepScroll(); toast("Tarjeta quitada"); break;
      }
      case "drillReveal": { const d = ctx.drill; d.phase = "reveal"; speak(d.queue[d.i].en); rerenderKeepScroll(); break; }
      case "drillGrade": {
        const d = ctx.drill; const it = d.queue[d.i]; const ok = el.dataset.ok === "1";
        if (ok) { if (!it.missed) d.right++; } else {
          if (!it.missed) d.wrong++;
          it.missed = true; d.queue.splice(Math.min(d.queue.length, d.i + 4), 0, { ...it }); // vuelve 3 tarjetas después
          addMistakeCard(ctx.unit.id, it.es, it.en);
        }
        record(ctx.unit.id, "speaking", ok);
        const l = dayLog(); l.drills = (l.drills || 0) + 1;
        d.i++; d.phase = "prompt"; if (d.i >= d.queue.length) { d.done = true; toast("🎯 ¡Entrenamiento completado!"); }
        save(); rerenderKeepScroll(); break;
      }
      case "whyAI": {
        const st = ctx.quiz[el.dataset.quiz]; const qi = +el.dataset.q; const q = st.items[qi]; const ans = st.answers[qi];
        el.disabled = true; el.textContent = "Pensando…";
        try {
          ans.why = await window.AI.explain({ level: currentLevel(), question: `Ejercicio: "${q.q}". Opciones: ${q.o.join(" | ")}. Respuesta correcta: "${q.o[q.a]}". El estudiante eligió: "${q.o[ans.pick]}".
Explica en español, muy claro y para principiante, en máximo 5 líneas: por qué la correcta es correcta (la regla y el orden de la frase) y, si se equivocó, por qué su opción no funciona. Da 1 ejemplo extra.` });
          rerenderKeepScroll();
        } catch (err) { toast(err.message); el.disabled = false; el.textContent = "🤖 ¿Por qué? Explícamelo"; }
        break;
      }
      case "explainUnit": {
        const u = C[unitIndex(el.dataset.unit)]; const out = $("#explain-" + u.id);
        el.disabled = true; out.innerHTML = '<p class="muted">El profesor está preparando tu clase…</p>';
        try {
          const txt = await window.AI.explain({ level: u.level, question: `Explica la clase "${u.grammar.name}" a una persona hispanohablante principiante que necesita entender el porqué de todo y el orden de las cosas.
Base de la clase: ${u.grammar.explain.replace(/<[^>]+>/g, "")}
Ejemplos: ${u.grammar.examples.join(" | ")}
Usa exactamente estas secciones:
## 1. ¿Para qué sirve? (situaciones reales)
## 2. El orden de la frase (fórmulas tipo: Sujeto + verbo + ...; afirmativa, negativa y pregunta, cada una con 1 ejemplo desglosado palabra por palabra con su traducción)
## 3. ¿Por qué es así? (la lógica, sin tecnicismos)
## 4. ¿Cuándo uso esto y cuándo lo otro? (compara con la estructura que más se confunde)
## 5. Diferencias con el español
## 6. Errores típicos (❌ incorrecto → ✅ correcto → por qué)
## 7. Resumen en 3 líneas` });
          S.explanations[u.id] = txt; save(); rerenderKeepScroll();
        } catch (err) { out.innerHTML = `<p class="pill bad">${esc(err.message)}</p>`; el.disabled = false; }
        break;
      }
      case "changeLevel": {
        const lv = el.dataset.level || ($("#levelSel") && $("#levelSel").value);
        S.progress = { unit: unitIndex(lv.toLowerCase() + "-1"), step: 0 }; save();
        toast("Listo: ahora empiezas en " + lv + ". Tu repaso y tareas se conservan."); go("class"); break;
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
          const su = C[unitIndex(el.dataset.unit)] || curUnit();
          const r = await window.AI.reviewSpeaking({ level: su.level, prompt: su.speaking, transcript: st.text, seconds: st.secs });
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
        if (need === "speak") {
          const minW = minWords(u);
          const best = Math.max(0, ...Object.values(ctx.sp || {}).map((x) => words(x.text).length));
          if (!best) return toast("Graba tu respuesta primero 🎙");
          if (best < minW) return toast(`${TEACHER} dice: necesitas al menos ${minW} palabras. Llevas ${best}. ¡Habla un poco más!`);
        }
        if (need === "practice" && !(ctx.drill && ctx.drill.done)) return toast("Termina el entrenamiento con " + TEACHER + " (responder en voz alta)");
        const score = need === "test" ? quizScore("test") : need === "learn" || need === "practice" ? quizScore(need) : null;
        const mins = Math.max(5, Math.round((Date.now() - (ctx.started || Date.now())) / 60000));
        const wasUnit = S.progress.unit; const xpBefore = dayXP(S.log[today()]);
        const stepName = PLAN[S.progress.step].name;
        completeStep(mins, score);
        go("today");
        if (need === "test" && S.progress.unit > wasUnit) celebrate({ icon: "🏁", title: "¡Unidad aprobada!", sub: `${u.title}: ${score}% en el examen.`, xpBefore, canDo: (window.CAN_DO || {})[u.id] });
        else if (need === "test") { toast("Necesitas " + PASS + "%. Repasa y vuelve a intentarlo 💪"); }
        else celebrate({ icon: "✅", title: `¡Clase completada!`, sub: `${u.title} · ${stepName}${score != null ? " · " + score + "% de aciertos" : ""}`, xpBefore });
        break;
      }
      case "flip": ctx.flip = true; render(); break;
      case "grade": {
        const xpBefore = ctx.revXp != null ? ctx.revXp : (ctx.revXp = dayXP(S.log[today()]));
        const c = dueCards()[0]; if (c) { gradeCard(c, +el.dataset.q); touchStreak(); save(); }
        ctx.flip = false; ctx.revN = (ctx.revN || 0) + 1; render();
        if (!dueCards().length) { celebrate({ icon: "🔁", title: "¡Repaso al día!", sub: `Repasaste ${ctx.revN} tarjetas. Tu memoria te lo agradece.`, xpBefore }); ctx.revXp = null; ctx.revN = 0; }
        break;
      }
      case "warmup": go("review", { warm: buildWarmup() }); break;
      case "listened": {
        const l = dayLog();
        if (!l.listened) { l.listened = true; l.minutes += 10; touchStreak(); save(); setTimeout(render, 300); toast("🎧 Escucha marcada. Repite en voz alta las frases que entiendas."); }
        break;
      }
      case "warmAns": {
        const w = ctx.warm; const q = w.items[w.i]; const ok = +el.dataset.i === q.a;
        if (ok) w.right++; record(q.unitId, "grammar", ok, ok ? null : { q: q.q, correct: q.o[q.a], pick: q.o[+el.dataset.i] });
        toast(ok ? "✅ Correcto" : "❌ Era: " + q.o[q.a]); w.i++; save(); render(); break;
      }
      case "openHw": stopRec(); go("homework", { hwId: el.dataset.id }); break;
      case "studyUnit": go("unit", { unitId: el.dataset.unit }); break;
      case "newPrompt": {
        const done = C.slice(0, Math.max(1, S.progress.unit + 1)); const cur = ctx.freeUnit;
        const pool = done.length > 1 ? done.filter((u) => u.id !== cur) : done;
        ctx.freeUnit = pool[Math.floor(Math.random() * pool.length)].id; ctx.sp = {}; ctx.writeMode = {}; render(); break;
      }
      case "writeMode": { ctx.writeMode = ctx.writeMode || {}; ctx.writeMode[el.dataset.id] = el.dataset.on === "1"; stopRec(); ctx.recording = null; rerenderKeepScroll(); break; }
      case "resetChat": ctx.chat.history = []; ctx.chat.ended = false; ctx.chat.summary = null; ctx.chatBusy = false; render(); break;
      case "pickScen": ctx.chat.si = +el.dataset.i; ctx.chat.history = []; ctx.chat.ended = false; ctx.chat.summary = null; rerenderKeepScroll(); break;
      case "endChat": sendChat("(Wrap up now: the student wants to finish. Close the conversation naturally in character, one or two sentences, then the 🏁 line.)", true); break;
      case "restartChat": ctx.chat.history = []; ctx.chat.ended = false; ctx.chat.summary = null; sendChat(`(The student is ready. Start the conversation in character with a short, friendly greeting and ONE easy question. Name: ${firstName()}.)`, true); break;
      case "startChat": sendChat(`(The student is ready. Start the conversation in character with a short, friendly greeting and ONE easy question. Name: ${firstName()}.)`, true); break;
      case "useSugg": { const inp = $("#chatInput"); speak(el.dataset.text); if (inp) { inp.value = el.dataset.text; inp.focus(); } else toast("Primero toca “Empezar”"); break; }
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
        saveFile("english-coach-backup-" + today() + ".json", JSON.stringify({ ...S, settings: { ...S.settings, apiKey: "" } }, null, 1), "application/json"); break;
      }
      case "reset":
        if (!ctx.confirmReset) { ctx.confirmReset = true; rerenderKeepScroll(); break; }
        S = defaults(); save(); go("today"); toast("Progreso borrado"); break;
      case "cancelReset": ctx.confirmReset = false; rerenderKeepScroll(); break;
    }
  });

  function afterSceneStep() {
    const sc = SCENES().find((x) => x.id === ctx.sceneId); const st = ctx.sc;
    if (st.i >= sc.lines.length && !st.finished) {
      st.finished = true;
      const mine = sc.lines.filter((l) => l[0] === "Tú").length;
      const score = Math.round((st.ok / Math.max(1, mine)) * 100);
      S.scenes = S.scenes || {};
      S.scenes[sc.id] = { date: today(), score: Math.max(score, (S.scenes[sc.id] || {}).score || 0) };
      sc.expressions.forEach(([e, m]) => addCard("real", e, m, "📍 " + sc.title));
      sc.lines.filter((l) => l[0] === "Tú").forEach((l) => addCard("real", sceneText(l[1]), sceneText(l[2]), "📍 " + sc.title));
      const xpBefore = dayXP(S.log[today()]);
      const lg = dayLog(); lg.scenes = (lg.scenes || 0) + 1; touchStreak(); save();
      setTimeout(() => celebrate({ icon: sc.icon, title: "¡Escena completada!", sub: `${sc.title}: ${score}% a la primera.`, xpBefore, closeLabel: "Ver mi resultado" }), 50);
    } else if (st.i < sc.lines.length && sc.lines[st.i][0] !== "Tú" && st.phase === "prompt") {
      speak(sceneText(sc.lines[st.i][3] || sc.lines[st.i][1]));
    }
    rerenderKeepScroll();
  }
  function rerenderKeepScroll() { const y = window.scrollY; render(); window.scrollTo(0, y); }

  async function sendChat(text, hidden) {
    const chat = ctx.chat; if (!text.trim() || ctx.chatBusy) return;
    const turns = chat.history.filter((m) => m.role === "user" && !m.hidden).length;
    if (!hidden && turns >= 9) text = text.trim() + "\n(Note for Kate: this conversation is long enough. Reply to this, then close it naturally and add the 🏁 line.)";
    chat.history.push({ role: "user", content: text.trim(), hidden: !!hidden });
    ctx.chatBusy = true; render(); scrollChat();
    try {
      const reply = await window.AI.chat({ level: currentLevel(), scenario: SCENARIOS[chat.si || 0].en, history: chat.history });
      chat.history.push({ role: "assistant", content: reply });
      if (!hidden) dayLog().speakingWords += words(text).length;
      touchStreak(); save();
      const k = parseKate(reply);
      if (k.tip) { const [fix, why] = k.tip.split(" — "); addCard("conv", fix.replace(/[“”"]/g, ""), why ? "✔ forma correcta: " + why.slice(0, 120) : "forma correcta"); save(); }
      ctx.chatBusy = false; render(); speak(k.en); scrollChat();
      if (k.end) finishChat();
    } catch (err) { chat.history.pop(); ctx.chatBusy = false; render(); toast(err.message); }
  }
  // Cierre: resumen, frases a las tarjetas y celebración
  async function finishChat() {
    const chat = ctx.chat; if (chat.ended) return;
    chat.ended = true; chat.summary = null; ctx.chatBusy = true; render(); scrollChat();
    const xpBefore = dayXP(S.log[today()]);
    const sc = SCENARIOS[chat.si || 0];
    const transcript = chat.history.filter((m) => !m.hidden).map((m) => (m.role === "user" ? "Student: " + m.content : "Kate: " + parseKate(m.content).en)).join("\n");
    let items = [], note = "";
    try {
      const txt = await window.AI.chatSummary({ level: currentLevel(), scenario: sc.es, transcript });
      txt.split("\n").map((l) => l.trim()).forEach((l) => {
        if (l.startsWith("📌")) { const [en, es, when] = l.replace(/^📌\s*/, "").split("|").map((x) => (x || "").trim()); if (en && es) items.push([en, es, when || ""]); }
        else if (l.startsWith("⭐")) note = l.replace(/^⭐\s*/, "");
      });
    } catch (err) { /* sin resumen: guardamos las frases sugeridas que usó */ }
    if (!items.length) {
      chat.history.filter((m) => m.role === "assistant").forEach((m) => parseKate(m.content).options.forEach(([en, es]) => items.push([en, es, sc.es])));
      items = items.slice(0, 8);
    }
    let added = 0; items.forEach(([en, es, when]) => { if (addCard("conv", en, es, when ? "📍 " + when + " (" + sc.es + ")" : sc.es)) added++; });
    const lg = dayLog(); lg.convs = (lg.convs || 0) + 1; touchStreak(); save();
    chat.summary = { items, note, added };
    ctx.chatBusy = false; render(); scrollChat();
    celebrate({ icon: sc.icon, title: "¡Conversación completada!", sub: `${sc.es}. ${items.length} frases guardadas en tus tarjetas para repasar.`, xpBefore, closeLabel: "Ver mi resumen" });
  }
  function scrollChat() { const b = $("#chat"); if (b) b.scrollTop = b.scrollHeight; const f = $(".chat-form"); if (f) f.scrollIntoView({ block: "nearest" }); }

  document.addEventListener("click", (e) => { if (e.target.id === "celebrate") e.target.hidden = true; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#celebrate").hidden) $("#celebrate").hidden = true; });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset.action === "import" && el.files[0]) {
      const r = new FileReader();
      r.onload = () => { try { const d = JSON.parse(r.result); const key = S.settings.apiKey; S = { ...defaults(), ...d }; S.settings.apiKey = key; save(); toast("Datos importados"); go("today"); } catch (err) { toast("Archivo no válido"); } };
      r.readAsText(el.files[0]);
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target.name === "text" && $("#wc")) $("#wc").textContent = words(e.target.value).length + " palabras";
    if (e.target.id === "vsearch") {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll(".vrow").forEach((r) => { r.hidden = !!q && !r.dataset.search.includes(q); });
      document.querySelectorAll(".vgroup").forEach((g) => { g.hidden = !!q && !g.querySelector(".vrow:not([hidden])"); });
    }
  });

  document.addEventListener("submit", async (e) => {
    const f = e.target; const kind = f.dataset.form; if (!kind) return;
    e.preventDefault();
    const fd = new FormData(f);
    if (kind === "onboard") {
      S.profile = { name: fd.get("name").trim(), goal: fd.get("goal"), minutes: +fd.get("minutes"), created: today() };
      S.settings.studyTime = fd.get("studyTime") || "19:00"; S.settings.reviewTime = fd.get("reviewTime") || "08:00";
      const tmp = S.profile; S.profile = null; // aún en onboarding
      if (fd.get("base") === "zero") { ctx = { result: "A1", pending: tmp }; finishOnboarding(); return; }
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
      h.feedback = r.text; h.score = r.score; h.status = "reviewed"; h.reviewed = today(); dayLog().hw = (dayLog().hw || 0) + 1;
      record(u.id, "writing", (r.score || 0) >= 7);
      const xpBeforeHw = dayXP(S.log[today()]);
      dayLog().minutes += 20; touchStreak(); save();
      out.innerHTML = md(r.text); e.submitter.disabled = false;
      celebrate({ icon: "📝", title: "¡Tarea entregada!", sub: r.score != null ? `Nota: ${r.score}/10. Revisa la corrección debajo.` : "Revisa la corrección debajo.", xpBefore: xpBeforeHw, closeLabel: "Ver la corrección" }); return;
    }
    if (kind === "goalDate") {
      S.settings.goalDate = fd.get("goalDate") || ""; save(); rerenderKeepScroll();
      toast(S.settings.goalDate ? "Fecha meta guardada" : "Fecha meta quitada"); return;
    }
    if (kind === "addCard") {
      const en = (fd.get("en") || "").trim(), es = (fd.get("es") || "").trim();
      if (!en || !es) return;
      const id = "custom:" + en.toLowerCase().slice(0, 60);
      S.cards[id] = { id, en, es, ex: (fd.get("ex") || "").trim(), unitId: "custom", box: 0, due: today() };
      save(); ctx.vfilter = "mine"; render(); toast("Tarjeta guardada: la repasarás hoy"); return;
    }
    if (kind === "typedSpeak") {
      const st = ctx.sp[f.dataset.id]; st.text = (fd.get("t") || "").trim(); st.secs = 0; st.feedback = ""; st.typed = true;
      if (st.text) { record(ctx.unit ? ctx.unit.id : curUnit().id, "speaking", words(st.text).length >= 40); dayLog().speakingWords += words(st.text).length; save(); toast("Respuesta guardada: mira tu resultado en el paso 4"); }
      rerenderKeepScroll(); return;
    }
    if (kind === "chat") { const v = fd.get("m"); f.reset(); stopRec(); ctx.recording = null; sendChat(v); return; }
    if (kind === "settings") {
      const s = S.settings;
      s.studyTime = fd.get("studyTime"); s.reviewTime = fd.get("reviewTime");
      s.days = fd.getAll("day").map(Number); s.rate = parseFloat(fd.get("rate")); s.voice = fd.get("voice");
      if (fd.has("apiKey")) { s.apiKey = (fd.get("apiKey") || "").trim(); s.model = fd.get("model"); }
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
