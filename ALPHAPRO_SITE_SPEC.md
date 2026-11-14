# AlphaPro Fitness — Website Build Spec

Build a production version of the AlphaPro Fitness website. It is a 3-page marketing site for a neighbourhood gym in Lingadheeranahalli, Bengaluru.

A working prototype already exists: **`reference/index.html`** in this folder. It is the **source of truth for look, copy and behaviour**. Open it in a browser first, then rebuild it as a proper multi-page site. Match it pixel-for-pixel on desktop (1440px) and phone (390px). Where this document and the prototype disagree, follow this document.

---

## 1. Tech stack

- **Astro 4+** with TypeScript. Static output (`output: 'static'`).
- **No UI framework, no CSS framework.** Plain CSS with custom properties, written per component (`<style>` in `.astro` files) plus one `global.css` for tokens, resets and shared utilities. Do **not** add Tailwind, Bootstrap, GSAP, three.js or Lenis.
- Interactivity in **vanilla TypeScript** inside Astro `<script>` tags (Astro bundles them). Keep each interactive feature in its own module under `src/scripts/`.
- Images through **`astro:assets` `<Image />`**, output WebP, with explicit `width`/`height` and `loading="lazy"` everywhere except the hero image (`loading="eager"`, `fetchpriority="high"`).
- Fonts: **Archivo** (variable, with the width axis) from Google Fonts. Self-host it with `@fontsource-variable/archivo` (`wdth` + `wght`, normal and italic). Also **DSEG7 Classic Bold Italic** from `src/assets/fonts/dseg7.woff2` for the LED clock (SIL OFL licence, free to use).
- Deploy target: **Vercel or Netlify**. Must build with `npm run build` and pass with no errors or warnings.
- Lighthouse targets on mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

## 2. Routes and file structure

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/membership` | Membership |

Use real routes, not hash routing (the prototype's `#home`/`#about` routing was only for the demo). "Contact" in the nav links to `/#contact`, and every "Book a free trial" button links to `/#book`.

```
src/
  layouts/Base.astro            # <head>, fonts, meta, Nav, Footer, grain canvas
  components/
    Nav.astro  MobileMenu.astro  Footer.astro
    Button.astro                # variants: primary | outline
    SectionHead.astro           # small label + H2
    FeatureStrip.astro          # 4 facility items (used on Home + About)
    CtaBand.astro               # "Ready to evolve?" band (title prop)
    home/  Hero.astro  AboutTeaser.astro  ProgramWheel.astro  SixtyMinutes.astro  PlansTeaser.astro  Contact.astro
    about/ AboutHero.astro  Owner.astro  Team.astro  CoachCard.astro
    membership/ MemHero.astro  PlanCards.astro  CompareTable.astro  MiniSixty.astro  Gallery.astro  Faq.astro
  data/
    programs.ts  plans.ts  coaches.ts  faq.ts  site.ts   # all copy/data lives here, not in markup
  scripts/
    grain.ts  nav.ts  reveal.ts  countup.ts  wheel.ts  led.ts  booking.ts  coaches.ts  faq.ts  lightbox.ts
  styles/global.css
  assets/  (images, logo, fonts from this folder)
```

## 3. Design system: "Iron & Chalk"

The idea comes from what a gym is made of: black rubber flooring, cast-iron plates, chalk, and the green LED interval clock on the wall. **AlphaPro lime is used only for actions and active states**, never to colour a single word in a headline.

### 3.1 Colour tokens (put in `:root`, single dark theme, `color-scheme: dark`)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#161616` | Page ground (rubber floor) |
| `--surf` | `#1e1f21` | Every panel: cards, form, plan tiers, map, stat badge, LED bezel |
| `--iron` | `#26272a` | Secondary buttons inside cards |
| `--stripe-1` | `#2f3033` | Wide diagonal stripe |
| `--stripe-2` | `#3a3b3f` | Thin diagonal stripe |
| `--ink` | `#eeefeb` | Headings and primary text (chalk) |
| `--body` | `#cfd0cc` | Paragraph text |
| `--mute` | `#9a9da1` | Secondary text |
| `--steel` | `#8e9196` | Small labels above headings |
| `--line` | `rgba(238,239,235,.10)` | Hairline borders and dividers |
| `--lime` | `#b8f13c` | Primary buttons, active nav, selected states, LED digits, best-value plan |
| `--led-off` | `rgba(184,241,60,.07)` | Unlit LED segments |
| `--error` | `#ff8a80` | Form errors |

**Rules:**
- Every section sits directly on the same `--bg` ground. **No section gets its own background fill.** Sections are separated by a 1px `--line` border only.
- All panels use `--surf`. Never introduce another grey.
- No glows, no frosted-glass blur, no gradients on text. The only glow is the LED digits' `text-shadow: 0 0 16px rgba(184,241,60,.35)`.

### 3.2 Rubber-floor grain

The page background is speckled like rubber gym flooring. **Do not use a repeating image tile** (it reads as visible tiles). Draw it once:
- A `<canvas id="grain">` that is `position: fixed; inset: 0; z-index: -1; pointer-events: none`.
- On load and on resize (debounced 200ms), fill it with `#161616`, then draw `area × 0.016` dots per CSS px² at random positions. Use a seeded PRNG (seed 7) so the pattern is stable.
- Dot radius: random 0.3–0.75 CSS px, scaled by `devicePixelRatio` (capped at 2).
- Dot colours, weighted: `#242424` 45%, `#2b2b2b` 30%, `#333333` 17%, `#444444` 8%.
- The result must look like a very fine, subtle grain, not visible dots.

### 3.3 Typography

- **One family: Archivo** (variable `wdth` 62–125, `wght` 400–900).
- **Display style** (H1, H2, program name, CTA titles): `font-stretch: 125%; font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: -0.005em; line-height: 0.95–1; text-wrap: balance`.
  - Hero H1: `128px` desktop, `15.2vw` phone.
  - Page-hero H1 (About, Membership): `96px` desktop, `12.4vw` phone.
  - Section H2: `46px` desktop, `30px` phone.
  - Program name (wheel): `46px` / `30px`.
- **Labels above headings:** sentence case, `15px` (phone `13px`), weight 500, `--steel`, **no letter-spacing, no all-caps, no decorative line**.
- **Body:** `16px / 1.55`, `--body`. Hero sub-line `19px` (phone `16px`).
- **Numbers** (prices, stats): Archivo `font-stretch:125%; font-weight:800`, `font-variant-numeric: tabular-nums`.
- **LED clock:** DSEG7 Classic Bold Italic.
- **Do not** colour or italicise single words inside headings.

### 3.4 Layout

- Container: `width: min(1280px, 100% - 80px)`, centred. Phone (≤640px): `width: calc(100% - 40px)`.
- Section vertical padding: 110–130px desktop, 70–80px phone.
- Breakpoint: a single one at **640px**. Everything stacks to one column below it.
- **Radius is 0 everywhere** except round arrow buttons and the wheel.

### 3.5 Buttons (one shape everywhere, nav included)

- Height 54px (nav 44px, cards 42–46px), padding `0 28px`, weight 700, `15px`.
- **Clipped bottom-right corner:** `clip-path: polygon(0 0,100% 0,100% 70%,calc(100% - 14px) 100%,0 100%)`.
- **Primary:** `--lime` background, `#111` text, optional arrow icon (16px, stroke 2) that nudges 4px right on hover.
- **Outline/secondary:** `--surf` background, `--ink` text, same clip.
- Hover: `translateY(-2px)` plus `brightness(1.08)`. Visible `:focus-visible` outline: `2px solid var(--lime)`, offset 3px.
- `white-space: nowrap`.

### 3.6 Diagonal stripes (brand motif from the AF logo)

Two parallelograms (`transform: skewX(-38deg)`), one wide in `--stripe-1` and one thin in `--stripe-2`. They appear in:
- the Home hero (top-right)
- the Home "About" image (top-left)
- the About and Membership page heroes (right side, **behind** the text: `z-index` lower than the content)
- the CTA band (right side)

Never lime.

## 4. Assets (in `assets/`)

| File | Use |
|---|---|
| `logo/af-full.png` | **Trademarked AlphaPro logo** (AF with flexing arms), transparent PNG. Nav height 68px desktop / 46px phone; footer 84px / 60px. Cut from the client's poster, so ask the client for the original vector/PNG and replace before launch. |
| `fonts/dseg7.woff2` | LED clock font. |
| `photos/*.jpg` | Stock photos for the prototype. Show them all in **black & white**: `filter: grayscale(1) contrast(1.12) brightness(.9)`. The client will supply real photos later. |

Photo mapping:
- `hero.jpg`: home hero
- `bodybuilding.jpg`: home about block
- `floor.jpg`: about hero
- `nutrition.jpg`: owner portrait
- Wheel and tiles: `strength`, `personal`, `crossfit`, `bodybuilding`, `weight`, `nutrition`, `cardio`, `aerobics`
- Coaches: `personal` (pos 22% 40%), `coaching` (78% 40%), `crossfit` (55% 30%), `aerobics` (52% 30%)
- `equip.jpg`: CTA band
- Gallery: `floor`, `equip`, `cardio`, `strength`, `space`

## 5. Global elements

### 5.1 Nav (fixed top)
- Left: logo image, a 1px vertical divider (`rgba(255,255,255,.35)`, 40px tall), then a two-line wordmark: **ALPHA PRO** (Archivo 125% width, 800, 17px) over **FITNESS** (11.5px, letter-spacing .62em, lime, 600).
- Centre links: **Home, About, Membership, Contact**. Active link is lime with a 2px lime underline 10px below. *(Do not add "Free 60 min" to the nav.)*
- Right: primary button **"Book a free trial"** → `/#book`.
- Transparent over the hero. After 40px of scroll it becomes `rgba(20,20,21,.96)` with a bottom hairline (transition .3s).
- Use `top: env(safe-area-inset-top)`.
- **Phone:** links and button hidden. Show a burger (three 2px lines, the last one 60% wide and lime) that turns into an ×. It opens a full-screen menu (`#141415`) with the four links in display style at 34px, plus "Call or WhatsApp / 90710 93361" pinned at the bottom. Close it on link tap or Esc, and lock body scroll while it's open.

### 5.2 Footer
- Logo, divider and wordmark on the left.
- Centre links: Home, About, Membership, Free 60 min (`/#sixty`), Contact.
- Right: social icons (Instagram, YouTube, X, WhatsApp), 20px line icons, as placeholders.
- A bottom row under a hairline: "© 2026 Alpha Pro Fitness. All rights reserved." on the left, "Lingadheeranahalli, Bengaluru 560091" on the right, 12px, `#66665f`.

### 5.3 Feature strip (Home, below hero; About, above CTA)
Four columns divided by hairlines. Each has a 40px line icon (stroke `--ink`, 1.8) and two-line text:
1. Certified coach & / professional trainers
2. Top-brand / equipment
3. Fully / air-conditioned
4. Dedicated parking / on the premises

On phone: 2×2 grid.

### 5.4 CTA band
- Height 300px, hairline top and bottom.
- Left 36%: `equip.jpg` with a slanted right edge (`clip-path: polygon(0 0,100% 0,78% 100%,0 100%)`), fading to `--bg`.
- Stripes on the right.
- Text block:
  - Title in display style, 58px: Home and About use **"READY TO / EVOLVE?"**; Membership uses **"READY TO / START?"**.
  - Paragraph: "Join Alpha Pro Fitness today and take the first step towards a stronger you."
  - Primary button: "Book a free trial".
- On phone the image becomes a 220px top banner and the content stacks below.

## 6. Pages and exact copy

All copy below is final unless marked **[PLACEHOLDER]**. Keep it verbatim.

### 6.1 Home `/`

**Hero** (`min-height` ~820px desktop; no `100vh`)
- Right 58%: `hero.jpg`, black & white, `clip-path: polygon(18% 0,100% 0,100% 100%,0 100%)`. It fades into the background from the left (`linear-gradient(90deg,#161616 0%,rgba(22,22,22,.25) 32%,transparent 60%)`) and from the bottom.
- Label: "Lingadheeranahalli, Bengaluru"
- H1 (three lines): **TRAIN. / BUILD. / EVOLVE.**, all chalk.
- Sub: "4,500 sq.ft of iron, coaches on the floor, and A/C that actually keeps up."
- Buttons: primary "Book a free trial →", outline "Call 90710 93361" (`tel:+919071093361`).
- Stat badge, bottom-right over the photo: a `--surf` box with two cells split by a hairline.
  - **4,500** (counts up) / "sq.ft floor"
  - **A/C** / "Every corner"
- **Phone:** the photo goes on top (420px tall, bottom edge slanted). The H1 overlaps it by -90px, the buttons stack full-width, and the badge is hidden.

**Feature strip** (5.3)

**About teaser**
- Two columns: image 42% (`bodybuilding.jpg`, fades right, stripes top-left) and content.
- H2: **MORE THAN A GYM.**
- Paragraph: "At **Alpha Pro Fitness**, we're the neighbourhood gym that takes training seriously. A big, cool floor, kit that's looked after, and certified coaches who'll actually **fix your form** before adding weight."
- Outline button: "Meet the team" → `/about#team`.
- Stats column with a hairline on its left:
  - **4,500**<sup>SQ.FT</sup> Training floor (counts up)
  - **8** Ways to train
  - **₹0** First workout

**Programs: wheel + tiles in ONE section** (`id="programs"`)
- Three columns: left text, centre wheel (560px), right details.
- Left:
  - Label: "Spin the wheel or pick one below"
  - H2: **8 WAYS TO TRAIN.**
  - Paragraph: "Eight ways to train on one floor. Scroll or drag the wheel. Tell a coach your goal and they'll put you on the right one."
  - Progress bar: 8 clickable 28×3px segments, filled lime up to the current program, then the counter "03 / 08".
- Centre: the wheel (behaviour in 7.3).
  - Outer circle: 1px `rgba(255,255,255,.16)` ring, with 72 tick marks every 5° and every 9th one longer.
  - The 8 program names sit around the ring in 13px weight 600, always kept upright. The selected name is lime and bold.
  - A lime 16px diamond marker at 12 o'clock.
  - A circular photo inset 9%.
  - "↻ Scroll to spin" in `--steel` 13px below the wheel.
- Right:
  - Counter "03 / 08" (`--steel`, 18px)
  - Program name (display style)
  - Description
  - Tag chips (13px, hairline border)
  - Two round 48px arrow buttons (prev, next; next is lime-bordered)
  - Text link "Try it free →"
- **Below, in the same section:** a row of 8 photo tiles (150px tall, 8 columns, 10px gap). Each tile shows the photo at 55% opacity with its name at the bottom; the selected tile has a lime border and lime name. On phone it becomes a horizontal scroll-snap row of 120px tiles with the scrollbar hidden.
- **Phone:** one centred column, wheel `min(78vw,320px)`, the left paragraph and progress bar hidden.

Program data (`src/data/programs.ts`; order matters, and the default selected is index 2, Crossfit):

| # | Name (ring label) | Photo | Description | Tags |
|---|---|---|---|---|
| 1 | Strength Training (Strength) | strength | Racks, bars and plates, coached from your very first lift. Form first, weight later. | Barbell · Progressive · All levels |
| 2 | Personal Training (Personal Training) | personal | One coach, one plan, built around your goal and your week. | 1-on-1 · Custom plan · Flexible slots |
| 3 | Crossfit (Crossfit) | crossfit | Short, sweaty, a bit loud. Kettlebells, carries and circuits, coached so you go hard without getting hurt. | High intensity · Groups · All levels |
| 4 | Body Building (Body Building) | bodybuilding | A full dumbbell wall and benches for hypertrophy splits, from your first cycle to stage prep. | Hypertrophy · Splits · Intermediate+ |
| 5 | Weight Management (Weight Mgmt) | weight | Lose fat or gain size steadily, with check-ins so you can see the change week to week. | Fat loss · Weight gain · Tracked |
| 6 | Nutrition Guidance (Nutrition) | nutrition | Simple eating plans that fit Indian kitchens and real routines. Pairs with any program. | Meal plans · Indian diet · Add-on |
| 7 | Cardio (Cardio) | cardio | Treadmills, bikes and conditioning work for stamina and heart health, on a fully air-conditioned floor. | Endurance · Heart health · Any time |
| 8 | Aerobics (Aerobics) | aerobics | Group sessions with music and energy. Open to every fitness level. | Groups · Music · Beginners welcome |

**Give us 60 minutes** (`id="sixty"`, hairline top and bottom)
- Label: "Your first hour is on us"
- Two columns:
  - **LED clock:** a `#0b0b0b` screen with a 10px `--surf` bezel and 10px radius. The ghost digits "88:88" show behind in `--led-off`. The lit digits read "60:00" in lime at 150px (phone `19vw`), with a small "GO" label (11px, 700, lime) in the top-right corner.
  - **Text:** H2 **GIVE US 60 MINUTES.**, then: "We'll prove why we're the best gym in Lingadheeranahalli. One free hour with a certified coach. Walk out convinced, or walk out owing nothing."
- Four steps in a row, with a hairline above and a lime progress bar that fills as you scroll (7.5):

| Time | Title | Text |
|---|---|---|
| 00 – 10 MIN | Walk the floor | See the 4,500 sq.ft, the kit and the A/C for yourself. |
| 10 – 20 MIN | Goal chat with a coach | What you want, what's held you back, what fits your week. |
| 20 – 50 MIN | Your first coached workout | Form first. Weight later. Every set watched. |
| 50 – 60 MIN | A plan you take home | Program, plan and price. No pressure to sign. |

  Step times are lime, 13px, 700. On phone the steps become a vertical list with the progress bar on the left.
- **Booking form** (`id="book"`): a `--surf` panel with a 4px lime left edge.
  - Fields in one row: Name (`placeholder "Your name"`), Phone (`inputmode="tel"`, `placeholder "10-digit mobile"`), Program (a select with the 8 programs plus "Not sure yet"; default Crossfit).
  - Submit: primary "Book my 60 minutes →".
  - Inputs are 52px tall, `#161617` fill, `rgba(255,255,255,.14)` border with a lime border on focus, radius 0, and a custom lime chevron on the select.
  - Behaviour in 7.6.

**Plans teaser** (hairline top and bottom)
- H2: **PLANS FROM ₹1,999 A MONTH.**
- Text: "Monthly, quarterly, half-yearly or annual. Same floor, same coaches. Sample prices."
- Buttons: primary "See membership →" (`/membership`), outline "Compare plans" (`/membership#compare`).

**CTA band** (5.4, "READY TO / EVOLVE?")

**Contact** (`id="contact"`)
- H2: **COME SAY HI**
- Two columns, info and map.
- Info:
  - Address: "4, 5, 6, 7, 2nd Block, Lingadheeranahalli, / D Group Employees Layout, Bengaluru 560091"
  - Call or WhatsApp: **90710 93361** (28px, display weight)
  - Parking: "Free, on the premises"
- Map: a 360px `--surf` panel with a stylised SVG street grid, a lime diamond pin labelled "ALPHA PRO FITNESS", and a "Directions on Google Maps ↗" link. Link it to `https://www.google.com/maps/search/?api=1&query=Lingadheeranahalli%2C%20D%20Group%20Employees%20Layout%2C%20Bengaluru%20560091` in a new tab. *(Optionally swap for a real Google Maps embed in production.)*

### 6.2 About `/about`

**Hero:** two columns, text and image.
- Label: "About AlphaPro"
- H1: **THE PEOPLE / BEHIND / THE IRON.**
- Text: "A neighbourhood gym in Lingadheeranahalli, run by people who lift, coach and actually show up every day."
- Image: `floor.jpg`, 440px, left edge slanted (`polygon(14% 0,100% 0,100% 100%,0 100%)`).
- Stripes behind on the right.

**Owner** (`id="owner"`): two columns, 460px portrait and text.
- Portrait 560px tall, with a lime "Founder" tag at bottom-left.
- Label: "From the owner"
- H2: **WHY ALPHAPRO EXISTS.**
- Quote (display italic, 34px): "“I wanted a gym where nobody waits for a bench and every beginner gets their form checked.”" **[PLACEHOLDER]**
- Attribution: a 40px lime line, then **Owner name** **[PLACEHOLDER]** / "Founder, Alpha Pro Fitness".
- Story: "Short story from the owner goes here: how AlphaPro started, why Lingadheeranahalli, and what they want every member to feel on their first day. Two or three lines in their own words." **[PLACEHOLDER]**
- Facts row under a hairline: **4,500** sq.ft floor · **8** programs · **2026** est. **[PLACEHOLDER year]**

**Team** (`id="team"`)
- Label: "The coaches"
- H2: **MEET THE TEAM.**
- Hint on the right: a small lime ring icon, then "Hover a coach to see their certifications" (phone: "Tap a coach to see their certifications").
- 4 coach cards in a row, 460px tall, photo with a dark bottom gradient. Name in 20px at weight 750, role in `--mute` below.
- **Hover (desktop) / tap (phone) / focus (keyboard) overlay:** a `rgba(18,18,19,.94)` panel slides up (.35s) and fills the card, with a lime card border. It contains:
  - Role (lime, 13px, 700)
  - Name (24px)
  - "X years coaching"
  - "Certifications" list with lime clipped-square bullets
  - "Coaches" chips
  - A primary button "Train with {first name} →" that goes to `/#book` with Program set to Personal Training
- On phone: a 2-column grid, and the opened card spans both columns.

Coach data (all **[PLACEHOLDER]**, keep in `coaches.ts`):

| Name | Role | Photo | Years | Certifications | Coaches |
|---|---|---|---|---|---|
| Trainer name | Head coach | personal | X | Certified personal trainer; Strength & conditioning; First aid & CPR | Strength; Fat loss; Beginners |
| Trainer name | Strength coach | coaching | X | same | same |
| Trainer name | Crossfit coach | crossfit | X | same | same |
| Trainer name | Aerobics & cardio | aerobics | X | same | same |

- Under the grid, 12px `#6b6d70`: "Names, photos and certifications are placeholders until AlphaPro shares the real team." (Remove this once real data arrives.)

**Feature strip** (5.3), then the **CTA band** ("READY TO / EVOLVE?").

### 6.3 Membership `/membership`

**Hero:** one column, stripes behind on the right.
- Label: "Membership"
- H1: **PICK A PLAN. / KEEP SHOWING UP.**
- Text: "Four plans. Same floor, same coaches. Start small if you're unsure and move up anytime."

**Plan cards** (`plans.ts`): 4 columns, each a `--surf` box with a hairline border and 30px padding. Inside each card:
- Plan name (15px, 600)
- Price (42px display) with a period suffix (13px `--mute`)
- Per-month line
- 3 features with steel diamond bullets
- A full-width button

| Plan | Price | Suffix | Sub-line | Features | Button |
|---|---|---|---|---|---|
| Monthly | ₹1,999 | /mo | Try it out | Full gym access · All equipment · Floor support | outline "Choose" |
| Quarterly | ₹4,999 | /3 mo | ≈ ₹1,666 a month | Everything in monthly · Starter program · Form check-ins | outline "Choose" |
| Half-yearly | ₹8,999 | /6 mo | ≈ ₹1,500 a month | Everything in quarterly · Nutrition guidance · Monthly progress review | outline "Choose" |
| Annual | ₹14,999 | /yr | ≈ ₹1,250 a month | Everything in half-yearly · 2 PT sessions · Freeze up to 30 days | **primary** "Choose annual →" |

- The Annual card has a lime border and a lime "Best value" tag in the top-right corner.
- Cards lift 6px on hover.
- The outline buttons inside cards use `--iron` fill.
- Below the cards, 12px: "Sample prices. Replace with AlphaPro's actual pricing." **[PLACEHOLDER prices]**
- "Choose" behaviour is in 7.6.

**Compare plans** (`id="compare"`, hairline top and bottom)
- Label: "Side by side"
- H2: **COMPARE PLANS.**
- A table with columns Monthly / Quarterly / Half-yearly / Annual. Header cells show the price small underneath. The Annual column is tinted `rgba(184,241,60,.05)`.
- A tick is a 16px lime clipped square; a dash is a 14×2px `#4a4b4e` bar.

| Feature | Monthly | Quarterly | Half-yearly | Annual |
|---|---|---|---|---|
| Full gym access | ✓ | ✓ | ✓ | ✓ |
| All equipment & A/C floor | ✓ | ✓ | ✓ | ✓ |
| Free parking | ✓ | ✓ | ✓ | ✓ |
| Starter program | – | ✓ | ✓ | ✓ |
| Form check-ins | – | ✓ | ✓ | ✓ |
| Nutrition guidance | – | – | ✓ | ✓ |
| Monthly progress review | – | – | ✓ | ✓ |
| Personal training sessions | – | – | – | 2 |
| Freeze membership | – | – | – | 30 days |

- On phone the table fits 390px (12.5px text, header prices hidden). Wrap it in `overflow-x:auto` as a fallback.

**Mini 60-minutes strip**
- Three columns:
  - A small LED clock (64px digits, same style as Home).
  - Display H3 (30px): **NOT SURE YET? GIVE US 60 MINUTES.** with the text "Free hour with a certified coach before you pay for anything."
  - Primary button "Book my 60 minutes →" (`/#book`).

**Gallery**
- Label: "What you're paying for"
- H2: **INSIDE ALPHAPRO.**
- A 4-column grid with two 240px rows. The first image spans 2 columns and 2 rows.
- Items: The main floor (`floor`), Dumbbell wall (`equip`), Cardio deck (`cardio`), Platforms (`strength`), Fully air-conditioned (`space`).
- Each caption is a small dark chip at bottom-left. Images zoom 1.05 on hover. Clicking opens the lightbox (7.8).
- Note: "Stock photos for the mockup. Replace with real shots of the AlphaPro floor." **[PLACEHOLDER photos]**

**FAQ** (`faq.ts`): two columns, 380px intro and the list.
- Label: "Front desk"
- H2: **QUESTIONS.**
- Text: "Anything else, call or WhatsApp 90710 93361."

| Question | Answer |
|---|---|
| Can I just come and look around first? | Yes. Walk in any time we're open, or book the free 60 minutes and a coach will show you around. |
| I've never been to a gym. Will I feel lost? | That's exactly who the free 60 minutes is for. A coach walks you round the floor and through your first workout, at your pace. |
| Can I switch plans later? | Yes. Talk to the front desk and they'll move you to a longer plan when you're ready. |
| Is personal training included? | The annual plan comes with two PT sessions. On any plan you can add personal training with a certified coach. |
| Where do I park? | There's dedicated parking on the premises, free for members. |

The first question is open by default. *(These answers were drafted for the mockup, so confirm them with the client.)*

**CTA band** ("READY TO / START?")

## 7. Behaviour and animation

Keep motion purposeful and quick. Wrap **all** motion in `@media (prefers-reduced-motion: no-preference)`. With reduced motion, everything shows instantly, the wheel doesn't auto-advance, and nothing counts up.

**7.1 Page load:** H1 and page-hero H1 rise 30px and fade in (.9s, `cubic-bezier(.2,.8,.2,1)`). The sub-text and buttons follow with a .15s delay. The hero photo eases from `scale(1.08)` to `1` over 1.6s. Stripes slide in from top-right (1s).

**7.2 Scroll reveal:** only elements that start **below the fold** get hidden (`opacity:0; translateY(26px)`). They animate in when 8% into the viewport (.8s), staggered 70ms within a group. Never hide anything already on screen at load. Include a fallback that reveals everything after 6s.

Targets: feature items, section H2s, wheel columns, tiles row, sixty columns, steps, form, plan cards, compare table, gallery items, FAQ items, coach cards, owner blocks, CTA content, contact columns.

**7.3 Program wheel** (`wheel.ts`)
- State: `current` (0–7) and `rotation` (degrees). The ring rotates `-current × 45°`, choosing the shortest direction, with a `.9s cubic-bezier(.3,.8,.2,1)` transition.
- **Labels stay upright:** each label sits on an arm rotated `i × 45°`; counter-rotate the label span by `-(rotation + i × 45)°` with the same transition.
- On change:
  - The circular photo cross-fades: the new image goes from `opacity 0, scale 1.1` to `1, 1` over .7s/1.1s.
  - The right column fades out 8px and swaps its text after 220ms.
  - The progress segments, counter and selected tile all update.
- Ways to change program:
  - Prev/next buttons.
  - Clicking a ring label.
  - Clicking a progress segment or a tile.
  - Arrow keys when the wheel has focus (`tabindex="0"`, `role="group"`, `aria-label="Program wheel. Use arrow keys to spin."`).
  - **Mouse wheel** over the dial: one step per gesture, 450ms lock.
  - **Pointer drag:** rotate live with the angle around the centre (no transition while dragging). On release, snap to the nearest 45° and select that program. Use `touch-action: pan-y` so vertical page scroll still works on phones.
- **Auto-advance** every 3.8s while the wheel is ≥40% visible, the tab is visible and reduced motion is off. Stop permanently after the first user interaction.
- "Try it free" sets the booking form's Program to the current program and scrolls to `#book`.

**7.4 LED clock** (`led.ts`, every `.led` on the page)
- When ≥50% visible: a quick "boot" where the digits flicker through 12 random times at 55ms, then settle on "60:00". After that it **counts down one second at a time** ("59:59", "59:58"…).
- Each tick briefly brightens the glow (180ms). It pauses when off-screen or the tab is hidden, and restarts from 60:00 when it comes back into view.

**7.5 Steps progress bar:** the lime bar above the four steps fills 0→100% as the steps block scrolls from 85% of the viewport height upward (width on desktop, height on phone).

**7.6 Booking form** (`booking.ts`)
- Validation on submit (no `alert()`). Show the error in `--error` under the form and set `aria-invalid` on the field:
  - Empty name: "Add your name so the coach knows who to expect."
  - Phone that isn't 10 digits after stripping spaces and a leading `91`: "Enter a 10-digit mobile number so we can confirm your slot."
- On success, the fields hide and this shows instead:
  - **"You're booked in."** (lime, 18px)
  - "Thanks, {first name}. The front desk will call {98765 43210 formatted} to fix a time for your free {program} hour."
  - Outline button "Book another", which resets the form.
- **Submission:** POST to a configurable endpoint (`PUBLIC_BOOKING_ENDPOINT`, e.g. Formspree or a small API), sending name, phone, program, plan and timestamp.
  - Also build a WhatsApp deep link as a fallback: `https://wa.me/919071093361?text=` plus the URL-encoded "Hi AlphaPro, I'd like to book my free 60 minutes. Name: …, Program: …".
  - Show a "Continue on WhatsApp" link in the success state.
- "Choose" on a plan card goes to `/#book` and shows a lime line above the submit: "Interested in the {Plan} plan. We'll go through it in your free hour." Pass the plan via `?plan=Annual` or `sessionStorage`. The submitted payload includes it.
- Arriving at `/#book` flashes the form border lime once (1.2s).

**7.7 Coach cards:**
- Desktop (`hover: hover`): show the overlay on hover and on `:focus-within`, and zoom the photo to 1.05.
- Touch: tapping toggles the overlay, and only one card is open at a time.
- "Train with…" goes to `/#book` with Program set to Personal Training.

**7.8 Gallery lightbox:**
- A fixed full-screen overlay `rgba(10,10,10,.94)` showing the image in black & white (max 1100px wide, 78vh tall) with its caption below.
- A 44px close button in the top-right.
- Close on ×, a backdrop click or Esc. Trap focus while open, and return focus to the thumbnail on close.

**7.9 FAQ:**
- Each question is a `<button aria-expanded>`. The answer opens by animating `grid-template-rows` from `0fr` to `1fr` (.35s), and the lime "+" rotates 45°.
- Several can be open at once.

**7.10 Count-ups:** the 4,500 numbers count from 0 over 1.4s (ease-out cubic) when 60% visible. Format with `toLocaleString('en-IN')`.

**7.11 Micro-interactions:**
- Buttons lift 2px and the arrow slides.
- Program tiles lift 4px and the image brightens.
- Plan cards lift 6px.
- Nav links brighten.
- The CTA image zooms slowly (6s) while hovered.

## 8. SEO and meta

- `<title>` per page:
  - "AlphaPro Fitness | Gym in Lingadheeranahalli, Bengaluru"
  - "About | AlphaPro Fitness"
  - "Membership & Plans | AlphaPro Fitness"
- Meta description per page, written from the copy above.
- Open Graph image: 1200×630, black with the logo and "TRAIN. BUILD. EVOLVE.".
- JSON-LD `HealthClub` schema on Home with:
  - name "AlphaPro Fitness"
  - telephone "+91-9071093361"
  - address (streetAddress "4, 5, 6, 7, 2nd Block, D Group Employees Layout, Lingadheeranahalli", addressLocality "Bengaluru", postalCode "560091", addressCountry "IN")
  - amenityFeature: air conditioning, parking
- `sitemap.xml` (via `@astrojs/sitemap`) and `robots.txt`.
- One H1 per page. Semantic `<header>`, `<main>`, `<section aria-labelledby>`, `<footer>`.

## 9. Accessibility

- Every interactive element is reachable by keyboard and has a visible lime focus ring.
- All images have meaningful `alt` (decorative ones `alt=""`).
- Colour contrast is AA or better. Check `--mute` on `--bg` and on `--surf`.
- Form inputs have `<label for>`, errors are linked with `aria-describedby`, and the success state uses `role="status"`.
- The mobile menu and lightbox trap focus and close on Esc.

## 10. Placeholders to replace before launch

1. Real logo file (vector or high-res PNG) from the client. The current one is cut from a poster.
2. Real photos of the AlphaPro floor, coaches and owner. All current photos are stock.
3. Owner name, quote, story and founding year.
4. Coach names, roles, years and certifications.
5. Actual membership prices and plan inclusions.
6. Opening hours (not yet known, and not shown anywhere yet). Add them to Contact and the FAQ answer "Walk in any time we're open" once known.
7. Social media links.
8. Confirm the FAQ answers with the client.
9. Booking endpoint and WhatsApp number confirmation.

## 11. Acceptance checklist

- [ ] All three routes match `reference/index.html` visually at 1440px and 390px.
- [ ] No horizontal scroll at any width from 320px to 1920px.
- [ ] Wheel works with click, drag, mouse wheel, keyboard, tiles and auto-advance, and labels stay upright.
- [ ] LED clock boots and counts down, and pauses off-screen.
- [ ] Booking form validates, submits, shows success, and carries program and plan.
- [ ] Coach overlay works on hover, tap and keyboard.
- [ ] FAQ, lightbox and mobile menu all work with keyboard and Esc.
- [ ] `prefers-reduced-motion` disables all motion.
- [ ] Background grain looks like fine rubber flooring with no visible tiling.
- [ ] Lighthouse mobile scores meet section 1 targets.
- [ ] `npm run build` passes clean, and every image is WebP with dimensions.
