/* SENQUIII Music Lab: Genre Curriculum UI. Reads window.SENQ_CURRICULUM (js/curriculum-data.js). */
(function () {
  "use strict";
  const DATA = window.SENQ_CURRICULUM;
  const root = document.getElementById("curriculum");
  if (!DATA || !root) return;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MODS = DATA.MODULES;
  const byId = {}; DATA.GENRES.forEach((g) => (byId[g.id] = g));
  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- progress (localStorage) ----------
  const PKEY = "senq_curriculum_progress_v1";
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem(PKEY) || "{}") || {}; } catch (_) { progress = {}; }
  const saveP = () => { try { localStorage.setItem(PKEY, JSON.stringify(progress)); } catch (_) {} };
  const doneCount = (gid) => MODS.filter((m) => progress[gid] && progress[gid][m.id]).length;

  // ---------- chord parsing + keyboard chart ----------
  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const QUAL = [
    ["maj9", [0, 4, 7, 11, 14]], ["maj7", [0, 4, 7, 11]], ["m7b5", [0, 3, 6, 10]], ["m9", [0, 3, 7, 10, 14]], ["m7", [0, 3, 7, 10]],
    ["13", [0, 4, 10, 14, 21]], ["9", [0, 4, 7, 10, 14]], ["7", [0, 4, 7, 10]], ["dim", [0, 3, 6]], ["sus4", [0, 5, 7]], ["sus2", [0, 2, 7]],
    ["6", [0, 4, 7, 9]], ["5", [0, 7, 12]], ["m", [0, 3, 7]], ["", [0, 4, 7]]
  ];
  function parseChord(name) {
    const m = /^([A-G])([#b]?)(.*?)(?:\/([A-G][#b]?))?$/.exec(name.trim());
    if (!m) return null;
    let root = NOTE[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
    root = (root + 12) % 12;
    const q = QUAL.find(([k]) => m[3] === k) || QUAL.find(([k]) => m[3].startsWith(k)) || QUAL[QUAL.length - 1];
    const notes = q[1].map((i) => root + i);
    let bass = null;
    if (m[4]) { bass = (NOTE[m[4][0]] + (m[4][1] === "#" ? 1 : m[4][1] === "b" ? -1 : 0) + 12) % 12; }
    return { name, root, notes, bass };
  }
  function keyboardSVG(ch) {
    // 2 octaves + a bit from C. White key width 12, height 48.
    const span = 26, W = 12, H = 48;
    const whites = [], blacks = [];
    const isBlack = (n) => [1, 3, 6, 8, 10].includes(n % 12);
    let wx = 0; const pos = [];
    for (let n = 0; n < span; n++) { if (!isBlack(n)) { pos[n] = wx; wx += W; } else pos[n] = wx - 4; }
    const lit = new Set(ch.notes.map((n) => n % 24 + (n >= 24 ? 0 : 0)));
    // place chord in octave 1 if root in the second half keeps it within span
    const notes = ch.notes.map((n) => n).filter((n) => n < span);
    const on = new Set(notes);
    if (ch.bass !== null) on.add(ch.bass < ch.root ? ch.bass : ch.bass - 12 >= 0 ? ch.bass - 12 : ch.bass);
    for (let n = 0; n < span; n++) {
      const hit = on.has(n);
      if (!isBlack(n)) whites.push('<rect x="' + pos[n] + '" y="0" width="' + (W - 1) + '" height="' + H + '" rx="1.5" class="' + (hit ? "k-w on" : "k-w") + '"/>');
      else blacks.push('<rect x="' + pos[n] + '" y="0" width="8" height="' + (H * 0.6) + '" rx="1" class="' + (hit ? "k-b on" : "k-b") + '"/>');
    }
    void lit;
    return '<svg class="kbd" viewBox="0 0 ' + (wx - 1) + " " + H + '" role="img" aria-label="' + esc(ch.name) + ' chord: ' + esc(spell(ch)) + '">' + whites.join("") + blacks.join("") + "</svg>";
  }
  const SHARPS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const FLATS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  function spell(ch) {
    const minor = /^[A-G][#b]?m(?!aj)/.test(ch.name);
    const flat = /^[A-G]b/.test(ch.name) || ch.root === 5 || (minor && [2, 7, 0, 5].includes(ch.root)) || /7|9|13/.test(ch.name) && [5, 0].includes(ch.root);
    const names = flat ? FLATS : SHARPS, set = [];
    ch.notes.forEach((n) => { const s = names[n % 12]; if (!set.includes(s)) set.push(s); });
    return set.join(" – ");
  }
  function chordChart(p) {
    const chords = p.chords.split(/\s+/);
    const uniq = [];
    chords.forEach((c) => { if (!uniq.includes(c)) uniq.push(c); });
    return '<figure class="prog">' +
      '<figcaption><b>' + esc(p.name) + '</b><span>' + esc(p.roman) + '</span><em>' + esc(p.feel || "") + '</em></figcaption>' +
      '<p class="prog-line" aria-label="Progression">' + chords.map((c) => '<span>' + esc(c) + '</span>').join("") + '</p>' +
      '<div class="chord-row">' + uniq.map((c) => { const ch = parseChord(c); return ch ? '<div class="chord"><b>' + esc(c) + '</b>' + keyboardSVG(ch) + '<small>' + esc(spell(ch)) + '</small></div>' : ""; }).join("") + '</div></figure>';
  }

  // ---------- drum grid (playable, editable) ----------
  let actx = null, playing = null;
  function ac() { if (!actx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; actx = new C(); } if (actx.state === "suspended") actx.resume(); return actx; }
  let noiseBuf = null;
  function noise(c) { if (noiseBuf) return noiseBuf; const b = c.createBuffer(1, c.sampleRate, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return (noiseBuf = b); }
  function hit(c, kind, t, vel) {
    const out = c.createGain(); out.gain.value = 0.55 * vel; out.connect(c.destination);
    const env = (node, a, d, peak) => { const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); node.connect(g); g.connect(out); return g; };
    const osc = (type, f0, f1, dur) => { const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur); o.start(t); o.stop(t + dur + 0.05); return o; };
    const nz = (type, f, q, dur) => { const s = c.createBufferSource(); s.buffer = noise(c); const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q || 0.7; s.connect(fl); s.start(t); s.stop(t + dur + 0.05); return fl; };
    switch (kind) {
      case "kick": env(osc("sine", 140, 45, 0.3), 0.003, 0.3, 1); break;
      case "stomp": env(osc("sine", 90, 40, 0.25), 0.004, 0.25, 0.9); env(nz("lowpass", 600, 0.7, 0.1), 0.002, 0.08, 0.4); break;
      case "snare": env(nz("highpass", 1500, 0.7, 0.18), 0.002, 0.16, 0.7); env(osc("triangle", 220, 160, 0.1), 0.002, 0.08, 0.4); break;
      case "clap": [0, 0.012, 0.024].forEach((d) => { const g = c.createGain(); const f = nz("bandpass", 1300, 1.2, 0.2); g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(0.8, t + d + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + d + (d > 0.02 ? 0.16 : 0.02)); f.connect(g); g.connect(out); }); break;
      case "rim": env(osc("triangle", 1700, 0, 0.04), 0.001, 0.035, 0.6); env(nz("bandpass", 2500, 3, 0.03), 0.001, 0.03, 0.3); break;
      case "open": env(nz("highpass", 7000, 0.7, 0.35), 0.002, 0.32, 0.35); break;
      case "ride": env(nz("bandpass", 5200, 1.4, 0.5), 0.002, 0.45, 0.32); env(osc("square", 3100, 0, 0.4), 0.002, 0.35, 0.03); break;
      case "crash": env(nz("highpass", 4000, 0.5, 1.2), 0.003, 1.1, 0.35); break;
      case "shaker": env(nz("highpass", 8000, 0.7, 0.05), 0.008, 0.04, 0.18); break;
      case "conga": env(osc("sine", 330, 280, 0.22), 0.002, 0.2, 0.6); break;
      case "timpani": env(osc("sine", 98, 92, 0.9), 0.006, 0.85, 0.8); env(nz("lowpass", 400, 0.7, 0.1), 0.003, 0.08, 0.2); break;
      case "strings": { [0, 7, 12].forEach((i) => env(osc("sawtooth", 110 * Math.pow(2, i / 12), 0, 0.35), 0.03, 0.3, 0.07)); break; }
      default: env(nz("highpass", 7500, 0.7, 0.06), 0.001, 0.05, 0.3); // hat
    }
  }
  function drumGrid(d, gid) {
    const rows = Object.keys(d.rows);
    return '<figure class="drum" data-drum="' + gid + '" data-bpm="' + d.bpm + '" data-swing="' + (d.swing || 0) + '">' +
      '<figcaption><b>' + esc(d.name) + '</b><span>' + d.bpm + ' BPM' + (d.swing ? ' · swing ' + Math.round(d.swing * 100) + '%' : "") + '</span>' +
      '<button class="btn btn-line btn-sm drum-play" type="button" aria-pressed="false">▶ Play</button></figcaption>' +
      '<div class="grid-wrap"><table class="dgrid"><thead><tr><th scope="col"><span class="sr-only">Sound</span></th>' +
      Array.from({ length: 16 }, (_, i) => '<th scope="col" class="' + (i % 4 === 0 ? "beat" : "") + '">' + (i % 4 === 0 ? i / 4 + 1 : "") + "</th>").join("") + "</tr></thead><tbody>" +
      rows.map((r) => '<tr data-row="' + r + '"><th scope="row">' + esc(r) + "</th>" + d.rows[r].split("").map((ch, i) =>
        '<td><button type="button" class="step' + (ch === "X" ? " on acc" : ch === "x" ? " on" : "") + (i % 4 === 0 ? " b1" : "") + '" aria-pressed="' + (ch !== "-") + '" aria-label="' + esc(r) + " step " + (i + 1) + '"></button></td>').join("") + "</tr>").join("") +
      "</tbody></table></div><p class=\"fig-note\">" + esc(d.note) + " <span class=\"muted\">Tap squares to edit the pattern.</span></p></figure>";
  }
  function stopDrums() {
    if (!playing) return;
    clearInterval(playing.timer); const b = $(".drum-play", playing.fig); if (b) { b.textContent = "▶ Play"; b.setAttribute("aria-pressed", "false"); }
    $$(".step.now", playing.fig).forEach((s) => s.classList.remove("now"));
    playing = null;
  }
  function startDrums(fig) {
    const c = ac(); if (!c) return;
    stopDrums();
    const bpm = +fig.dataset.bpm, sw = +fig.dataset.swing || 0.5, beat = 60 / bpm, s = Math.max(0.5, sw);
    const offs = [0, s * beat / 2, s * beat, s * beat + (1 - s) * beat / 2];
    let step = 0, barStart = c.currentTime + 0.08;
    const rows = $$("tbody tr", fig);
    const st = { fig, timer: 0 };
    playing = st;
    document.dispatchEvent(new CustomEvent("senq:audio", { detail: "curriculum" }));
    const tick = () => {
      while (true) {
        const t = barStart + Math.floor(step / 4) * beat + offs[step % 4];
        if (t > c.currentTime + 0.12) break;
        const idx = step;
        rows.forEach((tr) => { const b = tr.children[idx + 1].firstChild; if (b.classList.contains("on")) hit(c, tr.dataset.row, t, b.classList.contains("acc") ? 1 : 0.75); });
        const delay = Math.max(0, (t - c.currentTime) * 1000);
        setTimeout(() => { if (playing !== st) return; $$(".step.now", fig).forEach((x) => x.classList.remove("now")); rows.forEach((tr) => tr.children[idx + 1].firstChild.classList.add("now")); }, delay);
        step++; if (step === 16) { step = 0; barStart += beat * 4; }
      }
    };
    st.timer = setInterval(tick, 25); tick();
    const b = $(".drum-play", fig); b.textContent = "■ Stop"; b.setAttribute("aria-pressed", "true");
  }
  root.addEventListener("click", (e) => {
    const step = e.target.closest(".step");
    if (step) { const on = !step.classList.contains("on"); step.classList.toggle("on", on); step.classList.remove("acc"); step.setAttribute("aria-pressed", String(on)); if (on && actx) hit(actx, step.closest("tr").dataset.row, actx.currentTime, 0.7); return; }
    const pb = e.target.closest(".drum-play");
    if (pb) { const fig = pb.closest(".drum"); if (playing && playing.fig === fig) stopDrums(); else startDrums(fig); }
  });
  document.addEventListener("senq:audio", (e) => { if (e.detail !== "curriculum") stopDrums(); });
  document.addEventListener("senq:page", stopDrums);

  // ---------- structure timeline + tempo map ----------
  const fmt = (sec) => Math.floor(sec / 60) + ":" + String(Math.round(sec % 60)).padStart(2, "0");
  function timeline(p) {
    const barSec = 240 / p.bpm;
    const total = p.structure.reduce((a, s) => a + s[1], 0);
    let t = 0;
    const rows = p.structure.map(([name, bars]) => { const r = { name, bars, start: t }; t += bars * barSec; return r; });
    return '<figure class="song-map"><figcaption><b>Song map</b><span>' + total + " bars at " + p.bpm + " BPM ≈ " + fmt(t) + "</span></figcaption>" +
      '<div class="tl-bar" role="img" aria-label="Song structure">' + rows.map((r, i) => '<span style="flex:' + r.bars + '" class="' + (/chorus|hook|drop|coro/i.test(r.name) && !/pre/i.test(r.name) ? "hi" : "") + '" title="' + esc(r.name) + '"><i>' + esc(r.name) + "</i></span>").join("") + "</div>" +
      '<table class="tmap"><thead><tr><th>Section</th><th>Bars</th><th>Starts</th></tr></thead><tbody>' + rows.map((r) => "<tr><td>" + esc(r.name) + "</td><td>" + r.bars + "</td><td>" + fmt(r.start) + "</td></tr>").join("") + "</tbody></table>" +
      '<p class="fig-note muted">Times are calculated from the tempo (one bar of 4/4 = 240 ÷ BPM seconds).</p></figure>';
  }

  // ---------- EQ chart ----------
  function eqChart(notes) {
    const W = 640, H = 120, lx = (f) => (Math.log10(f) - Math.log10(20)) / (Math.log10(20000) - Math.log10(20)) * W;
    let n = 0; const list = [];
    const rects = DATA.EQ_BANDS.map((b) => {
      const x = lx(b.lo), w = lx(b.hi) - x, hi = notes && notes[b.id];
      if (hi) list.push([++n, b, notes[b.id]]);
      return '<g><rect x="' + x.toFixed(1) + '" y="' + (hi ? 18 : 42) + '" width="' + (w - 2).toFixed(1) + '" height="' + (hi ? 62 : 38) + '" class="' + (hi ? "eq-b hi" : "eq-b") + '"/>' +
        '<text x="' + (x + w / 2).toFixed(1) + '" y="98" class="eq-l">' + esc(b.label) + "</text>" + (hi ? '<text x="' + (x + w / 2).toFixed(1) + '" y="54" class="eq-n">' + n + "</text>" : "") + "</g>";
    }).join("");
    const ticks = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000].map((f) => '<text x="' + lx(f).toFixed(1) + '" y="116" class="eq-t">' + (f >= 1000 ? f / 1000 + "k" : f) + "</text>").join("");
    return '<figure class="eq"><figcaption><b>Frequency guide</b><span>Where this genre\'s mix lives (Hz)</span></figcaption>' +
      '<svg viewBox="-4 0 ' + (W + 12) + " " + H + '" role="img" aria-label="Frequency chart">' + rects + ticks + "</svg>" +
      '<ol class="eq-notes">' + list.map(([i, b, t]) => '<li><b>' + i + ". " + esc(b.label) + "</b> <span class=\"muted\">" + b.lo + "–" + (b.hi >= 1000 ? b.hi / 1000 + "k" : b.hi) + " Hz</span><br>" + esc(t) + "</li>").join("") + "</ol></figure>";
  }

  // ---------- warmup cards ----------
  const ICONS = {
    breath: '<path d="M6 30c6-10 12-10 18 0s12 10 18 0"/><path d="M6 20c6-6 12-6 18 0s12 6 18 0" opacity=".5"/>',
    lips: '<path d="M6 24c6-8 12-8 18-4 6-4 12-4 18 4-6 8-12 10-18 10S12 32 6 24z"/><path d="M10 24h28" opacity=".5"/>',
    siren: '<path d="M6 34C14 34 16 12 24 12s10 22 18 22"/>',
    straw: '<path d="M14 40l14-28"/><path d="M28 12l6-4"/><circle cx="12" cy="40" r="3"/>',
    hum: '<path d="M10 24h4l3-8 4 16 4-12 3 6 3-4h7"/>',
    scale: '<path d="M8 36h6v-6h6v-6h6v-6h6v6h6"/>',
    vowel: '<circle cx="24" cy="24" r="10"/><path d="M14 24h20" opacity=".5"/>',
    stacc: '<circle cx="10" cy="24" r="2.5"/><circle cx="19" cy="24" r="2.5"/><circle cx="28" cy="24" r="2.5"/><circle cx="37" cy="24" r="2.5"/>'
  };
  function warmCard(w) {
    return '<li class="warm"><svg viewBox="0 0 48 48" aria-hidden="true">' + (ICONS[w.icon] || ICONS.hum) + '</svg><div><b>' + esc(w.name) + '</b><p class="warm-meta"><span>' + esc(w.count) + '</span><span>' + esc(w.time) + "</span></p><p>" + esc(w.how) + "</p></div></li>";
  }

  // ---------- module renderers ----------
  const list = (arr) => "<ul class=\"clean\">" + arr.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>";
  const refTable = (title, rows) => '<div class="refs"><h5>' + title + '</h5><ul>' + rows.map(([a, s, l]) => '<li><b>' + esc(a) + '</b> · <cite>' + esc(s) + '</cite><span>' + esc(l) + "</span></li>").join("") + "</ul></div>";
  const R = {
    sing: (g) => {
      const s = g.sing;
      return "<p class=\"lead\">" + esc(s.intro) + "</p><h4>Signature techniques</h4><dl class=\"tech\">" + s.techniques.map(([n, h]) => "<div><dt>" + esc(n) + "</dt><dd>" + esc(h) + "</dd></div>").join("") + "</dl>" +
        "<h4>Listen and learn</h4><div class=\"refs-grid\">" + refTable("Classic", s.classic) + refTable("Modern", s.modern) + "</div>" +
        '<p class="fig-note muted">Listen for the moments described rather than exact timestamps. Learn from these singers; don\'t copy their voices.</p>' +
        '<h4>Original lyric to practice</h4><blockquote class="lyric">' + g.lyric.lines.map(esc).join("<br>") + '</blockquote><p class="fig-note muted">' + esc(g.lyric.note) + " Written for SENQUIII Music Lab, free to practice with.</p>";
    },
    train: (g) => {
      const t = g.train, warms = t.warmups.map((id) => DATA.WARMUPS[id]).concat(t.extra || []);
      const total = warms.reduce((a, w) => a + (parseFloat(w.time) || 0), 0);
      return '<h4>Warmup routine <span class="muted">(about ' + Math.round(total) + ' min, in this order)</span></h4><ol class="warm-list">' + warms.map(warmCard).join("") + "</ol>" +
        "<h4>Weekly routine</h4><table class=\"week\"><tbody>" + DATA.WEEK(t.drills[0], t.drills[1]).map(([d, x]) => "<tr><th scope=\"row\">" + d + "</th><td>" + esc(x) + "</td></tr>").join("") + "</tbody></table>" +
        '<div class="cols2"><div><h4>Vocal health</h4>' + list(DATA.HEALTH.concat(t.health || [])) + "</div><div><h4>Beginner mistakes</h4>" + list(t.mistakes) + "</div></div>" +
        '<div class="care"><h5>Grit, distortion &amp; screams</h5><p>' + esc(t.grit) + "</p></div>";
    },
    beats: (g) => {
      const b = g.beats;
      return '<p class="lead">' + esc(b.intro) + '</p><dl class="facts3"><div><dt>Tempo</dt><dd>' + esc(b.bpm) + "</dd></div><div><dt>Common keys</dt><dd>" + esc(b.keys) + "</dd></div><div><dt>Scales</dt><dd>" + esc(b.scales) + "</dd></div></dl>" +
        "<h4>Chord progressions</h4><div class=\"progs\">" + b.progs.map(chordChart).join("") + "</div>" +
        "<h4>Drum pattern</h4>" + drumGrid(b.drums, g.id) +
        '<div class="cols2"><div><h4>Signature sounds</h4>' + list(b.sounds) + '</div><div><h4>Step by step in a free DAW</h4><ol class="clean num">' + b.daw.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ol></div></div>";
    },
    produce: (g) => {
      const p = g.produce;
      return timeline(p) + '<div class="cols2"><div><h4>Arrangement</h4>' + list(p.arrangement) + "</div><div><h4>Mix traits</h4>" + list(p.mix) + "</div></div>" + eqChart(p.eq) +
        '<div class="care"><h5>Reference sound</h5><p>' + esc(p.reference) + "</p></div>";
    },
    promote: (g) => {
      const p = g.promote;
      return '<div class="cols2"><div><h4>Platforms</h4>' + list(p.platforms) + "</div><div><h4>Communities</h4>" + list(p.communities) + "</div></div>" +
        '<div class="cols2"><div><h4>Content ideas</h4>' + list(p.content) + "</div><div><h4>Collaborations</h4>" + list(p.collabs) + "</div></div>" +
        '<div class="care"><h5>Visual identity</h5><p>' + esc(p.visual) + '</p></div><p class="fig-note muted">More on release plans and consistency in <a href="#push" data-tab="push">Push Your Music</a>.</p>';
    }
  };

  // ---------- views ----------
  let current = null;
  function picker() {
    current = null; stopDrums();
    const totalDone = DATA.GENRES.reduce((a, g) => a + doneCount(g.id), 0), total = DATA.GENRES.length * MODS.length;
    root.innerHTML =
      '<div class="cur-head"><div><h3>Genre Curriculum</h3><p class="muted">16 genres, 5 modules each. Pick the genre you listen to most, then go in order: sing → train → beats → produce → promote.</p></div>' +
      '<p class="cur-total"><b>' + totalDone + "</b> / " + total + " modules done</p></div>" +
      '<ol class="mod-order" aria-label="Module order">' + MODS.map((m, i) => '<li><span>' + (i + 1) + "</span>" + esc(m.title) + (i === 0 ? ' <em>Start here</em>' : "") + "</li>").join("") + "</ol>" +
      '<div class="genre-grid">' + DATA.GENRES.map((g) => {
        const d = doneCount(g.id);
        return '<a class="genre-card" href="#class-' + g.id + '" data-genre="' + g.id + '"><b>' + esc(g.name) + "</b><small>" + esc(g.aka) + '</small><span class="g-bpm">' + esc(g.bpm) + '</span><span class="g-prog" aria-label="' + d + ' of 5 modules done"><i style="width:' + d * 20 + '%"></i></span></a>';
      }).join("") + "</div>";
  }
  function crumbs(g, mod) {
    return '<nav class="crumbs" aria-label="Breadcrumb"><a href="#learn-curriculum" data-crumb="learn">Learn</a><span aria-hidden="true">›</span><a href="#class-' + g.id + '" data-crumb="genre">' + esc(g.name) + '</a><span aria-hidden="true">›</span><span aria-current="page" class="crumb-mod">' + esc(mod.title) + "</span></nav>";
  }
  function classView(gid, mid) {
    const g = byId[gid]; if (!g) return picker();
    stopDrums(); current = gid;
    const d = doneCount(gid);
    root.innerHTML = crumbs(g, MODS[0]) +
      '<div class="class-layout"><aside class="class-nav" aria-label="Modules"><p class="class-nav-title">' + esc(g.name) + '</p><ol>' +
      MODS.map((m, i) => '<li><a href="#class-' + g.id + "-" + m.id + '" data-mod="' + m.id + '"><span class="cn-n">' + (i + 1) + '</span><span class="cn-t">' + esc(m.title) + '</span><span class="cn-c" aria-hidden="true">' + (progress[gid] && progress[gid][m.id] ? "✓" : "") + "</span></a></li>").join("") +
      '</ol><p class="class-prog"><span class="g-prog"><i style="width:' + d * 20 + '%"></i></span><span class="cp-t">' + d + ' / 5 done</span></p>' +
      '<div class="class-actions"><button class="btn btn-line btn-sm" type="button" data-act="print">Print this class</button><button class="btn btn-ghost btn-sm" type="button" data-act="all">All genres</button></div></aside>' +
      '<article class="class-main"><header class="class-head"><p class="eyebrow">Genre class</p><h3>' + esc(g.name) + ' <small>' + esc(g.aka) + "</small></h3><p class=\"muted\">" + esc(g.blurb) + "</p></header>" +
      MODS.map((m, i) => {
        const on = progress[gid] && progress[gid][m.id];
        return '<section class="module" id="class-' + g.id + "-" + m.id + '" data-mod="' + m.id + '"><header class="mod-head"><p class="mod-step">Module ' + (i + 1) + " of 5" + (i === 0 ? " · Start here" : "") + "</p><h3>" + esc(m.title) + "</h3></header>" + R[m.id](g) +
          '<label class="mod-done"><input type="checkbox" data-done="' + m.id + '"' + (on ? " checked" : "") + "> Mark “" + esc(m.title) + "” as done</label></section>";
      }).join("") + "</article></div>";
    observe(g);
    if (mid) { const el = document.getElementById("class-" + gid + "-" + mid); if (el) setTimeout(() => el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }), 30); }
    else { const top = $(".crumbs", root); if (top) top.scrollIntoView({ block: "start" }); }
  }
  let io = null;
  function observe(g) {
    if (io) io.disconnect();
    if (!("IntersectionObserver" in window)) return;
    io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return;
        const mid = en.target.dataset.mod, m = MODS.find((x) => x.id === mid);
        const c = $(".crumb-mod", root); if (c) c.textContent = m.title;
        $$(".class-nav a", root).forEach((a) => a.classList.toggle("active", a.dataset.mod === mid));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    $$(".module", root).forEach((s) => io.observe(s));
  }
  root.addEventListener("change", (e) => {
    const cb = e.target.closest("[data-done]"); if (!cb || !current) return;
    progress[current] = progress[current] || {};
    if (cb.checked) progress[current][cb.dataset.done] = true; else delete progress[current][cb.dataset.done];
    saveP();
    const d = doneCount(current);
    const a = $('.class-nav a[data-mod="' + cb.dataset.done + '"] .cn-c', root); if (a) a.textContent = cb.checked ? "✓" : "";
    const bar = $(".class-prog .g-prog i", root); if (bar) bar.style.width = d * 20 + "%";
    const t = $(".class-prog .cp-t", root); if (t) t.textContent = d + " / 5 done";
  });
  root.addEventListener("click", (e) => {
    const gl = e.target.closest("a[data-genre]");
    if (gl) { e.preventDefault(); history.pushState(null, "", "#class-" + gl.dataset.genre); classView(gl.dataset.genre); return; }
    const ml = e.target.closest(".class-nav a[data-mod]");
    if (ml) { e.preventDefault(); history.replaceState(null, "", ml.getAttribute("href")); const el = document.getElementById(ml.getAttribute("href").slice(1)); if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); return; }
    const cr = e.target.closest("[data-crumb]");
    if (cr) { e.preventDefault(); if (cr.dataset.crumb === "learn") { history.pushState(null, "", "#learn-curriculum"); picker(); root.scrollIntoView({ block: "start" }); } else classView(current); return; }
    const act = e.target.closest("[data-act]");
    if (act) { if (act.dataset.act === "print") window.print(); else { history.pushState(null, "", "#learn-curriculum"); picker(); root.scrollIntoView({ block: "start" }); } }
  });

  document.addEventListener("senq:class", (e) => { classView(e.detail.genre, e.detail.module); });
  document.addEventListener("senq:subpage", (e) => { if (e.detail === "curriculum" && !root.firstChild) picker(); });
  // initial
  const m0 = /^#class-([a-z0-9]+)(?:-([a-z]+))?$/.exec(location.hash);
  if (m0 && byId[m0[1]]) classView(m0[1], m0[2]); else picker();

  window.SenqCurriculum = { open: classView, picker: picker, data: DATA, parseChord: parseChord };
})();
