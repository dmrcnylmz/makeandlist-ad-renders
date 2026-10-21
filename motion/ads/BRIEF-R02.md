# R02 — 18 ads from the v2 screens (brief for the builders)

Each ad is one file `motion/ads/bNN-slug.html`, built on `kit.js` / `kit.css` exactly like the R01 ads
(`a07-your-yes.html` in the main repo is the model: `K.run(meta, draw)`, `draw(T)` is a pure function of time).
15.0 s, 30 fps, two formats from one timeline: `?f=9x16` (1080×1920) and `?f=4x5` (1080×1350) — lay out each format
on purpose (`K.F`, `K.W`, `K.H`), never a crop.

## House rules (evidence: TikTok/Meta/Google creative guides, Motion 2026 data, LottieFiles motion-design skill)

1. **Hook in 0–1.5 s, product on screen by 2 s.** ≤ 7 words on screen; text ≤ 5–10 words per second.
2. **Safe zones.** 9:16: every caption and button inside y 270–1248, x 65–1015 (top 14 %, bottom 35 % stay clear of
   text). 4:5: keep 60 px margins. The end card's CTA must sit above y 1248 in 9:16.
3. **One motion language per ad.** Premium: 350–600 ms moves, ease out on entrances (K.ease.outExpo / outQuint), in
   on exits (inCubic), inOut for moves within frame; overshoot only for "pop" moments (outBack). Entrances 30–50 %
   longer than exits. Hero moves first; ≤ 1/3 of elements move at once; every shot has primary + secondary + ambient
   motion (slow drift, grain, parallax) so nothing is ever dead still.
4. **Sound sync.** Put `cues` on cuts and impacts: 'whoosh' (ends on the cut), 'hit' (big reveal), 'pop' (UI lands),
   'click' (tap), 'riser' (before a reveal), 'type' (typing). Pick `bpm` and land cuts on the beat grid
   (beat = 60/bpm s). `mood`: warm | bright | calm | drive. `intro`: seconds before drums.
5. **End card 13.0–15.0 s** with `K.endCard(13.0, { line, cta, dark })` (line ≤ 6 words, e.g. "Describe it. Review it.
   List it."). CTA "Start free · makeandlist.com".
6. **Honesty (non-negotiable).**
   - Real screens carry `K.demoTag('Real app · demo workspace', x, y)` at least once; canvas boards carry
     `K.demoTag('Product design · sample data', x, y)`.
   - Nothing is published without the seller's yes: show "Draft" / "You review before it goes live" at least once.
   - Prints are paid via the seller's own partner account — never "free prints", never a price we invent.
   - No revenue, sales, review or ranking claims. No "AI does everything". Stores named only from: ikas, WooCommerce,
     Wix, Gumroad, Shopware, Whop, Salla, SHOPLINE, Magento, Shoplazza. **Never** Etsy, Shopify, Shopier, Ecwid.
   - Product images are "Example made with MakeAndList by its owner" where they lead a scene.
7. **Frame-exact.** No CSS transitions/animations, no Date.now / requestAnimationFrame timing: every style is set in
   `draw(T)`. Wait-free: images are preloaded by `K.run`. Use transforms and opacity; blur only on fast moves.
8. **meta** (required): `id` ('B01'…), `title`, `dur: 15`, `bpm`, `mood`, `key`, `intro`, `cover` (a strong frame
   time for the thumbnail, e.g. 3–6 s), `technique` (one sentence), `caption` (post text, 1–2 sentences + "Start free
   at makeandlist.com"), `short` (≤ 8 words), `beats` (4–6 strings "0–2 s: …"), `cues`.

## Assets (paths relative to `motion/ads/`)

- `K.screen('<name>')` → real app screens (`docs/design-v2/screens/<name>.png`, see its `index.json` for name/route/
  note). Desktop shots are 1440 wide (tall pages), phone shots are 780 wide (2x of 390). Useful: 03-overview,
  04-create, 06-create-product, 08-generating, 10-products, 11-product, 12-stores, 13-listings, 14-listing,
  15-publishing, 17-billing, 22-phone-create, 24-phone-product, 26-production, 29-sell-physical, 63–85 phone set
  (e.g. 65-phone-configure, 69-phone-making, 72-phone-listing-send), 86-invite.
- `K.canvas('<Board>')` → design-canvas boards rendered at 2x (`docs/design-v2/canvas/<Board>.png`): AppHome,
  AppStudio, AppPlan, AppMaking, AppRoomReview, AppRoomList, AppRoomSend, AppRoomTrack, AppCatalogue, AppTryOn,
  AppProducts, AppIdeas, AppStores, AppListings, AppOrders, AppPerformance, AppCredits, AppSettings, AppPhone,
  AppMotion, AppWaiting, AppIdeasCategory, AppCopilot, MakePhysical, PrintArea, BookProof, Costs, Listing, Orders,
  Studio, StudioMobile, Stores, Editor, LandingExhibition, LandingMobile, Main, System. Widths: most 1440 (→ 2880 px
  image), phone boards wider. Crop with an overflow box + translate/scale.
- `K.pub('showcase/<pack>/cover.webp')` and pages in each pack folder (christmas-preschool-pack, halloween-preschool-pack,
  fall-activity-pack, thanksgiving-kids-table, coloring-christmas, activity-halloween, christmas-party-games,
  halloween-party-games); `K.pub('examples/…png')`; `K.pub('platforms/<store>.svg')`; `K.brand('makeandlist-…svg')`.
  Look in the folders for exact file names.

## The 18 ads

| id | file | title | hook (on screen) | technique | bpm/mood |
|---|---|---|---|---|---|
| B01 | b01-metro-line | Metro Line | Your idea has six stops. | SVG transit line draws on; a product token rides it, stations expand into real screens; red "Your review" stop waits for a tap; line forks to store terminals | 118 bright |
| B02 | b02-paper-workshop | Paper Workshop | Kids' packs, cut from paper. | Stop-motion on twos (time snapped to 1/15 s), paper cut-outs with hard shadows and seeded jitter; the owner's real activity pages stack; paper "Approve?" tag ticks | 100 warm |
| B03 | b03-riso | Riso Registration | Your design, now on paper. | CMYK-style layers (mix-blend multiply, hue-rotated copies) misaligned then snapping into register with a 2-frame shake, halftone overlay; poster onto tee and mug; "Printed via your own partner account" | 112 drive |
| B04 | b04-receipt | Thermal Receipt | Here's what one sentence prints. | A receipt feeds from a printer slot in stepped lines (title, pages, sizes, tags, "PRICE … YOU SET IT"), dithered thumbnails; tear, 3D flip to the real listing screen; "Approved by you" stamp | 124 drive |
| B05 | b05-overhead-desk | Overhead Desk | From sticky note to store. | Orthographic flat-lay on a desk: sticky note, tablet with the product screen, printed pages fan, phone with listing + tap; slow 3° camera rotate, two-layer contact shadows | 96 warm |
| B06 | b06-loupe | The Loupe | Zoom in. It's print-ready. | Circular magnifier (clip-path circle over a 2.5× copy) glides over real screens, callouts on leader lines | 90 calm |
| B07 | b07-highlighter | Highlighter Brief | Scribble the idea. That's the brief. | Handwritten brief draws on (stroke-dash SVG or masked handwriting), highlighter swipes, phrases fly into the real form; ends on "Draft — waiting for you" | 108 bright |
| B08 | b08-one-take | One-Take Scroll | One idea. Keep scrolling. | One tall column of real screens; the camera dollies down with speed ramps and holds per section (plateau keyframes), vertical motion blur on ramps, pinned captions; brakes at the review step | 128 drive |
| B09 | b09-match-cuts | Shape Match Cuts | Same idea, every shape. | Graphic match cuts on the beat: circle→circle, rectangle→rectangle across products, UI buttons and store badges; 2-frame flash + punch-in | 120 bright |
| B10 | b10-unboxing | Unboxing the Download | What's inside one listing? | CSS 3D box, flaps open, real files pop out on arcs with squash and land in a grid that becomes the real Files view | 115 bright |
| B11 | b11-blueprint | Blueprint to Render | Specs first. Then the poster. | Blue grid technical drawing, dimension lines draw on (A4 / A3 / 50×70 cm, bleed), render wipe into the artwork, then the size/edition UI | 92 calm |
| B12 | b12-mask-morph | One Design, Three Things | One design. Three things to sell. | One artwork, its silhouette morphs poster → tee → mug wrap curling into a cylinder (CSS 3D strips); edition list UI | 122 drive |
| B13 | b13-ping-pong | You / The App | You decide. It does the legwork. | Split screen, a lime ball passes between "You" and "MakeAndList"; every hand-off lands a real screen crop; stereo-feel alternation; lanes merge | 110 bright |
| B14 | b14-rack-focus | Rack Focus | Look closer at your listing. | Three depth planes (product, listing images, phone); focus pulls between them (blur by depth, scale breath, slight fringing), slow dolly orbit | 84 calm |
| B15 | b15-marquee | Counter-Marquee | Planners. Colouring books. Wall art. | Rows of the owner's products scroll in alternating directions; freeze on the beat, one lifts out and becomes its listing screen in a phone | 126 drive |
| B16 | b16-scanner | Scanner Pass | From a brief to a printable. | A glowing scan bar sweeps down revealing finished pages under brief/idea cards, three passes, last reveals the listing images screen | 120 drive |
| B17 | b17-polaroid | Polaroid Develop | Your listing images, developing. | Instant photos eject and develop (filter grey→colour), pin to a board, then FLIP into the real listing-image grid | 104 warm |
| B18 | b18-spotlight | Spotlight Tour | Lights off. Watch the cursor. | Near-black overlay with a radial-mask spotlight following a cursor over real UI; clicks pulse the light; lights up on the beat drop at 11 s | 122 drive |

Write the composition, then check it with stills (no full render on the Mac):
`node stills.mjs b01 9x16 1,3,6,9,12,14 /tmp/b01-9x16.jpg` and the same for `4x5`; look at the sheet, fix, repeat.
