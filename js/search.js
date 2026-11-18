/* SENQUIII Music Lab: global search (header). Indexes tabs, Learn sections, genre classes, modules, and tracks. */
(function () {
  "use strict";
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const btn = $("#searchOpen"), panel = $("#searchPanel"), input = $("#searchInput"), out = $("#searchResults"), closeB = $("#searchClose");
  if (!btn || !panel) return;
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9#&+ ]+/g, " ");

  // ---------- build index ----------
  const IDX = [];
  const add = (group, title, sub, href, text, boost) => IDX.push({ group, title, sub, href, hay: norm(title + " " + sub + " " + (text || "")), t: norm(title), boost: boost || 0 });
  // Pages (from the nav, so a removed module disappears automatically)
  $$(".site-nav a[data-tab]").forEach((a) => {
    const id = a.dataset.tab, sec = document.getElementById(id);
    if (!sec) return;
    const head = $(".page-head .sub", sec) || $(".lede", sec);
    add("Pages", a.textContent.replace(/^\d+/, "").trim(), head ? head.textContent.trim().slice(0, 90) : "", "#" + id, sec.textContent.slice(0, 4000), 2);
  });
  // Learn sections
  $$(".subtabs [data-sub]").forEach((b) => {
    const p = $('[data-subpage="' + b.dataset.sub + '"]');
    add("Learn", b.textContent.trim(), "Learn", "#learn-" + b.dataset.sub, p ? p.textContent.slice(0, 3000) : "", 1);
  });
  // In-page headings (Keys principles, Push sections, etc.)
  $$("[data-page] h3").forEach((h, i) => {
    const page = h.closest("[data-page]"); if (!page || page.id === "beat-maker" && !document.getElementById("beat-maker")) return;
    if (h.closest("#curriculum")) return;
    if (!h.id) h.id = "s-" + page.id + "-" + i;
    const sub = $(".site-nav a[data-tab=\"" + page.id + "\"]");
    const near = h.parentElement ? h.parentElement.textContent.slice(0, 400) : "";
    add("Sections", h.textContent.trim(), sub ? sub.textContent.replace(/^\d+/, "").trim() : "", "#" + h.id, near, 0);
  });
  // Curriculum
  const C = window.SENQ_CURRICULUM;
  if (C) C.GENRES.forEach((g) => {
    add("Genre classes", g.name, g.aka + " · " + g.bpm, "#class-" + g.id, g.blurb, 3);
    const txt = {
      sing: g.sing.intro + " " + g.sing.techniques.map((t) => t.join(" ")).join(" ") + " " + g.sing.classic.concat(g.sing.modern).map((r) => r.join(" ")).join(" "),
      train: g.train.warmups.join(" ") + " warmup warm up " + (g.train.extra || []).map((w) => w.name).join(" ") + " " + g.train.mistakes.join(" ") + " " + g.train.grit + " health scream",
      beats: g.beats.intro + " " + g.beats.bpm + " " + g.beats.keys + " " + g.beats.progs.map((p) => p.name + " " + p.chords + " " + p.roman).join(" ") + " drum " + g.beats.drums.name + " " + g.beats.sounds.join(" ") + " daw chords progression",
      produce: g.produce.arrangement.join(" ") + " " + g.produce.mix.join(" ") + " structure arrangement mix eq " + g.produce.reference,
      promote: Object.values(g.promote).flat().join(" ") + " promotion marketing"
    };
    C.MODULES.forEach((m) => add("Modules", g.name + " › " + m.title, "Genre Curriculum", "#class-" + g.id + "-" + m.id, g.name + " " + txt[m.id], 1));
  });
  // Tracks
  (window.SENQ_TRACKS || []).forEach((t, i) => add("Tracks", t.title, [t.genre, t.bpm ? t.bpm + " BPM" : "", t.key].filter(Boolean).join(" · "), "#track-" + i, (t.vibe || "") + " instrumental beat free download", 1));

  const ORDER = ["Pages", "Genre classes", "Modules", "Learn", "Sections", "Tracks"];
  const LIMIT = { Pages: 4, "Genre classes": 5, Modules: 6, Learn: 4, Sections: 4, Tracks: 5 };

  function hl(text, terms) {
    let s = esc(text);
    terms.forEach((t) => { if (t.length < 2) return; s = s.replace(new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>"); });
    return s;
  }
  let items = [], sel = -1;
  function run(q) {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) {
      out.innerHTML = '<div class="search-group"><h4>Popular</h4>' + [["Start here", "#learn-start", "The beginner path"], ["Genre Curriculum", "#learn-curriculum", "16 genres × 5 modules"], ["Solo Instrumentals", "#solo", "Free beats to download"], ["Write Lyrics", "#learn-lyrics", "Frameworks and prompts"]].map(([t, h, s]) => '<a class="search-item" role="option" href="' + h + '"><span>' + esc(t) + "</span><small>" + esc(s) + "</small></a>").join("") + "</div>";
      items = $$(".search-item", out); sel = -1; return;
    }
    const scored = [];
    IDX.forEach((it) => {
      if (!terms.every((t) => it.hay.includes(t))) return;
      let sc = it.boost;
      terms.forEach((t) => { if (it.t.includes(t)) sc += 5; if (it.t.startsWith(t)) sc += 3; });
      scored.push([sc, it]);
    });
    scored.sort((a, b) => b[0] - a[0]);
    const groups = {};
    scored.forEach(([, it]) => { (groups[it.group] = groups[it.group] || []).push(it); });
    const html = ORDER.filter((g) => groups[g]).map((g) => '<div class="search-group" role="group" aria-label="' + g + '"><h4>' + g + " <span>" + groups[g].length + "</span></h4>" +
      groups[g].slice(0, LIMIT[g]).map((it) => '<a class="search-item" role="option" href="' + it.href + '"><span>' + hl(it.title, terms) + "</span>" + (it.sub ? "<small>" + hl(it.sub, terms) + "</small>" : "") + "</a>").join("") + "</div>").join("");
    out.innerHTML = html || '<p class="search-empty">No results for “' + esc(q) + '”. Try a genre (“jazz”), a skill (“warmup”, “808”), or a tab name.</p>';
    items = $$(".search-item", out); sel = items.length ? 0 : -1; mark();
  }
  function mark() { items.forEach((a, i) => a.setAttribute("aria-selected", String(i === sel))); if (items[sel]) items[sel].scrollIntoView({ block: "nearest" }); }

  let scrim = null;
  function open() {
    panel.hidden = false; btn.setAttribute("aria-expanded", "true");
    scrim = document.createElement("div"); scrim.className = "search-scrim"; scrim.addEventListener("click", close); document.body.appendChild(scrim);
    input.value = ""; run(""); setTimeout(() => input.focus(), 0);
  }
  function close() { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); if (scrim) { scrim.remove(); scrim = null; } }
  function go(a) {
    const href = a.getAttribute("href"); close();
    if (location.hash === href) window.dispatchEvent(new HashChangeEvent("hashchange")); else location.hash = href;
    const m = /^#track-(\d+)$/.exec(href);
    if (m) setTimeout(() => { const card = document.getElementById("track-" + m[1]); if (card && card.offsetParent === null) { const all = $("#soloFilter [data-g='all']"); if (all) all.click(); card.scrollIntoView({ block: "center" }); } if (card) { card.classList.add("flash"); setTimeout(() => card.classList.remove("flash"), 1600); } }, 60);
  }
  btn.addEventListener("click", () => (panel.hidden ? open() : close()));
  closeB.addEventListener("click", close);
  input.addEventListener("input", () => run(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); if (items.length) { sel = (sel + 1) % items.length; mark(); } }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (items.length) { sel = (sel - 1 + items.length) % items.length; mark(); } }
    else if (e.key === "Enter") { e.preventDefault(); if (items[sel]) go(items[sel]); }
    else if (e.key === "Escape") { close(); btn.focus(); }
  });
  out.addEventListener("click", (e) => { const a = e.target.closest(".search-item"); if (a) { e.preventDefault(); go(a); } });
  document.addEventListener("keydown", (e) => {
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if ((e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(tag)) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); open(); }
  });
  window.SenqSearch = { open, close, run, index: IDX };
})();
