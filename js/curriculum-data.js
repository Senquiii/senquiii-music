/*
  SENQUIII Music Lab: Genre Curriculum content.
  Plain data, safe to edit. Rendered by js/curriculum.js.
  Conventions:
    - Drum rows are 16 steps (one bar of 16th notes): "x" = hit, "X" = accent, "-" = rest.
    - Chords use standard names (C, Am, F#m7, Bb5, G7, Dmaj7, Esus4 ...). The page draws a keyboard chart for each.
    - structure: [section, bars]. Times are calculated from the BPM, not guessed.
    - Reference songs are well-known recordings. No timestamps: moments are described in words.
    - Lyric fragments are original, written for this site.
*/
window.SENQ_CURRICULUM = (function () {
  const MODULES = [
    { id: "sing", title: "How to Sing It", short: "Sing" },
    { id: "train", title: "Vocal Training", short: "Train" },
    { id: "beats", title: "Making Beats", short: "Beats" },
    { id: "produce", title: "Producing & Arranging", short: "Produce" },
    { id: "promote", title: "Promotion", short: "Promote" }
  ];

  // Shared warmup library. Each genre picks the ones that fit and adds its own.
  const WARMUPS = {
    breath: { name: "Silent breath ladder", icon: "breath", count: "Inhale 4 · hold 4 · hiss out 8 → 12 → 16", time: "3 min", how: "Hand on your belly. Breathe low and wide without lifting your shoulders, then release on a steady 'sss' as long as you can keep it even." },
    lipTrill: { name: "Lip trills", icon: "lips", count: "5 slides up and down · 5-note scale × 6 keys", time: "2 min", how: "Loose lips, steady air, like a motorboat. If your lips stop, press your cheeks gently with two fingers." },
    siren: { name: "Sirens on 'ng'", icon: "siren", count: "Low → high → low × 6", time: "2 min", how: "Hum 'ng' (as in 'sing') and slide through your whole range smoothly. Aim for no bumps or cracks; quiet is fine." },
    straw: { name: "Straw phonation", icon: "straw", count: "3 glides + 1 easy song melody", time: "3 min", how: "Hum through a drinking straw. The back-pressure takes strain off the folds. Great on tired days." },
    hum: { name: "Hum & chew", icon: "hum", count: "8 slow counts × 4", time: "1 min", how: "Hum 'mmm' while gently chewing, feeling buzz on your lips and nose. This finds forward resonance." },
    scale5: { name: "5-tone scale on 'mum'", icon: "scale", count: "1-2-3-4-5-4-3-2-1 × 8 keys", time: "3 min", how: "Start mid-range and move up a half step each time. Keep the volume medium and every note connected." },
    vowels: { name: "Vowel line", icon: "vowel", count: "'mee-meh-mah-moh-moo' on one note × 5 notes", time: "2 min", how: "Keep the tone and loudness identical across all five vowels. Only your mouth shape should change." },
    stacc: { name: "Staccato 'ha' pulses", icon: "stacc", count: "4 sets of 8 short 'ha'", time: "1 min", how: "Short, bouncy, from the belly. Wakes up support for rhythmic singing." },
    octave: { name: "Octave slides on 'gee'", icon: "siren", count: "1 → 8 → 1 × 6 keys", time: "2 min", how: "The bratty 'g' and 'ee' help you stay connected through the break between chest and head voice." }
  };

  // Template for a weekly routine; each genre supplies two focus drills.
  const WEEK = (a, b) => [
    ["Mon", "Warmup 10 min + " + a + " (10 min)"],
    ["Tue", "Warmup 10 min + sing along to one reference track twice, matching phrasing"],
    ["Wed", "Rest day: light humming only (5 min)"],
    ["Thu", "Warmup 10 min + " + b + " (15 min)"],
    ["Fri", "Record one full take, listen back, write down 3 things to fix"],
    ["Sat", "Warmup 10 min + run your song top to bottom twice"],
    ["Sun", "Full rest. Listen to music you love; no singing required"]
  ];

  const HEALTH = [
    "Drink water through the day, not just right before singing. Room-temperature is easiest on the throat.",
    "Warm up before you sing hard and cool down after (2 minutes of gentle humming or straw glides).",
    "Pain, burning, or hoarseness that lasts more than a day or two means stop and rest. If it lasts two weeks, see a doctor or an ENT.",
    "Sleep is the best vocal medicine. Tired voices crack and strain.",
    "Avoid shouting in loud places the night before a session. Talking over noise tires you out fast."
  ];

  // Frequency bands for the EQ chart (Hz). Genres highlight bands with notes.
  const EQ_BANDS = [
    { id: "sub", lo: 20, hi: 60, label: "Sub" },
    { id: "bass", lo: 60, hi: 250, label: "Bass" },
    { id: "lowmid", lo: 250, hi: 500, label: "Low mids" },
    { id: "mid", lo: 500, hi: 2000, label: "Mids" },
    { id: "uppermid", lo: 2000, hi: 5000, label: "Upper mids" },
    { id: "presence", lo: 5000, hi: 8000, label: "Presence" },
    { id: "air", lo: 8000, hi: 20000, label: "Air" }
  ];

  const GENRES = [];
  const add = (g) => GENRES.push(g);

  /* ============ ROCK ============ */
  add({
    id: "rock", name: "Rock", aka: "incl. rock & roll", bpm: "110–160",
    blurb: "Guitars, drums, attitude. From 1950s rock & roll to stadium anthems and garage bands.",
    sing: {
      intro: "Rock singing is about energy and honesty more than perfection. You want a strong, speech-like chest voice, a little edge on the loud lines, and the stamina to keep it up over a loud band.",
      techniques: [
        ["Chest-mix belt", "Sing high notes with a speech-like, 'calling across the street' quality instead of shouting. Keep the jaw loose and the vowel slightly open ('ah' leans toward 'uh')."],
        ["Grit and rasp", "A light, controlled edge added on top of a healthy tone. Start at low volume and learn it with a coach; it should never hurt (see Vocal Training)."],
        ["Rhythmic attack", "Rock vocals lock to the snare. Hit consonants on the beat and clip phrase endings so the groove stays tight."],
        ["Wails and cries", "A short flip or slide up into a high note for emotion. Use it as seasoning on a few big moments, not every line."]
      ],
      classic: [
        ["Chuck Berry", "Johnny B. Goode", "Storytelling verses delivered almost like speech, locked to the beat."],
        ["Little Richard", "Tutti Frutti", "Explosive energy and falsetto whoops: the blueprint for rock & roll screaming."],
        ["Led Zeppelin (Robert Plant)", "Whole Lotta Love", "Wailing high cries in the middle section and a bluesy, sliding delivery."],
        ["Queen (Freddie Mercury)", "Bohemian Rhapsody", "The shift from a soft piano ballad into the operatic section, then into hard rock."]
      ],
      modern: [
        ["Foo Fighters (Dave Grohl)", "Everlong", "Quiet, breathy verses that explode into a full-voiced chorus."],
        ["Arctic Monkeys (Alex Turner)", "Do I Wanna Know?", "Low, laid-back, almost spoken delivery over a heavy riff."],
        ["Paramore (Hayley Williams)", "Misery Business", "Bright, punchy belting with clear diction at high speed."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "siren", "octave", "stacc"],
      extra: [{ name: "Calling 'hey!'", icon: "vowel", count: "5 calls rising by step × 3", time: "1 min", how: "Call 'hey!' like you're getting a friend's attention, not screaming. That speech-like feeling is the base of a rock belt." }],
      drills: ["belting the chorus of your song at 70% volume", "riff-and-sing: sing along over a loud backing track while keeping the shoulders relaxed"],
      health: ["Use in-ear monitors or put a wedge speaker near you on stage. Not hearing yourself is the #1 reason rock singers oversing."],
      grit: "Safe grit comes from extra resonance and false-fold texture, not from squeezing the throat. Learn it quietly first, keep the airflow steady, stop the moment it tickles, scratches, or hurts, and always alternate gritty lines with clean ones. A voice teacher who works with rock singers is worth it here.",
      mistakes: ["Pushing more air to get louder instead of using brighter resonance.", "Singing every line at maximum, leaving nowhere to go in the chorus.", "Raising the chin and neck to reach high notes.", "Copying a famous singer's rasp before having a clean, healthy tone."]
    },
    beats: {
      intro: "Rock 'beats' usually mean a live-feeling drum part plus guitars and bass. You can build convincing demos with free virtual drums and amp simulators.",
      bpm: "Rock & roll 150–180 · classic/hard rock 100–140 · punk 160–200+",
      keys: "E, A, D, G (open-string guitar keys)", scales: "Major, minor pentatonic, blues scale, Mixolydian",
      progs: [
        { name: "Power-chord anthem", chords: "E5 A5 B5 A5", roman: "I – IV – V – IV", feel: "Driving straight 8ths" },
        { name: "Classic rock turn", chords: "A G D A", roman: "I – bVII – IV – I", feel: "Mixolydian swagger" },
        { name: "Rock & roll 12-bar (in A)", chords: "A A A A D D A A E D A E", roman: "I×4 · IV×2 · I×2 · V · IV · I · V", feel: "Boogie shuffle" },
        { name: "Modern alt", chords: "Em C G D", roman: "vi – IV – I – V (in G)", feel: "Big open chorus" }
      ],
      drums: { name: "Basic rock beat", bpm: 128, swing: 0, rows: { crash: "x---------------", hat: "x-x-x-x-x-x-x-x-", snare: "----X-------X---", kick: "x-------x-x-----" }, note: "Kick on 1 and the '&' of 3, snare on 2 and 4, 8th-note hi-hats. Move the hats to the ride cymbal for the chorus." },
      sounds: ["Distorted electric guitar (double-tracked, panned hard left and right)", "Picked or slightly driven bass guitar", "Acoustic drum kit with room sound", "Optional organ or piano for classic rock color"],
      daw: [
        "Open a free DAW (GarageBand, BandLab, Cakewalk Sonar, or Waveform Free) and set the tempo to 128 BPM.",
        "Add a drum track and program the beat above for 4 bars. Copy it out to 32 bars.",
        "Record or program a bass part playing the root note of each chord in straight 8ths.",
        "Add a guitar track with a free amp simulator. Record the power-chord progression, then record it again on a second track and pan the two hard left and right.",
        "Make the chorus bigger: switch the hats to ride/crash, play the guitar chords open instead of muted.",
        "Leave a gap for the vocal: cut the guitars a little in the 1–3 kHz range on the verse."
      ]
    },
    produce: {
      bpm: 128,
      structure: [["Intro", 4], ["Verse", 8], ["Pre-chorus", 4], ["Chorus", 8], ["Verse", 8], ["Pre-chorus", 4], ["Chorus", 8], ["Bridge", 8], ["Solo", 8], ["Chorus", 8], ["Outro", 4]],
      arrangement: ["Start the intro with the main riff alone, then bring the band in.", "Pull instruments out of verse 1 (muted guitar, closed hats) so the chorus hits harder.", "A 1-bar drum fill or a cymbal swell signals every new section.", "The bridge should change something: a new chord, half-time drums, or a breakdown."],
      mix: ["Guitars wide, vocals and bass centered.", "Drums sound big with room mics or a short room reverb.", "Vocals sit just above the guitars with a slap-back delay (80–120 ms).", "Use gentle bus compression for glue; avoid crushing the dynamics."],
      eq: { bass: "Kick and bass guitar share this; give each its own space (e.g. kick at 60 Hz, bass at 100 Hz).", lowmid: "Cut mud here on guitars (around 300 Hz).", uppermid: "Guitar bite and vocal clarity live here; carve a little room for the voice.", presence: "Snare crack and cymbal attack." },
      reference: "Big, live-band sound: punchy drums, two walls of guitar left and right, and a clear lead vocal riding on top."
    },
    promote: {
      platforms: ["YouTube (full songs, live sessions)", "Instagram Reels and TikTok (riff clips, 'how I wrote this' videos)", "Bandcamp (fans can buy directly)", "SoundCloud and BandLab"],
      communities: ["Local venues' open-mic nights and battle-of-the-bands", "Reddit communities for musicians and home recording", "Local music stores' bulletin boards and Discord servers"],
      content: ["Film a one-take live performance in a garage or bedroom.", "Riff challenge: play your main riff and invite others to duet it.", "Gear rundown: what you used to record the song on a budget.", "Before/after: the phone demo vs. the finished track."],
      visual: "Gritty, real, and consistent: one color treatment (high-contrast black & white or warm film grain), a simple logo, live photos over studio glamour.",
      collabs: ["Split a gig bill with another local band.", "Trade guest vocals or a guitar solo with another artist.", "Ask a local photographer to shoot a show in exchange for credit."]
    },
    lyric: { lines: ["Engine's running on a borrowed dream,", "headlights cutting through the in-between,", "I don't need a map to know I'm gone,", "just turn it up and let the night go on."], note: "Short, punchy lines with strong vowels at the ends ('dream', 'gone') that are easy to belt." }
  });

  /* ============ BLUES ============ */
  add({
    id: "blues", name: "Blues", aka: "12-bar, Delta, Chicago", bpm: "60–130",
    blurb: "The root of rock, R&B, and so much more. Three chords, a lot of feeling.",
    sing: {
      intro: "Blues singing is storytelling with emotion. The notes bend, the phrases breathe, and the voice talks back and forth with the guitar.",
      techniques: [
        ["Blue notes", "Bend the 3rd, 5th, or 7th note of the scale slightly flat. Slide into notes from below instead of hitting them dead-on."],
        ["Call and response", "Sing a line, then leave space for the guitar or harmonica to answer."],
        ["AAB lyric form", "Sing line one, repeat it (often with more intensity), then resolve with a third line that answers it."],
        ["Grit and moan", "A little rasp, a hum, or a moan at the end of a phrase adds feeling. Keep it relaxed."]
      ],
      classic: [
        ["B.B. King", "The Thrill Is Gone", "His voice and his guitar take turns, like a conversation."],
        ["Muddy Waters", "Mannish Boy", "Stop-time riff with a huge, confident chest voice and crowd shouts."],
        ["Etta James", "I'd Rather Go Blind", "Grit and a cry in the voice on the long held lines."],
        ["Howlin' Wolf", "Smokestack Lightnin'", "The famous howl: raw, rough, and full of character."]
      ],
      modern: [
        ["Gary Clark Jr.", "Bright Lights", "Modern, distorted blues with a smooth, laid-back vocal."],
        ["Christone 'Kingfish' Ingram", "662", "Young Delta-style blues with a warm, soulful voice."],
        ["Susan Tedeschi (Tedeschi Trucks Band)", "Midnight in Harlem", "Soulful, controlled power and space between phrases."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "hum", "siren", "scale5"],
      extra: [{ name: "Bend & slide", icon: "siren", count: "Slide into each note of a minor pentatonic from a half step below × 2 keys", time: "2 min", how: "Practice landing on pitch after a scoop. Record it to check you actually arrive." }],
      drills: ["blues scale on 'ah' with slides into the 3rd and 7th", "singing a 12-bar verse in AAB form with call-and-response gaps"],
      health: ["Blues is often sung late at night in bars. Keep a water bottle on stage and skip yelling over the crowd between sets."],
      grit: "The 'growl' in blues should be a resonance effect on top of a supported tone. Practice at low volume, never force it, and stop at any scratchiness.",
      mistakes: ["Over-singing: the blues is about restraint and space.", "Scooping into every note until nothing is in tune.", "Ignoring the lyric story and just making sounds.", "Rushing: let the phrase end late and relaxed."]
    },
    beats: {
      intro: "Blues backing is usually a live band: shuffle drums, walking or boogie bass, guitar, and sometimes piano or organ.",
      bpm: "Slow blues 60–75 · shuffle 90–130 · Chicago 110–130", keys: "E, A, G, Bb, C", scales: "Blues scale (1 b3 4 b5 5 b7), minor and major pentatonic, Mixolydian",
      progs: [
        { name: "12-bar blues in E", chords: "E7 E7 E7 E7 A7 A7 E7 E7 B7 A7 E7 B7", roman: "I7×4 · IV7×2 · I7×2 · V7 · IV7 · I7 · V7", feel: "Shuffle" },
        { name: "Quick-change 12-bar in A", chords: "A7 D7 A7 A7 D7 D7 A7 A7 E7 D7 A7 E7", roman: "I7 · IV7 · I7×2 · IV7×2 · I7×2 · V7 · IV7 · I7 · V7", feel: "Medium shuffle" },
        { name: "Minor blues in A", chords: "Am7 Am7 Am7 Am7 Dm7 Dm7 Am7 Am7 F7 E7 Am7 E7", roman: "i · iv · i · bVI7 · V7 · i · V7", feel: "Slow, moody" }
      ],
      drums: { name: "Shuffle", bpm: 96, swing: 0.62, rows: { hat: "x-x-x-x-x-x-x-x-", snare: "----X-------X---", kick: "x-------x-------" }, note: "Swing is set high so the 8ths 'long-short'. Kick on 1 and 3, snare backbeat on 2 and 4." },
      sounds: ["Clean or slightly overdriven electric guitar (tube-amp sim)", "Upright or electric bass playing a walking or boogie line", "Hammond-style organ or piano", "Harmonica for answers between vocal lines"],
      daw: [
        "Set the tempo to 96 BPM and turn on swing/shuffle (in many DAWs it's a 'swing' or 'groove' knob; try 60–65%).",
        "Program the shuffle beat above and loop it for 12 bars.",
        "Add a bass line: root, 3rd, 5th, 6th of each chord, up and down (the classic boogie).",
        "Add guitar or piano playing the 12-bar chords. Leave holes at the end of each vocal line for fills.",
        "Repeat the 12 bars 3–4 times: verse, verse, solo, verse.",
        "End with a 'turnaround' (the last 2 bars) and finish on the I chord."
      ]
    },
    produce: {
      bpm: 96,
      structure: [["Intro (turnaround)", 4], ["Verse 1 (12-bar)", 12], ["Verse 2", 12], ["Guitar solo", 12], ["Verse 3", 12], ["Outro / tag", 4]],
      arrangement: ["Each 12-bar chorus is one verse; build intensity over the song.", "Drop the band out for a 'stop-time' verse to spotlight the vocal.", "Instruments answer the vocal, never talk over it."],
      mix: ["Natural and live: minimal tuning, real room sound.", "Vocal slightly forward with plate reverb.", "Guitar warm, with mids, not scooped."],
      eq: { lowmid: "Warmth for guitar and voice; cut only if muddy.", mid: "Guitar tone and harmonica live here.", uppermid: "A little lift for vocal clarity." },
      reference: "Sounds like a band in a small club: warm, close, and a little loose."
    },
    promote: {
      platforms: ["YouTube (live sessions get the most traction in blues)", "Facebook groups for blues fans (an older, loyal audience)", "Bandcamp", "Local radio blues shows"],
      communities: ["Blues jams at local bars", "Regional blues societies (many cities have one)", "Guitar and harmonica forums"],
      content: ["Front-porch or kitchen one-take performances", "Explain the story behind a lyric", "Lessons: 'how to play this lick'"],
      visual: "Warm and vintage: amber light, wood, sepia tones, a classic font.",
      collabs: ["Sit in at a jam and network with players", "Feature a harmonica or slide guitarist", "Team up with a local photographer for live shots"]
    },
    lyric: { lines: ["I left my porch light burning, burning all night long,", "Yeah, I left my porch light burning, burning all night long,", "You said you'd find your way back, baby, but the morning came and gone."], note: "Classic AAB form: say it, say it again harder, then the twist." }
  });

  /* ============ HIP-HOP / RAP ============ */
  add({
    id: "hiphop", name: "Hip-Hop / Rap", aka: "boom bap, trap, conscious", bpm: "70–100 (trap ~130–150 written double-time)",
    blurb: "Rhythm, words, and voice. The beat is the canvas; your flow is the paint.",
    sing: {
      intro: "Rapping is rhythm first. Breath control, clear diction, and sitting 'in the pocket' of the beat matter more than having a big voice. Melodic rap adds singing on top.",
      techniques: [
        ["Pocket and flow", "Choose where your syllables land: on the beat, between beats, or triplets. Changing flow between sections keeps a verse interesting."],
        ["Breath control", "Plan breath spots in your written bars. Take quick 'catch breaths' at commas, not mid-word."],
        ["Multisyllabic rhyme", "Rhyme groups of syllables (e.g. 'broken promise' / 'open honest'), not just the last word."],
        ["Ad-libs and doubles", "Short shouts or echoes between lines, and doubled key words, add energy."]
      ],
      classic: [
        ["Eric B. & Rakim", "Paid in Full", "Calm, controlled delivery with complex internal rhymes."],
        ["Nas", "N.Y. State of Mind", "Dense internal rhymes over a sparse, dark beat."],
        ["The Notorious B.I.G.", "Juicy", "Effortless, conversational flow that rides the beat."],
        ["Lauryn Hill", "Doo Wop (That Thing)", "Switching between rapping and singing in one song."]
      ],
      modern: [
        ["Kendrick Lamar", "HUMBLE.", "Punchy, clipped phrasing that plays with the beat's gaps."],
        ["J. Cole", "No Role Modelz", "Storytelling flow and relaxed confidence."],
        ["Megan Thee Stallion", "Savage", "Precise, rhythmic delivery and strong ad-libs."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "stacc", "hum"],
      extra: [{ name: "Tongue twisters to a metronome", icon: "stacc", count: "'Red leather, yellow leather' × 8 at 80 → 90 → 100 BPM", time: "3 min", how: "Stay crisp at each tempo before speeding up. Clarity over speed." }, { name: "Breath-mark read", icon: "breath", count: "1 verse with breaths marked by a slash", time: "2 min", how: "Rap your verse once at half speed exactly as marked. Adjust marks that feel rushed." }],
      drills: ["rapping a verse to a metronome, then to the beat, with breaths marked", "flow switch: rap the same 4 bars in straight 8ths, then 16ths, then triplets"],
      health: ["Long sessions of loud ad-libs tire your voice quickly. Record ad-libs last, after the main verse is done."],
      grit: "Aggressive delivery comes from support and attitude, not throat squeeze. Shout from the belly at a medium volume and let the mic and compression do the rest.",
      mistakes: ["Writing bars too wordy to breathe in.", "Rapping on top of the beat with no rhythm variation.", "Mumbling the hook: the hook needs to be the clearest part.", "Ignoring the mic: stand a fist's distance back and stay consistent."]
    },
    beats: {
      intro: "Hip-hop beats are built around drums and a loop: a sample, keys, or a melody, plus bass. Boom bap is punchy and swung; trap uses rolling hi-hats and 808 bass.",
      bpm: "Boom bap 85–95 · modern trap 130–150 (feels half-time) · lofi rap 75–90", keys: "Minor keys dominate: C#m, Fm, Gm, Am", scales: "Natural minor, harmonic minor (dark), Dorian (jazzy)",
      progs: [
        { name: "Dark minor loop", chords: "Fm Db Bbm C", roman: "i – bVI – iv – V", feel: "Cinematic tension" },
        { name: "Boom bap jazz", chords: "Dm9 G13 Cmaj9 Am7", roman: "ii – V – I – vi", feel: "Dusty, sampled" },
        { name: "Two-chord trap", chords: "Am F", roman: "i – bVI", feel: "Hypnotic, leaves space" }
      ],
      drums: { name: "Boom bap", bpm: 90, swing: 0.56, rows: { hat: "x-x-x-x-x-x-x-x-", snare: "----X-------X---", kick: "x-------x-x-----" }, note: "A small amount of swing makes it nod. Try moving the second kick around to change the bounce." },
      sounds: ["Punchy kick and crisp snare (layer a clap on the snare)", "Sampled loop: soul, jazz, or keys (only clear samples you have rights to, or use royalty-free packs)", "808 or sub bass", "Rolling hi-hats (16ths and 32nds) for trap"],
      daw: [
        "Open BandLab, GarageBand, or LMMS. Set 90 BPM and add some swing (55–58%).",
        "Program the boom bap pattern for 2 bars and loop it.",
        "Add a keys or pad track playing the boom bap jazz chords, one chord per bar.",
        "Add a bass following the root notes. For trap, use an 808 with a long tail and glide.",
        "Make an 8-bar intro, 16-bar verse, 8-bar hook. Drop the drums for 1 bar before the hook.",
        "Export a WAV and rap over it."
      ]
    },
    produce: {
      bpm: 90,
      structure: [["Intro", 4], ["Hook", 8], ["Verse 1", 16], ["Hook", 8], ["Verse 2", 16], ["Hook", 8], ["Outro", 4]],
      arrangement: ["Hook first is common: hook in the first 30 seconds.", "Drop elements (drums out, filter on the loop) right before the hook.", "Add a counter-melody or new percussion in verse 2 to keep it fresh."],
      mix: ["Vocal loud and upfront; the beat makes room for it.", "Kick and 808 must not fight; sidechain or tune them.", "Ad-libs panned slightly left/right and quieter."],
      eq: { sub: "808 and kick body. Check on headphones and a phone speaker.", bass: "Kick punch; cut boxiness on samples.", uppermid: "Vocal clarity: rap must be understood.", air: "Hi-hat shimmer; tame harshness." },
      reference: "Loud, clear vocal over hard drums; low end you feel in the car."
    },
    promote: {
      platforms: ["TikTok and Reels (8–15 second verse clips)", "YouTube (music videos, freestyles)", "SoundCloud", "Audiomack (popular for rap)"],
      communities: ["Local cyphers and open mics", "Producer and rapper Discords", "Beat battles and online verse challenges"],
      content: ["Freestyle over a fan-suggested beat", "Writing process: show the lyric notebook", "Verse challenge on a hot instrumental (with permission/free beats)"],
      visual: "A clear persona: consistent color, logo, and photo style. Cover art should read at thumbnail size.",
      collabs: ["Feature swap with an artist at your level", "Work with one producer on a full EP for a cohesive sound", "Shoot videos with local videographers"]
    },
    lyric: { lines: ["Corner of the block where the streetlight hums,", "counting every step 'til the morning comes,", "they said keep it small, I said watch it grow,", "every closed door's just a place to go."], note: "Internal rhyme (block/clock vibes), a clear rhythm of 10–11 syllables per bar." }
  });

  /* ============ POP ============ */
  add({
    id: "pop", name: "Pop", aka: "mainstream, dance-pop, bedroom pop", bpm: "95–128",
    blurb: "Catchy, clean, and built around a hook you can't stop humming.",
    sing: {
      intro: "Pop vocals are intimate and precise: clear words, a consistent tone, and a hook that's easy to sing along to. Many pop singers use a light, breathy tone in verses and a bright mix in the chorus.",
      techniques: [
        ["Mixed voice", "A blend of chest and head voice that lets you sing high without shouting. Practice smooth slides across your break."],
        ["Breathy intimacy", "A touch of air in the tone for verses; sing close to the mic at a lower volume."],
        ["Vocal stacks", "Record the chorus 2–4 times and layer them, plus harmonies a 3rd above."],
        ["Small runs and flips", "Quick, clean decorations at the ends of phrases, never at the expense of the melody."]
      ],
      classic: [
        ["Michael Jackson", "Billie Jean", "Rhythmic, percussive delivery and vocal hiccups as part of the groove."],
        ["Whitney Houston", "I Will Always Love You", "Quiet, unaccompanied opening, then the dramatic key change into the final chorus."],
        ["Madonna", "Like a Prayer", "Pop meets gospel choir in the chorus."]
      ],
      modern: [
        ["Billie Eilish", "bad guy", "Whispery, close-mic vocal and stacked harmonies."],
        ["Dua Lipa", "Levitating", "Warm low register and a rhythmic, disco-style hook."],
        ["Olivia Rodrigo", "drivers license", "Soft verses building to a raw, belted bridge."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "siren", "octave", "vowels", "straw"],
      extra: [{ name: "Hook repeat", icon: "vowel", count: "Sing your hook 5× quietly, 5× full", time: "2 min", how: "Same pitch, same tone, every time. Consistency is the pop skill." }],
      drills: ["mixed-voice slides on 'nay' across your break", "stack practice: sing the chorus twice and match timing exactly"],
      health: ["Pop sessions often involve many takes; take a 5-minute break every 30 minutes."],
      grit: "Pop rarely needs distortion. For a 'cry' or edge in a bridge, use a light vocal fry onset rather than throat squeeze.",
      mistakes: ["Too many runs that hide the melody.", "Singing louder instead of closer to the mic in quiet parts.", "Doubles that don't match timing, making the chorus messy.", "Pushing chest voice too high instead of mixing."]
    },
    beats: {
      intro: "Pop production is polished and hook-driven: tight drums, a strong bass line, and a memorable synth or guitar part.",
      bpm: "Ballads 70–90 · mid-tempo 95–110 · dance-pop 115–128", keys: "Any; major keys feel bright, minor for darker pop", scales: "Major, natural minor, pentatonic for hooks",
      progs: [
        { name: "The 'four chords'", chords: "C G Am F", roman: "I – V – vi – IV", feel: "Instantly familiar" },
        { name: "Sad-pop loop", chords: "Am F C G", roman: "vi – IV – I – V", feel: "Emotional, driving" },
        { name: "Dreamy lift", chords: "Fmaj7 G Em7 Am", roman: "IV – V – iii – vi", feel: "Floaty pre-chorus" }
      ],
      drums: { name: "Dance-pop", bpm: 118, swing: 0, rows: { open: "--x---x---x---x-", hat: "x-x-x-x-x-x-x-x-", clap: "----X-------X---", kick: "x---x---x---x---" }, note: "Four-on-the-floor kick with open hats on the off-beats. For mid-tempo pop, use a kick on 1 and the '&' of 2." },
      sounds: ["Clean synth plucks and pads", "Punchy kick, snappy clap", "Synth bass or picked bass guitar", "Vocal chops as an instrumental hook"],
      daw: [
        "Set 118 BPM. Program the dance-pop beat for 2 bars.",
        "Add a pad playing 'C G Am F', one chord per bar.",
        "Write a 2-bar synth hook using notes from C major pentatonic (C D E G A).",
        "Add a bass line following the roots in 8th notes.",
        "Build sections: verse (kick + bass + pad), pre (add hats, rising), chorus (everything + hook).",
        "Add a riser or a 1-beat drop before the chorus."
      ]
    },
    produce: {
      bpm: 118,
      structure: [["Intro", 4], ["Verse 1", 8], ["Pre-chorus", 4], ["Chorus", 8], ["Verse 2", 8], ["Pre-chorus", 4], ["Chorus", 8], ["Bridge", 8], ["Final chorus", 8], ["Outro", 4]],
      arrangement: ["Get to the chorus in under a minute.", "Make the post-chorus a hook too (vocal chop or chant).", "Strip back the bridge, then go bigger in the last chorus (key change, extra layers)."],
      mix: ["Vocals bright, upfront, and tuned gently.", "Strong low end but clean; sidechain the bass to the kick.", "Wide stereo for pads and backing vocals; lead vocal centered."],
      eq: { bass: "Kick and bass separated; sidechain helps.", lowmid: "Cut mud on vocals and pads (200–400 Hz).", presence: "Vocal sparkle.", air: "Gentle high-shelf for polish." },
      reference: "Glossy and loud, with the vocal always the star."
    },
    promote: {
      platforms: ["TikTok and Reels (hook snippets, behind-the-song)", "YouTube Shorts and lyric videos", "Spotify (pitch to playlists through your distributor)", "Instagram"],
      communities: ["Songwriting Discords and co-write groups", "Reddit songwriting and singer communities", "Local songwriter rounds"],
      content: ["Post the hook before release and ask which version people prefer", "Acoustic version of your song", "Covers of trending songs with your twist"],
      visual: "Clean and colorful (or deliberately moody). Pick 2–3 brand colors and use them everywhere.",
      collabs: ["Duet with another singer on TikTok", "Co-write sessions", "Remix swaps with producers"]
    },
    lyric: { lines: ["You left your hoodie on my chair,", "now every room smells like you're there,", "I tell my friends I'm doing fine,", "but I still check my phone at nine."], note: "Specific, everyday details make pop lyrics feel personal." }
  });

  /* ============ OPERA / CLASSICAL VOICE ============ */
  add({
    id: "opera", name: "Opera / Classical Voice", aka: "arias, art song, choral", bpm: "Tempo markings: Largo to Allegro",
    blurb: "Unamplified singing that fills a hall. The most technical style here, and the best foundation for any voice.",
    sing: {
      intro: "Classical singers project over an orchestra without microphones. That takes a low, steady breath, a tall open throat, and a resonant tone that carries. Progress is slow and steady; a qualified teacher matters most in this style.",
      techniques: [
        ["Appoggio (breath support)", "Keep the ribs gently expanded while you sing, so the air releases slowly and evenly rather than collapsing."],
        ["Open throat & low larynx", "The feeling of the start of a yawn: soft palate lifted, throat relaxed, never pressed down."],
        ["Chiaroscuro tone", "Italian for 'bright-dark': a balance of ring (brightness) and warmth (depth) in every note."],
        ["Legato", "Connect notes like a bowed violin. Vowels carry the line; consonants are quick and clear."],
        ["Vibrato", "A natural, even pulse that appears when the voice is free. Don't fake it; let it emerge."]
      ],
      classic: [
        ["Luciano Pavarotti", "Nessun dorma (Puccini, Turandot)", "The final sustained high note on 'Vincerò!'"],
        ["Maria Callas", "Casta diva (Bellini, Norma)", "Long, floating legato lines and dramatic color."],
        ["Leontyne Price", "Vissi d'arte (Puccini, Tosca)", "A rich, gleaming tone that stays even top to bottom."],
        ["Renée Fleming", "Song to the Moon (Dvořák, Rusalka)", "Creamy legato and soft high notes."]
      ],
      modern: [
        ["Jonas Kaufmann", "Tenor arias by Puccini and Verdi", "Dark, baritonal tenor color."],
        ["Pretty Yende", "Bel canto arias (Bellini, Donizetti)", "Agile coloratura: fast, clean runs."],
        ["Lawrence Brownlee", "Rossini tenor arias", "Light, flexible high tenor singing."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "hum", "scale5", "vowels", "octave"],
      extra: [{ name: "Messa di voce", icon: "breath", count: "Hold one note: soft → loud → soft, 8 counts each way × 5 notes", time: "3 min", how: "Grow and shrink the sound without the pitch or tone changing. A classic exercise for control." }, { name: "Italian vowel line", icon: "vowel", count: "'i-e-a-o-u' on a 5-tone scale × 6 keys", time: "3 min", how: "Pure Italian vowels: ee, eh, ah, oh, oo. Keep the throat shape open on all of them." }],
      drills: ["messa di voce and slow legato scales", "learning one Italian art song (e.g. from the '24 Italian Songs and Arias' book) phrase by phrase"],
      health: ["Classical voices develop slowly. Avoid heavy repertoire too early; ask a teacher about your voice type (Fach) before choosing arias."],
      grit: "Classical singing avoids distortion entirely. If you hear rasp or feel scratchiness, rest and check your technique with a teacher.",
      mistakes: ["Pressing the larynx down to sound 'operatic' (it makes the tone wobbly and dark).", "Singing too loud too soon; resonance carries, volume doesn't.", "Choosing arias that are too heavy for your voice.", "Ignoring language and diction study."]
    },
    beats: {
      intro: "Instead of beats, classical singers practice with piano accompaniment or orchestral backing tracks. You can make these in a free DAW or notation app.",
      bpm: "Largo ~40–60 · Adagio ~66–76 · Andante ~76–108 · Allegro ~120–156 (approximate)", keys: "Arias come in set keys; art songs are often published in high, medium, and low versions", scales: "Major and minor, chromatic for runs",
      progs: [
        { name: "Perfect cadence", chords: "C F G7 C", roman: "I – IV – V7 – I", feel: "Final, resolved" },
        { name: "Pre-dominant cadence", chords: "Am Dm G7 C", roman: "vi – ii – V7 – I", feel: "Classic approach to the home key" },
        { name: "Minor lament", chords: "Am E7 Am Dm E7 Am", roman: "i – V7 – i – iv – V7 – i", feel: "Tragic aria color" }
      ],
      drums: { name: "Orchestral pulse (timpani & low strings)", bpm: 72, swing: 0, rows: { strings: "x---x---x---x---", timpani: "x-------x-------" }, note: "Not drums but a pulse: low strings on every beat, timpani on 1 and 3. Useful for practicing steady tempo." },
      sounds: ["Concert grand piano", "String ensemble", "Woodwinds for color", "Timpani for drama"],
      daw: [
        "Get MuseScore (free notation) or any free DAW, and a free orchestral library such as Spitfire LABS.",
        "Enter the piano part of your piece, or play it in with a MIDI keyboard.",
        "Set the tempo to match the marking (e.g. Andante around 80).",
        "Add tempo changes where the music slows (ritardando) so you can practice them.",
        "Export the accompaniment as audio and practice with it daily.",
        "Record yourself and compare with a professional recording."
      ]
    },
    produce: {
      bpm: 72,
      structure: [["Introduction (piano/orchestra)", 4], ["A section", 16], ["B section (contrast)", 16], ["A section returns, ornamented", 16], ["Cadenza", 2], ["Coda", 4]],
      arrangement: ["Many arias use A-B-A form (da capo): the return of A is decorated by the singer.", "The accompaniment breathes with the singer; tempos stretch at phrase ends.", "A cadenza is a free, solo passage before the final cadence."],
      mix: ["Record in a room with natural reverb, mic at a distance (1–2 m) to capture the voice blooming.", "Very little compression; let the dynamics live.", "Hall reverb rather than plate or delay."],
      eq: { mid: "The voice's body and vowel color.", uppermid: "The 'singer's formant' around 2.5–3.5 kHz is the ring that cuts through an orchestra.", air: "Room and breath; keep natural." },
      reference: "Like a seat in a concert hall: natural, spacious, dynamic."
    },
    promote: {
      platforms: ["YouTube (performances and lessons)", "Instagram (short arias, behind-the-scenes)", "Local concert listings and church music programs"],
      communities: ["Community choirs and opera workshops", "University and conservatory open masterclasses", "Classical singing forums and competitions for young singers"],
      content: ["'One aria, three languages' or translation videos", "Practice-room diaries showing progress", "Explaining what an aria is about before singing it"],
      visual: "Elegant and minimal: concert black, warm light, serif type.",
      collabs: ["Partner with a pianist for recitals", "Sing with local orchestras or choirs", "Collaborate with a crossover/pop artist for something unexpected"]
    },
    lyric: { lines: ["O silent lamp above the harbor,", "hold your light a moment more;", "the sea has kept my heart a stranger,", "guide it gently home to shore."], note: "Classical-style text: long open vowels ('o', 'ah', 'more') that are easy to sustain." }
  });

  /* ============ R&B / SOUL ============ */
  add({
    id: "rnb", name: "R&B / Soul", aka: "classic soul, neo-soul, alt-R&B", bpm: "60–100",
    blurb: "Feeling, groove, and voice. From church-rooted soul to smooth modern R&B.",
    sing: {
      intro: "R&B and soul singing put emotion and tone first. Runs and riffs decorate the melody, falsetto adds softness, and grit adds intensity, all riding a groove.",
      techniques: [
        ["Runs and riffs (melisma)", "Several notes on one syllable. Learn them slowly from the pentatonic scale, then speed up."],
        ["Falsetto and head voice", "Light, airy high notes for tenderness. Practice smooth switches between chest and falsetto."],
        ["Behind-the-beat phrasing", "Relax a phrase so it lands a hair late; it feels smooth and laid-back."],
        ["Ad-libs", "Improvised lines around the main melody, especially in the last chorus."]
      ],
      classic: [
        ["Aretha Franklin", "Respect", "Call-and-response with the backing singers and the spelled-out hook."],
        ["Marvin Gaye", "What's Going On", "Smooth, layered vocals and a relaxed, conversational melody."],
        ["Al Green", "Let's Stay Together", "Effortless falsetto and soft dynamics."],
        ["Stevie Wonder", "Superstition", "Rhythmic, funky phrasing locked to the clavinet riff."]
      ],
      modern: [
        ["SZA", "Snooze", "Relaxed, conversational melody with soft runs."],
        ["Daniel Caesar", "Get You (feat. Kali Uchis)", "Gentle falsetto and warm harmonies."],
        ["H.E.R.", "Focus", "Breathy, controlled tone and subtle riffs."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "siren", "scale5", "octave", "straw"],
      extra: [{ name: "Pentatonic run builder", icon: "scale", count: "5-note pentatonic down on 'ah' at 60 → 80 → 100 BPM (16ths)", time: "3 min", how: "Slow and clean first. Every note should be audible when you slow the recording down." }],
      drills: ["runs at slow tempo with a metronome, speeding up 5 BPM at a time", "chest-to-falsetto flips on one vowel"],
      health: ["Runs tire the voice when pushed. Keep them light and stop when they get sloppy."],
      grit: "Soul grit should be light and supported, used on peak moments. Practice quietly and never force it.",
      mistakes: ["Runs everywhere: the melody gets lost.", "Sloppy, too-fast runs (slow them down until clean).", "Copying a singer's tone instead of finding yours.", "Ignoring dynamics: R&B needs quiet moments."]
    },
    beats: {
      intro: "R&B beats are smooth and spacious: warm keys, deep bass, crisp but soft drums, and lots of room for the vocal.",
      bpm: "Slow jam 60–75 · mid-tempo 80–100 · neo-soul with swing 80–95", keys: "Eb, Ab, Db, F minor and their relatives", scales: "Major/minor pentatonic, Dorian, lots of 7th and 9th chords",
      progs: [
        { name: "Neo-soul ii–V–I", chords: "Ebm9 Ab13 Dbmaj9 Bbm7", roman: "ii9 – V13 – Imaj9 – vi7", feel: "Lush and warm" },
        { name: "Slow jam loop", chords: "Fmaj7 Em7 Dm7 Cmaj7", roman: "IVmaj7 – iii7 – ii7 – Imaj7", feel: "Descending, romantic" },
        { name: "Modern R&B", chords: "Am7 Dm7 Gmaj7 Cmaj7", roman: "vi7 – ii7 – V – I (in C)", feel: "Moody and smooth" }
      ],
      drums: { name: "Laid-back R&B", bpm: 80, swing: 0.58, rows: { hat: "x-x-x-xxx-x-x-x-", rim: "------x-------x-", snare: "----X-------X---", kick: "x--x------x-----" }, note: "Gentle swing, syncopated kick, and a rimshot ghost note. Play quietly." },
      sounds: ["Rhodes or Wurlitzer electric piano", "Warm sub bass or fingered bass", "Soft snare, finger snaps", "Lush pads and guitar licks"],
      daw: [
        "Set 80 BPM and swing ~58%.",
        "Program the laid-back beat and loop 4 bars.",
        "Add a Rhodes-style instrument playing the neo-soul progression (one chord per bar).",
        "Add bass playing roots with a few passing notes.",
        "Add a pad underneath and a short guitar lick at the end of every 4 bars.",
        "Leave the mids clear for the vocal."
      ]
    },
    produce: {
      bpm: 80,
      structure: [["Intro", 4], ["Verse 1", 16], ["Pre-chorus", 4], ["Chorus", 8], ["Verse 2", 16], ["Pre-chorus", 4], ["Chorus", 8], ["Bridge", 8], ["Chorus + ad-libs", 8], ["Outro", 8]],
      arrangement: ["Stack backing vocals and harmonies in the chorus.", "Save the biggest ad-libs for the last chorus and outro.", "A key change or a breakdown in the bridge adds emotion."],
      mix: ["Warm, smooth vocal with plate reverb and a slapback.", "Deep but soft low end.", "Backing vocals wide; lead centered."],
      eq: { sub: "Smooth sub-bass; avoid boom.", lowmid: "Warmth for keys; clear mud from vocals.", presence: "Vocal silkiness; de-ess carefully.", air: "A soft high shelf on vocals." },
      reference: "Warm, intimate, and polished, like the singer is in the room."
    },
    promote: {
      platforms: ["TikTok and Reels (vocal runs, covers)", "YouTube (live sessions, covers)", "Spotify playlists (pitch via your distributor)", "SoundCloud"],
      communities: ["Open mics and R&B nights", "Singer Discords and harmony challenges", "Gospel and church music circles (many R&B singers start there)"],
      content: ["Car or bedroom vocal covers", "Harmony stacks: layer yourself in split screen", "Slow-motion run tutorials"],
      visual: "Moody warmth: soft lighting, rich colors, film grain.",
      collabs: ["Duets with other singers", "Features with rappers", "Producers who make R&B beats"]
    },
    lyric: { lines: ["Slow it down, the night's not going anywhere,", "candle light is dancing in your hair,", "say my name the way you did before,", "I'll pretend I didn't hear it, just to hear it more."], note: "Long vowels on 'there', 'hair', 'more' give room for runs." }
  });

  /* ============ COUNTRY ============ */
  add({
    id: "country", name: "Country", aka: "classic, outlaw, modern country", bpm: "70–130",
    blurb: "Storytelling songs with twang, heart, and a great hook.",
    sing: {
      intro: "Country singing is conversational: you're telling a story. Clear words, a touch of twang, and small vocal 'cries' make it feel personal.",
      techniques: [
        ["Twang", "A bright, slightly nasal-sounding resonance that helps the voice cut through. Try saying 'nyeah' like a bratty kid, then sing with that brightness."],
        ["Vocal cry / break", "A small flip into head voice on emotional words (a classic country sound)."],
        ["Conversational phrasing", "Sing it like you'd say it. Natural speech rhythms carry the story."],
        ["Harmony singing", "Close harmonies, often a 3rd above, especially in choruses."]
      ],
      classic: [
        ["Patsy Cline", "Crazy", "Smooth, controlled tone with small emotional breaks."],
        ["Dolly Parton", "Jolene", "Repeating the name with growing urgency over fingerpicked guitar."],
        ["Johnny Cash", "Folsom Prison Blues", "Deep, spoken-sung storytelling with a train-beat rhythm."],
        ["Willie Nelson", "On the Road Again", "Relaxed phrasing, often sung slightly off the beat."]
      ],
      modern: [
        ["Chris Stapleton", "Tennessee Whiskey", "Soulful, gritty power within a country song."],
        ["Kacey Musgraves", "Slow Burn", "Soft, intimate tone and clever lyrics."],
        ["Zach Bryan", "Something in the Orange", "Raw, unpolished emotion and storytelling."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "hum", "siren", "vowels"],
      extra: [{ name: "Bratty 'nyeah'", icon: "vowel", count: "5-tone scale on 'nyeah' × 6 keys", time: "2 min", how: "Bright, forward sound. Keep it light; twang is resonance, not volume." }, { name: "Yodel flip", icon: "siren", count: "Chest 'oh' → head 'ee' flips × 8", time: "1 min", how: "Practice a clean, quick break between registers. Start quiet." }],
      drills: ["storytelling read: speak the lyric, then sing it with the same rhythm", "twang scales and gentle cry-breaks"],
      health: ["Twang is efficient, but too much nasal squeeze can tire you; balance it with open vowels."],
      grit: "Country grit (think Stapleton) is a resonance color on a supported tone. Keep volume moderate while learning.",
      mistakes: ["Faking an accent instead of finding your natural voice.", "Rushing through the story; let words land.", "Over-twanging every line.", "Melodies too complex for the story."]
    },
    beats: {
      intro: "Country backing is usually live instruments: acoustic and electric guitar, bass, drums, plus fiddle, steel guitar, or banjo.",
      bpm: "Ballads 70–85 · mid-tempo 90–110 · up-tempo/train beat 120–140", keys: "G, D, A, E, C (capo-friendly)", scales: "Major, major pentatonic, Mixolydian",
      progs: [
        { name: "Classic three-chord", chords: "G C D G", roman: "I – IV – V – I", feel: "Honky-tonk" },
        { name: "Modern country", chords: "G D Em C", roman: "I – V – vi – IV", feel: "Radio anthem" },
        { name: "Ballad with a twist", chords: "D A/C# Bm G", roman: "I – V/3 – vi – IV", feel: "Descending bass, emotional" }
      ],
      drums: { name: "Train beat", bpm: 120, swing: 0, rows: { snare: "xxxxXxxxxxxxXxxx", kick: "x-------x-------" }, note: "Soft 16ths on the snare with accents on 2 and 4, like a train. Use brushes for a softer feel." },
      sounds: ["Acoustic guitar (strummed or fingerpicked)", "Telecaster-style electric with twang", "Pedal steel or fiddle for answers", "Upright or electric bass"],
      daw: [
        "Set 120 BPM. Program the train beat or record a simple 2-and-4 snare with brushes.",
        "Record an acoustic guitar strumming G C D G (or use a free acoustic guitar instrument).",
        "Add a bass playing root and fifth on beats 1 and 3 (the 'boom-chick').",
        "Add a lead instrument (steel or fiddle sound) filling gaps between vocal lines.",
        "Build: verse with just guitar and bass, chorus with full drums and harmony.",
        "Bounce and sing over it."
      ]
    },
    produce: {
      bpm: 110,
      structure: [["Intro", 4], ["Verse 1", 16], ["Chorus", 8], ["Verse 2", 16], ["Chorus", 8], ["Bridge", 8], ["Chorus", 8], ["Tag/Outro", 4]],
      arrangement: ["The story drives everything; each verse reveals something new.", "The chorus usually holds the title line.", "A final chorus twist (the title line takes on a new meaning) is a country trademark."],
      mix: ["Vocal clear and forward.", "Acoustic guitar bright, not boomy.", "Natural reverb; modern country can be quite polished."],
      eq: { bass: "Tight kick and bass; not too heavy.", lowmid: "Cut boom from acoustic guitar (~200 Hz).", uppermid: "Twang and vocal clarity.", air: "Acoustic guitar shimmer." },
      reference: "Clean and warm, with every word of the story easy to hear."
    },
    promote: {
      platforms: ["TikTok (country has a huge TikTok audience)", "YouTube", "Instagram Reels", "Local country radio"],
      communities: ["Songwriter rounds and writers' nights", "Bars and honky-tonks with live music", "Country songwriting groups online"],
      content: ["Tailgate or porch performances", "The real story behind the song", "Duets and harmony videos"],
      visual: "Authentic and outdoors: natural light, landscapes, denim and wood tones.",
      collabs: ["Co-writing (country is very co-write driven)", "Duets", "Local fairs and festival stages"]
    },
    lyric: { lines: ["Mama's old Ford still smells like rain,", "and the radio only plays one station,", "I drove it past the county line today,", "and it felt a lot like graduation."], note: "Specific, visual details and a twist in the last line." }
  });

  /* ============ JAZZ ============ */
  add({
    id: "jazz", name: "Jazz", aka: "swing, standards, bebop, vocal jazz", bpm: "60–240+",
    blurb: "Swing, improvisation, and the Great American Songbook.",
    sing: {
      intro: "Jazz singers treat the voice like an instrument: playing with rhythm, reshaping melodies, and improvising (scat). Lyrics are interpreted, not just sung.",
      techniques: [
        ["Swing feel", "8th notes are played long-short. Accent beats 2 and 4."],
        ["Behind the beat", "Lay back and float over the rhythm section; catch up at the phrase end."],
        ["Scat", "Improvised syllables ('doo-bee-dah', 'shoo-bah') that mimic horn lines. Start by scatting the melody, then vary it."],
        ["Melodic interpretation", "Change rhythms and a few notes of a standard to make it your own."]
      ],
      classic: [
        ["Ella Fitzgerald", "How High the Moon (live in Berlin, 1960)", "Long scat solo full of quotes from other songs."],
        ["Billie Holiday", "God Bless the Child", "Behind-the-beat phrasing and storytelling."],
        ["Sarah Vaughan", "Misty", "Rich tone and wide range."],
        ["Frank Sinatra", "Fly Me to the Moon", "Swinging phrasing and clear diction with a big band."]
      ],
      modern: [
        ["Gregory Porter", "Liquid Spirit", "Warm baritone with gospel and soul roots."],
        ["Samara Joy", "Linger Awhile (album)", "Classic jazz tone with modern clarity."],
        ["Norah Jones", "Don't Know Why", "Soft, intimate jazz-pop delivery."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "hum", "scale5", "vowels"],
      extra: [{ name: "Arpeggio scat", icon: "scale", count: "1-3-5-7-5-3-1 on 'doo-bee-doo' over Cmaj7, Dm7, G7", time: "3 min", how: "Know the chord tones; scatting is built on them." }],
      drills: ["swing 8ths: sing scales long-short with a metronome on 2 and 4", "scat 4-bar phrases over a ii–V–I backing track"],
      health: ["Late-night gigs are common; keep regular sleep and hydrate between sets."],
      grit: "Jazz rarely uses distortion. Use tone color and dynamics instead.",
      mistakes: ["Straight 8ths instead of swing.", "Scatting random syllables with no shape.", "Over-ornamenting the melody until it's lost.", "Not knowing the original melody before changing it."]
    },
    beats: {
      intro: "Jazz backing is a rhythm section: piano or guitar, upright bass, and drums with ride cymbal. You can practice with play-along tracks or build your own in a DAW.",
      bpm: "Ballad 50–80 · medium swing 120–160 · up-tempo/bebop 200+", keys: "Bb, Eb, F, C (horn-friendly)", scales: "Major, Dorian, Mixolydian, bebop scales, blues",
      progs: [
        { name: "ii–V–I in C", chords: "Dm7 G7 Cmaj7 Cmaj7", roman: "ii7 – V7 – Imaj7", feel: "The core jazz move" },
        { name: "Turnaround", chords: "Cmaj7 A7 Dm7 G7", roman: "I – VI7 – ii – V", feel: "Loops back to the top" },
        { name: "Minor ii–V–i", chords: "Bm7b5 E7 Am7 Am7", roman: "iiø7 – V7 – i", feel: "Dark, bluesy" }
      ],
      drums: { name: "Swing ride pattern", bpm: 140, swing: 0.66, rows: { ride: "x---x-x-x---x-x-", hat: "----x-------x---" }, note: "'Ding, ding-a, ding, ding-a': quarter notes on the ride with swung skips. Hi-hat pedal on 2 and 4." },
      sounds: ["Acoustic piano voicing rootless chords", "Upright bass walking quarter notes", "Drum kit with ride and brushes", "Horn lines: trumpet, sax"],
      daw: [
        "Set 140 BPM, swing 66%.",
        "Program the ride pattern with hi-hat on 2 and 4.",
        "Add a walking bass: 4 quarter notes per bar, starting on each chord's root.",
        "Add piano 'comping' (short chords) on off-beats.",
        "Loop a 32-bar AABA form and practice singing the melody, then scatting a chorus.",
        "Try free play-along apps or iReal-style chord charts as a reference."
      ]
    },
    produce: {
      bpm: 140,
      structure: [["Intro", 4], ["Head (A)", 8], ["A", 8], ["B (bridge)", 8], ["A", 8], ["Solos", 32], ["Head out", 32], ["Tag ending", 4]],
      arrangement: ["32-bar AABA form is the classic standard.", "Singer takes the head, then instruments solo, then singer returns.", "Tag endings repeat the last line 2–3 times."],
      mix: ["Natural and dynamic: little compression.", "Voice in a realistic room.", "Stereo like a stage: drums center, piano slightly left, bass center."],
      eq: { bass: "Upright bass warmth.", mid: "Piano body and vocal warmth.", air: "Ride cymbal shimmer and brush detail." },
      reference: "Live-in-the-room: like a trio playing in a small club."
    },
    promote: {
      platforms: ["YouTube (live sets)", "Instagram", "Bandcamp", "Local jazz radio"],
      communities: ["Jazz jams (bring charts in your key)", "School and community big bands", "Jazz clubs' open nights"],
      content: ["One standard, three ways (ballad, swing, bossa)", "Scat lesson clips", "Late-night live session"],
      visual: "Classic and elegant: black & white photos, vintage type.",
      collabs: ["Trio or quartet gigs", "Sit-ins at jams", "Crossover with hip-hop or R&B producers"]
    },
    lyric: { lines: ["The coffee's cold, the record's slow,", "the city hums a melody I used to know,", "you said 'just one more song' an hour ago,", "and the moon agreed, so on we go."], note: "Conversational, a little witty, with internal rhyme." }
  });

  /* ============ GOSPEL ============ */
  add({
    id: "gospel", name: "Gospel", aka: "traditional, contemporary, choir", bpm: "60–140",
    blurb: "Powerful, joyful, communal singing, and the training ground for countless soul and R&B voices.",
    sing: {
      intro: "Gospel singing is full-bodied and expressive, built on strong chest voice, call-and-response with a choir, runs, and the 'vamp' that keeps building.",
      techniques: [
        ["Chest-dominant belt", "A big, supported, speech-like sound. Strength comes from breath and resonance, not shouting."],
        ["Vamps", "A short phrase repeated while intensity builds, often with key changes."],
        ["Call and response", "The lead sings a line, the choir answers. Leave space for the answer."],
        ["Runs and riffs", "Quick melodic decorations, usually from the pentatonic or blues scale."]
      ],
      classic: [
        ["Mahalia Jackson", "How I Got Over", "Huge, sustained chest tone and deep conviction."],
        ["Aretha Franklin", "Amazing Grace (live album, 1972)", "Slow, building intensity with the choir behind her."],
        ["The Clark Sisters", "You Brought the Sunshine", "Tight harmonies and vocal runs."],
        ["Andraé Crouch", "Soon and Very Soon", "Joyful choir-led contemporary gospel."]
      ],
      modern: [
        ["CeCe Winans", "Goodness of God", "Warm, controlled worship singing."],
        ["Tasha Cobbs Leonard", "Break Every Chain", "A long build from soft to full power."],
        ["Maverick City Music", "Jireh (with Elevation Worship)", "Modern worship with spontaneous vamps."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "siren", "scale5", "octave", "stacc"],
      extra: [{ name: "Vamp builder", icon: "scale", count: "Repeat one 2-bar phrase 8×, moving up a half step every 2 reps", time: "3 min", how: "Practice rising key changes without pushing. Keep the shoulders and jaw loose." }],
      drills: ["vamp practice with step-up key changes", "riffs over a I–IV–V gospel progression"],
      health: ["Long services and rehearsals add up. Mark (sing lightly) in rehearsal, save full voice for performance."],
      grit: "Gospel grit and 'growls' must sit on strong support. Keep them short and never force them on a tired voice.",
      mistakes: ["Shouting instead of supporting.", "Too many runs in the first verse.", "Ignoring the choir/band; gospel is a conversation.", "Starting too high and having nowhere to build."]
    },
    beats: {
      intro: "Gospel music features organ, piano, bass, drums, and a choir. Rich chords and passing harmonies are the signature sound.",
      bpm: "Worship ballads 60–75 · praise/shout 120–140+", keys: "Ab, Db, Eb, F, Bb (flat keys are common)", scales: "Major, pentatonic, blues; lots of passing chords",
      progs: [
        { name: "Gospel 1–4–5 with passing", chords: "Ab Db/Ab Eb/G Ab", roman: "I – IV/1 – V/7 – I", feel: "Classic praise" },
        { name: "2-5-1 worship", chords: "Bbm7 Eb7 Abmaj7 Fm7", roman: "ii – V – I – vi", feel: "Warm, flowing" },
        { name: "Shout progression", chords: "C C7 F Fm C/G G7 C", roman: "I – I7 – IV – iv – I/5 – V7 – I", feel: "Uptempo church shout" }
      ],
      drums: { name: "Praise groove", bpm: 124, swing: 0.55, rows: { hat: "x-xxx-xxx-xxx-xx", snare: "----X--x----X---", kick: "x-----x-x-----x-" }, note: "Busy hats, ghost snares, and a syncopated kick. Gospel drummers love fills; add one every 4 bars." },
      sounds: ["Hammond organ (with rotary/Leslie effect)", "Acoustic piano", "Electric bass", "Choir pads and stacked vocals"],
      daw: [
        "Set 124 BPM, slight swing.",
        "Program the praise groove; add a fill every 4th bar.",
        "Add organ chords from the 1–4–5 progression.",
        "Add piano doubling the chords an octave higher with rhythmic stabs.",
        "Record or layer 3-part harmonies (low, middle, high) for the choir response.",
        "Build a vamp section at the end: repeat 2 bars, step up a key every 4 repeats."
      ]
    },
    produce: {
      bpm: 124,
      structure: [["Intro", 4], ["Verse", 16], ["Chorus", 8], ["Verse", 16], ["Chorus", 8], ["Bridge", 8], ["Vamp (with key changes)", 16], ["Final chorus", 8]],
      arrangement: ["Builds are everything: start simple, end with full choir and band.", "Step-up key changes during the vamp lift energy.", "Choir answers the lead in call-and-response."],
      mix: ["Lead vocal powerful and upfront.", "Choir wide and warm behind.", "Organ and piano full, but carved around the vocal."],
      eq: { bass: "Solid bass and kick.", lowmid: "Organ warmth; watch for buildup with choir.", uppermid: "Lead vocal presence.", air: "Choir sparkle." },
      reference: "Big church sound: warm, powerful, and uplifting."
    },
    promote: {
      platforms: ["YouTube (live worship videos do very well)", "Facebook (church communities)", "Instagram", "Gospel radio"],
      communities: ["Church choirs and praise teams", "Gospel workshops and conferences", "Community events and fundraisers"],
      content: ["Live worship moments", "Harmony part breakdowns (teach the choir parts)", "Testimony behind the song"],
      visual: "Warm, uplifting light; clean type; real moments with real people.",
      collabs: ["Choirs and praise teams", "Other worship leaders", "Producers blending gospel with R&B or hip-hop"]
    },
    lyric: { lines: ["When the morning finds me tired,", "and the road ahead is long,", "I lift my voice a little higher,", "and the weight becomes a song."], note: "Simple, uplifting lines that a choir can echo." }
  });

  /* ============ REGGAE ============ */
  add({
    id: "reggae", name: "Reggae", aka: "roots, lovers rock, dancehall roots", bpm: "60–90",
    blurb: "Jamaica's laid-back groove: off-beat guitar, heavy bass, and conscious lyrics.",
    sing: {
      intro: "Reggae vocals are relaxed and rhythmic, often sitting behind the beat. Harmony groups, conscious messages, and the 'toasting' style of deejays are all part of the tradition.",
      techniques: [
        ["Laid-back phrasing", "Sing slightly behind the beat. It should feel unhurried."],
        ["Harmony trios", "Classic reggae uses 2–3 part harmonies on the chorus."],
        ["Toasting / deejay style", "Rhythmic, chanted vocals over the riddim, the ancestor of rap."],
        ["Clear message", "Many roots songs carry a message of unity, struggle, or love; deliver it with conviction."]
      ],
      classic: [
        ["Bob Marley & the Wailers", "Redemption Song", "Just voice and acoustic guitar: plain, sincere phrasing."],
        ["Toots and the Maytals", "Pressure Drop", "Gospel-rooted energy and grit."],
        ["Jimmy Cliff", "The Harder They Come", "Bright, soulful delivery."],
        ["Burning Spear", "Marcus Garvey", "Chant-like roots vocals."]
      ],
      modern: [
        ["Chronixx", "Skankin' Sweet", "Modern roots with a smooth, confident tone."],
        ["Koffee", "Toast", "Light, rhythmic, upbeat delivery."],
        ["Protoje", "Who Knows (feat. Chronixx)", "Mix of singing and deejay-style flow."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "hum", "scale5", "stacc"],
      extra: [{ name: "Off-beat chant", icon: "stacc", count: "Chant on the '&' of each beat for 8 bars at 75 BPM", time: "2 min", how: "Clap on 2 and 4 and place syllables on the off-beats. This trains the reggae pocket." }],
      drills: ["singing behind the beat with a metronome on 2 and 4", "harmony practice: sing a 3rd above a simple melody"],
      health: ["Outdoor sound-system shows are loud: use earplugs and avoid shouting over speakers."],
      grit: "Reggae grit (like Toots) comes from a relaxed throat and strong support. Keep it gentle.",
      mistakes: ["Rushing: reggae should never feel hurried.", "Faking a Jamaican accent instead of respecting the culture and finding your voice.", "Forgetting the bass is the lead instrument; leave space."]
    },
    beats: {
      intro: "A reggae 'riddim' centers on drums and bass, with guitar or keys 'skanking' on the off-beats. The one drop is the signature drum pattern.",
      bpm: "Roots one drop 60–80 (felt in half time) · steppers 70–80 · lovers rock 70–90", keys: "Minor keys are common: Am, Em, Gm, Dm", scales: "Natural minor, minor pentatonic, major",
      progs: [
        { name: "Roots minor", chords: "Am Dm Am Em", roman: "i – iv – i – v", feel: "Heavy, meditative" },
        { name: "Two-chord riddim", chords: "Gm Cm", roman: "i – iv", feel: "Hypnotic vamp" },
        { name: "Lovers rock", chords: "C Am F G", roman: "I – vi – IV – V", feel: "Sweet, romantic" }
      ],
      drums: { name: "One drop", bpm: 75, swing: 0.55, rows: { hat: "x-x-x-x-x-x-x-x-", rim: "--------X-------", kick: "--------X-------" }, note: "Kick and rimshot together on beat 3; nothing on beat 1 (that's the 'drop'). Hats ride the 8ths." },
      sounds: ["Deep, round bass (the star)", "Skank guitar: short muted chords on the off-beats", "Organ 'bubble' (rhythmic organ on off-beats)", "Rimshot snare, dub delays and spring reverb"],
      daw: [
        "Set 75 BPM, slight swing.",
        "Program the one drop: kick + rimshot on beat 3 only.",
        "Add a heavy bass line with space: a few strong notes per bar.",
        "Add skank chords on every off-beat ('&'): short, muted, bright.",
        "Add organ bubble on the off-beats too, mixed lower.",
        "Try a dub section: mute instruments in and out and add delay throws."
      ]
    },
    produce: {
      bpm: 75,
      structure: [["Intro", 8], ["Verse", 16], ["Chorus", 8], ["Verse", 16], ["Chorus", 8], ["Dub break", 8], ["Chorus", 8], ["Outro", 8]],
      arrangement: ["Bass and drums run almost the whole song; other parts drop in and out.", "Dub breaks: strip to drums and bass with echoes.", "Harmony vocals answer the lead in choruses."],
      mix: ["Bass loud and warm; drums dry and punchy.", "Spring reverb and tape delay for space.", "Vocals centered and warm."],
      eq: { sub: "Bass body: big but controlled.", bass: "Kick thump.", mid: "Skank guitar and organ (keep them small and bright).", presence: "Rimshot crack." },
      reference: "Big bass you can feel on a sound system, with space everywhere else."
    },
    promote: {
      platforms: ["YouTube", "Instagram", "SoundCloud", "Reggae radio shows and sound-system culture"],
      communities: ["Sound-system dances and reggae nights", "Caribbean cultural festivals", "Riddim-sharing communities (many artists voice the same riddim)"],
      content: ["Voice a popular riddim (with permission) and share the 'version'", "Live sessions with a full band", "Stories behind the message"],
      visual: "Warm, natural, sunlit; earthy colors; respect the culture's symbols.",
      collabs: ["Voicing riddims from producers", "Features with dancehall or hip-hop artists", "Sound-system crews"]
    },
    lyric: { lines: ["Morning sun on the zinc roof shining,", "every heart got a silver lining,", "hold the line, we'll be fine, keep rising,", "one love moving through the island."], note: "Short, chantable lines with an upbeat message." }
  });

  /* ============ EDM / ELECTRONIC ============ */
  add({
    id: "edm", name: "EDM / Electronic", aka: "house, techno, dubstep, drum & bass", bpm: "120–175",
    blurb: "Built for dance floors: drums, synths, drops, and vocal hooks.",
    sing: {
      intro: "Vocals in electronic music are usually 'toplines': short, catchy, and clean so producers can chop, pitch, and process them. Clean tone, steady pitch, and strong hooks matter most.",
      techniques: [
        ["Clean, steady tone", "Minimal vibrato and consistent volume make vocals easy to process."],
        ["Chantable hooks", "Short phrases that work repeated over a drop."],
        ["Airy textures", "Breathy pads and 'oohs' that producers can chop into instruments."],
        ["Belted anthems", "Big house and trance toplines use powerful, sustained notes."]
      ],
      classic: [
        ["Robin S", "Show Me Love", "Soulful house vocal over the iconic organ-synth riff."],
        ["Daft Punk", "One More Time", "Heavily processed vocal (Romanthony) used as an instrument."],
        ["Swedish House Mafia", "Don't You Worry Child (feat. John Martin)", "Anthemic, sustained topline."]
      ],
      modern: [
        ["Avicii", "Wake Me Up (feat. Aloe Blacc)", "Soulful vocal over folk guitar, then the dance drop."],
        ["Calvin Harris & Dua Lipa", "One Kiss", "Cool, relaxed vocal over house groove."],
        ["Fred again..", "Delilah (pull me out of this)", "Chopped, emotional vocal samples as the hook."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "siren", "straw", "vowels"],
      extra: [{ name: "Long tone on pitch", icon: "breath", count: "Hold one note 8 counts with a tuner × 6 notes", time: "2 min", how: "Watch the tuner and keep the needle steady. Producers love steady pitch." }],
      drills: ["topline writing: hum 3 melodies over a 4-chord loop and record them", "sustained notes with a tuner app"],
      health: ["Club and festival environments are dry and loud. Hydrate and protect your ears."],
      grit: "Usually not needed. If you want edge, add it with production effects (saturation) rather than your throat.",
      mistakes: ["Overly busy melodies that clash with the drop.", "Heavy vibrato that fights pitch correction.", "Recording too far from the mic (room noise is hard to remove)."]
    },
    beats: {
      intro: "Electronic music is built entirely in the computer: drums, bass, synths, and effects. The drop is the payoff.",
      bpm: "House 120–128 · techno 125–135+ · trance 136–140 · dubstep 140 (half-time) · drum & bass 170–175", keys: "Minor keys dominate: Am, Fm, Gm, F#m", scales: "Natural minor, harmonic minor, Phrygian (dark techno)",
      progs: [
        { name: "Festival anthem", chords: "Am F C G", roman: "i – bVI – bIII – bVII", feel: "Uplifting minor" },
        { name: "Deep house", chords: "Fm9 Ebmaj7 Dbmaj7 Cm7", roman: "i9 – bVII – bVI – v", feel: "Smooth, late night" },
        { name: "Techno one-chord", chords: "Am Am Am Am", roman: "i (one chord, the drums and sound design carry it)", feel: "Hypnotic" }
      ],
      drums: { name: "House", bpm: 124, swing: 0, rows: { open: "--x---x---x---x-", hat: "x-x-x-x-x-x-x-x-", clap: "----X-------X---", kick: "X---X---X---X---" }, note: "Four-on-the-floor kick, clap on 2 and 4, open hat on every off-beat." },
      sounds: ["Punchy kick with sidechained bass", "Saw-wave leads and supersaws", "Pads and plucks", "Risers, white-noise sweeps, impacts"],
      daw: [
        "Use a free DAW (LMMS and Waveform Free are good for electronic music). Set 124 BPM.",
        "Program the house pattern for 1 bar, loop it.",
        "Add a bass on the off-beats between kicks (classic house bounce).",
        "Add chords on a pad; add a sidechain compressor keyed to the kick for 'pumping'.",
        "Build: 16-bar intro, 16-bar breakdown (no kick, add a riser), drop (everything).",
        "Make the drop different: new lead or bass pattern."
      ]
    },
    produce: {
      bpm: 124,
      structure: [["Intro (DJ-friendly)", 16], ["Build", 8], ["Drop", 16], ["Breakdown", 16], ["Build", 8], ["Drop 2", 16], ["Outro (DJ-friendly)", 16]],
      arrangement: ["Phrases come in 8s and 16s so DJs can mix.", "Remove the kick in breakdowns so the drop hits harder.", "Change something every 8 bars (add a hat, a filter sweep, a new layer)."],
      mix: ["Kick and bass are the foundation; sidechain is essential.", "Loud but clean; leave headroom before mastering.", "Wide synths, mono bass."],
      eq: { sub: "Mono, clean sub. Check on club speakers or good headphones.", bass: "Kick punch.", uppermid: "Lead synth presence.", air: "Hats and shimmer." },
      reference: "Club-ready: pounding kick, wide synths, a huge drop."
    },
    promote: {
      platforms: ["SoundCloud (huge electronic scene)", "YouTube promo channels", "TikTok (drop reveals)", "Beatport (for DJs)"],
      communities: ["Local DJ nights and club open decks", "Producer Discords and remix contests", "Electronic music subreddits"],
      content: ["Drop reveal videos", "Sound-design breakdowns ('how I made this bass')", "DJ sets including your own tracks"],
      visual: "Bold and graphic: neon or monochrome, geometric shapes, strong logo.",
      collabs: ["Collab tracks with other producers", "Vocalist features", "Remix swaps"]
    },
    lyric: { lines: ["Hold on, the lights are coming down,", "hold on, I feel it in the ground,", "say it once and say it loud,", "we come alive inside the crowd."], note: "Short, repeatable lines built for a drop." }
  });

  /* ============ LO-FI ============ */
  add({
    id: "lofi", name: "Lo-fi", aka: "lo-fi hip-hop, chillhop, bedroom", bpm: "70–90",
    blurb: "Warm, dusty, relaxing beats for studying and late nights. Imperfection is the point.",
    sing: {
      intro: "Lo-fi is often instrumental. When there are vocals, they're soft, intimate, and close to the mic, sometimes treated as just another texture.",
      techniques: [
        ["Close-mic intimacy", "Sing quietly, close to the mic, like you're talking to one person."],
        ["Half-whisper tone", "Soft, airy delivery; never push."],
        ["Conversational melody", "Simple melodies, small range, natural rhythm."],
        ["Vocal as texture", "Short phrases, hums, or spoken words that loop with the beat."]
      ],
      classic: [
        ["Nujabes", "Feather (feat. Cise Starr & Akin)", "Jazzy, sampled beat with relaxed rap vocals."],
        ["J Dilla", "Donuts (album)", "Loose, swung drums and chopped samples that defined the sound."],
        ["Erykah Badu", "On & On", "Laid-back, intimate neo-soul delivery."]
      ],
      modern: [
        ["Clairo", "Pretty Girl", "Soft vocal recorded in a bedroom, honest and simple."],
        ["Joji", "Slow Dancing in the Dark", "Hazy, melancholy tone."],
        ["beabadoobee", "Coffee", "Gentle, close-up vocal over a minimal guitar."]
      ]
    },
    train: {
      warmups: ["breath", "hum", "lipTrill", "straw", "vowels"],
      extra: [{ name: "Quiet consistency", icon: "hum", count: "Sing a phrase at your softest volume 5× without the tone breaking", time: "2 min", how: "Soft singing takes control. Keep air steady and the throat relaxed." }],
      drills: ["soft singing at low volume with steady pitch", "humming melody ideas over a loop for 10 minutes"],
      health: ["Quiet doesn't mean strain-free; keep breath support even when soft."],
      grit: "Not used in lo-fi. Character comes from tape saturation and filtering in production.",
      mistakes: ["Singing too loud for the mood.", "Over-producing: lo-fi needs breathing room.", "Clean, perfectly quantized drums that lose the human feel."]
    },
    beats: {
      intro: "Lo-fi beats combine swung, dusty drums with jazzy chords and warm, slightly degraded textures like vinyl crackle and tape wobble.",
      bpm: "70–90 (most around 80)", keys: "Major 7ths and minor 9ths in any key; F, Eb, Ab are popular", scales: "Major, Dorian, pentatonic",
      progs: [
        { name: "Jazzy lo-fi", chords: "Fmaj7 Em7 Dm7 Cmaj7", roman: "IVmaj7 – iii7 – ii7 – Imaj7", feel: "Descending and calm" },
        { name: "Rainy minor", chords: "Am9 Dm9 Gmaj7 Cmaj7", roman: "vi9 – ii9 – V – I", feel: "Moody" },
        { name: "Two-chord drift", chords: "Ebmaj7 Dm7", roman: "IVmaj7 – iii7 (in Bb)", feel: "Endless loop" }
      ],
      drums: { name: "Dusty lo-fi", bpm: 80, swing: 0.6, rows: { hat: "x-x-x-x-x-x-x-x-", snare: "----X-------X---", kick: "x-----x---x-----" }, note: "Heavy swing and slightly late snares give the lazy, head-nod feel. Turn off quantize on a few hits." },
      sounds: ["Rhodes or felt piano", "Soft kick and snare (or vinyl-sampled drums)", "Warm bass", "Vinyl crackle, rain, and tape-wobble effects"],
      daw: [
        "Set 80 BPM and swing 60%.",
        "Program the dusty drums; nudge a few snares slightly late.",
        "Add a Rhodes or piano playing the jazzy chords, one per bar.",
        "Add a low-pass filter on the whole beat (cut above ~8–10 kHz) for warmth.",
        "Add vinyl crackle or rain ambience quietly underneath.",
        "Loop 8 bars and vary drums slightly each time."
      ]
    },
    produce: {
      bpm: 80,
      structure: [["Intro (filtered)", 4], ["A section", 16], ["B section", 8], ["A section", 16], ["Outro (fade)", 4]],
      arrangement: ["Short and loopable: many lo-fi tracks are 2–3 minutes.", "Variation is subtle: a new melody, a drum change.", "Fade-ins and fade-outs fit playlists."],
      mix: ["Warm and soft; no harsh highs.", "Low-pass filtering and tape saturation.", "Quieter overall loudness is fine."],
      eq: { bass: "Warm, round low end.", lowmid: "The cozy warmth lives here.", air: "Usually rolled off for a vintage feel." },
      reference: "A warm, slightly worn record playing in a cozy room."
    },
    promote: {
      platforms: ["YouTube (24/7 streams and study mixes)", "Spotify lo-fi playlists (pitch through your distributor)", "SoundCloud", "Twitch (beat-making streams)"],
      communities: ["Lo-fi producer Discords", "Beat-making streams", "Study and focus communities"],
      content: ["Beat-making timelapses", "'Beats to study to' visuals with an animated loop", "Sample flips (with cleared or royalty-free samples)"],
      visual: "Cozy illustrations, soft colors, a looping animated scene.",
      collabs: ["Split EPs with other producers", "Visual artists for animated covers", "Vocalists for soft hooks"]
    },
    lyric: { lines: ["Tea gone cold beside the window,", "rain is writing on the glass,", "I don't mind the day is slow,", "some things are better when they pass."], note: "Soft imagery and slow pacing that match the beat." }
  });

  /* ============ METAL ============ */
  add({
    id: "metal", name: "Metal", aka: "heavy, thrash, metalcore", bpm: "90–220+",
    blurb: "Loud, heavy, technical, with both soaring cleans and harsh vocals.",
    sing: {
      intro: "Metal vocals range from operatic high belts to harsh screams and growls. Done right, harsh vocals are a learned technique that doesn't hurt. Done wrong, they can damage your voice, so learn them slowly and carefully.",
      techniques: [
        ["Powerful clean belt", "Supported, ringing high notes (classic heavy metal)."],
        ["Fry screams", "Built on vocal fry (the creaky sound at the bottom of your voice) plus air and resonance. Learn quietly first."],
        ["False-chord growls/screams", "Use the false vocal folds above the true folds for distortion. Needs guidance; it should never hurt."],
        ["Clean/harsh switching", "Modern metal often alternates harsh verses with clean choruses."]
      ],
      classic: [
        ["Black Sabbath (Ozzy Osbourne)", "Paranoid", "Simple, driving vocal that follows the riff."],
        ["Iron Maiden (Bruce Dickinson)", "The Trooper", "Operatic, galloping high belts."],
        ["Judas Priest (Rob Halford)", "Painkiller", "Extreme high screams with full support."],
        ["Metallica (James Hetfield)", "Master of Puppets", "Aggressive, rhythmic clean-gritty delivery."]
      ],
      modern: [
        ["Spiritbox (Courtney LaPlante)", "Holy Roller", "Switches between brutal harsh vocals and clean singing."],
        ["Gojira", "Stranded", "Powerful harsh vocals over massive riffs."],
        ["Bring Me the Horizon", "Can You Feel My Heart", "Melodic metalcore with electronic elements."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "siren", "straw", "octave"],
      extra: [{ name: "Quiet fry", icon: "breath", count: "Vocal fry on 'ah' for 4 counts × 6, very soft", time: "2 min", how: "Find a relaxed, creaky fry with no pushing. This is the foundation for fry screams. Never louder than a quiet conversation while learning." }],
      drills: ["clean belting to build a strong, healthy base", "supervised scream practice: short, quiet fry-based bursts with rests between"],
      health: ["Always warm up before screaming, and cool down after.", "Scream training should feel effortless. Any pain, burning, or loss of voice means stop now and rest.", "Strongly consider lessons with a coach experienced in extreme vocals."],
      grit: "Safe harsh vocals: (1) warm up fully, (2) build on relaxed vocal fry or false-fold technique with lots of breath support, (3) the mic does the volume, not your throat, (4) practice in short bursts with rests, (5) stop at the first sign of pain or hoarseness. Many professionals scream for decades safely because of technique, not toughness.",
      mistakes: ["Screaming from the throat with no breath support.", "Practicing harsh vocals loud and long before the technique is solid.", "Ignoring clean singing; it builds the support harsh vocals need.", "Not warming up before shows."]
    },
    beats: {
      intro: "Metal is guitar-driven: down-tuned riffs, fast double-kick drums, and tight bass. Programmed drums are common in home demos.",
      bpm: "Doom 60–90 · heavy metal 100–140 · thrash 160–220 · breakdowns in half-time", keys: "E, D, C, B (often drop-tuned)", scales: "Natural minor, Phrygian, harmonic minor, chromatic riffs",
      progs: [
        { name: "Phrygian riff", chords: "E5 F5 E5 G5", roman: "i – bII – i – bIII", feel: "Dark, menacing" },
        { name: "Epic minor", chords: "Em C D Em", roman: "i – bVI – bVII – i", feel: "Heroic metal" },
        { name: "Breakdown", chords: "D5 D5 Eb5 C5", roman: "i – i – bII – bVII (drop D)", feel: "Half-time heaviness" }
      ],
      drums: { name: "Double-kick gallop", bpm: 160, swing: 0, rows: { crash: "x---------------", hat: "x---x---x---x---", snare: "----X-------X---", kick: "xxxxxxxxxxxxxxxx" }, note: "Continuous 16th-note double kick under a backbeat. Start slower (120) to hear it clearly." },
      sounds: ["High-gain guitar (amp simulator), double-tracked left and right", "Bass with grit, locked to the kick", "Tight, punchy drums with clicky kick", "Optional orchestral or synth layers"],
      daw: [
        "Set 160 BPM. Program the double-kick pattern.",
        "Record or program a palm-muted E5 riff in 16ths following the kick.",
        "Double-track the guitar and pan hard left and right.",
        "Add bass doubling the guitar's root notes.",
        "Write a half-time breakdown: snare only on beat 3, guitar chugs syncopated with the kick.",
        "Leave space in the upper mids for vocals."
      ]
    },
    produce: {
      bpm: 160,
      structure: [["Intro riff", 8], ["Verse", 16], ["Pre-chorus", 8], ["Chorus", 8], ["Verse", 16], ["Chorus", 8], ["Breakdown", 8], ["Solo", 16], ["Chorus", 8], ["Outro", 4]],
      arrangement: ["Riffs are the hooks; repeat and vary them.", "Breakdowns at half-time give a heavy payoff.", "Clean choruses contrast with harsh verses."],
      mix: ["Guitars wall-of-sound but not muddy.", "Kick clicky enough to hear at fast tempos.", "Vocals cut through the guitars; harsh vocals often doubled."],
      eq: { bass: "Tight low end; high-pass guitars around 80–100 Hz.", lowmid: "Cut mud from guitars (300–500 Hz).", uppermid: "Guitar bite and vocal cut; avoid harshness.", presence: "Kick click and snare crack." },
      reference: "Huge, tight, and aggressive, with every part clear even at high speed."
    },
    promote: {
      platforms: ["YouTube (playthroughs and vocal covers)", "Bandcamp (strong metal community)", "Instagram and TikTok (riff clips)", "Metal blogs and podcasts"],
      communities: ["Local metal shows and venues", "Metal subreddits and Discords", "Guitar and drum playthrough communities"],
      content: ["Guitar/drum playthrough videos", "Vocal cover with a split-screen of clean and harsh takes", "Gear and tone breakdowns"],
      visual: "Dark, striking art; a logo that matches your sub-genre; consistent merch-ready look.",
      collabs: ["Guest vocalists on breakdowns", "Split releases with other bands", "Touring with local bands"]
    },
    lyric: { lines: ["Iron sky and a sleepless crown,", "every tower built to burn back down,", "I am the noise beneath the ground,", "rise, rise, until the walls come down."], note: "Strong consonants and short vowels for aggressive delivery." }
  });

  /* ============ FOLK / ACOUSTIC ============ */
  add({
    id: "folk", name: "Folk / Acoustic", aka: "singer-songwriter, indie folk, Americana", bpm: "60–130",
    blurb: "A voice, an acoustic guitar, and a story. Simple tools, honest songs.",
    sing: {
      intro: "Folk singing values honesty over polish. A natural tone, clear words, and harmony singing are its heart. Many folk singers accompany themselves, so coordination matters.",
      techniques: [
        ["Natural, speech-like tone", "Sing close to how you speak; let your own accent and character through."],
        ["Storytelling diction", "Every word should be understood."],
        ["Harmony singing", "Close harmonies, often in 3rds, are a folk staple."],
        ["Singing while playing", "Practice the guitar part until it's automatic so you can focus on the voice."]
      ],
      classic: [
        ["Bob Dylan", "Blowin' in the Wind", "Plain, conversational delivery focused on the words."],
        ["Joni Mitchell", "A Case of You", "Free, flowing phrasing and leaps into head voice."],
        ["Simon & Garfunkel", "The Sound of Silence", "Close two-part harmony throughout."],
        ["Joan Baez", "Diamonds & Rust", "Clear, pure tone and storytelling."]
      ],
      modern: [
        ["Phoebe Bridgers", "Motion Sickness", "Conversational, understated delivery."],
        ["Bon Iver", "Skinny Love", "Raw falsetto and intimate recording."],
        ["Noah Kahan", "Stick Season", "Fast, wordy storytelling with a big sing-along chorus."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "hum", "scale5", "vowels"],
      extra: [{ name: "Strum & sing", icon: "vowel", count: "Strum G-C-D on beats while singing 1-2-3-4-5 × 5 rounds", time: "2 min", how: "Separate hand and voice rhythms. Start slow." }],
      drills: ["singing while playing a simple strum pattern", "harmony: sing a 3rd above along with a recording"],
      health: ["Posture matters when holding a guitar; keep your neck and shoulders loose, don't hunch over the instrument."],
      grit: "Folk usually uses a clean tone. Raw emotion comes from dynamics and honesty, not distortion.",
      mistakes: ["Hunching over the guitar and constricting breath.", "Mumbling words; folk lives on lyrics.", "Strumming too loudly and pushing the voice to compete."]
    },
    beats: {
      intro: "Folk 'beats' are usually strumming patterns, foot stomps, and claps. Many folk tracks have no drums at all.",
      bpm: "Ballads 60–80 · mid-tempo 90–110 · stompers 110–130", keys: "G, D, C, A, E (use a capo to fit your voice)", scales: "Major, major pentatonic, Mixolydian, Dorian",
      progs: [
        { name: "Campfire classic", chords: "G C G D", roman: "I – IV – I – V", feel: "Warm and simple" },
        { name: "Indie folk", chords: "C Am F G", roman: "I – vi – IV – V", feel: "Gentle and hopeful" },
        { name: "Modal folk", chords: "Am G Am Em", roman: "i – bVII – i – v (Dorian/Aeolian)", feel: "Old, haunting" }
      ],
      drums: { name: "Stomp & clap", bpm: 104, swing: 0, rows: { clap: "----X-------X---", stomp: "x-------x-------", shaker: "x-x-x-x-x-x-x-x-" }, note: "Foot stomp on 1 and 3, clap on 2 and 4, shaker 8ths. Works great with a strummed guitar." },
      sounds: ["Acoustic guitar (strummed or fingerpicked)", "Banjo, mandolin, or fiddle", "Upright bass", "Stomps, claps, tambourine"],
      daw: [
        "Set 104 BPM. Record a guitar strumming 'G C G D' with the pattern Down, Down-Up, Up-Down-Up.",
        "Add the stomp & clap pattern (or record real stomps and claps).",
        "Add a simple bass part on roots.",
        "Record a harmony vocal in the chorus.",
        "Keep it sparse in verses; add mandolin or fiddle in the chorus.",
        "Record in a quiet room with a blanket behind the mic."
      ]
    },
    produce: {
      bpm: 104,
      structure: [["Intro (guitar)", 4], ["Verse 1", 16], ["Chorus", 8], ["Verse 2", 16], ["Chorus", 8], ["Bridge", 8], ["Chorus", 8], ["Outro", 4]],
      arrangement: ["Start with voice and guitar alone; add instruments gradually.", "A big group-vocal chorus is a modern folk trademark.", "Leave silence; it's part of the sound."],
      mix: ["Natural, room-sound recordings.", "Vocal clear and intimate.", "Acoustic guitar warm but not boomy."],
      eq: { bass: "Remove boom from guitar (~100–200 Hz) if muddy.", mid: "Body of voice and guitar.", air: "Guitar string shimmer and breath." },
      reference: "Like sitting in the room with the singer: close, honest, natural."
    },
    promote: {
      platforms: ["YouTube (live acoustic sessions)", "Instagram and TikTok (one-take performances)", "Bandcamp", "Spotify playlists"],
      communities: ["Open mics and folk clubs", "Festivals and busking", "Songwriter circles"],
      content: ["Outdoor one-take videos", "Song stories", "Simple chord tutorials for your own songs"],
      visual: "Natural and earthy: outdoor light, hand-drawn type, film photography.",
      collabs: ["Harmony duets", "Busking with other musicians", "House concerts"]
    },
    lyric: { lines: ["We carved our names in the river stone,", "back when the summer felt like home,", "the water's carried half away,", "but I still know the words we'd say."], note: "Plain words, strong imagery, and a memory at the center." }
  });

  /* ============ LATIN ============ */
  add({
    id: "latin", name: "Latin", aka: "reggaeton, salsa, Latin pop", bpm: "Reggaeton 85–100 · salsa 160–220",
    blurb: "From the dembow of reggaeton to the clave of salsa: rhythm comes first.",
    sing: {
      intro: "Latin vocals live on rhythm. Salsa singers improvise lines ('soneos') against a chorus ('coro'); reggaeton artists blend melodic singing and rap-like flow over the dembow beat. Spanish diction and clear rhythm are key.",
      techniques: [
        ["Rhythmic diction", "Clear consonants and vowels locked to the beat, especially at fast tempos."],
        ["Soneo (salsa)", "Improvised lines between repeats of the chorus. Know the clave and build phrases around it."],
        ["Melodic flow (reggaeton)", "Half-sung, half-rapped phrasing, often with autotune as a stylistic effect."],
        ["Ad-libs and call-outs", "Shouts and catchphrases that energize the track."]
      ],
      classic: [
        ["Celia Cruz", "La Vida Es un Carnaval", "Powerful, joyful voice and her famous '¡Azúcar!' energy."],
        ["Héctor Lavoe", "El Cantante", "Expressive salsa vocals with a coro answering."],
        ["Marc Anthony", "Vivir Mi Vida", "Big, passionate salsa belting."],
        ["Daddy Yankee", "Gasolina", "Rhythmic, chant-like reggaeton flow."]
      ],
      modern: [
        ["Bad Bunny", "Tití Me Preguntó", "Playful flow with a beat switch mid-song."],
        ["Karol G", "Provenza", "Soft, melodic reggaeton-pop delivery."],
        ["J Balvin & Willy William", "Mi Gente", "Chantable, minimal hook."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "stacc", "scale5", "vowels"],
      extra: [{ name: "Clave clap & chant", icon: "stacc", count: "Clap 3-2 son clave while chanting 'ta' on beats × 8 bars", time: "2 min", how: "Internalize the clave: X--X--X---X-X---. Everything in salsa sits around it." }, { name: "Spanish vowel line", icon: "vowel", count: "'a-e-i-o-u' on a 5-tone scale × 6 keys", time: "2 min", how: "Spanish has five pure vowels. Keep them short and clean." }],
      drills: ["rhythmic diction: rap/sing a verse at slow, then full tempo", "soneo practice: improvise 2-bar lines between a repeated coro"],
      health: ["Fast, high-energy shows are demanding; pace yourself and hydrate."],
      grit: "Light grit is used in salsa on climactic lines. Keep it supported and occasional.",
      mistakes: ["Ignoring the clave (in salsa, the clave is the law).", "Sloppy diction at fast tempos.", "Over-tuning vocals until words become unclear."]
    },
    beats: {
      intro: "Reggaeton is built on the dembow rhythm with 808s and synths. Salsa uses a live band: piano montuno, bass tumbao, congas, timbales, and horns.",
      bpm: "Reggaeton 85–100 · Latin pop 95–110 · salsa 160–220 (felt in 2)", keys: "Minor keys for reggaeton; salsa in many keys", scales: "Natural and harmonic minor, major",
      progs: [
        { name: "Reggaeton loop", chords: "Am F C G", roman: "i – bVI – bIII – bVII", feel: "Moody dance" },
        { name: "Salsa montuno", chords: "C F G F", roman: "I – IV – V – IV", feel: "Driving piano pattern" },
        { name: "Minor salsa", chords: "Am Dm E7 Am", roman: "i – iv – V7 – i", feel: "Passionate" }
      ],
      drums: { name: "Dembow (reggaeton)", bpm: 92, swing: 0, rows: { hat: "x-x-x-x-x-x-x-x-", snare: "---x--x----x--x-", kick: "x---x---x---x---" }, note: "Kick on every beat; snare on the 'a' of 1 and the '&' of 2 in each half bar: the 'boom-ch-boom-chick' heartbeat." },
      sounds: ["Reggaeton: 808 bass, dembow drums, plucky synths, reverse FX", "Salsa: piano montuno, baby bass, congas, timbales, cowbell, trumpets and trombones", "Latin pop: acoustic guitar plus dembow"],
      daw: [
        "Set 92 BPM. Program the dembow pattern.",
        "Add an 808 following the root notes of 'Am F C G'.",
        "Add a pluck synth playing the chords with a syncopated rhythm.",
        "Add percussion: timbale fills, shakers.",
        "Build: intro (filtered), verse, pre-coro (drums drop), coro (full).",
        "For salsa: program a clave pattern first and build the piano montuno around it."
      ]
    },
    produce: {
      bpm: 92,
      structure: [["Intro", 4], ["Coro (hook)", 8], ["Verse 1", 16], ["Pre-coro", 4], ["Coro", 8], ["Verse 2", 16], ["Coro", 8], ["Beat switch / bridge", 8], ["Coro", 8], ["Outro", 4]],
      arrangement: ["Hook early and often.", "Beat switches add surprise in modern reggaeton.", "In salsa, the montuno section (coro + soneos) is the climax."],
      mix: ["Reggaeton: heavy 808, crisp dembow, vocals upfront with modern effects.", "Salsa: live and bright, horns punchy, percussion clear.", "Keep the rhythm section dominant."],
      eq: { sub: "808 power (reggaeton).", bass: "Kick and bass tumbao.", uppermid: "Vocal and horn presence.", presence: "Percussion snap." },
      reference: "Made for dancing: the rhythm hits first, and the hook sticks."
    },
    promote: {
      platforms: ["TikTok (dance trends)", "YouTube (music videos)", "Instagram", "Spotify Latin playlists"],
      communities: ["Latin dance clubs and salsa socials", "Cultural festivals", "Latin producer communities online"],
      content: ["Dance challenges with your hook", "Bilingual behind-the-scenes", "Percussion and dembow breakdowns"],
      visual: "Bold colors, energetic movement, strong cultural pride.",
      collabs: ["Feature swaps (very common in reggaeton)", "Dancers and choreographers", "Live salsa bands"]
    },
    lyric: { lines: ["Baila conmigo hasta que salga el sol,", "the city's moving to the beat of the drum,", "no pienses mucho, déjate llevar,", "tonight we're dancing 'til the morning comes."], note: "A bilingual hook (Spanish and English) with a dance-floor message. Have a fluent speaker check your Spanish lyrics." }
  });

  /* ============ AFROBEATS ============ */
  add({
    id: "afrobeats", name: "Afrobeats", aka: "West African pop, Afropop, Afro-fusion", bpm: "95–115",
    blurb: "Infectious West African grooves, melodic vocals, and global hits.",
    sing: {
      intro: "Afrobeats vocals are melodic, relaxed, and rhythmic, often mixing English, Nigerian Pidgin, Yoruba, or other languages. Note: 'Afrobeats' (modern pop) is different from Fela Kuti's 1970s 'Afrobeat', its influential ancestor.",
      techniques: [
        ["Relaxed, melodic flow", "Glide over the groove without pushing; let the rhythm carry you."],
        ["Code-switching", "Mixing languages naturally, if they're part of your own life and culture."],
        ["Call and response", "Short hook phrases with answering backing vocals."],
        ["Syncopated phrasing", "Place words against the off-beats of the percussion."]
      ],
      classic: [
        ["Fela Kuti", "Water No Get Enemy", "The Afrobeat roots: long grooves, horn lines, and call-and-response."],
        ["King Sunny Adé", "Ja Funmi", "Juju music: guitars and talking drums with layered vocals."],
        ["2Baba (2face Idibia)", "African Queen", "Smooth, melodic delivery that helped Afropop go global."]
      ],
      modern: [
        ["Wizkid", "Essence (feat. Tems)", "Laid-back, sensual phrasing and harmonies."],
        ["Burna Boy", "Last Last", "Relaxed melodic flow over a sample of Toni Braxton's 'He Wasn't Man Enough'."],
        ["Rema", "Calm Down", "Catchy, light, melodic hook."]
      ]
    },
    train: {
      warmups: ["breath", "lipTrill", "hum", "scale5", "stacc"],
      extra: [{ name: "Groove sing-along", icon: "stacc", count: "Sing 'oh-oh-oh' melodies over a percussion loop for 8 bars × 3", time: "3 min", how: "Lock into the shaker and kick. Keep it relaxed and bouncy." }],
      drills: ["melodic improvisation over an Afrobeats loop", "harmony stacks on short hooks"],
      health: ["Long, energetic shows: pace your energy and use backing vocals for support."],
      grit: "Not common. Character comes from tone, melody, and rhythm.",
      mistakes: ["Rushing the groove.", "Copying language or slang that isn't part of your life.", "Ignoring the percussion; it drives everything."]
    },
    beats: {
      intro: "Afrobeats grooves combine syncopated kicks, rimshots, shakers, and congas with melodic guitars, keys, and bass.",
      bpm: "95–115 (most around 100–108)", keys: "Major and minor; many use simple 2–4 chord loops", scales: "Major, pentatonic, Mixolydian",
      progs: [
        { name: "Bright loop", chords: "C G Am F", roman: "I – V – vi – IV", feel: "Feel-good" },
        { name: "Smooth minor", chords: "Am7 Dm7 Gmaj7 Cmaj7", roman: "vi7 – ii7 – V – Imaj7", feel: "Late-night groove" },
        { name: "Two-chord vamp", chords: "Dm7 G7", roman: "ii7 – V7 (Mixolydian vamp)", feel: "Highlife-flavored" }
      ],
      drums: { name: "Afrobeats groove", bpm: 104, swing: 0.52, rows: { shaker: "xxxxxxxxxxxxxxxx", conga: "--x--x----x--x--", rim: "---x--x----x--x-", kick: "x--x---x--x--x--" }, note: "Tresillo-style kick (3+3+2 feel), rimshots answering, steady shaker 16ths, and congas filling the gaps." },
      sounds: ["Clean, palm-muted highlife-style guitar", "Warm keys and pads", "Round bass with syncopation", "Shakers, congas, talking drum, rimshots"],
      daw: [
        "Set 104 BPM, very slight swing.",
        "Program the groove: start with kick and rim, then shaker, then congas.",
        "Add bass following the kick's syncopation.",
        "Add a clean guitar riff in short, muted notes.",
        "Add keys with the chord loop.",
        "Leave space in the mids for the vocal hook."
      ]
    },
    produce: {
      bpm: 104,
      structure: [["Intro", 4], ["Hook", 8], ["Verse 1", 16], ["Hook", 8], ["Verse 2", 16], ["Hook", 8], ["Bridge / breakdown", 8], ["Hook", 8], ["Outro", 8]],
      arrangement: ["The groove runs throughout; variation comes from percussion and vocal layers.", "Hooks repeat and stack backing vocals.", "Breakdowns strip to percussion and vocals."],
      mix: ["Warm, clear, and bouncy.", "Percussion detailed and wide.", "Vocals smooth and centered with subtle reverb and delay."],
      eq: { bass: "Round, warm bass and kick.", mid: "Guitar riff and keys.", presence: "Shaker and rim detail.", air: "Light sparkle on vocals." },
      reference: "Warm and danceable, with percussion you can feel in your hips."
    },
    promote: {
      platforms: ["TikTok (dance challenges are huge)", "YouTube", "Instagram", "Audiomack and Boomplay (popular in Africa)"],
      communities: ["African diaspora events and clubs", "Afrobeats producer communities", "Dance crews"],
      content: ["Dance challenges with your hook", "Studio sessions", "Language/lyric explainers"],
      visual: "Vibrant colors, fashion-forward, joyful energy.",
      collabs: ["Dancers and choreographers", "Cross-genre features (R&B, dancehall, hip-hop)", "Producers from the scene"]
    },
    lyric: { lines: ["Sunlight dancing on your face,", "move it slow, we no dey race,", "every step you take, I follow,", "save the worries for tomorrow."], note: "Light, melodic lines with a little Pidgin ('we no dey race' = we're not racing). Only use languages that are part of your life." }
  });

  return { MODULES: MODULES, WARMUPS: WARMUPS, WEEK: WEEK, HEALTH: HEALTH, EQ_BANDS: EQ_BANDS, GENRES: GENRES };
})();
