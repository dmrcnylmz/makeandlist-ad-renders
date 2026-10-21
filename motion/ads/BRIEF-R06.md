# R06 — 16 ads in native social formats (feels like the feed, sells like an ad)

Read `BRIEF-R02.md` … `BRIEF-R05.md` first: every house rule stands (safe zones, honesty, demo tags, lifted 13.0 s end
card, recorded cues, recorded music + its bpm, pure function of time, both formats laid out on purpose, full meta). The
owner rated R04 and R05 "very, very good". R06 changes the *genre*: each ad borrows a format people already scroll past
every day, recreated by hand (drawn UI — never a real third-party app's logo, trademark or exact UI), so it stops the
thumb by looking native. Voice-over (Marian, `meta.vo`, `node vo.mjs fNN`) is **optional** in R06: use it where a
narrator helps (about half the ads); the rest are music + effects + on-screen text.

Recreated platform UIs must be generic and unbranded (no app names, logos, or icons that copy a real product; write
"Notes", "Messages", "Search", "Board", "Your year", etc.). Content inside them follows every honesty rule; nothing
pretends to be a real customer's post, message, review or result — label demo content "sample".

## The 16 ads

| id | file | format | idea |
|---|---|---|---|
| F01 | f01-notes-app | a notes-app checklist typed live | "Shop to-do": make 12 printables, write listings, photos, upload to 3 stores… each ticked as MakeAndList does it; the last item "Approve" is left for you |
| F02 | f02-messages | a message thread with a friend (sample) | "how do you make so many products?" → replies with short app clips; ends "it waits for my yes" |
| F03 | f03-search | a search results page | the query "how to sell printables without design skills" → the top answer card is MakeAndList's 3 steps |
| F04 | f04-board | a pin-board of saved ideas | saved concept images (r04/r05) → each pin flips into a product with listing |
| F05 | f05-your-year | "your year" recap cards (sample data, labelled) | slides: "ideas described", "drafts approved", "stores connected" as an illustrative recap; no results claims |
| F06 | f06-poll | a story poll + quiz | "Which would you sell? Poster / Tee / Mug" → the answer: all three, printed per order |
| F07 | f07-calendar-invite | a calendar week view | Mon idea, Tue review, Wed listed, Thu order approved — events pop into the week; "no meeting with a designer" joke |
| F08 | f08-cart | a shopping-cart from the buyer's side | a buyer adds the seller's printed poster (concept) → checkout → the order reaches the seller to approve |
| F09 | f09-file-browser | a desktop file window | folders fill by themselves: /files /listing /images /video /print — the whole kit from one sentence |
| F10 | f10-voice-memo | a voice-memo recording (voiced) | the idea spoken into a memo → waveform → becomes the product (VO required) |
| F11 | f11-before-after-slider | a before/after slider people drag | blank page ↔ finished product, repeatedly, for three products |
| F12 | f12-comment-reply | answering a comment (sample) | "does it post things without asking?" → video reply: no, drafts first, your yes |
| F13 | f13-unboxing-pov | POV unboxing from the buyer (concept images) | the parcel (r04/g20) opens → the print → "made by a small shop, printed on demand" |
| F14 | f14-tutorial | a 3-step on-screen tutorial with taps | step chips, finger taps on the real app phone screens; voiced |
| F15 | f15-split-screen-react | split-screen "react" layout without faces: a seller's sketch top, the app result bottom | three rounds, each faster |
| F16 | f16-app-store-card | an app-listing style card (generic, unbranded) | screenshots carousel, "what you get", "made for small sellers"; voiced; no ratings or review counts |

Assets: real screens (`K.screen`, `K.canvas`), concept images `r04/*`, `r05/*` (tag them), music beds, recorded effects,
Marian's voice. Verify with stills only (never render on the Mac).
