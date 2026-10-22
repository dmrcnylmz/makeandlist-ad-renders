# R09 — Instagram Highlights: MakeAndList, plainly explained (16 stories in 9 highlights)

Read `BRIEF-R02.md` … `BRIEF-R08.md`; every house rule stands (honesty, demo tags, recorded cues, voice-led mix, pure
function of time, full meta). The owner rated R04–R08 highly. R09 is different in **purpose**: these stories sit
permanently in the profile's **Highlights**, so a new visitor taps through them to understand MakeAndList. They must be
clear before they are clever.

## The owner's prompt, sharpened

> Make the Instagram Highlights that explain MakeAndList to someone who has never heard of it. In a few taps they must
> understand **what it is** (an app that turns an idea into a finished product — files, listing copy, images, video —
> and sends it to your own stores), **what it is for**, **how it works** (describe → it makes and checks → you review →
> it lists, and prints per order if you want), **what you gain** (a second income stream you can run in spare time,
> without design skills, stock or a warehouse, and with every decision still yours), and **which 10 store platforms it
> works with**, shown clearly with their real logos. Explain with beautiful, concrete examples (planners, kids'
> worksheets, wall art, mugs, tees), not abstractions. Where the app is shown, show it **beautifully**: crop to the
> part that matters, make it large and readable, and move it with premium motion — never a whole page shrunk to tiny
> text, never an unrelated screen. One idea per story, plain words, a calm narrator, and a clear "what's next".

## Format

- **9:16 is the format that matters** (Stories/Highlights, 1080×1920); 4:5 is also rendered for feed posts — lay it
  out on purpose, as always.
- **`dur: 18`** (17–20 allowed). End card at `dur - 2` with `K.endCard(dur - 2, { lift: K.F==='9x16'?160:0, line, cta })`,
  where `line` points to the next story where there is one (e.g. "Next: how it works →"); `cta` stays
  "Start free · makeandlist.com".
- **Instagram's own UI**: the top ~250 px (progress bars, profile name) and bottom ~300 px (reply bar) are covered in
  Stories. So in R09 (Stories, not Reels) words and buttons may sit anywhere in y 270–1600 (9:16), and **the frame must
  be composed over that whole height** — no empty lower 40 %: scale the panel up, centre the composition, or fill the
  lower band with a moving supporting visual.
- **Series signature**: a highlight chip at the same place in every story (top-left, y ≈ 290, height 56 px, the R08
  `.fchip` style) reading `<HIGHLIGHT> · n/N`, e.g. `WHAT IS IT · 1/2`. Same CSS in all 16.

## Text you can read

- On-screen text **≥ 40 px** (headlines 72–96 px Playfair/Archivo as in R08), ≤ 7 words per caption, captions timed
  to the voice. The narrator carries detail, the screen carries the key words (most people watch muted).
- **No small UI text as content.** Any app text that matters must render at ≥ 26 px in the output frame.

## Showing the app beautifully ("screen cards")

The owner saw small leftover text and unwanted screens in earlier ads. In R09:

1. **Crop to the one panel that proves the point** (a quote card, a page-plan list, the checks, a store row, the order
   approval). Use `K.canvas(Board)` / `K.screen(name)` inside an overflow box, scaled so its text is ≥ 26 px. Never a
   full desktop page scaled down, no sidebars, nav bars, browser chrome, empty states, toasts or dev UI in frame.
2. **Or rebuild the panel in HTML** with the app's real words and values (taken from those screens/boards), in the
   app's look (ivory #FAF7EE / #FFFDF8 cards, ink #1F1F1F, lime #DFFF5A accents, Archivo + IBM Plex Mono). A rebuilt
   panel is the app's own UI redrawn larger; tag it `K.demoTag('App screen · redrawn, sample data', x, y)`. Real
   crops keep `K.demoTag('Real app · demo workspace', x, y)`.
3. **Move it like a product film**: a floating card with 28 px radius and a deep soft shadow, a gentle 3D tilt that
   settles flat (perspective 1600 px, ≤ 10°), a spotlight that dims everything but the point, a highlighter swipe, a
   finger tap ring, parallax between card and background. 400–700 ms eased moves; the card is never still.

## The 10 store platforms (owner: "show them clearly with their logos")

Exactly these, in this order, with what each really does (from the app's channel registry — never imply more):

| platform | logo (`K.pub('platforms/…')`) | what MakeAndList does there |
|---|---|---|
| WooCommerce | woocommerce.svg | Draft first |
| Wix | wix.svg (**white logo: always on a #1F1F1F tile**) | Hidden until you confirm |
| ikas | ikas.svg | Not for sale until you confirm |
| Shopware 6 | shopware.svg | Reviewed hidden drafts |
| Gumroad | gumroad.svg (show the name beside the mark) | Draft first |
| Whop | whop.svg | Separate publishing authorization |
| SHOPLINE | shopline.svg | Connection only |
| Salla | salla.svg (**min 88 px wide**) | Connection only |
| Magento Open Source / Adobe Commerce | **name only, no logo** (written permission needed) | Compatible with · hidden drafts |
| Shoplazza | **name only, no logo** (approval pending) | Compatible with · approval pending |

Logo rules: unmodified files — no recolouring, no CSS `filter`, no stretching, no cropping, no animating parts of a
logo; move/scale/fade only the tile that holds it, uniformly. Each on a plain tile (light #FFFDF8, Wix dark). Say
"Works with your own store on" / "10 store platforms", never "partners", "official", "integrated with all" or
"publish everywhere". Wherever several logos appear, add a small line: "Logos belong to their owners. Shown to identify
compatible platforms; no endorsement implied." **Never** Etsy, Shopify, Shopier or Ecwid (files exist in the folder:
do not use them).

## New images (`K.pub('r09/<id>.webp')`, gpt-image-2)

Scenes (portrait, photographic; tag the scenes they lead with `K.demoTag('Concept image · AI-generated', x, y)`):
p01-teacher-desk · p02-illustrator-studio · p03-boutique-counter · p04-kitchen-evening (side business at night) ·
p05-kids-table · p06-planner-flatlay · p07-wall-art-room · p08-print-room · p09-parcel-doorstep · p10-one-design (one
lemon design on tee, mug, tote, poster) · p11-digital-planner · p12-card-shelf.
Cut-outs (transparent WebP; tag `K.demoTag('Concept products · AI-generated', x, y)`): k15-canvas · k16-cushion ·
k17-phone-case · k18-planner-stack · k19-worksheets · k20-bodysuit — plus the R07 set `r07/k01…k14` and R04/R05 photos.

## Sound

Voice-led mix as in R08. Marian narrates **every** story (they explain): 30–42 words for 18 s, lines fitted to
`node vo.mjs iNN`. About a third use `musicMode: 'none'`; the rest an `ov-*` or Holizna bed with `meta.bpm`. Soft cues
only (pop, click, swish, sparkle, pageturn, ding); impacts in the breaths.

## Honesty for "earn money"

The owner wants viewers to see they can **earn on the side and run it easily**. Say it as an opportunity, never a
result: "build a second income stream", "sell in your spare time", "your price, your margin". **No** income figures,
"passive income", "get rich", sales counts, guarantees or testimonials. Printing is paid from the seller's own print
partner account; nothing goes live and no print order is sent without the seller's yes; Credits are quoted before
anything is made.

## The 16 stories

| id | file | highlight | n/N | the story (one idea) | must show |
|---|---|---|---|---|---|
| I01 | i01-what-is | WHAT IS IT | 1/2 | MakeAndList in one breath: an idea becomes a finished product, listed in your own store | sentence → product (planner) → listing → store tile |
| I02 | i02-who-for | WHAT IS IT | 2/2 | Who it's for: teachers, illustrators, small shops, parents, anyone starting on the side | p01, p02, p03, p04, p05 as quick portraits of places (no faces) |
| I03 | i03-describe | HOW IT WORKS | 1/3 | Step 1 — describe it in a sentence; see the quote in Credits before anything is made | typed sentence, quote card (pages, pictures, extras, total) |
| I04 | i04-make-check | HOW IT WORKS | 2/3 | Step 2 — it plans every page, makes the files and checks them; you review real files | page plan rows, making stages ticking, checks passing, filmstrip |
| I05 | i05-list-sell | HOW IT WORKS | 3/3 | Step 3 — listing copy, images and video, sent to your stores as drafts; you publish when ready | listing card, "Draft" badges, your "Publish" tap |
| I06 | i06-whole-kit | WHAT YOU GET | 1/3 | One idea, the whole kit: files, title + description + tags, images, a short video | exploded kit around one product (k18) |
| I07 | i07-digital-examples | WHAT YOU GET | 2/3 | Digital products you can make: planners, worksheets, wall art, cards, digital planners | p06, k19, p07, k08, p11 as a swipe carousel |
| I08 | i08-physical-examples | WHAT YOU GET | 3/3 | Physical products, printed per order: tees, mugs, totes, canvas, cushions, cases | p10 then cut-outs k03 k01 k05 k15 k16 k17 on a turntable |
| I09 | i09-ten-stores | STORES | 1/3 | Works with your own store on 10 platforms — all ten, clearly, with logos | the 10 tiles assemble into a grid; names readable |
| I10 | i10-stores-a | STORES | 2/3 | What it does on WooCommerce, Wix, ikas, Shopware 6, Gumroad | one row per platform: logo tile + its note, large |
| I11 | i11-stores-b | STORES | 3/3 | What it does on Whop, SHOPLINE, Salla, Magento / Adobe Commerce, Shoplazza | same rows; "one place for all your stores" |
| I12 | i12-print | PRINT | 1/1 | Physical without stock: your print partner prints each order; you approve; you set the margin | order approval card (buyer paid, partner cost, your margin), p08 → p09 |
| I13 | i13-credits | PRICING | 1/1 | Start free; pay in Credits for what you make; the quote comes first; unused Credits come back; or use your own AI key | quote card, refund line, plan/pack tiles (no invented prices — show "Credits", not currency) |
| I14 | i14-control | YOUR CONTROL | 1/1 | Nothing goes live without your yes: drafts first, print orders wait for you, a loss needs its own yes | three locks/yes taps |
| I15 | i15-why | WHY IT HELPS | 1/1 | What you gain: time back, no design skills, no stock, one place for every store — a second income stream run in spare time | four gains as big cards over p04 → p09 |
| I16 | i16-start | START | 1/1 | Start in three taps: sign up free, connect your store, describe your first product | three numbered steps, store tiles, the end card "Start free · makeandlist.com" |

Highlight covers (profile circles) are made separately: WHAT IS IT · HOW IT WORKS · WHAT YOU GET · STORES · PRINT ·
PRICING · YOUR CONTROL · WHY IT HELPS · START.

Verify with stills only (`node stills.mjs iNN 9x16 1,4,8,12,16,17.5`), one stills run at a time; never render video
on the Mac.
