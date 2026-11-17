/*
  SENQUIII Solo Instrumentals: track list.
  To add a track: drop the MP3 in /audio and add an entry below.
    title  – track name shown on the card
    genre  – one of: hip-hop, trap, lo-fi, rock, blues, jazz (or any new genre; a filter chip is created automatically)
    bpm    – tempo (number)
    key    – musical key (text)
    vibe   – one short line describing the feel
    file   – path or URL to the audio file (MP3/WAV)
*/
window.SENQ_TRACKS = [
  { title: "Midnight Ledger",        genre: "hip-hop", bpm: 90,  key: "D minor",  vibe: "Dusty boom bap with late-night Rhodes. Made for storytelling bars.", file: "audio/hiphop-midnight-bap.mp3", seconds: 43 },
  { title: "Corner Store Gospel",    genre: "hip-hop", bpm: 94,  key: "F minor",  vibe: "Warm church organ over a head-nod pocket.",                     file: "audio/hiphop-corner-store.mp3", seconds: 41 },
  { title: "Concrete Cypher",        genre: "hip-hop", bpm: 86,  key: "A minor",  vibe: "Gritty and swung. Built for freestyles.",                       file: "audio/hiphop-cypher-steps.mp3", seconds: 45 },
  { title: "Glass Cathedral",        genre: "trap",    bpm: 140, key: "C# minor", vibe: "Dark pads, sliding 808s, rolling hats.",                         file: "audio/trap-glass-city.mp3", seconds: 41 },
  { title: "Afterglow Drip",         genre: "trap",    bpm: 150, key: "G minor",  vibe: "Bouncy and melodic, with a square-lead hook.",                  file: "audio/trap-neon-drip.mp3", seconds: 38 },
  { title: "Low Orbit",              genre: "trap",    bpm: 130, key: "E minor",  vibe: "Spacey, weightless, and heavy underneath.",                     file: "audio/trap-low-orbit.mp3", seconds: 44 },
  { title: "Rain on the 4th Floor",  genre: "lo-fi",   bpm: 78,  key: "Eb major", vibe: "Tape hiss, soft keys, study-session calm.",                     file: "audio/lofi-rainy-window.mp3", seconds: 37 },
  { title: "Sunday Tape Hiss",       genre: "lo-fi",   bpm: 72,  key: "A minor",  vibe: "Mellow and nostalgic. Vinyl crackle included.",                file: "audio/lofi-sunday-tape.mp3", seconds: 40 },
  { title: "Highway Static",         genre: "rock",    bpm: 128, key: "E major",  vibe: "Driving power chords and an open-road kick.",                   file: "audio/rock-open-road.mp3", seconds: 38 },
  { title: "Fuzz & Gasoline",        genre: "rock",    bpm: 140, key: "A major",  vibe: "Raw garage fuzz, fast and loud.",                               file: "audio/rock-garage-fuzz.mp3", seconds: 34 },
  { title: "Smoke Room Shuffle",     genre: "blues",   bpm: 96,  key: "A · 12-bar", vibe: "Organ comping over a classic shuffle.",                       file: "audio/blues-smoky-room.mp3", seconds: 30 },
  { title: "Delta Night Walk",       genre: "blues",   bpm: 84,  key: "E · 12-bar", vibe: "Slow, twangy, and front-porch honest.",                       file: "audio/blues-delta-walk.mp3", seconds: 34 },
  { title: "After Hours, Low Lamp",  genre: "jazz",    bpm: 120, key: "Bb major", vibe: "Ride cymbal, walking bass, ii–V–I.",                            file: "audio/jazz-after-hours.mp3", seconds: 32 },
  { title: "Velvet Rope Swing",      genre: "jazz",    bpm: 100, key: "F major",  vibe: "Smooth late-night swing for crooners and rappers alike.",       file: "audio/jazz-blue-velvet.mp3", seconds: 38 }
];
