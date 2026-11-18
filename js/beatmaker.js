/* SENQUIII Music Lab: Beat Maker UI module. Depends only on js/beatgen.js and the #beat-maker section. */
(function () {
  "use strict";
  const root = document.getElementById("beat-maker");
  if (!root || !window.SenqBeat) return;
  const B = window.SenqBeat, CFG = (window.SENQ_CONFIG || {}).TRENDING || {};
  const $ = (s) => root.querySelector(s), $$ = (s) => Array.from(root.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (t) => { t = Math.max(0, t || 0); return Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0"); };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

  const el = {
    form: $("#genForm"), prompt: $("#prompt"), gen: $("#genBtn"), surprise: $("#surpriseBtn"), chips: $("#genreChips"), examples: $("#examples"),
    trending: $("#trendingChips"), deck: $("#deck"), empty: $("#deckEmpty"), genBox: $("#deckGen"), genStep: $("#genStep"), genBar: $("#genBar"), genPct: $("#genPct"),
    title: $("#deckTitle"), player: $("#player"), play: $("#playBtn"), seek: $("#seek"), tCur: $("#tCur"), tLen: $("#tLen"), loop: $("#loopBtn"),
    regen: $("#regenBtn"), edit: $("#editBtn"), ext15: $("#ext15"), ext30: $("#ext30"), dl: $("#dlBtn"),
    editPanel: $("#editPanel"), editPrompt: $("#editPrompt"), editMods: $("#editMods"), modChips: $("#modChips"), editCancel: $("#editCancel"),
    versions: $("#versions"), status: $("#genStatus"), settings: $("#settings"), viz: $("#viz")
  };

  // ---------- unsupported browsers ----------
  if (!B.supported) {
    el.empty.innerHTML = "<p>Your browser can't build audio on the page (it's missing the Web Audio API). Try the latest Chrome, Safari, Firefox, or Edge. Meanwhile, the <a href=\"#solo\" data-tab=\"solo\">Solo Instrumentals</a> are free to download.</p>";
    el.gen.disabled = true; el.surprise.disabled = true;
    return;
  }
  if (isIOS) el.status.dataset.hint = "On iPhone? If you hear nothing, check the silent switch and volume.";

  // ---------- genre chips + examples ----------
  const GENRE_ORDER = ["hip-hop", "trap", "lo-fi", "rock", "blues", "jazz", "r&b", "drill", "house", "reggae"];
  el.chips.innerHTML = GENRE_ORDER.map((g) => '<button type="button" class="chip" aria-pressed="false" data-g="' + g + '">' + esc(B.GENRES[g].label) + "</button>").join("");
  const EXAMPLES = ["dark trap 140 bpm with heavy 808s", "chill lo-fi piano for studying", "gritty blues shuffle in E", "upbeat rock with distorted guitar"];
  el.examples.innerHTML = EXAMPLES.map((x) => '<button type="button" class="ex">' + esc(x) + "</button>").join("");
  const SURPRISE = ["sad r&b with strings and a slow 808", "dreamy lo-fi with rhodes and vinyl, 75 bpm", "aggressive drill with dark piano in F minor", "happy house with piano stabs", "mysterious trap with bells and flute", "smooth late-night jazz in Bb", "laid-back reggae with organ skank", "epic hip-hop with strings and brass", "energetic rock 150 bpm", "romantic r&b in D minor with pads", "old school boom bap with organ, 92 bpm", "slow blues with piano in A"];
  function markChip(g) { $$("#genreChips .chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.g === g ? "true" : "false")); }
  el.prompt.addEventListener("input", () => markChip(null)); // a typed prompt decides its own genre
  el.chips.addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (!c) return; el.prompt.value = B.GENRE_STARTERS[c.dataset.g]; markChip(c.dataset.g); el.prompt.focus(); });
  el.examples.addEventListener("click", (e) => { const b = e.target.closest(".ex"); if (!b) return; el.prompt.value = b.textContent; markChip(null); generate(); });
  el.surprise.addEventListener("click", () => { el.prompt.value = SURPRISE[Math.floor(Math.random() * SURPRISE.length)]; markChip(null); generate(); });

  // ---------- trending prompts ----------
  // Stored per browser in localStorage. Optional shared backend via config.js (TRENDING.submitUrl / topUrl).
  const SEED_TRENDING = [["dark trap with heavy 808s", 48], ["chill lo-fi piano for studying", 41], ["boom bap with dusty rhodes", 33], ["sad r&b with strings", 27], ["gritty blues shuffle", 19], ["upbeat rock 140 bpm", 16], ["late-night jazz swing", 12], ["drill with sliding 808s", 11]];
  const LS_KEY = "senq_prompts_v1";
  const norm = (p) => p.toLowerCase().replace(/[^a-z0-9#&\s-]/g, " ").replace(/\s+/g, " ").trim();
  let remoteTop = null;
  function localLog() { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch (_) { return []; } }
  function recordPrompt(p) {
    const n = norm(p); if (n.length < 3) return;
    const log = localLog(); log.push({ p: n, t: Date.now() });
    try { localStorage.setItem(LS_KEY, JSON.stringify(log.slice(-200))); } catch (_) {}
    if (CFG.submitUrl) fetch(CFG.submitUrl, { method: "POST", headers: Object.assign({ "Content-Type": "application/json" }, CFG.headers || {}), body: JSON.stringify({ prompt: n.slice(0, 200), ts: Date.now() }) }).catch(() => {});
    renderTrending();
  }
  function renderTrending() {
    const counts = new Map();
    (remoteTop || SEED_TRENDING.map(([prompt, count]) => ({ prompt, count }))).forEach((r) => counts.set(norm(r.prompt), (counts.get(norm(r.prompt)) || 0) + (+r.count || 0)));
    const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
    localLog().forEach((r) => { if (r.t > weekAgo) counts.set(r.p, (counts.get(r.p) || 0) + 3); });
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    el.trending.innerHTML = top.map(([p, c]) => '<button type="button" class="trend" data-p="' + esc(p) + '" title="' + esc(p) + '"><span class="tt">' + esc(p) + '</span><span class="tc">' + c + "</span></button>").join("");
  }
  el.trending.addEventListener("click", (e) => { const b = e.target.closest(".trend"); if (!b) return; el.prompt.value = b.dataset.p; markChip(null); generate(); });
  if (CFG.topUrl) fetch(CFG.topUrl, { headers: CFG.headers || {} }).then((r) => r.json()).then((rows) => { if (Array.isArray(rows)) { remoteTop = rows.slice(0, 20); renderTrending(); } }).catch(() => {});
  renderTrending();

  // ---------- state ----------
  // Each version keeps its recipe (prompt, seed, edits, length) and, for recent ones, the rendered WAV.
  const MAX_CACHED = 4;
  let versions = [], cur = -1, busy = false;
  const audio = new Audio(); audio.preload = "auto"; audio.loop = true;
  audio.setAttribute("playsinline", ""); // media element playback is not muted by the iOS silent switch like Web Audio is

  function recipeToSettings(rc) {
    let s = B.parse(rc.prompt, { seed: rc.seed, genre: rc.genreHint, lockKey: rc.lockKey });
    if (rc.lockBpm && !s.bpmExplicit) s.bpm = rc.lockBpm;
    if (rc.lockMinor != null && !/\b(major|minor)\b/i.test(rc.prompt)) { s.minor = rc.lockMinor; s.keyName = s.keyName.replace(/ (major|minor)$/, rc.lockMinor ? " minor" : " major"); }
    const notes = [];
    (rc.edits || []).forEach((t) => notes.push(...B.applyEdit(s, t)));
    s.extraBars = rc.extraBars || 0;
    // keep total length within the cap after tempo edits
    while (s.extraBars > 0 && B.lengthOf(s) > B.MAX_SECONDS + 0.01) s.extraBars -= 4;
    s.editNotes = notes;
    // memory/time guard: long renders on phones use a lower sample rate
    s.sampleRate = isMobile && B.lengthOf(s) > 75 ? 32000 : 44100;
    return s;
  }

  // ---------- progress UI ----------
  const STEPS = ["Reading your prompt", "Programming the drums", "Laying down chords", "Writing the bassline", "Adding the melody", "Mixing & mastering"];
  let progTimer = 0, progReal = 0;
  function startProgress(estimate) {
    progReal = 0;
    el.genBox.hidden = false; el.empty.hidden = true;
    const t0 = performance.now();
    clearInterval(progTimer);
    progTimer = setInterval(() => {
      const k = (performance.now() - t0) / estimate;
      const pct = Math.min(96, Math.max(Math.round(100 * (1 - Math.exp(-2.2 * k)) * 0.5), Math.round(progReal * 96)));
      el.genBar.style.width = pct + "%"; el.genPct.textContent = pct + "%";
      el.genStep.textContent = STEPS[Math.min(STEPS.length - 1, Math.floor((pct / 95) * STEPS.length))] + "…";
    }, 80);
  }
  function endProgress() {
    clearInterval(progTimer);
    el.genBar.style.width = "100%"; el.genPct.textContent = "100%"; el.genStep.textContent = "Done";
    return new Promise((r) => setTimeout(() => { el.genBox.hidden = true; el.genBar.style.width = "0%"; r(); }, 260));
  }
  function setBusy(on) {
    busy = on;
    el.deck.classList.toggle("busy", on);
    [el.gen, el.surprise, el.regen, el.edit, el.ext15, el.ext30, el.dl, el.play, $("#editApply")].forEach((b) => b && (b.disabled = on));
    $$(".ver").forEach((b) => (b.disabled = on));
    if (!on) updateExtendState();
    el.deck.setAttribute("aria-busy", on ? "true" : "false");
  }

  // ---------- render a recipe into a new version ----------
  async function build(recipe, label) {
    if (busy) return;
    const s = recipeToSettings(recipe);
    setBusy(true);
    stop();
    el.status.textContent = "";
    const secs = B.lengthOf(s);
    startProgress(Math.max(900, secs * (isMobile ? 60 : 25)));
    const t0 = performance.now();
    try {
      await new Promise((r) => setTimeout(r, 60)); // let the progress state paint
      const { buffer, info } = await B.render(s, (f) => { progReal = f; });
      const blob = B.toWav(buffer);
      const peaks = computePeaks(buffer, 220);
      const v = { recipe: clone(recipe), settings: s, label, url: URL.createObjectURL(blob), size: blob.size, seconds: buffer.duration, peaks, sections: info.sections, ms: Math.round(performance.now() - t0) };
      const minWait = 700 - (performance.now() - t0);
      if (minWait > 0) await new Promise((r) => setTimeout(r, minWait));
      await endProgress();
      versions = versions.slice(0, cur + 1).concat([v]);
      cur = versions.length - 1;
      evict();
      showVersion(cur, true);
      window.__senqLast = { settings: s, seconds: buffer.duration, ms: v.ms, size: blob.size, url: v.url, sampleRate: buffer.sampleRate, peak: peakOf(buffer), rms: rmsOf(buffer), nan: hasNaN(buffer) };
    } catch (err) {
      clearInterval(progTimer); el.genBox.hidden = true;
      if (cur < 0) el.empty.hidden = false;
      el.status.textContent = "Couldn't build that beat on this device. Try a shorter length or another browser.";
      console.error(err);
    } finally { setBusy(false); }
  }
  function evict() { versions.forEach((v, i) => { if (i < versions.length - MAX_CACHED && v.url) { URL.revokeObjectURL(v.url); v.url = null; } }); }
  function computePeaks(buf, n) {
    const d = buf.getChannelData(0), step = Math.floor(d.length / n), out = [];
    for (let i = 0; i < n; i++) { let m = 0; for (let j = i * step; j < (i + 1) * step; j += 16) { const a = Math.abs(d[j]); if (a > m) m = a; } out.push(m); }
    const mx = Math.max(...out) || 1; return out.map((x) => x / mx);
  }
  function peakOf(b) { let p = 0; for (let c = 0; c < b.numberOfChannels; c++) { const d = b.getChannelData(c); for (let i = 0; i < d.length; i += 4) p = Math.max(p, Math.abs(d[i])); } return p; }
  function rmsOf(b) { let s = 0, n = 0; const d = b.getChannelData(0); for (let i = 0; i < d.length; i += 8) { s += d[i] * d[i]; n++; } return Math.sqrt(s / n); }
  function hasNaN(b) { const d = b.getChannelData(0); for (let i = 0; i < d.length; i += 97) if (!isFinite(d[i])) return true; return false; }

  // ---------- show a version ----------
  function showVersion(i, autoplay) {
    const v = versions[i]; if (!v) return;
    if (!v.url) { cur = i; return rebuildEvicted(v); }
    cur = i;
    stop();
    audio.src = v.url; audio.load();
    const s = v.settings, d = B.describe(s);
    el.player.hidden = false; el.empty.hidden = true;
    el.title.hidden = false; el.title.textContent = d.title;
    el.tLen.textContent = fmt(v.seconds); el.tCur.textContent = "0:00"; setSeek(0);
    const fields = d.fields.slice();
    fields.splice(4, 0, ["Length", fmt(v.seconds) + " · " + Math.round(v.seconds / B.barSeconds(s)) + " bars"]);
    if (s.editNotes && s.editNotes.length) fields.push(["Edits", s.editNotes.join(", "), true]);
    el.settings.innerHTML = fields.map(([k, val, wide]) => '<div class="' + (wide ? "wide" : "") + '"><small>' + esc(k) + "</small><b>" + esc(val) + "</b></div>").join("");
    markChip(s.genre);
    renderVersions();
    updateExtendState();
    drawWave(0);
    el.status.textContent = v.label + " ready · " + fmt(v.seconds) + " · built in " + (v.ms / 1000).toFixed(1) + "s" + (el.status.dataset.hint ? " · " + el.status.dataset.hint : "");
    if (autoplay) play();
  }
  async function rebuildEvicted(v) { const label = v.label; versions[cur] = null; versions.splice(cur, 1); cur = Math.min(cur, versions.length - 1); await build(v.recipe, label + " (rebuilt)"); }
  function renderVersions() {
    if (versions.length < 2) { el.versions.innerHTML = ""; return; }
    el.versions.innerHTML = '<span class="vl">Versions</span>' + versions.map((v, i) => '<button type="button" class="ver" data-i="' + i + '" aria-current="' + (i === cur) + '" title="' + esc(v.label) + '">v' + (i + 1) + "</button>").join("");
  }
  el.versions.addEventListener("click", (e) => { const b = e.target.closest(".ver"); if (!b || busy) return; showVersion(+b.dataset.i, true); });

  // ---------- playback ----------
  function play() { audio.play().then(() => { el.play.classList.add("is-playing"); el.play.setAttribute("aria-label", "Pause"); tick(); }).catch(() => { el.status.textContent = "Tap play to listen."; }); document.dispatchEvent(new CustomEvent("senq:audio", { detail: "beatmaker" })); }
  function stop() { audio.pause(); el.play.classList.remove("is-playing"); el.play.setAttribute("aria-label", "Play"); }
  el.play.addEventListener("click", () => (audio.paused ? play() : stop()));
  el.loop.addEventListener("click", () => { audio.loop = !audio.loop; el.loop.setAttribute("aria-pressed", String(audio.loop)); });
  audio.addEventListener("ended", () => { stop(); drawWave(0); setSeek(0); });
  document.addEventListener("senq:audio", (e) => { if (e.detail !== "beatmaker") stop(); });
  document.addEventListener("senq:page", (e) => { if (e.detail !== "beat-maker") stop(); });
  function setSeek(frac) { el.seek.value = Math.round(frac * 1000); el.seek.style.setProperty("--p", frac * 100 + "%"); }
  el.seek.addEventListener("input", () => { if (audio.duration) { audio.currentTime = (el.seek.value / 1000) * audio.duration; setSeek(el.seek.value / 1000); drawWave(el.seek.value / 1000); } });
  let raf = 0;
  function tick() {
    cancelAnimationFrame(raf);
    const loop = () => {
      if (audio.duration) { const f = audio.currentTime / audio.duration; setSeek(f); el.tCur.textContent = fmt(audio.currentTime); drawWave(f); }
      if (!audio.paused) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }
  el.viz.addEventListener("click", (e) => { if (!audio.duration) return; const r = el.viz.getBoundingClientRect(); audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration; if (audio.paused) play(); });

  // waveform overview with playhead and section markers
  function drawWave(frac) {
    const v = versions[cur]; const cv = el.viz, ctx = cv.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    if (!v) return;
    const n = v.peaks.length, bw = w / n, mid = h / 2 + 8;
    for (let i = 0; i < n; i++) {
      const x = i * bw, bh = Math.max(2, v.peaks[i] * (h * 0.36));
      ctx.fillStyle = i / n <= frac ? "#f5a524" : "rgba(243,240,234,0.18)";
      ctx.fillRect(x + bw * 0.18, mid - bh, Math.max(1, bw * 0.64), bh * 2);
    }
    const bs = B.barSeconds(v.settings);
    ctx.strokeStyle = "rgba(245,165,36,0.35)"; ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
    (v.sections || []).forEach((sec) => { if (!sec.start) return; const x = (sec.start * bs / v.seconds) * w; ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x, h - 6); ctx.stroke(); });
    ctx.setLineDash([]);
    const px = frac * w; ctx.fillStyle = "#ffb83d"; ctx.fillRect(px - 1, 26, 2, h - 30);
  }
  window.addEventListener("resize", () => drawWave(audio.duration ? audio.currentTime / audio.duration : 0));

  // ---------- generate / regenerate / edit / extend ----------
  function newSeed() { return (Math.random() * 1e9) | 0; }
  function generate() {
    const p = el.prompt.value.trim() || B.GENRE_STARTERS[(root.querySelector('#genreChips .chip[aria-pressed="true"]') || {}).dataset?.g || "hip-hop"];
    el.prompt.value = p;
    recordPrompt(p);
    const chip = root.querySelector('#genreChips .chip[aria-pressed="true"]');
    build({ prompt: p, seed: newSeed(), genreHint: chip ? chip.dataset.g : null, edits: [], extraBars: 0 }, "Generated");
    closeEdit();
  }
  el.form.addEventListener("submit", (e) => { e.preventDefault(); generate(); });
  el.prompt.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); } });

  el.regen.addEventListener("click", () => {
    const v = versions[cur]; if (!v) return;
    const rc = clone(v.recipe);
    rc.seed = newSeed(); rc.lockKey = v.settings.keyPc; rc.lockMinor = v.settings.minor; rc.lockBpm = v.settings.bpm; rc.genreHint = v.settings.genre;
    // tempo/key from earlier edits are already locked in, so replay only the non-tempo edits
    rc.edits = (rc.edits || []).map((t) => t.replace(/\b(faster|slower|speed (it )?up|slow (it )?down|\d{2,3}\s*bpm)\b/gi, ""));
    build(rc, "Regenerated");
  });

  const MODS = ["harder drums", "softer drums", "add a melody", "more bass", "faster", "slower", "darker", "brighter", "remove drums", "add piano", "add guitar", "add strings", "more reverb", "vinyl crackle"];
  el.modChips.innerHTML = MODS.map((m) => '<button type="button" class="mod" aria-pressed="false">' + esc(m) + "</button>").join("");
  el.modChips.addEventListener("click", (e) => { const b = e.target.closest(".mod"); if (b) b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true"); });
  function openEdit() { const v = versions[cur]; if (!v) return; el.editPrompt.value = v.recipe.prompt; el.editMods.value = ""; $$(".mod").forEach((b) => b.setAttribute("aria-pressed", "false")); el.editPanel.hidden = false; el.edit.setAttribute("aria-expanded", "true"); el.editMods.focus(); }
  function closeEdit() { el.editPanel.hidden = true; el.edit.setAttribute("aria-expanded", "false"); }
  el.edit.addEventListener("click", () => (el.editPanel.hidden ? openEdit() : closeEdit()));
  el.editCancel.addEventListener("click", closeEdit);
  el.editPanel.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = versions[cur]; if (!v) return;
    const mods = [el.editMods.value.trim()].concat($$(".mod[aria-pressed=true]").map((b) => b.textContent)).filter(Boolean).join(", ");
    const newPrompt = el.editPrompt.value.trim() || v.recipe.prompt;
    if (!mods && newPrompt === v.recipe.prompt) { el.status.textContent = "Change the prompt or pick a tweak first."; return; }
    const rc = clone(v.recipe);
    if (newPrompt !== rc.prompt) {
      rc.prompt = newPrompt;
      const genreNow = B.parse(newPrompt, { seed: rc.seed }).genre;
      if (genreNow === v.settings.genre) { rc.lockKey = v.settings.keyPc; } else { delete rc.lockKey; delete rc.lockMinor; delete rc.lockBpm; rc.genreHint = null; }
      recordPrompt(newPrompt);
    }
    if (mods) rc.edits = (rc.edits || []).concat([mods]);
    closeEdit();
    build(rc, "Edited" + (mods ? " (" + mods + ")" : ""));
  });

  function updateExtendState() {
    const v = versions[cur];
    const room = v ? B.extendBars(v.settings, 15) > 0 : false;
    el.ext15.disabled = busy || !room; el.ext30.disabled = busy || !room;
    el.ext15.title = el.ext30.title = room ? "Add bars to the end" : "Maximum length is " + fmt(B.MAX_SECONDS);
  }
  function extend(sec) {
    const v = versions[cur]; if (!v) return;
    const add = B.extendBars(v.settings, sec);
    if (!add) { el.status.textContent = "That's the max length (" + fmt(B.MAX_SECONDS) + ")."; return; }
    const rc = clone(v.recipe); rc.extraBars = (rc.extraBars || 0) + add;
    rc.lockKey = v.settings.keyPc; rc.lockMinor = v.settings.minor; rc.lockBpm = v.settings.bpm;
    build(rc, "Extended +" + Math.round(add * B.barSeconds(v.settings)) + "s");
  }
  el.ext15.addEventListener("click", () => extend(15));
  el.ext30.addEventListener("click", () => extend(30));

  el.dl.addEventListener("click", () => {
    const v = versions[cur]; if (!v || !v.url) return;
    const s = v.settings;
    const a = document.createElement("a");
    a.href = v.url;
    a.download = ("senquiii-" + s.genre + "-" + s.bpm + "bpm-" + s.keyName + "-v" + (cur + 1)).toLowerCase().replace(/&/g, "n").replace(/#/g, "sharp").replace(/[^a-z0-9-]+/g, "-") + ".wav";
    document.body.appendChild(a); a.click(); a.remove();
  });

  window.SenqBeatMaker = { generate, extend, versions: () => versions, current: () => cur };
})();
