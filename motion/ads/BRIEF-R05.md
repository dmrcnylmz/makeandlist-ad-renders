# R05 — 16 voiced ads (narrator: Marian, Cartesia sonic-3)

Read `BRIEF-R02.md`, `BRIEF-R03.md` and `BRIEF-R04.md` first: every house rule stands (safe zones, honesty, demo tags,
lifted 13.0 s end card, recorded cues, recorded music with `meta.music` + its `bpm`, pure function of time, both formats
laid out on purpose, full meta). The owner called R04 "very, very good" — R05 keeps that bar and adds a **voice**.

## Voice-over

- Add `vo: [[t, "line"], …]` to meta (seconds, plain sentences). The narrator is **Marian — Poised Narrator**: calm,
  mature, warm authority. Write for her: short, spoken sentences, no jargon, contractions welcome, one idea per line.
- Budget: **24–34 words** in total, lines between 0.3 s and 12.8 s, a 0.25–0.5 s breath between lines. The end card
  (13.0 s) may have one short closing line (e.g. "MakeAndList. Start free.").
- Get real durations and fit your timeline to them: `node vo.mjs e01` (from motion/ads) voices the lines once
  (cached by text) and prints each line's duration and end time. Change text → run again. Never print or commit the
  key file `motion/.cartesia-key` (git-ignored).
- **On-screen text still carries the message** (most people watch muted): captions show the key words of each line
  (not necessarily verbatim), timed with the voice.
- The mixer ducks music and effects under the voice automatically; keep cues, but avoid a big 'hit' or 'riser' on top of
  a spoken word — put impacts in the breaths.
- Honesty applies to what is said: no invented results, no "AI does everything", nothing goes live without the seller's
  yes, printing is paid from the seller's own partner account.

## New images (`K.pub('r05/<id>.webp')`, gpt-image-2, label scenes they lead with `K.demoTag('Concept image · AI-generated', x, y)`)

h01-night-desk (desk at night, lamp, sketchbook idea) · h02-morning-desk (same mood, morning, printed planner) ·
h03-story-shop (watercolour fox shopkeeper) · h04-story-press (watercolour printing press with hedgehog) ·
h05-story-courier (watercolour bicycle courier with parcel) · h06-craft-studio (home craft studio, nobody present) ·
h07-market-stall (craft market stall) · h08-postcard (botanical postcard) · h09-night-street (rainy street, lit shop
window) · h10-hands-sketch (hands drawing a lemon pattern on a tablet) · h11-gift-wrap (kraft gift with printed tag) ·
h12-print-macro (macro of a print's texture). The R04 set `r04/g01…g24` is available too. App screens only where they
prove a point.

## The 16 ads — narrator-led formats (none used before)

| id | file | title | format | the line it lands |
|---|---|---|---|---|
| E01 | e01-dear-seller | Dear Seller | a handwritten letter writes itself on paper as she reads it | "Your idea deserves a shop." |
| E02 | e02-night-to-morning | From Night to Morning | h01 → h02 crossfade day-cycle; an idea at night, a draft waiting in the morning | "Start tonight. Review it tomorrow." |
| E03 | e03-audiogram | The Audiogram | podcast audiogram: waveform reacting to her voice, big captions, product cards slide in | "One sentence is enough to start." |
| E04 | e04-audio-guide | The Audio Guide | museum audio-guide device with numbered exhibits (gallery of prints) she narrates | "Printed per order. No stock." |
| E05 | e05-documentary | The Documentary | wildlife-documentary parody, gently: "Here, a small seller in her natural habitat…" over h06/h07 | "She keeps the final say." |
| E06 | e06-recipe | The Recipe | cooking-show recipe card: ingredients (an idea, a sentence, your stores), method steps | "Serves every store you sell in." |
| E07 | e07-safety-card | The Safety Card | in-flight safety card illustrations: "In the unlikely event…", nothing live without your yes | "Nothing takes off without you." |
| E08 | e08-forecast | Today's Forecast | weather-forecast set: a map of stores, "100 % chance of drafts", a front of printed products | "Clear skies for your launch." |
| E09 | e09-bedtime-story | A Bedtime Story | storybook pages turn (h03, h04, h05 watercolours) as she reads "Once upon a time…" | "And they listed happily ever after." |
| E10 | e10-manual | The Manual | flat assembly-instruction diagrams: parts list, steps 1–4, assembling a listing | "No tools required." |
| E11 | e11-trailer | The Trailer | movie-trailer cut: letterbox, h09 night street, title cards; she narrates, not a deep-voice parody | "This season, your shop opens." |
| E12 | e12-voicemail | You Have One New Message | phone voicemail playback UI; the message explains a print order waiting for approval | "Press yes when you're ready." |
| E13 | e13-five-things | Five Things You Get | 5-4-3-2-1 countdown with big numerals, each a product or app moment | "All five, from one sentence." |
| E14 | e14-quiet | The Quiet One | ASMR-calm: slow macro product shots (h12, h11, g01), paper and box sounds, she speaks softly | "Made with care. Sent when you say." |
| E15 | e15-postcard | A Postcard From the Printer | a postcard travels from the print partner to the buyer (h08, h05), postmarks stamp each step | "Printed by your partner. Paid from your account." |
| E16 | e16-what-is | What Is MakeAndList? | the definitive narrated explainer: what it is, who it's for, how it works, what you gain | "Describe it. Review it. Sell it." |

Verify with stills only (never render video on the Mac); run stills one at a time; `vo.mjs` only calls the TTS API.
