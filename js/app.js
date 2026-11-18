/* SENQUIII Music Lab: core site script (navigation, Solo Instrumentals, Learn, Work With, donations).
   Nothing here depends on the Beat Maker module. */
(function () {
  "use strict";
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const CFG = window.SENQ_CONFIG || {};
  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (t) => { t = Math.max(0, t || 0); return Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0"); };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  const ICON_DL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v10.2l3.6-3.6 1.4 1.4-6 6-6-6 1.4-1.4 3.6 3.6zM4 19h16v2H4z"/></svg>';

  // ---------- optional modules: degrade gracefully when a page was removed ----------
  const pageIds = $$("[data-page]").map((p) => p.dataset.page);
  const has = (id) => pageIds.includes(id);
  $$("[data-requires]").forEach((el) => {
    const need = el.dataset.requires;
    if (has(need)) return;
    if (el.dataset.fallbackTab) {
      el.setAttribute("href", "#" + el.dataset.fallbackTab);
      el.dataset.tab = el.dataset.fallbackTab;
      el.innerHTML = esc(el.dataset.fallbackLabel || "Explore") + ' <span aria-hidden="true">→</span>';
    } else el.remove();
  });
  $$("[data-hide-without]").forEach((el) => { if (!has(el.dataset.hideWithout)) el.remove(); });
  $$("[data-show-without]").forEach((el) => { if (!has(el.dataset.showWithout)) el.hidden = false; else el.remove(); });
  $$(".site-nav a").forEach((a) => { if (!has(a.dataset.tab)) a.remove(); });

  // numbering follows the nav order, so removing a tab renumbers everything
  const order = $$(".site-nav a").map((a) => a.dataset.tab);
  const num = (id) => String(order.indexOf(id) + 1).padStart(2, "0");
  $$(".site-nav a").forEach((a) => { const n = $(".n", a); if (n) n.textContent = num(a.dataset.tab); });
  $$(".tile").forEach((t) => { const n = $(".tile-n", t); if (n) n.textContent = num(t.dataset.tab); });
  $$("[data-page]").forEach((p) => {
    const eb = $(".eyebrow[data-num]", p);
    if (eb && !eb.dataset.done) { eb.textContent = num(p.dataset.page) + " · " + eb.textContent; eb.dataset.done = "1"; }
  });

  // ---------- router ----------
  const menuBtn = $("#menuBtn"), nav = $("#siteNav"), scrim = $("#navScrim"), menuCurrent = $("#menuCurrent");
  function closeMenu() { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); scrim.hidden = true; }
  function openMenu() { nav.classList.add("open"); menuBtn.setAttribute("aria-expanded", "true"); scrim.hidden = false; const a = $("a.active", nav) || $("a", nav); a && a.focus(); }
  menuBtn.addEventListener("click", () => (nav.classList.contains("open") ? closeMenu() : openMenu()));
  scrim.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeMenu(); closeDonate(); } });

  const TITLES = {};
  $$(".site-nav a").forEach((a) => (TITLES[a.dataset.tab] = a.textContent.replace(/^\d+/, "").trim()));
  let current = null;
  function show(id, opts) {
    opts = opts || {};
    if (!has(id)) id = "home";
    if (id !== current) {
      $$("[data-page]").forEach((p) => (p.hidden = p.dataset.page !== id));
      $$(".site-nav a").forEach((a) => { const on = a.dataset.tab === id; a.classList.toggle("active", on); on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"); });
      menuCurrent.textContent = TITLES[id] || "Home";
      document.title = id === "home" ? "SENQUIII Music Lab: Beats, Lessons & Free Instrumentals" : (TITLES[id] + " · SENQUIII Music Lab");
      current = id;
      document.dispatchEvent(new CustomEvent("senq:page", { detail: id }));
    }
    closeMenu();
    if (opts.anchor) { const el = document.getElementById(opts.anchor); if (el) { el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); return; } }
    if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: "auto" });
  }
  function fromHash() {
    const h = decodeURIComponent(location.hash.replace("#", ""));
    const sub = /^learn-(\w+)$/.exec(h);
    if (sub && document.querySelector('[data-subpage="' + sub[1] + '"]')) { show("learn"); document.dispatchEvent(new CustomEvent("senq:learn", { detail: sub[1] })); return; }
    const cls = /^class-([a-z0-9]+)(?:-([a-z]+))?$/.exec(h);
    if (cls) { show("learn"); document.dispatchEvent(new CustomEvent("senq:learn", { detail: "curriculum" })); document.dispatchEvent(new CustomEvent("senq:class", { detail: { genre: cls[1], module: cls[2] || null } })); return; }
    if (!h) return show("home", { keepScroll: true });
    if (has(h)) return show(h);
    const el = document.getElementById(h);
    const page = el && el.closest("[data-page]");
    if (page) show(page.dataset.page, { anchor: h }); else show("home");
  }
  document.addEventListener("click", (e) => {
    const l = e.target.closest("a[data-learn]");
    if (l && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      history.pushState(null, "", "#learn-" + l.dataset.learn);
      show("learn"); document.dispatchEvent(new CustomEvent("senq:learn", { detail: l.dataset.learn }));
      return;
    }
    const a = e.target.closest("a[data-tab]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const id = a.dataset.tab;
    if (location.hash !== "#" + id) history.pushState(null, "", "#" + id);
    show(id);
    if (id && a.closest(".site-nav")) $("#main").focus({ preventScroll: true });
  });
  window.addEventListener("popstate", fromHash);
  window.addEventListener("hashchange", fromHash);
  fromHash();

  // ---------- hero waveform (canvas, behind the title) ----------
  (function heroWave() {
    const cv = $("#heroWave"); if (!cv) return;
    const ctx = cv.getContext("2d");
    let w = 0, h = 0, raf = 0, t0 = performance.now();
    function size() { const r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); }
    function draw(now) {
      const t = (now - t0) / 1000 * 0.35; // slow, calm drift
      ctx.clearRect(0, 0, w, h);
      const mid = h * 0.55, bars = Math.floor(w / 9);
      // equalizer bars
      for (let i = 0; i < bars; i++) {
        const x = i * 9, k = i / bars;
        const env = Math.sin(Math.PI * k) ** 1.4;
        const v = (0.35 + 0.65 * Math.abs(Math.sin(i * 0.37 + t * 1.6) * Math.cos(i * 0.11 - t * 0.9))) * env;
        const bh = v * h * 0.42;
        ctx.fillStyle = "rgba(245,165,36," + (0.04 + 0.06 * env) + ")";
        ctx.fillRect(x, mid - bh, 3, bh * 2);
      }
      // thin waveform lines
      const lines = [[0.9, 1.0, 0.45], [0.55, 1.7, 0.16]];
      lines.forEach(([amp, f, a], li) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const k = x / w, env = Math.sin(Math.PI * k) ** 2;
          const y = mid + Math.sin(k * Math.PI * 2 * f * 3 + t * (1.2 + li * 0.4)) * Math.sin(k * 9 + t * 0.7) * h * 0.22 * amp * env;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = "rgba(245,165,36," + a + ")"; ctx.lineWidth = li ? 1 : 1.5; ctx.stroke();
      });
      ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(w, mid); ctx.stroke();
      if (!reduceMotion && current === "home" && !document.hidden) raf = requestAnimationFrame(draw);
    }
    function start() { cancelAnimationFrame(raf); size(); raf = requestAnimationFrame(draw); }
    window.addEventListener("resize", start);
    document.addEventListener("senq:page", (e) => { if (e.detail === "home") start(); });
    document.addEventListener("visibilitychange", () => { if (!document.hidden && current === "home") start(); });
    start();
  })();

  // ---------- Solo Instrumentals ----------
  (function solo() {
    const grid = $("#trackGrid"); if (!grid) return;
    const tracks = window.SENQ_TRACKS || [], peaks = window.SENQ_PEAKS || {};
    const filterRow = $("#soloFilter");
    const genres = [...new Set(tracks.map((t) => t.genre))];
    const label = (g) => ({ "hip-hop": "Hip-Hop", "lo-fi": "Lo-Fi", "r&b": "R&B" }[g] || g.charAt(0).toUpperCase() + g.slice(1));
    filterRow.innerHTML = ['<button class="chip" aria-pressed="true" data-g="all">All<span class="count">' + tracks.length + "</span></button>"]
      .concat(genres.map((g) => '<button class="chip" aria-pressed="false" data-g="' + esc(g) + '">' + esc(label(g)) + '<span class="count">' + tracks.filter((t) => t.genre === g).length + "</span></button>")).join("");
    function seeded(str, n) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); const out = []; for (let i = 0; i < n; i++) { h = Math.imul(h ^ (h >>> 13), 1274126177); out.push(0.3 + ((h >>> 0) % 1000) / 1430); } return out; }
    grid.innerHTML = tracks.map((t, i) => {
      const pk = (peaks[t.file] || seeded(t.title, 64));
      const fname = t.file.split("/").pop();
      return '<article class="track" id="track-' + i + '" data-i="' + i + '" data-genre="' + esc(t.genre) + '">' +
        '<div class="track-head"><button class="t-play" aria-label="Play ' + esc(t.title) + '">' + ICON_PLAY + "</button>" +
        '<div class="t-title"><h3>' + esc(t.title) + '</h3><div class="t-meta"><span class="tag genre">' + esc(label(t.genre)) + '</span><span class="tag">' + esc(t.bpm) + ' BPM</span><span class="tag">' + esc(t.key) + "</span></div></div></div>" +
        '<p class="t-desc">' + esc(t.vibe || "") + "</p>" +
        '<div class="t-wave" role="slider" tabindex="0" aria-label="Seek ' + esc(t.title) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + pk.map((v) => '<i style="height:' + Math.max(8, Math.round(v * 100)) + '%"></i>').join("") + "</div>" +
        '<div class="track-foot"><span class="t-time"><span class="cur">0:00</span> / <span class="len">' + (t.seconds ? fmt(t.seconds) : "–:––") + '</span></span>' +
        '<a class="t-dl" href="' + esc(t.file) + '" download="' + esc("Senquiii - " + t.title + "." + (fname.split(".").pop() || "mp3")) + '">' + ICON_DL + "Download</a></div></article>";
    }).join("");

    const audio = new Audio(); audio.preload = "none";
    let active = null;
    const cardOf = (i) => grid.querySelector('.track[data-i="' + i + '"]');
    function paint(card, frac) {
      const bars = card.querySelectorAll(".t-wave i"), on = Math.round(frac * bars.length);
      bars.forEach((b, j) => b.classList.toggle("on", j < on));
      card.querySelector(".t-wave").setAttribute("aria-valuenow", Math.round(frac * 100));
    }
    function setPlaying(card, playing) {
      card.classList.toggle("playing", playing);
      const b = card.querySelector(".t-play");
      b.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
      b.setAttribute("aria-label", (playing ? "Pause " : "Play ") + card.querySelector("h3").textContent);
    }
    function play(i, at) {
      const t = tracks[i];
      if (active !== i) {
        if (active !== null) { const c = cardOf(active); setPlaying(c, false); }
        active = i; audio.src = t.file; audio.load();
      }
      const card = cardOf(i);
      if (at != null) { const go = () => { if (audio.duration) audio.currentTime = at * audio.duration; }; audio.readyState >= 1 ? go() : audio.addEventListener("loadedmetadata", go, { once: true }); }
      audio.play().then(() => setPlaying(card, true)).catch(() => {});
      document.dispatchEvent(new CustomEvent("senq:audio", { detail: "solo" }));
    }
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".track"); if (!card) return;
      const i = +card.dataset.i;
      if (e.target.closest(".t-play")) {
        if (active === i && !audio.paused) { audio.pause(); setPlaying(card, false); } else play(i);
      } else if (e.target.closest(".t-wave")) {
        const r = e.target.closest(".t-wave").getBoundingClientRect();
        play(i, Math.min(0.999, Math.max(0, (e.clientX - r.left) / r.width)));
      }
    });
    grid.addEventListener("keydown", (e) => {
      const wv = e.target.closest(".t-wave"); if (!wv) return;
      const i = +wv.closest(".track").dataset.i;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (active !== i) return play(i);
        audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + (e.key === "ArrowRight" ? 5 : -5)));
      } else if (e.key === " " || e.key === "Enter") { e.preventDefault(); grid.querySelector('.track[data-i="' + i + '"] .t-play').click(); }
    });
    audio.addEventListener("timeupdate", () => {
      if (active === null || !audio.duration) return;
      const c = cardOf(active); paint(c, audio.currentTime / audio.duration);
      c.querySelector(".cur").textContent = fmt(audio.currentTime);
    });
    audio.addEventListener("loadedmetadata", () => { if (active !== null) cardOf(active).querySelector(".len").textContent = fmt(audio.duration); });
    audio.addEventListener("ended", () => { if (active !== null) { const c = cardOf(active); setPlaying(c, false); paint(c, 0); c.querySelector(".cur").textContent = "0:00"; } });
    audio.addEventListener("error", () => {
      if (active === null) return;
      const c = cardOf(active); setPlaying(c, false);
      if (!c.querySelector(".t-missing")) {
        c.querySelector(".t-play").disabled = true;
        c.querySelector(".t-dl").classList.add("disabled");
        c.insertAdjacentHTML("beforeend", '<p class="t-missing">Audio coming soon.</p>');
      }
      active = null;
    });
    document.addEventListener("senq:audio", (e) => { if (e.detail !== "solo" && !audio.paused) { audio.pause(); if (active !== null) setPlaying(cardOf(active), false); } });
    filterRow.addEventListener("click", (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      $$(".chip", filterRow).forEach((c) => c.setAttribute("aria-pressed", c === b ? "true" : "false"));
      $$(".track", grid).forEach((c) => (c.hidden = b.dataset.g !== "all" && c.dataset.genre !== b.dataset.g));
    });
  })();

  // ---------- Learn: sub-tabs, writing prompts, fun facts ----------
  (function learn() {
    const tabs = $$(".subtabs [role=tab]"); if (!tabs.length) return;
    function sel(name) {
      tabs.forEach((t) => t.setAttribute("aria-selected", t.dataset.sub === name ? "true" : "false"));
      $$("[data-subpage]").forEach((p) => (p.hidden = p.dataset.subpage !== name));
      document.dispatchEvent(new CustomEvent("senq:subpage", { detail: name }));
    }
    window.SenqLearnSelect = sel;
    document.addEventListener("senq:learn", (e) => { sel(e.detail); const st = document.querySelector(".subtabs"); if (st) st.scrollIntoView({ block: "start" }); });
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => { sel(t.dataset.sub); history.replaceState(null, "", "#learn-" + t.dataset.sub); });
      t.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); sel(n.dataset.sub);
      });
    });
    const m0 = /^#learn-(\w+)$/.exec(location.hash);
    sel(m0 && $('[data-subpage="' + m0[1] + '"]') ? m0[1] : (/^#class-/.test(location.hash) ? "curriculum" : "start"));
    const PROMPTS = [
      "Write about the last time you almost said something, but didn't.",
      "Describe your neighborhood at 3 a.m. using only sounds.",
      "Write a hook that's a promise you're not sure you can keep.",
      "Pick an object you've owned for 10+ years. What has it seen?",
      "Write a verse from the point of view of your phone.",
      "Turn a piece of advice someone gave you into a chorus.",
      "Write about a place that doesn't exist anymore.",
      "Start every line of a verse with the same word.",
      "Write a love song where the word 'love' never appears.",
      "What would you tell yourself on the first day you started making music?",
      "Write about a small win nobody noticed.",
      "Describe a color to someone who has never seen it.",
      "Write the argument you never got to finish.",
      "Write about leaving, but make it sound like a celebration.",
      "Take the last text you sent and make it the first line of a song.",
      "Write 8 bars about your hands and what they've built.",
      "Write a blues verse (AAB) about something annoyingly small.",
      "Write a chorus that's only 6 words long."
    ];
    let last = 0;
    const btn = $("#newPromptBtn"), out = $("#writingPrompt");
    btn && btn.addEventListener("click", () => {
      let i; do { i = Math.floor(Math.random() * PROMPTS.length); } while (i === last);
      last = i; out.textContent = PROMPTS[i];
    });
    const FACTS = [
      ["The most sampled 6 seconds", "The “Amen break,” a short drum solo from The Winstons’ 1969 track “Amen, Brother,” is one of the most sampled recordings in history, all over hip-hop, jungle, and drum & bass."],
      ["The 808 was a flop", "Roland’s TR-808 drum machine (1980) was a commercial failure. Used ones got cheap, producers grabbed them, and its booming kick became the backbone of hip-hop and trap."],
      ["An 808 kick is basically a sine wave", "That deep boom is a low sine tone with a fast pitch drop and a long fade. Tune it to your song’s key and the low end instantly sounds cleaner."],
      ["Auto-Tune came from oil exploration", "Its inventor, Andy Hildebrand, worked on processing seismic data for the oil industry before applying the same math to pitch. Cher’s “Believe” (1998) made the effect famous."],
      ["Hip-hop has a birthday", "Many trace it to an August 1973 party in the Bronx, where DJ Kool Herc used two copies of the same record to stretch out the drum breaks dancers loved."],
      ["Beethoven couldn’t hear the Ninth", "He was almost completely deaf when his Ninth Symphony premiered in 1824. Legend says he had to be turned around to see the applause."],
      ["Lo-fi grit started as a limitation", "Classic samplers like the E-mu SP-1200 recorded at low bit depth and sample rate. That crunchy sound was a hardware limit; now producers add it on purpose."],
      ["MIDI is older than the web", "The MIDI standard arrived in 1983 and still connects keyboards, drum pads, and DAWs today."],
      ["A = 440", "Most modern music tunes the A above middle C to 440 Hz, an international standard. Before that, orchestras tuned to wildly different pitches."],
      ["“Happy Birthday” was copyrighted", "Royalties were collected on it for decades until a 2015 US court ruling. It’s now treated as public domain in the US."],
      ["Mozart started early", "He wrote his first symphony in 1764, at around eight years old."],
      ["Gum fights earworms", "A 2015 University of Reading study found that chewing gum can reduce songs getting stuck in your head, because it keeps your inner voice busy."]
    ];
    const fg = $("#factGrid");
    if (fg) fg.innerHTML = FACTS.map((f, i) => '<article class="fact"><span class="fn">FACT ' + String(i + 1).padStart(2, "0") + "</span><h4>" + esc(f[0]) + "</h4><p>" + esc(f[1]) + "</p></article>").join("");
  })();

  // ---------- Work With Senquiii: roster ----------
  (function roster() {
    const root = $("#roster"); if (!root) return;
    const list = window.SENQ_ROSTER || [];
    const channel = window.SENQ_CHANNEL_URL || "";
    const channelOk = channel && !/YOUR_CHANNEL/.test(channel);
    const initials = (n) => n.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    root.innerHTML = list.map((a) => {
      const vids = a.tracks.map((t) => t.youtube
        ? '<div class="vid-wrap"><button class="vid" data-yt="' + esc(t.youtube) + '" aria-label="Play ' + esc(t.title) + '"><img src="https://i.ytimg.com/vi/' + esc(t.youtube) + '/hqdefault.jpg" alt="" loading="lazy"><span class="vid-play"><span><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></span></button><span class="vid-cap">' + esc(t.title) + "</span></div>"
        : '<div class="vid-wrap"><div class="vid soon"><span>Coming soon</span></div><span class="vid-cap muted">New track</span></div>').join("");
      return '<article class="artist"><div class="artist-head"><span class="avatar" aria-hidden="true">' + esc(initials(a.name)) + '</span><div><h3>' + esc(a.name) + '</h3><span class="artist-sub">' + (a.tracks.filter((t) => t.youtube).length ? a.tracks.filter((t) => t.youtube).length + " on the channel" : "Videos coming soon") + "</span></div></div><div class=\"vids\">" + vids + "</div>" +
        (channelOk ? '<a class="channel-link" href="' + esc(channel) + '" target="_blank" rel="noopener">Watch on the Senquiii channel →</a>' : "") + "</article>";
    }).join("");
    root.addEventListener("click", (e) => {
      const v = e.target.closest(".vid[data-yt]"); if (!v) return;
      const id = encodeURIComponent(v.dataset.yt);
      v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      v.removeAttribute("data-yt");
      document.dispatchEvent(new CustomEvent("senq:audio", { detail: "video" }));
    });
  })();

  // ---------- submission form ----------
  (function form() {
    const f = $("#submitForm"); if (!f) return;
    const msg = $("#formMsg");
    const endpoint = CFG.FORM_ENDPOINT || f.getAttribute("action") || "";
    const live = endpoint && !/YOUR_FORM_ID/.test(endpoint);
    function validate() {
      let ok = true;
      $$(".field", f).forEach((fl) => {
        const inp = $("input,textarea", fl);
        const bad = inp.required && (!inp.value.trim() || (inp.type === "url" && !/^https?:\/\/\S+\.\S+/.test(inp.value.trim())));
        fl.classList.toggle("invalid", bad); inp.setAttribute("aria-invalid", bad ? "true" : "false");
        if (bad && ok) { inp.focus(); ok = false; }
      });
      const cb = $("input[name=rights]", f), lab = cb.closest(".check");
      lab.classList.toggle("invalid", !cb.checked);
      if (!cb.checked && ok) { cb.focus(); ok = false; }
      return ok;
    }
    f.addEventListener("input", (e) => { const fl = e.target.closest(".field"); if (fl) fl.classList.remove("invalid"); });
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.className = "form-msg"; msg.textContent = "";
      if (f._gotcha && f._gotcha.value) return;
      if (!validate()) { msg.className = "form-msg err"; msg.textContent = "Please fill in the highlighted fields."; return; }
      const data = new FormData(f);
      const name = String(data.get("artist") || "").trim();
      if (!live) {
        // No form service connected yet: keep the details on this device so nothing is lost.
        try { const saved = JSON.parse(localStorage.getItem("senq_pending_submissions") || "[]"); saved.push({ artist: name, link: data.get("track_link"), note: data.get("note"), contact: data.get("contact"), ts: Date.now() }); localStorage.setItem("senq_pending_submissions", JSON.stringify(saved.slice(-10))); } catch (_) {}
        msg.className = "form-msg ok";
        msg.textContent = "Thanks, " + name + ". Submissions open very soon. Your details are saved on this device, so please check back and send them once we're live.";
        return;
      }
      const btn = $("button[type=submit]", f); btn.disabled = true; btn.textContent = "Sending…";
      try {
        const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.status);
        f.outerHTML = '<div class="form-done" role="status"><h4>Got it, ' + esc(name) + '. 🎧</h4><p>Senquiii listens to every submission. If it’s a fit for the channel, we’ll reach out before anything goes up.</p></div>';
      } catch (err) {
        btn.disabled = false; btn.textContent = "Send submission";
        msg.className = "form-msg err"; msg.textContent = "Something went wrong sending that. Please try again in a minute.";
      }
    });
  })();

  // ---------- support the site (optional donations) ----------
  const modal = $("#donateModal");
  function closeDonate() { if (modal && !modal.hidden) { modal.hidden = true; if (modal._from) modal._from.focus(); } }
  (function donations() {
    const link = CFG.PAYPAL_LINK || "[PAYPAL_LINK_PLACEHOLDER]";
    const ready = /^https?:\/\//i.test(link) && !/PLACEHOLDER/i.test(link);
    $$("[data-donate]").forEach((a) => {
      if (ready) { a.href = link; $$(".ph", a).forEach((x) => x.remove()); return; }
      a.addEventListener("click", (e) => { e.preventDefault(); modal._from = a; modal.hidden = false; $("#donateClose").focus(); });
    });
    if (modal) {
      $("#donateClose").addEventListener("click", closeDonate);
      modal.addEventListener("click", (e) => { if (e.target === modal) closeDonate(); });
    }
  })();

  // ---------- contact form ----------
  (function contact() {
    const f = $("#contactForm"); if (!f) return;
    const msg = $("#contactMsg");
    const endpoint = CFG.CONTACT_ENDPOINT || "";
    const live = /^https?:\/\//.test(endpoint) && !/YOUR_CONTACT_FORM_ID|PLACEHOLDER/.test(endpoint);
    const email = CFG.CONTACT_EMAIL || "xsenquiiix@gmail.com";
    const prefix = CFG.CONTACT_SUBJECT_PREFIX || "[SENQUIII Contact] ";
    const okEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    f.addEventListener("input", (e) => { const fl = e.target.closest(".field"); if (fl) fl.classList.remove("invalid"); });
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.className = "form-msg"; msg.textContent = "";
      if (f._gotcha.value) return; // honeypot
      let first = null;
      $$(".field", f).forEach((fl) => {
        const inp = $("input,textarea", fl), v = inp.value.trim();
        const bad = !v || (inp.type === "email" && !okEmail(v));
        fl.classList.toggle("invalid", bad); inp.setAttribute("aria-invalid", String(bad));
        if (bad && !first) first = inp;
      });
      if (first) { first.focus(); msg.className = "form-msg err"; msg.textContent = "Please check the highlighted fields."; return; }
      const name = f.name.value.trim(), from = f.email.value.trim(), subj = f.subject.value.trim(), body = f.message.value.trim();
      const subject = prefix + subj;
      const text = "Name: " + name + "\nEmail: " + from + "\nSubject: " + subj + "\n\nMessage:\n" + body + "\n\n— Sent from the SENQUIII Music Lab contact form";
      if (!live) {
        // Fallback: open the visitor's email app with everything filled in.
        const mailto = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
        window.__senqLastMailto = mailto; // used by tests
        location.href = mailto;
        msg.className = "form-msg ok";
        msg.textContent = "Opening your email app with your message ready to send. If nothing opens, email " + email + " directly.";
        return;
      }
      const btn = $("button[type=submit]", f); btn.disabled = true; btn.textContent = "Sending…";
      try {
        const data = new FormData();
        data.append("name", name); data.append("email", from); data.append("subject", subj); data.append("message", body);
        data.append("_subject", subject); data.append("_replyto", from);
        const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.status);
        f.outerHTML = '<div class="form-done" role="status"><h4>Thanks, ' + esc(name) + '.</h4><p>Your message is in. Expect a reply at ' + esc(from) + ' within a few days.</p></div>';
      } catch (_) {
        btn.disabled = false; btn.textContent = "Send message";
        msg.className = "form-msg err"; msg.innerHTML = "That didn't send. Please try again, or email <a href=\"mailto:" + esc(email) + "\">" + esc(email) + "</a>.";
      }
    });
  })();

  window.SenqSite = { show, has, esc, fmt };
})();
