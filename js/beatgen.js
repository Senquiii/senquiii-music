/* SENQUIII Beat Maker engine
   Turns a text prompt into settings, renders a loop with the Web Audio API
   (OfflineAudioContext), and exports WAV. Runs fully in the browser. */
(function () {
  "use strict";

  // ---------- helpers ----------
  function rngFrom(seed) { // mulberry32
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

  // ---------- genre profiles ----------
  const GENRES = {
    "hip-hop": { label: "Hip-Hop", bpm: 90,  minor: true,  swing: 0.14, drums: "boombap", bass: "sub",     chords: "rhodes", lead: null,    comp: "bar",    reverb: 0.16, vinyl: 0.25 },
    "trap":    { label: "Trap",    bpm: 140, minor: true,  swing: 0,    drums: "trap",    bass: "808",     chords: "pad",    lead: "bells", comp: "long",   reverb: 0.22, chordBars: 2 },
    "drill":   { label: "Drill",   bpm: 142, minor: true,  swing: 0,    drums: "drill",   bass: "808",     chords: "strings",lead: "piano", comp: "long",   reverb: 0.2,  chordBars: 2, slides: true },
    "lo-fi":   { label: "Lo-Fi",   bpm: 80,  minor: false, swing: 0.28, drums: "lofi",    bass: "round",   chords: "rhodes", lead: null,    comp: "lofi",   reverb: 0.22, vinyl: 0.7, warm: true, sevenths: true },
    "r&b":     { label: "R&B",     bpm: 72,  minor: true,  swing: 0.1,  drums: "rnb",     bass: "sub",     chords: "rhodes", lead: "pluck", comp: "bar",    reverb: 0.25, sevenths: true, pad: true },
    "rock":    { label: "Rock",    bpm: 126, minor: false, swing: 0,    drums: "rock",    bass: "pick",    chords: "guitar", lead: null,    comp: "eighths",reverb: 0.1,  power: true },
    "blues":   { label: "Blues",   bpm: 92,  minor: false, swing8: 0.33,drums: "shuffle", bass: "shuffle", chords: "organ",  lead: null,    comp: "shuffle",reverb: 0.16, form: "12bar" },
    "jazz":    { label: "Jazz",    bpm: 120, minor: false, swing8: 0.33,drums: "swing",   bass: "walk",    chords: "rhodes", lead: null,    comp: "jazz",   reverb: 0.2,  form: "251", sevenths: true },
    "house":   { label: "House",   bpm: 124, minor: true,  swing: 0.05, drums: "house",   bass: "offbeat", chords: "piano",  lead: "synth", comp: "stabs",  reverb: 0.2,  sevenths: true },
    "reggae":  { label: "Reggae",  bpm: 76,  minor: false, swing: 0.12, drums: "onedrop", bass: "reggae",  chords: "organ",  lead: null,    comp: "skank",  reverb: 0.18 }
  };
  const GENRE_WORDS = [
    ["trap", ["trap"]],
    ["drill", ["drill"]],
    ["lo-fi", ["lo-fi", "lofi", "lo fi", "chillhop", "study beat", "study"]],
    ["r&b", ["r&b", "rnb", "r and b", "neo soul", "neo-soul", "soul", "slow jam"]],
    ["hip-hop", ["hip-hop", "hip hop", "hiphop", "boom bap", "boom-bap", "boombap", "old school", "rap"]],
    ["rock", ["rock", "punk", "grunge", "metal", "alt rock", "garage"]],
    ["blues", ["blues", "bluesy", "delta", "shuffle"]],
    ["jazz", ["jazz", "jazzy", "bebop", "bossa", "swing jazz"]],
    ["house", ["house", "edm", "dance", "techno", "disco", "club"]],
    ["reggae", ["reggae", "dub", "dancehall", "ska"]]
  ];
  const GENRE_STARTERS = {
    "hip-hop": "warm boom bap hip-hop with dusty rhodes and vinyl, 90 bpm",
    "trap": "dark trap with heavy 808s and eerie bells",
    "drill": "cold drill beat with sliding 808s and strings",
    "lo-fi": "chill lo-fi with mellow keys and vinyl crackle",
    "r&b": "smooth late-night r&b with rhodes and soft pads",
    "rock": "driving rock with distorted guitars, 128 bpm",
    "blues": "slow blues shuffle with organ in A",
    "jazz": "late-night jazz swing with walking bass and piano",
    "house": "uplifting house with piano stabs, 124 bpm",
    "reggae": "laid-back reggae one drop with organ skank"
  };

  const MOODS = {
    dark:       { words: ["dark", "evil", "sinister", "menacing", "grim", "gritty", "cold"], minor: true, bright: 0.7, reg: -2 },
    sad:        { words: ["sad", "melancholy", "melancholic", "emotional", "heartbreak", "lonely", "somber", "pain"], minor: true, tempo: 0.92, bright: 0.85, want: ["piano"] },
    happy:      { words: ["happy", "uplifting", "bright", "sunny", "joyful", "cheerful", "feel good", "feel-good", "positive", "summer"], minor: false, bright: 1.25 },
    chill:      { words: ["rain", "rainy", "night", "midnight", "nocturnal", "chill", "mellow", "relaxed", "calm", "smooth", "laid back", "laid-back", "soft", "peaceful", "late night", "late-night"], tempo: 0.94, bright: 0.85, vel: 0.85 },
    dreamy:     { words: ["dreamy", "ambient", "spacey", "spacy", "ethereal", "floaty", "atmospheric", "space"], reverb: 0.25, pad: true, bright: 0.9 },
    aggressive: { words: ["aggressive", "hard", "heavy", "angry", "hype", "intense", "gritty", "raw"], drive: 1, bright: 1.1 },
    romantic:   { words: ["romantic", "love", "sensual", "sexy", "intimate"], sevenths: true, bright: 0.9 },
    epic:       { words: ["epic", "cinematic", "dramatic", "triumphant", "orchestral"], reverb: 0.15, want: ["strings", "brass"] },
    energetic:  { words: ["energetic", "upbeat", "bouncy", "party", "lively"], tempo: 1.08, bright: 1.1 },
    mysterious: { words: ["mysterious", "eerie", "spooky", "haunting", "creepy", "suspense"], minor: true, harmonic: true, want: ["bells"] }
  };

  const INSTRUMENTS = [ // [id, words, role]
    ["808", ["808"], "bass"],
    ["rhodes", ["rhodes", "electric piano", "e-piano", "wurli", "keys"], "chords"],
    ["piano", ["piano", "grand"], "chords"],
    ["organ", ["organ", "hammond"], "chords"],
    ["guitar", ["guitar", "guitars", "riff"], "chords"],
    ["strings", ["strings", "violin", "violins", "cello", "orchestra", "orchestral"], "chords"],
    ["pad", ["pad", "pads", "atmosphere", "choir"], "chords"],
    ["bells", ["bells", "bell", "music box", "glockenspiel", "chimes"], "lead"],
    ["pluck", ["pluck", "plucks", "harp", "kalimba"], "lead"],
    ["synth", ["synth", "lead", "synths", "arp"], "lead"],
    ["flute", ["flute", "flutes", "whistle"], "lead"],
    ["brass", ["brass", "horn", "horns", "trumpet", "sax", "saxophone"], "lead"]
  ];
  const INST_LABEL = { "808": "808 bass", rhodes: "Rhodes keys", piano: "Piano", organ: "Organ", guitar: "Guitar", strings: "Strings", pad: "Pad", bells: "Bells", pluck: "Pluck", synth: "Synth lead", flute: "Flute", brass: "Brass" };

  const hasWord = (text, w) => {
    const esc = w.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&");
    return new RegExp("(^|[^a-z0-9])" + esc + "($|[^a-z0-9])", "i").test(text);
  };
  const firstIndex = (text, w) => {
    const esc = w.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&");
    const m = new RegExp("(^|[^a-z0-9])" + esc + "($|[^a-z0-9])", "i").exec(text);
    return m ? m.index : -1;
  };

  function parseKey(raw) {
    const acc = (a) => !a ? 0 : (/^(#|♯|sharp)/i.test(a.trim()) ? 1 : -1);
    let m = /\bkey of ([a-g])\s*(#|♯|b|♭|sharp|flat)?(?:\s*(major|minor|maj|min))?/i.exec(raw)
      || /\b([a-g])\s*(#|♯|b|♭|sharp|flat)?\s*(major|minor|maj|min)\b/i.exec(raw)
      || /\bin ([a-g])(#|♯|b|♭)?(?=[\s,.!]|$)(?!\s+(?:dark|chill|slow|fast|mellow|heavy|minimal|sad|happy|smooth|hard|soft|vibe|mood|style|way|bit|lot))/i.exec(raw)
      || /(?:^|\s)([A-G])(#|b)?(m)(?=[\s,.!]|$)/.exec(raw);
    if (!m) return null;
    const base = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }[m[1].toLowerCase()];
    // ignore the article "a" unless it clearly reads as a key
    if (m[1].toLowerCase() === "a" && !m[2] && !m[3] && !/key of/i.test(m[0])) {
      if (!/\bin a\s*([,.!]|$)/i.test(raw)) return null;
    }
    const pc = (base + acc(m[2]) + 12) % 12;
    let minor = null;
    if (m[3]) minor = /^(minor|min|m)$/i.test(m[3]);
    return { pc, minor };
  }

  function parse(prompt, opts) {
    opts = opts || {};
    const raw = (prompt || "").trim();
    const text = " " + raw.toLowerCase().replace(/\s+/g, " ") + " ";
    const s = { prompt: raw, seed: opts.seed || (Math.random() * 1e9) | 0 };

    // genre: earliest mention wins
    let best = null, bestIdx = Infinity;
    for (const [g, words] of GENRE_WORDS) {
      for (const w of words) {
        const i = firstIndex(text, w);
        if (i >= 0 && i < bestIdx) { best = g; bestIdx = i; }
      }
    }
    let moodGuess = null;
    s.moods = [];
    for (const [k, m] of Object.entries(MOODS)) if (m.words.some((w) => hasWord(text, w))) s.moods.push(k);
    if (!best) {
      if (opts.genre) best = opts.genre;
      else if (s.moods.includes("chill")) best = "lo-fi";
      else if (s.moods.includes("romantic")) best = "r&b";
      else if (s.moods.includes("epic") || s.moods.includes("mysterious")) best = "trap";
      else if (hasWord(text, "808")) best = "trap";
      else if (hasWord(text, "guitar")) best = "rock";
      else best = "hip-hop";
      moodGuess = true;
    }
    s.genre = best; s.genreGuessed = !!moodGuess;
    const G = GENRES[best];

    // mood aggregate
    let minor = G.minor, bright = 1, tempoMul = 1, reverb = G.reverb, vel = 1, drive = 0, pad = !!G.pad, sevenths = !!G.sevenths, harmonic = false, reg = 0;
    const want = [];
    for (const k of s.moods) {
      const m = MOODS[k];
      if (m.minor !== undefined) minor = m.minor;
      if (m.bright) bright *= m.bright;
      if (m.tempo) tempoMul *= m.tempo;
      if (m.reverb) reverb += m.reverb;
      if (m.vel) vel *= m.vel;
      if (m.drive) drive += m.drive;
      if (m.pad) pad = true;
      if (m.sevenths) sevenths = true;
      if (m.harmonic) harmonic = true;
      if (m.reg) reg += m.reg;
      if (m.want) want.push(...m.want);
    }
    if (hasWord(text, "major")) minor = false;
    if (hasWord(text, "minor")) minor = true;

    // tempo
    let bpm = null;
    const bm = /(\d{2,3}(?:\.\d+)?)\s*(?:bpm|beats per minute|beats)/i.exec(raw) || /(?:tempo|at)\s*(\d{2,3})\b/i.exec(raw);
    if (bm) bpm = parseFloat(bm[1]);
    else {
      const nums = (raw.match(/\b\d{2,3}\b/g) || []).map(Number).filter((n) => n !== 808 && n >= 50 && n <= 200);
      if (nums.length) bpm = nums[0];
    }
    s.bpmExplicit = bpm !== null;
    if (bpm === null) {
      bpm = G.bpm * tempoMul;
      if (hasWord(text, "very slow") || hasWord(text, "super slow")) bpm *= 0.75;
      else if (hasWord(text, "slow") || hasWord(text, "slowed")) bpm *= 0.85;
      if (hasWord(text, "very fast") || hasWord(text, "super fast")) bpm *= 1.25;
      else if (hasWord(text, "fast") || hasWord(text, "quick")) bpm *= 1.14;
      if (hasWord(text, "upbeat")) bpm *= 1.06;
    }
    s.bpm = Math.round(clamp(bpm, 50, 200));

    // key
    const key = parseKey(raw);
    if (key && key.minor !== null) minor = key.minor;
    const r = rngFrom(s.seed);
    const defaultPcs = minor ? [9, 4, 2, 1, 7, 5, 0, 11] : [0, 7, 5, 2, 10, 3, 9];
    s.keyPc = key ? key.pc : (opts.lockKey != null ? opts.lockKey : pick(r, defaultPcs));
    s.minor = minor;
    s.keyName = NOTE_NAMES[s.keyPc] + (minor ? " minor" : " major");

    // instruments
    const asked = INSTRUMENTS.filter(([id, words]) => words.some((w) => hasWord(text, w))).map(([id]) => id);
    for (const w of want) if (!asked.includes(w) && asked.length < 2) asked.push(w);
    const role = (id) => INSTRUMENTS.find((x) => x[0] === id)[2];
    const chordAsk = asked.filter((i) => role(i) === "chords");
    const leadAsk = asked.filter((i) => role(i) === "lead");
    s.chords = chordAsk[0] || G.chords;
    s.pad = chordAsk[1] || ((pad || hasWord(text, "pad")) && s.chords !== "pad" ? "pad" : null);
    if (best === "rock" && s.chords === "guitar") s.distorted = !/(clean|acoustic|soft)/.test(text);
    else s.distorted = /(distorted|distortion|fuzz|overdrive|heavy guitar)/.test(text);
    s.lead = leadAsk[0] || (chordAsk.length > 1 && role(chordAsk[1]) === "chords" && chordAsk[1] === "piano" ? null : G.lead);
    if (s.lead === s.chords) s.lead = null;
    s.bass = asked.includes("808") ? "808" : (hasWord(text, "no 808") ? "sub" : G.bass);
    if (s.bass === "808" && hasWord(text, "no 808")) s.bass = "sub";
    s.drums = !/(no drums|without drums|drumless|no percussion)/.test(text);
    if (/(minimal|stripped|sparse)/.test(text)) { s.lead = leadAsk[0] || null; s.minimal = true; }
    s.vinyl = /(vinyl|dusty|crackle|tape|lo-fi|lofi)/.test(text) ? Math.max(G.vinyl || 0, 0.6) : (G.vinyl || 0);
    s.swing = (G.swing || 0) + (/(swing|swung|bouncy|groovy)/.test(text) && !G.swing8 ? 0.12 : 0);
    s.swing8 = G.swing8 || 0;
    s.reverb = clamp(reverb + (/(reverb|spacious|wide|big room|echo)/.test(text) ? 0.15 : 0), 0, 0.6);
    s.bright = clamp(bright, 0.5, 1.6);
    s.vel = vel;
    s.drive = drive;
    s.sevenths = sevenths;
    s.harmonic = harmonic || (minor && r() < 0.35);
    s.reg = reg;
    s.mood = s.moods.length ? s.moods.join(", ") : "neutral";
    return s;
  }

  // ---------- harmony ----------
  const PROGS_MINOR = [
    [[0, "m"], [8, "M"], [3, "M"], [10, "M"]],
    [[0, "m"], [5, "m"], [8, "M"], [7, "V"]],
    [[0, "m"], [10, "M"], [8, "M"], [10, "M"]],
    [[0, "m"], [8, "M"], [5, "m"], [7, "V"]],
    [[0, "m"], [3, "M"], [8, "M"], [7, "V"]],
    [[0, "m"], [5, "m"], [0, "m"], [8, "M"]]
  ];
  const PROGS_MAJOR = [
    [[0, "M"], [7, "M"], [9, "m"], [5, "M"]],
    [[0, "M"], [9, "m"], [5, "M"], [7, "M"]],
    [[0, "M"], [5, "M"], [9, "m"], [7, "M"]],
    [[5, "M"], [7, "M"], [0, "M"], [9, "m"]],
    [[0, "M"], [4, "m"], [5, "M"], [7, "M"]],
    [[2, "m"], [7, "M"], [0, "M"], [9, "m"]]
  ];
  const QUAL = { m: [0, 3, 7], M: [0, 4, 7], V: [0, 4, 7], m7: [0, 3, 7, 10], M7: [0, 4, 7, 11], "7": [0, 4, 7, 10], m9: [0, 3, 7, 10, 14], p: [0, 7, 12], hd: [0, 3, 6, 10] };

  function buildProgression(s, r) {
    const G = GENRES[s.genre];
    if (G.form === "12bar") {
      const f = [0, 0, 0, 0, 5, 5, 0, 0, 7, 5, 0, 7];
      return f.map((o) => [o, "7"]);
    }
    if (G.form === "251") {
      const base = s.minor ? [[2, "hd"], [7, "7"], [0, "m7"], [0, "m7"]] : [[2, "m7"], [7, "7"], [0, "M7"], [9, "7"]];
      return base.concat(s.minor ? [[5, "m7"], [7, "7"], [0, "m7"], [0, "m7"]] : [[2, "m7"], [7, "7"], [0, "M7"], [0, "M7"]]);
    }
    let prog = pick(r, s.minor ? PROGS_MINOR : PROGS_MAJOR).map((c) => c.slice());
    if (!s.harmonic) prog = prog.map(([o, q]) => [o, q === "V" ? (s.minor ? "m" : "M") : q]);
    if (G.power || (s.genre === "rock")) prog = prog.map(([o]) => [o, "p"]);
    else if (s.sevenths || s.chords === "rhodes") prog = prog.map(([o, q]) => [o, q === "m" ? (r() < 0.4 ? "m9" : "m7") : q === "M" ? "M7" : q === "V" ? "7" : q]);
    const cb = G.chordBars || 1;
    const bars = [];
    for (let i = 0; i < 8; i++) bars.push(prog[Math.floor(i / cb) % prog.length]);
    return bars;
  }

  function voice(rootPc, quality, low) {
    const iv = QUAL[quality] || QUAL.M;
    const pcs = iv.map((i) => (rootPc + i) % 12);
    const out = pcs.map((pc) => { let n = low + ((pc - low) % 12 + 12) % 12; return n; });
    if (iv.length > 4) out[out.length - 1] += 12; // 9th on top
    return out.sort((a, b) => a - b);
  }

  // ---------- audio building blocks ----------
  function makeNoise(ctx, seconds) {
    const len = Math.floor(ctx.sampleRate * seconds), b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    let x = 12345;
    for (let i = 0; i < len; i++) { x = (x * 1103515245 + 12345) & 0x7fffffff; d[i] = (x / 0x3fffffff) - 1; }
    return b;
  }
  function makeImpulse(ctx, seconds, decay) {
    const len = Math.floor(ctx.sampleRate * seconds), b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c); let x = 777 + c * 999;
      for (let i = 0; i < len; i++) { x = (x * 1664525 + 1013904223) >>> 0; d[i] = ((x / 4294967296) * 2 - 1) * Math.pow(1 - i / len, decay); }
    }
    return b;
  }
  function shaperCurve(amount) {
    const n = 2048, c = new Float32Array(n), k = amount;
    for (let i = 0; i < n; i++) { const x = (i * 2) / n - 1; c[i] = ((1 + k) * x) / (1 + k * Math.abs(x)); }
    return c;
  }
  function env(g, t, a, peak, d, sus, rel, end) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setTargetAtTime(Math.max(peak * sus, 0.0001), t + a, d / 3);
    g.gain.setValueAtTime(Math.max(peak * sus, 0.0001), Math.max(t + a + 0.001, end));
    g.gain.setTargetAtTime(0.0001, Math.max(t + a + 0.002, end), rel / 4);
  }

  function Engine(ctx, s) {
    this.ctx = ctx; this.s = s;
    this.noise = makeNoise(ctx, 2);
    const master = ctx.createGain(); master.gain.value = 0.8;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 3.5; comp.attack.value = 0.008; comp.release.value = 0.18; comp.knee.value = 8;
    const lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -2; lim.ratio.value = 20; lim.attack.value = 0.002; lim.release.value = 0.08; lim.knee.value = 0;
    let tail = master;
    if (GENRES[s.genre].warm || s.vinyl > 0.5) {
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 5200 * s.bright; lp.Q.value = 0.4;
      master.connect(lp); tail = lp;
    }
    tail.connect(comp); comp.connect(lim); lim.connect(ctx.destination);
    this.master = master;
    const rev = ctx.createConvolver(); rev.buffer = makeImpulse(ctx, 2.4, 3.2);
    const revGain = ctx.createGain(); revGain.gain.value = s.reverb;
    rev.connect(revGain); revGain.connect(master);
    this.rev = rev;
    const bus = (g, send) => { const n = ctx.createGain(); n.gain.value = g; n.connect(master); if (send) { const sg = ctx.createGain(); sg.gain.value = send; n.connect(sg); sg.connect(rev); } return n; };
    this.drums = bus(1.0 * (s.drumGain || 1), 0.06);
    this.bass = bus(0.62 * (s.bassGain || 1), 0);
    this.keys = bus(0.62 * s.vel, 0.9);
    this.leadBus = bus(0.42 * s.vel, 1.0);
    this.padBus = bus(0.3, 1.0);
    // guitar amp
    const gIn = ctx.createGain(); gIn.gain.value = 1;
    if (s.distorted) {
      const sh = ctx.createWaveShaper(); sh.curve = shaperCurve(28); sh.oversample = "2x";
      const cab = ctx.createBiquadFilter(); cab.type = "lowpass"; cab.frequency.value = 3600; cab.Q.value = 0.9;
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 110;
      const post = ctx.createGain(); post.gain.value = 0.22;
      gIn.connect(sh); sh.connect(hp); hp.connect(cab); cab.connect(post); post.connect(this.keys);
    } else gIn.connect(this.keys);
    this.guitarIn = gIn;
    // 808 saturation
    const sat = ctx.createWaveShaper(); sat.curve = shaperCurve(2 + s.drive * 5);
    const satOut = ctx.createGain(); satOut.gain.value = 0.62;
    sat.connect(satOut); satOut.connect(this.bass);
    this.sat808 = sat;
  }
  Engine.prototype.noiseSrc = function (t, dur) {
    const n = this.ctx.createBufferSource(); n.buffer = this.noise;
    n.start(t, Math.random() * 1.5, dur + 0.05); return n;
  };
  Engine.prototype.osc = function (type, f, t, end) {
    const o = this.ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.start(t); o.stop(end); return o;
  };

  // drums
  Engine.prototype.kick = function (t, v, opts) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    const f0 = opts && opts.soft ? 110 : 160, f1 = opts && opts.soft ? 48 : 44;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + 0.11);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    o.connect(g); g.connect(this.drums); o.start(t); o.stop(t + 0.45);
    // click
    const n = this.noiseSrc(t, 0.01), hp = c.createBiquadFilter(), ng = c.createGain();
    hp.type = "highpass"; hp.frequency.value = 3000; ng.gain.setValueAtTime(v * 0.25, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.012);
    n.connect(hp); hp.connect(ng); ng.connect(this.drums);
  };
  Engine.prototype.snare = function (t, v, tone) {
    const c = this.ctx;
    const n = this.noiseSrc(t, 0.25), bp = c.createBiquadFilter(), g = c.createGain();
    bp.type = "highpass"; bp.frequency.value = 1400;
    g.gain.setValueAtTime(v * 0.85, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    n.connect(bp); bp.connect(g); g.connect(this.drums);
    const o = c.createOscillator(), og = c.createGain(); o.type = "triangle";
    o.frequency.setValueAtTime(tone || 210, t); o.frequency.exponentialRampToValueAtTime((tone || 210) * 0.8, t + 0.08);
    og.gain.setValueAtTime(v * 0.5, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    o.connect(og); og.connect(this.drums); o.start(t); o.stop(t + 0.14);
    this.sendRev(g, 0.25);
  };
  Engine.prototype.clap = function (t, v) {
    const c = this.ctx, n = this.noiseSrc(t, 0.3), bp = c.createBiquadFilter(), g = c.createGain();
    bp.type = "bandpass"; bp.frequency.value = 1300; bp.Q.value = 0.9;
    g.gain.setValueAtTime(0.0001, t);
    [0, 0.011, 0.022].forEach((d) => { g.gain.setValueAtTime(v * 1.2, t + d); g.gain.exponentialRampToValueAtTime(v * 0.25, t + d + 0.009); });
    g.gain.setValueAtTime(v * 0.95, t + 0.032); g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    n.connect(bp); bp.connect(g); g.connect(this.drums);
    this.sendRev(g, 0.3);
  };
  Engine.prototype.rim = function (t, v) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.type = "triangle"; o.frequency.value = 1750;
    g.gain.setValueAtTime(v * 0.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    o.connect(g); g.connect(this.drums); o.start(t); o.stop(t + 0.05);
    const n = this.noiseSrc(t, 0.03), bp = c.createBiquadFilter(), ng = c.createGain(); bp.type = "bandpass"; bp.frequency.value = 3500; bp.Q.value = 2;
    ng.gain.setValueAtTime(v * 0.3, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    n.connect(bp); bp.connect(ng); ng.connect(this.drums);
  };
  Engine.prototype.hat = function (t, v, open) {
    const c = this.ctx, d = open ? 0.32 : 0.045, n = this.noiseSrc(t, d), hp = c.createBiquadFilter(), g = c.createGain();
    hp.type = "highpass"; hp.frequency.value = open ? 6500 : 7500;
    g.gain.setValueAtTime(v * 0.6, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
    n.connect(hp); hp.connect(g); g.connect(this.drums);
  };
  Engine.prototype.ride = function (t, v) {
    const c = this.ctx, n = this.noiseSrc(t, 0.6), bp = c.createBiquadFilter(), g = c.createGain();
    bp.type = "bandpass"; bp.frequency.value = 6200; bp.Q.value = 0.8;
    g.gain.setValueAtTime(v * 0.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    n.connect(bp); bp.connect(g); g.connect(this.drums);
    [3150, 4730].forEach((f) => { const o = c.createOscillator(), og = c.createGain(); o.frequency.value = f; og.gain.setValueAtTime(v * 0.035, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.5); o.connect(og); og.connect(this.drums); o.start(t); o.stop(t + 0.52); });
  };
  Engine.prototype.crash = function (t, v) {
    const c = this.ctx, n = this.noiseSrc(t, 1.4), hp = c.createBiquadFilter(), g = c.createGain();
    hp.type = "highpass"; hp.frequency.value = 4500;
    g.gain.setValueAtTime(v * 0.28, t); g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
    n.connect(hp); hp.connect(g); g.connect(this.drums);
  };
  Engine.prototype.sendRev = function (node, amt) { const g = this.ctx.createGain(); g.gain.value = amt; node.connect(g); g.connect(this.rev); };

  // bass
  Engine.prototype.b808 = function (t, m, dur, v, slideTo) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain(), f = mtof(m);
    o.frequency.setValueAtTime(f * 2.2, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.045);
    if (slideTo != null) { o.frequency.setValueAtTime(f, t + dur * 0.55); o.frequency.exponentialRampToValueAtTime(mtof(slideTo), t + dur * 0.55 + 0.09); }
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.004);
    g.gain.setTargetAtTime(v * 0.55, t + 0.05, 0.35);
    g.gain.setValueAtTime(v * 0.5, t + Math.max(0.06, dur - 0.04)); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.sat808); o.start(t); o.stop(t + dur + 0.02);
  };
  Engine.prototype.subBass = function (t, m, dur, v, type) {
    const c = this.ctx, f = mtof(m), o = this.osc(type || "sine", f, t, t + dur + 0.3), g = c.createGain();
    let src = o;
    if (type && type !== "sine") { const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = type === "sawtooth" ? 900 : 650; lp.Q.value = 0.7; o.connect(lp); src = lp; }
    env(g, t, 0.006, v, 0.25, 0.7, 0.08, t + dur);
    src.connect(g); g.connect(this.bass);
    if (!type || type === "sine") { const h = this.osc("triangle", f * 2, t, t + dur + 0.3), hg = c.createGain(); env(hg, t, 0.006, v * 0.12, 0.2, 0.5, 0.08, t + dur); h.connect(hg); hg.connect(this.bass); }
  };

  // melodic instruments
  Engine.prototype.note = function (inst, t, m, dur, v, dest) {
    const c = this.ctx, f = mtof(m), end = t + dur, s = this.s;
    dest = dest || this.keys;
    const g = c.createGain(); g.connect(dest);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.connect(g);
    switch (inst) {
      case "piano": {
        lp.frequency.setValueAtTime(4200 * s.bright, t); lp.frequency.exponentialRampToValueAtTime(1300 * s.bright, t + 1.2);
        const ring = Math.min(dur + 0.6, 3.2);
        [["triangle", 1, 1], ["sine", 2, 0.35], ["sine", 3, 0.12], ["sine", 1.003, 0.4]].forEach(([ty, mul, a]) => { const o = this.osc(ty, f * mul, t, t + ring + 0.3), og = c.createGain(); og.gain.value = a; o.connect(og); og.connect(lp); });
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.004); g.gain.exponentialRampToValueAtTime(v * 0.25, t + 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + ring);
        break; }
      case "rhodes": {
        lp.frequency.value = 3200 * s.bright;
        const car = this.osc("sine", f, t, end + 1.2), mod = this.osc("sine", f, t, end + 1.2), mg = c.createGain();
        mg.gain.setValueAtTime(f * 1.4, t); mg.gain.exponentialRampToValueAtTime(f * 0.12, t + 0.5);
        mod.connect(mg); mg.connect(car.frequency); car.connect(lp);
        const bell = this.osc("sine", f * 4, t, t + 0.4), bg = c.createGain(); bg.gain.setValueAtTime(0.08, t); bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.3); bell.connect(bg); bg.connect(lp);
        env(g, t, 0.006, v, 1.6, 0.35, 0.5, end);
        break; }
      case "organ": {
        lp.frequency.value = 3600 * s.bright;
        const vib = this.osc("sine", 5.6, t, end + 0.3), vg = c.createGain(); vg.gain.value = f * 0.004; vib.connect(vg);
        [[1, 1], [2, 0.6], [3, 0.35], [4, 0.2], [0.5, 0.35]].forEach(([mul, a]) => { const o = this.osc("sine", f * mul, t, end + 0.3), og = c.createGain(); og.gain.value = a * 0.55; vg.connect(o.frequency); o.connect(og); og.connect(lp); });
        env(g, t, 0.012, v, 0.2, 0.9, 0.06, end);
        break; }
      case "guitar": {
        if (s.distorted) {
          g.disconnect(); g.connect(this.guitarIn);
          lp.frequency.value = 5000;
          [0, 0.006, -0.005].forEach((dt) => { const o = this.osc("sawtooth", f * (1 + dt), t, end + 0.15); o.connect(lp); });
          env(g, t, 0.004, v * 0.9, 0.4, 0.8, 0.04, end);
        } else {
          lp.frequency.setValueAtTime(4200 * s.bright, t); lp.frequency.exponentialRampToValueAtTime(700, t + 0.35); lp.Q.value = 1.5;
          const o = this.osc("sawtooth", f, t, end + 0.6), o2 = this.osc("triangle", f * 2, t, end + 0.6), o2g = c.createGain(); o2g.gain.value = 0.2;
          o.connect(lp); o2.connect(o2g); o2g.connect(lp);
          g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 0.8, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(dur + 0.4, 1.6));
        }
        break; }
      case "strings": {
        lp.frequency.value = 2100 * s.bright; lp.Q.value = 0.5;
        const vib = this.osc("sine", 5, t, end + 1), vg = c.createGain(); vg.gain.value = f * 0.003; vib.connect(vg);
        [-0.006, 0, 0.007].forEach((dt) => { const o = this.osc("sawtooth", f * (1 + dt), t, end + 1); vg.connect(o.frequency); o.connect(lp); });
        env(g, t, 0.28, v * 0.45, 0.5, 0.85, 0.7, end);
        break; }
      case "pad": {
        lp.frequency.setValueAtTime(500, t); lp.frequency.linearRampToValueAtTime(1500 * s.bright, t + dur * 0.6);
        [-0.008, 0.008].forEach((dt) => { const o = this.osc("sawtooth", f * (1 + dt), t, end + 1.5); o.connect(lp); });
        const tr = this.osc("triangle", f / 2, t, end + 1.5), tg = c.createGain(); tg.gain.value = 0.4; tr.connect(tg); tg.connect(lp);
        env(g, t, Math.min(0.8, dur * 0.3), v * 0.5, 1, 0.85, 1.2, end);
        break; }
      case "bells": {
        lp.frequency.value = 9000;
        const car = this.osc("sine", f, t, t + 2.2), mod = this.osc("sine", f * 3.5, t, t + 2.2), mg = c.createGain();
        mg.gain.setValueAtTime(f * 2.2, t); mg.gain.exponentialRampToValueAtTime(f * 0.05, t + 1.4);
        mod.connect(mg); mg.connect(car.frequency); car.connect(lp);
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 0.75, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 2);
        break; }
      case "pluck": {
        lp.frequency.setValueAtTime(5000 * s.bright, t); lp.frequency.exponentialRampToValueAtTime(400, t + 0.3); lp.Q.value = 3;
        [0, 0.005].forEach((dt) => { const o = this.osc("sawtooth", f * (1 + dt), t, t + 0.9); o.connect(lp); });
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 0.7, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
        break; }
      case "synth": {
        lp.frequency.setValueAtTime(3200 * s.bright, t); lp.frequency.exponentialRampToValueAtTime(1600 * s.bright, t + 0.3); lp.Q.value = 2;
        const o = this.osc("square", f, t, end + 0.3), o2 = this.osc("sawtooth", f * 1.006, t, end + 0.3), og = c.createGain(); og.gain.value = 0.5;
        o.connect(og); o2.connect(og); og.connect(lp);
        env(g, t, 0.008, v * 0.5, 0.25, 0.6, 0.12, end);
        break; }
      case "flute": {
        lp.frequency.value = 3000;
        const vib = this.osc("sine", 5.2, t, end + 0.4), vg = c.createGain(); vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(f * 0.008, t + 0.35); vib.connect(vg);
        const o = this.osc("sine", f, t, end + 0.4), o2 = this.osc("triangle", f * 2, t, end + 0.4), o2g = c.createGain(); o2g.gain.value = 0.12;
        vg.connect(o.frequency); o.connect(lp); o2.connect(o2g); o2g.connect(lp);
        const n = this.noiseSrc(t, dur + 0.3), nb = c.createBiquadFilter(), ng = c.createGain(); nb.type = "bandpass"; nb.frequency.value = f * 2; nb.Q.value = 3; ng.gain.value = 0.18; n.connect(nb); nb.connect(ng); ng.connect(lp);
        env(g, t, 0.07, v * 0.7, 0.3, 0.85, 0.15, end);
        break; }
      case "brass": {
        lp.frequency.setValueAtTime(500, t); lp.frequency.linearRampToValueAtTime(2600 * s.bright, t + 0.07); lp.frequency.setTargetAtTime(1500 * s.bright, t + 0.08, 0.2); lp.Q.value = 1;
        [0, 0.004, -0.004].forEach((dt) => { const o = this.osc("sawtooth", f * (1 + dt), t, end + 0.3); o.connect(lp); });
        env(g, t, 0.05, v * 0.4, 0.3, 0.8, 0.12, end);
        break; }
    }
  };

  // ---------- arrangement ----------
  function arrange(e, s, r, opts) {
    opts = opts || {};
    const G = GENRES[s.genre];
    const spb = 60 / s.bpm, step = spb / 4;
    const prog = opts.prog;
    const bars = Math.min(prog.length, opts.bars || prog.length);
    const mr = rngFrom(s.seed + 7); // melody motif stays the same across sections
    const tonic = s.keyPc;
    const T = (bar, st) => {
      let x = st;
      const whole = Math.floor(st);
      if (s.swing8 && Math.abs(st - whole) < 1e-6 && whole % 4 === 2) x += s.swing8 * 2;
      else if (s.swing && Math.abs(st - whole) < 1e-6 && whole % 2 === 1) x += s.swing;
      return (bar * 16 + x) * step;
    };
    const vH = (base) => base * (0.85 + r() * 0.2);
    const kicks = []; // per bar kick steps for bass following

    // ---- drums ----
    for (let b = 0; b < bars; b++) {
      const last = b === bars - 1, k = [];
      const fill = (b % 4 === 3);
      switch (G.drums) {
        case "boombap": {
          const pats = ["x.....x...x.....", "x......xx.....x.", "x.x.......x..x..", "x......x..x....."];
          const p = pats[(b % 2 === 0) ? 0 : 1 + Math.floor(r() * 3)];
          [...p].forEach((ch, i) => ch === "x" && k.push(i));
          [4, 12].forEach((i) => e.snare(T(b, i), 0.95, 190));
          if (r() < 0.4) e.snare(T(b, 15), 0.25, 190);
          for (let i = 0; i < 16; i += 2) e.hat(T(b, i), vH(i % 4 === 0 ? 0.9 : 0.6), !s.minimal && i === 14 && b % 2 === 1);
          break; }
        case "trap": {
          const pats = ["x.........x.....", "x......x..x.....", "x..x......x...x.", "x.........x..x.."];
          [...pick(r, pats)].forEach((ch, i) => ch === "x" && k.push(i));
          e.clap(T(b, 8), 0.95); e.snare(T(b, 8), 0.4, 230);
          let i = 0;
          while (i < 16) {
            const roll = !s.minimal && r() < (fill ? 0.5 : 0.18) && i % 4 === 0 && i < 15;
            if (roll) {
              const kind = pick(r, [3, 4, 6]);
              for (let j = 0; j < kind; j++) e.hat(T(b, 0) + (i + j * (4 / kind)) * step, vH(0.55 + 0.35 * (j / kind)));
              i += 4;
            } else { e.hat(T(b, i), vH(i % 4 === 0 ? 0.85 : 0.55)); i += 2; }
          }
          if (b % 4 === 1) e.hat(T(b, 14), 0.5, true);
          break; }
        case "drill": {
          const pats = ["x.........x.x...", "x......x...x....", "x..x.......x..x."];
          [...pick(r, pats)].forEach((ch, i) => ch === "x" && k.push(i));
          e.clap(T(b, 8), 0.9); e.snare(T(b, 8), 0.45, 240);
          if (r() < 0.6) { e.snare(T(b, 14), 0.5, 240); }
          else e.snare(T(b, 13), 0.45, 240);
          [0, 3, 6, 8, 11, 14].forEach((i) => e.hat(T(b, i), vH(i % 4 === 0 ? 0.8 : 0.55)));
          if (fill && !s.minimal) for (let j = 0; j < 6; j++) e.hat(T(b, 12) + j * (4 / 6) * step, 0.5);
          break; }
        case "lofi": {
          const pats = ["x......x..x.....", "x.....x...x..x..", "x.......x.x....."];
          [...pats[b % 2 === 0 ? 0 : 1 + Math.floor(r() * 2)]].forEach((ch, i) => ch === "x" && k.push(i));
          [4, 12].forEach((i) => { e.snare(T(b, i), 0.6, 170); e.rim(T(b, i), 0.25); });
          for (let i = 0; i < 16; i += 2) e.hat(T(b, i), vH(i % 4 === 0 ? 0.55 : 0.35));
          break; }
        case "rnb": {
          const pats = ["x.......x.x.....", "x..x......x.....", "x......x.x......"];
          [...pick(r, pats)].forEach((ch, i) => ch === "x" && k.push(i));
          [4, 12].forEach((i) => { e.clap(T(b, i), 0.6); e.rim(T(b, i), 0.3); });
          for (let i = 0; i < 16; i++) e.hat(T(b, i), vH(i % 4 === 0 ? 0.5 : i % 2 ? 0.22 : 0.35));
          break; }
        case "rock": {
          const p = b % 2 === 0 ? [0, 8, 10] : [0, 6, 8, 10];
          k.push(...p);
          [4, 12].forEach((i) => e.snare(T(b, i), 1, 200));
          for (let i = 0; i < 16; i += 2) e.hat(T(b, i), vH(i % 4 === 0 ? 0.8 : 0.6));
          if (b % 4 === 0) e.crash(T(b, 0), b === 0 ? 0.9 : 0.7);
          if (fill) [13, 14, 15].forEach((i) => e.snare(T(b, i), 0.55 + (i - 13) * 0.15, 190));
          break; }
        case "shuffle": {
          k.push(0, 8);
          if (r() < 0.4) k.push(10);
          [4, 12].forEach((i) => e.snare(T(b, i), 0.75, 190));
          for (let i = 0; i < 16; i += 2) e.ride(T(b, i), i % 4 === 0 ? 0.8 : 0.55);
          if (b % 4 === 0) e.crash(T(b, 0), 0.4);
          break; }
        case "swing": {
          [0, 4, 6, 8, 12, 14].forEach((i) => e.ride(T(b, i), (i === 6 || i === 14) ? 0.5 : 0.8));
          [4, 12].forEach((i) => e.hat(T(b, i), 0.5));
          for (let i = 0; i < 16; i += 4) e.kick(T(b, i), 0.18, { soft: true });
          if (r() < 0.5) e.snare(T(b, pick(r, [6, 10, 14])), 0.18, 180);
          break; }
        case "house": {
          k.push(0, 4, 8, 12);
          [4, 12].forEach((i) => e.clap(T(b, i), 0.75));
          [2, 6, 10, 14].forEach((i) => e.hat(T(b, i), 0.7, true));
          for (let i = 0; i < 16; i++) if (i % 2 === 1) e.hat(T(b, i), vH(0.3));
          break; }
        case "onedrop": {
          k.push(8);
          e.rim(T(b, 8), 0.8);
          for (let i = 0; i < 16; i += 2) e.hat(T(b, i), vH(i % 4 === 2 ? 0.6 : 0.35));
          if (fill) e.snare(T(b, 14), 0.5, 200);
          break; }
      }
      kicks.push(k);
      if (s.drums && G.drums !== "swing") k.forEach((i) => e.kick(T(b, i), G.drums === "lofi" ? 0.8 : 1, { soft: G.drums === "lofi" }));
    }

    // ---- harmony ----
    const reg = (s.reg || 0);
    const chordLow = (s.chords === "guitar" && s.distorted ? 52 : (s.chords === "pad" || s.chords === "strings") ? 55 : 57) + reg;
    const bassBase = s.bass === "808" ? 33 : 36; // A1 / C2 region
    const bassNote = (pc) => bassBase + ((pc - bassBase) % 12 + 12) % 12;
    const barLen = 16 * step;
    let lastBassNote = null;
    for (let b = 0; b < bars; b++) {
      const [off, q] = prog[b];
      const rootPc = (tonic + off) % 12;
      const notes = voice(rootPc, q, chordLow);
      const ci = s.chords;
      const vel = 0.32;
      const same = b > 0 && prog[b - 1][0] === off && prog[b - 1][1] === q;
      switch (G.comp) {
        case "long":
          if (!same) { const len = (G.chordBars || 1) * barLen; notes.forEach((n) => e.note(ci, T(b, 0), n, len * 0.98, vel * 0.85)); }
          break;
        case "bar":
          notes.forEach((n, i) => e.note(ci, T(b, 0) + i * 0.012, n, barLen * 0.95, vel));
          if (r() < 0.35) notes.forEach((n) => e.note(ci, T(b, 10), n, barLen * 0.35, vel * 0.6));
          break;
        case "lofi":
          notes.forEach((n, i) => e.note(ci, T(b, 0) + i * 0.018, n, barLen * 0.6, vel));
          notes.forEach((n, i) => e.note(ci, T(b, 10) + i * 0.015, n, barLen * 0.35, vel * 0.7));
          break;
        case "eighths": {
          const p = s.distorted ? voice(rootPc, "p", 40 + reg) : notes;
          for (let i = 0; i < 16; i += 2) p.forEach((n) => e.note(ci, T(b, i), n, step * 1.8, vel * (i % 4 === 0 ? 1 : 0.85)));
          break; }
        case "shuffle":
          [0, 2, 4, 6, 8, 10, 12, 14].forEach((i) => { if (i % 4 === 2 || i === 0 || r() < 0.25) notes.forEach((n) => e.note(ci, T(b, i), n, step * 1.4, vel * (i % 4 === 2 ? 0.9 : 0.7))); });
          break;
        case "jazz": {
          const hits = [[0, 3], [6, 2], [10, 3], [14, 2]].filter(() => r() < 0.55);
          if (!hits.length) hits.push([2, 3]);
          hits.forEach(([i, d]) => notes.forEach((n) => e.note(ci, T(b, i), n, step * d, vel * 0.85)));
          break; }
        case "stabs":
          [2, 6, 10, 14].forEach((i) => notes.forEach((n) => e.note(ci, T(b, i), n + 12, step * 1.2, vel * 0.8)));
          break;
        case "skank":
          [4, 12].forEach((i) => notes.forEach((n) => e.note(ci, T(b, i), n + 12, step * 0.9, vel * 0.9)));
          [2, 6, 10, 14].forEach((i) => notes.forEach((n) => e.note("organ", T(b, i), n, step * 0.8, vel * 0.35)));
          break;
      }
      if (s.pad && !same) {
        const len = (G.chordBars || 1) * barLen;
        voice(rootPc, q.replace("9", "7"), 52 + reg).forEach((n) => e.note(s.pad, T(b, 0), n, len * 0.98, 0.28, e.padBus));
      }

      // ---- bass ----
      const bn = bassNote(rootPc);
      const k = kicks[b].length ? kicks[b] : [0, 8];
      switch (s.bass) {
        case "808": {
          k.forEach((i, idx) => {
            const nextI = idx + 1 < k.length ? k[idx + 1] : 16;
            const dur = Math.max(step * 2, (nextI - i) * step * 0.98);
            const slide = (G.slides || r() < 0.18) && idx === k.length - 1 && dur > step * 3 ? (r() < 0.5 ? bn + 12 : bassNote((tonic + prog[(b + 1) % prog.length][0]) % 12)) : null;
            e.b808(T(b, i), (idx > 0 && r() < 0.2) ? bn + 12 : bn, dur, 0.95, slide);
          });
          break; }
        case "sub":
          k.forEach((i, idx) => { const nextI = idx + 1 < k.length ? k[idx + 1] : 16; e.subBass(T(b, i), bn + 12, (nextI - i) * step * 0.9, 0.7); });
          break;
        case "round":
          e.subBass(T(b, 0), bn + 12, step * 7, 0.6, "triangle");
          e.subBass(T(b, 10), bn + 12 + 7 - (bn + 19 > 55 ? 12 : 0), step * 5, 0.5, "triangle");
          break;
        case "pick":
          for (let i = 0; i < 16; i += 2) e.subBass(T(b, i), bn + 12, step * 1.7, 0.55, "sawtooth");
          break;
        case "shuffle": {
          const riff = [0, 4, 7, 9, 10, 9, 7, 4];
          riff.forEach((iv, j) => e.subBass(T(b, j * 2), bn + 12 + iv, step * 1.6, 0.6, "triangle"));
          break; }
        case "walk": {
          const tones = QUAL[q].map((iv) => bn + 12 + iv);
          const nextRoot = bassNote((tonic + prog[(b + 1) % prog.length][0]) % 12) + 12;
          const line = [tones[0], pick(r, [tones[1], tones[2]]), tones[2], nextRoot + (r() < 0.5 ? -1 : 1)];
          line.forEach((n, j) => e.subBass(T(b, j * 4), n, step * 3.6, 0.65, "triangle"));
          break; }
        case "offbeat":
          [2, 6, 10, 14].forEach((i, j) => e.subBass(T(b, i), bn + 12 + (j === 3 && r() < 0.5 ? 12 : 0), step * 1.5, 0.65, "sawtooth"));
          break;
        case "reggae":
          [[0, 0, 3], [3, 7, 2], [6, 12, 2], [10, 0, 2], [12, 7, 3]].forEach(([i, iv, d]) => e.subBass(T(b, i), bn + 12 + iv, step * d, 0.7, "sine"));
          break;
      }
      lastBassNote = bn;
    }

    // ---- lead melody ----
    if (s.lead) {
      const scale = s.minor ? [0, 3, 5, 7, 10] : [0, 2, 4, 7, 9];
      const leadLow = (s.lead === "bells" ? 72 : s.lead === "brass" ? 62 : s.lead === "flute" ? 72 : 67) + reg;
      const pool = [];
      for (let m = leadLow; m < leadLow + 15; m++) if (scale.includes(((m - tonic) % 12 + 12) % 12)) pool.push(m);
      const density = s.genre === "trap" || s.genre === "drill" ? 0.42 : 0.32;
      const motif = [];
      for (let i = 0; i < 32; i++) if (mr() < (i % 4 === 0 ? density + 0.25 : i % 2 === 0 ? density : density * 0.4)) motif.push(i);
      if (motif.length < 3) motif.push(0, 6, 12);
      let idx = Math.floor(pool.length / 2);
      const notes = motif.map(() => { idx = clamp(idx + pick(mr, [-2, -1, -1, 0, 1, 1, 2]), 0, pool.length - 1); return pool[idx]; });
      const startBar = opts.pass ? 0 : (bars >= 8 ? 2 : 0);
      for (let b = startBar; b < bars; b += 2) {
        const variation = b >= bars - 2;
        motif.forEach((st, j) => {
          if (variation && j === motif.length - 1) return;
          const nextSt = j + 1 < motif.length ? motif[j + 1] : 32;
          const dur = Math.min((nextSt - st) * step * 0.95, step * 6);
          let n = notes[j];
          if (variation && j >= motif.length - 3) n = pool[clamp(pool.indexOf(n) + 1, 0, pool.length - 1)];
          const bar = b + Math.floor(st / 16);
          if (bar < bars) e.note(s.lead, T(bar, st % 16), n, dur, 0.32, e.leadBus);
        });
      }
    }

    // ---- vinyl ----
    if (s.vinyl > 0) {
      const c = e.ctx, total = bars * barLen + 1, len = Math.floor(c.sampleRate * total);
      const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      let x = 99 + (opts.pass || 0) * 7919;
      for (let i = 0; i < len; i++) {
        x = (x * 1103515245 + 12345) & 0x7fffffff; const rnd = x / 0x7fffffff;
        d[i] = (rnd - 0.5) * 0.02 + (rnd > 0.99965 ? (rnd - 0.5) * 1.2 : 0);
      }
      const src = c.createBufferSource(), hp = c.createBiquadFilter(), g = c.createGain();
      src.buffer = buf; hp.type = "highpass"; hp.frequency.value = 900; g.gain.value = 0.22 * s.vinyl;
      src.connect(hp); hp.connect(g); g.connect(e.master); src.start(0);
    }
    return { bars, loopSeconds: bars * barLen, prog };
  }

  // ---------- render ----------
  function barSeconds(s) { return (16 * 60) / s.bpm / 4; }
  function baseBars(s) {
    const G = GENRES[s.genre];
    const L = G.form === "12bar" ? 12 : 8;
    return L * (L * barSeconds(s) < 14 ? 2 : 1);
  }
  function phrase(s) { return GENRES[s.genre].form === "12bar" ? 12 : 4; }
  function totalBars(s) { return baseBars(s) + (s.extraBars || 0); }
  const MAX_SECONDS = 180;
  // bars to add for roughly `seconds` more, in whole phrases, capped at MAX_SECONDS
  function extendBars(s, seconds) {
    const ph = phrase(s), bs = barSeconds(s);
    let add = Math.max(ph, Math.ceil(seconds / bs / ph) * ph);
    while (add > 0 && (totalBars(s) + add) * bs > MAX_SECONDS + 0.01) add -= ph;
    return add;
  }
  function lengthOf(s) { return totalBars(s) * barSeconds(s); }

  // time-shifted (and optionally muted) view of the engine for one section
  function sectionView(e, shift, breakdown) {
    const v = Object.create(e);
    const DRUMS = ["kick", "snare", "clap", "rim", "ride", "crash"], BASS = ["b808", "subBass"];
    ["kick", "snare", "clap", "rim", "hat", "ride", "crash", "b808", "subBass"].forEach((fn) => {
      v[fn] = function () {
        if (breakdown && (DRUMS.includes(fn) || BASS.includes(fn))) return;
        const a = Array.prototype.slice.call(arguments); a[0] += shift;
        if (breakdown && fn === "hat") a[1] *= 0.55;
        return e[fn].apply(e, a);
      };
    });
    v.note = function (inst, t, m, dur, vel, dest) { return e.note(inst, t + shift, m, dur, vel, dest); };
    return v;
  }

  // Each section renders in its own short OfflineAudioContext and is overlap-added into the result.
  // (One long context gets slower per second as nodes pile up; chunking keeps render time roughly linear.)
  function renderCtx(ctx) {
    return new Promise((resolve, reject) => {
      ctx.oncomplete = (ev) => resolve(ev.renderedBuffer); // older Safari (webkitOfflineAudioContext)
      const p = ctx.startRendering();
      if (p && p.then) p.then(resolve, reject);
    });
  }
  async function render(s, onProgress) {
    const G = GENRES[s.genre];
    const L = G.form === "12bar" ? 12 : 8;
    const tb = totalBars(s), bs = barSeconds(s);
    const loopSeconds = tb * bs;
    const tail = 2.5, sr = s.sampleRate || 44100;
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    s._totalSeconds = null;
    const prog = buildProgression(s, rngFrom(s.seed));
    const base = baseBars(s);
    let bar = 0, pass = 0;
    const plan = [];
    while (bar < tb) {
      const n = Math.min(L, tb - bar);
      plan.push({ start: bar, bars: n, pass });
      bar += n; pass++;
    }
    const passesInBase = Math.round(base / L);
    plan.forEach((sec, i) => {
      // breakdown: every third pass of the extension (never the last one, never inside the base loop)
      sec.breakdown = sec.pass >= passesInBase && i < plan.length - 1 && (sec.pass - passesInBase) % 3 === 1 && sec.bars >= 4 && s.drums;
    });
    const loopLen = Math.round(loopSeconds * sr);
    const acc = [new Float32Array(loopLen + Math.ceil(tail * sr) + 8), new Float32Array(loopLen + Math.ceil(tail * sr) + 8)];
    let ctx0 = null;
    for (let k = 0; k < plan.length; k++) {
      const sec = plan[k];
      const ctx = new OAC(2, Math.ceil((sec.bars * bs + tail) * sr), sr);
      if (!ctx0) ctx0 = ctx;
      const e = new Engine(ctx, s);
      if (!s.drums) e.drums.gain.value = 0;
      const view = sec.breakdown ? sectionView(e, 0, true) : e;
      arrange(view, s, rngFrom(s.seed + 101 * sec.pass), { prog, bars: sec.bars, pass: sec.pass, breakdown: sec.breakdown });
      if (sec.breakdown) {
        const step = bs / 16, lastBar = sec.bars - 1; // snare build into the drop
        for (let i = 0; i < 8; i++) e.snare(lastBar * bs + (8 + i) * step, 0.25 + i * 0.07, 200);
      } else if (sec.pass > 0 && s.drums && G.drums !== "swing" && G.drums !== "lofi") {
        e.crash(0, 0.55);
      }
      const buf = await renderCtx(ctx);
      const off = Math.round(sec.start * bs * sr);
      for (let ch = 0; ch < 2; ch++) {
        const src = buf.getChannelData(ch), dst = acc[ch];
        const n = Math.min(src.length, dst.length - off);
        for (let i = 0; i < n; i++) dst[off + i] += src[i];
      }
      if (onProgress) onProgress((k + 1) / plan.length);
    }
    // fold the tail onto the start so the loop is seamless, then normalize
    const out = ctx0.createBuffer(2, loopLen, sr);
    let peak = 0;
    for (let ch = 0; ch < 2; ch++) {
      const src = acc[ch], dst = out.getChannelData(ch);
      dst.set(src.subarray(0, loopLen));
      for (let i = loopLen; i < src.length; i++) dst[i - loopLen] += src[i];
      for (let i = 0; i < loopLen; i++) { const a = Math.abs(dst[i]); if (a > peak) peak = a; }
    }
    const gain = peak > 0 ? 0.92 / peak : 1;
    for (let ch = 0; ch < 2; ch++) { const d = out.getChannelData(ch); for (let i = 0; i < d.length; i++) { const v = d[i] * gain; d[i] = v > 0.98 ? 0.98 : v < -0.98 ? -0.98 : v; } }
    return { buffer: out, info: { bars: tb, seconds: loopSeconds, sections: plan } };
  }

  // ---------- edits ----------
  // Apply free-text modifier instructions ("harder drums", "add piano", "faster") to settings.
  function applyEdit(s, text) {
    const t = " " + (text || "").toLowerCase() + " ";
    const has = (re) => re.test(t);
    const G = GENRES[s.genre];
    const notes = [];
    s.drumGain = s.drumGain || 1; s.bassGain = s.bassGain || 1;
    if (has(/(harder|punchier|heavier|louder|hard) drums|hit harder|more punch/)) { s.drumGain = clamp(s.drumGain * 1.25, 0.3, 2); s.drive = (s.drive || 0) + 0.6; notes.push("harder drums"); }
    if (has(/(softer|lighter|quieter|gentler) drums|less drums/)) { s.drumGain = clamp(s.drumGain * 0.72, 0.3, 2); notes.push("softer drums"); }
    if (has(/(remove|no|drop|without|mute)( the)? drums|drumless/)) { s.drums = false; notes.push("no drums"); }
    else if (has(/(add|bring back|with) (the )?drums/)) { s.drums = true; notes.push("drums back"); }
    if (has(/(more|louder|heavier|bigger|boost)( the)? (bass|808)|bass up/)) { s.bassGain = clamp(s.bassGain * 1.3, 0.3, 2.2); notes.push("more bass"); }
    if (has(/(less|softer|quieter)( the)? (bass|808)/)) { s.bassGain = clamp(s.bassGain * 0.75, 0.3, 2.2); notes.push("less bass"); }
    const bpmM = /(\d{2,3})\s*bpm/.exec(t);
    if (bpmM) { s.bpm = Math.round(clamp(+bpmM[1], 50, 200)); notes.push(s.bpm + " bpm"); }
    else if (has(/faster|speed (it )?up|quicker|more tempo/)) { s.bpm = Math.round(clamp(s.bpm * 1.1, 50, 200)); notes.push("faster"); }
    else if (has(/slower|slow (it )?down|less tempo/)) { s.bpm = Math.round(clamp(s.bpm * 0.9, 50, 200)); notes.push("slower"); }
    if (has(/darker|more dark|moodier|more sinister/)) { s.bright = clamp(s.bright * 0.75, 0.4, 1.8); if (!s.minor) { s.minor = true; s.keyName = NOTE_NAMES[s.keyPc] + " minor"; } notes.push("darker"); }
    if (has(/brighter|more bright|happier|lighter mood/)) { s.bright = clamp(s.bright * 1.25, 0.4, 1.8); if (has(/happier/) && s.minor) { s.minor = false; s.keyName = NOTE_NAMES[s.keyPc] + " major"; } notes.push("brighter"); }
    if (has(/(more|add|bigger) (reverb|space)|spacious/)) { s.reverb = clamp(s.reverb + 0.15, 0, 0.6); notes.push("more space"); }
    if (has(/vinyl|dusty|crackle/)) { s.vinyl = Math.max(s.vinyl || 0, 0.6); notes.push("vinyl"); }
    if (has(/(remove|no|drop|without)( the)? (melody|lead|hook)/)) { s.lead = null; notes.push("no melody"); }
    else if (has(/melody|lead|hook|topline/)) {
      const named = ["bells", "flute", "synth", "brass", "pluck", "piano"].find((i) => t.includes(i));
      s.lead = named || s.lead || G.lead || (s.genre === "rock" ? "synth" : s.genre === "blues" || s.genre === "jazz" ? "piano" : "pluck");
      if (s.lead === s.chords) s.lead = "bells";
      notes.push("melody");
    }
    const remove = (inst) => new RegExp("(remove|no|drop|without)( the)? " + inst).test(t);
    [["piano", "piano"], ["guitar", "guitar"], ["strings", "strings"], ["organ", "organ"], ["rhodes", "rhodes"], ["keys", "rhodes"], ["pad", "pad"], ["bells", "bells"], ["flute", "flute"], ["brass", "brass"], ["horns", "brass"], ["synth", "synth"], ["pluck", "pluck"]].forEach(([word, inst]) => {
      if (!new RegExp("\\b" + word + "\\b").test(t) || /melody|lead|hook/.test(t) && ["bells", "flute", "synth", "brass", "pluck"].includes(inst)) return;
      if (remove(word)) {
        if (s.lead === inst) s.lead = null;
        if (s.pad === inst) s.pad = null;
        notes.push("no " + word); return;
      }
      if (s.chords === inst || s.pad === inst || s.lead === inst) return;
      if (inst === "guitar") { s.chords = "guitar"; s.distorted = /distort|heavy|rock|fuzz/.test(t) || s.genre === "rock"; }
      else if (["strings", "pad", "organ", "rhodes"].includes(inst)) s.pad = inst;
      else if (inst === "piano") { if (!s.lead) s.lead = "piano"; else s.pad = "piano"; }
      else s.lead = inst;
      notes.push("add " + word);
    });
    const k = parseKey(text || "");
    if (k) { s.keyPc = k.pc; if (k.minor !== null) s.minor = k.minor; s.keyName = NOTE_NAMES[s.keyPc] + (s.minor ? " minor" : " major"); notes.push(s.keyName); }
    return notes;
  }

  // ---------- WAV export ----------
  function toWav(buffer) {
    const ch = buffer.numberOfChannels, sr = buffer.sampleRate, len = buffer.length;
    const data = new DataView(new ArrayBuffer(44 + len * ch * 2));
    const w = (o, str) => { for (let i = 0; i < str.length; i++) data.setUint8(o + i, str.charCodeAt(i)); };
    w(0, "RIFF"); data.setUint32(4, 36 + len * ch * 2, true); w(8, "WAVE"); w(12, "fmt ");
    data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, ch, true); data.setUint32(24, sr, true);
    data.setUint32(28, sr * ch * 2, true); data.setUint16(32, ch * 2, true); data.setUint16(34, 16, true); w(36, "data"); data.setUint32(40, len * ch * 2, true);
    const chans = []; for (let c = 0; c < ch; c++) chans.push(buffer.getChannelData(c));
    let o = 44;
    for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) { const v = Math.max(-1, Math.min(1, chans[c][i])); data.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2; }
    return new Blob([data], { type: "audio/wav" });
  }

  function describe(s) {
    const insts = [s.bass === "808" ? "808 bass" : "Bass", INST_LABEL[s.chords] + (s.chords === "guitar" && s.distorted ? " (distorted)" : "")];
    if (s.pad) insts.push(INST_LABEL[s.pad]);
    if (s.lead) insts.push(INST_LABEL[s.lead]);
    if (s.drums) insts.unshift("Drums");
    return {
      title: [s.moods[0] ? s.moods[0][0].toUpperCase() + s.moods[0].slice(1) : null, GENRES[s.genre].label, "· " + s.bpm + " BPM ·", s.keyName].filter(Boolean).join(" "),
      fields: [
        ["Genre", GENRES[s.genre].label + (s.genreGuessed ? " (best guess)" : "")],
        ["Tempo", s.bpm + " BPM" + (s.bpmExplicit ? "" : " (auto)")],
        ["Key", s.keyName],
        ["Mood", s.mood],
        ["Feel", s.swing8 ? "Triplet swing" : s.swing > 0.2 ? "Heavy swing" : s.swing > 0.05 ? "Light swing" : "Straight"],
        ["Texture", [s.vinyl > 0.3 ? "Vinyl" : null, s.reverb > 0.3 ? "Spacious" : null, s.drive ? "Driven" : null, s.minimal ? "Minimal" : null].filter(Boolean).join(", ") || "Clean"],
        ["Instruments", insts.join(" · "), true]
      ]
    };
  }

  const supported = !!(window.OfflineAudioContext || window.webkitOfflineAudioContext);
  window.SenqBeat = { supported, parse, render, toWav, describe, applyEdit, extendBars, lengthOf, barSeconds, MAX_SECONDS, GENRES, GENRE_STARTERS };
})();
