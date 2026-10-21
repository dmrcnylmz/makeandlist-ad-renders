# R03 — 16 ads: the whole flow, and print on demand told properly

Same kit, same house rules as `BRIEF-R02.md` (read it first: safe zones, honesty, demo tags, 13.0 s end card,
pure function of time, both formats laid out on purpose, full meta). R02 was judged "very good" by the owner — keep that
level of craft and variety. New for R03:

- **End card:** call `K.endCard(13.0, { lift: K.F === '9x16' ? 160 : 0, line: '…' })` (the kit now has `lift`); do not
  move the card by hand.
- **Sound cues** (the renderer now maps them to real recorded effects): 'click' (tap), 'pop' (UI lands), 'whoosh'
  (fast move, ends on the cut), 'swish' (light slide), 'riser' (1.4 s before a reveal), 'hit' (big reveal), 'type'
  (typing burst ~0.7 s), 'chime' (success / approved), 'notify' (phone notification), 'paper' (paper slide/rustle),
  'printer' (printer running ~1 s), 'stamp' (rubber stamp), 'shutter' (camera), 'marker' (pen stroke), 'coin' (money
  moves), 'box' (parcel lands). Put a cue on every cut and impact, on the beat grid.
- **New products are welcome.** Draw new product concepts yourself as inline SVG/CSS (e.g. a botanical line-art poster
  set, a kids' name poster, a retro sunset tee, a "slow mornings" coffee mug, a sticker sheet, a tote with a monstera,
  a planner cover). Label every drawn product `Concept · drawn for this ad` (small, mono) and never present it as a
  customer's sale. Keep them on-brand: ivory/graphite/lime palette plus one warm accent per artwork, clean line art.
- **Print on demand facts to tell (true in the app):**
  1. A digital product becomes physical with "Make it physical": choose a print partner (Printful, Gelato, Prodigi;
     a simulated partner for trying), pick a product from the partner's own catalogue, try the artwork on it (colour,
     size, artwork size, print area), and a sharpness / print-file check runs against that partner's spec.
  2. The edition starts as a **draft**; it is listed in the seller's own stores (ikas, WooCommerce, …) only after their
     confirmation.
  3. When a buyer orders, the order waits for the seller: they see the buyer's payment, the partner's cost, shipping,
     and their margin; an order that would lose money needs its own confirmation. Nothing is sent to a partner without
     approval (auto-approval is an opt-in the seller sets).
  4. Printing and shipping are paid from the seller's own partner account — **never Credits**. Credits pay for making
     designs. The buyer pays the seller's store.
  5. The partner prints and ships; tracking goes back to the store order; split shipments and an unknown outcome are
     looked up, never resent blindly.
  Any money figure on screen is a sample and labelled "sample" (or comes from a real demo screen with its demo tag).
- **Screens for POD** (`K.screen`): 26-production, 27-production-order, 28-production-partners, 29-sell-physical,
  59-sell-physical-shopware-wix, 61-publishing-printed, 81-phone-orders, 82-phone-store-orders, 83-phone-catalogue,
  31-partner-connected, 33-phone-sell-physical, 35-production-order-shipping, 36-production-store-orders, 45-catalogue,
  46-try-on, 52-phone-order, 54-phone-try-on, 57-production-partners-attention, 58-production-store-orders-woo,
  62-phone-production-partners. Canvas boards (`K.canvas`): MakePhysical, PrintArea, BookProof, Costs, Listing, Orders,
  AppCatalogue, AppTryOn, AppOrders, AppStores, Stores. Open the PNGs to see what is on them before choosing crops.

## The 16 ads

| id | file | title | hook (≤ 7 words) | technique | bpm/mood |
|---|---|---|---|---|---|
| C01 | c01-print-journey | The Print Journey | From a file to a parcel. | Isometric conveyor belt: the artwork rides through lit stations (Partner → Try-on → Sharpness check → Draft → Your store → Order → Your approval → Print & ship), each station a mini real-screen crop; camera tracks along | 120 drive |
| C02 | c02-margin-math | Margin, Before You Say Yes | See your margin before you approve. | Animated order card: buyer pays / partner cost / shipping / your margin as stacked bars that fill and count (sample figures); a losing order turns red and asks for its own confirmation | 108 bright |
| C03 | c03-who-pays | Who Pays What | Credits make. Your partner prints. | Three-lane money flow: coins travel buyer → your store, your partner account → printing, Credits → design; clean infographic motion with labels; ends on "never Credits for printing" | 100 calm |
| C04 | c04-sharpness | The Sharpness Check | Will it print sharp? We check. | Pixel-zoom: a low-res art blows up into blocky pixels and is flagged; the print-ready file snaps crisp with a DPI badge; real preflight crop | 112 drive |
| C05 | c05-partners | Pick Your Partner | Your printer. Your account. | Trading-card flip: Printful, Gelato, Prodigi, simulated partner cards flip with what each is proven to do (from the partners screen), holo sheen; one is picked | 116 bright |
| C06 | c06-runway | The Try-On Runway | Try it on before it exists. | Catwalk: a tee/hoodie/tote walk a lit runway, colours change on the beat, artwork size slider and print-area outline; real try-on board | 124 drive |
| C07 | c07-order-in | An Order Comes In | Ding. Someone wants it printed. | Phone notification → approve sheet with margin → partner "printing" → parcel → tracking number lands in the store order; real order screens | 118 bright |
| C08 | c08-new-collection | A Collection in One Go | Four new designs. Twelve products. | NEW drawn concept artworks (4) multiply into a grid of poster/tee/mug/tote; collection "drop" reveal with a lime sweep; each tile marked concept | 122 drive |
| C09 | c09-book-proof | Your Book, Proofed | Print a real book. | 3D book assembles: interior pages stack, spine width grows with page count, cover wraps; real BookProof board crops | 96 warm |
| C10 | c10-make-physical | Make It Physical | One tap: digital to physical. | A digital product card flips in 3D into a physical edition stack (poster, tee, mug); ripple transition; real "Make it physical" screen | 110 bright |
| C11 | c11-six-words | The Flow in Six Words | Describe. Plan. Make. Review. List. Print. | Kinetic word chain: each word morphs (scale/clip) into its real screen and back into the next word; one continuous rhythm | 126 drive |
| C12 | c12-day-clock | One Day With MakeAndList | Morning idea. Evening order. | A clock dial sweeps the day; at 9, 12, 15, 19 h the dial opens a phone moment (idea, product made, listed, print order approved) | 104 warm |
| C13 | c13-relays | Orders From Your Stores | Store orders, straight to print. | Pipe network: order packets flow from ikas / WooCommerce / Wix nodes to a "waiting for you" valve, then on to the partner after approval; real store-orders screen | 120 drive |
| C14 | c14-weekend | The Weekend Test | One weekend. One product line. | Split before/after wipe: a messy drawn desk of tabs and spreadsheets (illustration) vs the MakeAndList flow screens; the wipe follows a pencil | 112 bright |
| C15 | c15-idea-shelf | From Ideas to the Shelf | Pick an idea. Fill a shelf. | Ideas cards fly off the real Ideas screen onto a 3D store shelf as printed products (drawn concepts) and digital packs | 116 warm |
| C16 | c16-credits | Credits, Explained | What does a product cost? | The Credits ring fills; a product's credit cost builds from its parts (pages, images, video); packs slide in; ends "printing is never paid in Credits" | 98 calm |

Verify with stills only (never render video on the Mac); run stills one at a time.
