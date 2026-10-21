# R08 — 16 feature spotlights: the whole system, one feature per ad (voiced, new mix, Openverse audio)

Read `BRIEF-R02.md` … `BRIEF-R07.md`; every house rule stands. R08 explains MakeAndList properly: each ad takes **one
feature**, says what it does, why it matters to a seller, and proves it with the real app (screens in
`docs/design-v2/screens`, boards in `docs/design-v2/canvas`), dressed with concept products (`r04`, `r05`, `r07`).
A series signature ties them together: a small "Feature NN / 16 · <name>" chip near the top in every ad (same style),
while each ad still uses its own visual technique.

## Sound (the owner asked for this after R05–R07)

- **The narrator leads.** The mixer now levels by loudness: voice −16 LUFS (EQ + gentle compression), music bed −27 LUFS
  between lines and ~19 dB under the voice while she speaks (duck + 1–4 kHz carve), effects −26 LUFS and −6 dB under
  speech. Do not fight it: no big 'hit' / 'riser' on a word; impacts in the breaths.
- **Not every ad needs music.** Set `musicMode: 'none'` in meta for about a third of the ads (voice + effects only),
  choosing the calm, close-up or explanatory ones. The rest use a bed.
- **New beds from Openverse (CC0, Freesound):** ids starting `ov-` in `motion/music/tracks.json` (uplifting, acoustic,
  corporate, lo-fi, ukulele, funk, piano, kalimba). Prefer them in R08; set `meta.bpm` to the track's bpm.
- **New cue kinds:** 'pageturn', 'sparkle', 'ding', 'tape' (plus all R03 cues).
- Voice-over (Marian) in at least 13 of 16: 22–30 words, `node vo.mjs hNN`, fit to the real speech times.

## The 16 features

| id | file | feature | what to say (true in the app) |
|---|---|---|---|
| H01 | h01-quote | The quote | Before anything is made, you see the price in Credits — pages, pictures, extras. If making stops, unused Credits come back. |
| H02 | h02-page-plan | The page plan | Every page is planned: what each page needs and why; the page count is measured from the files that ship. |
| H03 | h03-making | Making, live | Watch it being made: stages tick, pages stack in; it tells you plainly if something stops. |
| H04 | h04-review | The review room | Real files, a filmstrip of every page, checks that pass or fail — review before anything is sold. |
| H05 | h05-listing-copy | Listing copy | Title, description and tags written for you, in your words to edit. |
| H06 | h06-images-video | Images and video | Listing images and a short product video, made for the listing. |
| H07 | h07-send | Send to your stores | Pick stores; each gets a draft; publish per store when you say. |
| H08 | h08-waiting | Waiting for you | One list of everything that needs your decision. |
| H09 | h09-ideas | Ideas | Browse ideas by category and make one; no sales promises. |
| H10 | h10-copilot | Describe it in chat | Say it in a sentence; the plan and quote answer beside it. |
| H11 | h11-make-physical | Make it physical | Add a printed edition: choose a partner's real product, try it on, check sharpness. |
| H12 | h12-print-check | The print check | Sizes that would print soft are flagged before you sell them. |
| H13 | h13-approve-orders | Approve print orders | Each order waits for you with the buyer's payment, the partner's cost and your margin; a loss needs its own yes. |
| H14 | h14-partners | Your print partner | Connect your own partner account (or try a simulated partner); printing is paid from it, never from Credits. |
| H15 | h15-team | Work as a team | Invite people to your workspace by email; give each a role. |
| H16 | h16-credits | Credits and your own key | Plans and packs in Credits; you can also use your own AI key. |

Verify with stills only (never render on the Mac); one stills run at a time.
