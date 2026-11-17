# SENQUIII Music Lab

A free, static music site: lessons, a 16-genre curriculum, free instrumentals, a browser beat maker, and ways to connect.
Plain HTML, CSS, and JavaScript. There's no build step, framework, or server code.

> **Status: local draft.** Nothing in this folder has been published. Preview it locally (see below).

## Preview locally

```bash
cd senquiii-site
python3 -m http.server 8765
# open http://localhost:8765
```

Opening `index.html` straight from disk mostly works, but use a local server so audio downloads and the Beat Maker behave like they will online.

## File map

| Path | What it is |
|---|---|
| `index.html` | Every page (tabs are `<section data-page="…">`), the header, the footer, and the support modal |
| `css/styles.css` | Design tokens (charcoal + amber, 4/8px spacing scale), layout, and all core pages |
| `css/curriculum.css` | Genre Curriculum visuals and the print stylesheet |
| `css/beatmaker.css` | Beat Maker only |
| `js/config.js` | **All settings and placeholders** (contact email, form endpoints, PayPal link, trending backend) |
| `js/app.js` | Router, hero waveform, Solo Instrumentals player, Learn tabs, roster, forms, support modal |
| `js/curriculum-data.js` | Curriculum content: 16 genres × 5 modules (edit text here) |
| `js/curriculum.js` | Curriculum UI: picker, modules, progress, chord charts, drum grids, timelines, EQ chart |
| `js/search.js` | Header search (press `/` or Ctrl/⌘+K) |
| `js/tracks.js` | Solo Instrumentals track list |
| `js/peaks.js` | Pre-computed waveform shapes for the tracks |
| `js/roster.js` | Work With Senquiii roster and YouTube slots |
| `js/beatgen.js`, `js/beatmaker.js` | Beat Maker engine and UI |
| `audio/` | 14 original instrumentals (MP3), made with `tools/gen_beats.py` |
| `assets/` | Favicon and the two photo placeholders |
| `tests/` | Headless browser tests and audio analysis |

## Going live: placeholders to replace

Search the project for these exact strings and replace them:

| Placeholder | Replace with | Where |
|---|---|---|
| `xsenquiiix@gmail.com` | The real contact email | `js/config.js` (`CONTACT_EMAIL`) and the literal text in `index.html` (Contact tab + footer) |
| `[PAYPAL_LINK_PLACEHOLDER]` | The real PayPal link, e.g. `https://paypal.me/yourname` | `js/config.js` (`PAYPAL_LINK`) and the three links in `index.html` |
| `https://formspree.io/f/YOUR_CONTACT_FORM_ID` | A Formspree (or similar) form URL for contact messages | `js/config.js` (`CONTACT_ENDPOINT`) and the contact `<form action>` |
| `https://formspree.io/f/YOUR_FORM_ID` | A form URL for music submissions | `js/config.js` (`FORM_ENDPOINT`) and the submission `<form action>` |
| `https://www.youtube.com/@YOUR_CHANNEL` | The channel URL | `js/roster.js` |

One command does the two main swaps (macOS: use `sed -i ''`):

```bash
grep -rl --exclude-dir=test-renders "\[PLACEHOLDER_EMAIL\]\|\[PAYPAL_LINK_PLACEHOLDER\]" . | xargs sed -i \
  -e 's#\[PLACEHOLDER_EMAIL\]#you@example.com#g' \
  -e 's#\[PAYPAL_LINK_PLACEHOLDER\]#https://paypal.me/yourname#g'
```

### How the contact form behaves
* While `CONTACT_ENDPOINT` is still the placeholder, **Send** opens the visitor's email app addressed to `CONTACT_EMAIL`, with subject `[SENQUIII Contact] <their subject>` and a body listing **Name, Email, Subject, Message**.
* With a real endpoint, it posts `name`, `email`, `subject`, `message`, `_subject` (prefixed) and `_replyto` and shows a thank-you or a retry/email fallback.
* Validation runs on all four fields, and a hidden honeypot field (`_gotcha`) silently drops bot submissions.
* Every message has the same subject prefix and labeled fields, so incoming mail is easy to filter, read, and reply to.

### How "Support the site (optional)" behaves
* While `PAYPAL_LINK` contains `PLACEHOLDER`, clicking any support link shows a small note: *"Donations aren't set up yet, and the site is free either way."* Nothing navigates.
* Once it's a real `https://` link, the same buttons open it in a new tab, and the visible `[PAYPAL_LINK_PLACEHOLDER]` label on the Home card disappears automatically.

## Swapping in the real photos (one step)

Replace these two files, keeping the same names:

* `assets/senquiii-red.jpg`: profile photo (Home hero and About). Portrait 4:5 works best (e.g. 960×1200); it's cropped toward the top third.
* `assets/senquiii-blue.jpg`: wallpaper. Landscape (e.g. 1920×1080). It's automatically dimmed, blurred, and covered with a dark gradient.

## Removing the Beat Maker (one step)

Delete the block between `<!-- BEAT MAKER MODULE START -->` and `<!-- BEAT MAKER MODULE END -->` in `index.html`.
(Optionally also delete `js/beatgen.js`, `js/beatmaker.js`, `css/beatmaker.css` and their two `<script>`/one `<link>` tags marked "Beat Maker module".)

Everything else adapts on its own: the nav link disappears and tabs renumber, Home buttons fall back to **Solo Instrumentals**, the hero stat swaps, search drops it, and no other script depends on it.

## Editing content

* **Tracks:** add an MP3 to `audio/` and an entry to `js/tracks.js` (title, genre, bpm, key, vibe, file). Waveforms for new files fall back to a generic shape. To regenerate exact peaks, see `tools/`.
* **Roster videos:** paste a YouTube URL into a track's `youtube` field in `js/roster.js`. Empty slots show "Coming soon."
* **Curriculum:** edit `js/curriculum-data.js`. Drum rows are 16 characters (`x` hit, `X` accent, `-` rest); chord names draw their own keyboard diagrams; song-map times are calculated from BPM.
* **Learner progress** is stored only in the visitor's browser (`localStorage` key `senq_curriculum_progress_v1`).

## Beat Maker trending prompts (optional backend)

Prompts are saved in each visitor's browser. To show trends from all visitors, set `TRENDING.submitUrl` and `TRENDING.topUrl` in `js/config.js`:

* `POST submitUrl` with `{"prompt": "...", "ts": 1700000000000}`
* `GET topUrl` returns `[{"prompt": "...", "count": 12}, ...]`

## Tests

```bash
python3 -m http.server 8765 &          # from the site folder
python tests/beatmaker_test.py         # renders prompts, regenerate/edit/extend, saves WAVs to test-renders/
python tests/analyze.py                # loudness / peak / spectrum per render
python tests/screens.py                # desktop + mobile screenshots of every tab into screenshots/
```
(Tests use Playwright with a system Chrome at `/usr/bin/google-chrome`.)

© 2026 Senquiii
