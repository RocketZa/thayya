# THAYYA™ — UI/UX Design Specification

**Version 1.0 · June 2026 · Design direction for thayya.com v2**
**Author role: Lead Product / UX Designer**

This is the single source of truth for the Thayya web experience. Every screen, component,
and animation built for Thayya should be checkable against this document. It is written to
be reusable: future pages (booking flow, instructor dashboard, class detail) must inherit
the systems defined here.

---

## 1. Brand Foundation

### 1.1 What Thayya is

Thayya is a dance and movement platform — *"a movement rooted in Indian rhythms, culture,
and tradition."* The name comes from the spoken rhythm syllables (bols) of Indian dance —
*"thayya thakka"*. The brand motto is **Move. Rise. Shine.**

| Attribute | Value |
|---|---|
| Tagline | Move. Rise. Shine. |
| Positioning line | Find your rhythm. Move with your tribe. |
| Origin | Made in India (roots in Chennai / Tamil Nadu) |
| Audiences | 1. Students (discover & book classes) · 2. Instructors (certify, teach, earn) · 3. Studio owners (launch & grow under the Thayya brand) |
| Social | Instagram @thayyaofficial |

### 1.2 Creative direction — "Rhythm as Ritual"

One sentence: **a quiet, gallery-grade editorial canvas on warm handmade paper, where
Indian rhythm erupts in precise, deliberate bursts of the four logo colors.**

The tension that makes the site memorable: *restraint vs. celebration*. 90% of every
viewport is calm — cream space, ink typography, hairline rules, kolam dots. The remaining
10% is pure Holi: the gradient ribbon, a marigold accent, a Tamil syllable drifting past.
Like a dancer holding stillness before the beat drops.

**The one unforgettable thing:** the hero — a silk ribbon of thousands of particles in the
logo gradient (saffron → magenta → violet → teal) flowing like a dancer's dupatta in 3D
space, breathing with the scroll.

### 1.3 What this is NOT

- Not a neon gym site. No black-and-acid-green, no shouting.
- Not a "spiritual wellness" cliché. No incense-smoke gradients, no lotus overload.
- Not generic SaaS. No purple-gradient-on-white, no Inter, no card-grid-hero-CTA template.
- Indian elements are **structural** (grids from kolam geometry, type from Tamil script
  rhythm), never sticker-like decoration.

---

## 2. Design Principles

1. **Stillness first, then the beat.** Default state of any section is calm and editorial.
   Color and motion arrive as accents, the way a beat lands in a rhythm cycle.
2. **One hero moment per scroll-chapter.** Each section gets exactly one signature motion
   idea. Never compete with two spectacle effects in one viewport.
3. **Craft over decoration.** Every Indian motif must do a job — divide, guide, count,
   or texture. If removing it changes nothing, remove it.
4. **The grid is sacred; breaking it is the event.** A strict 12-column grid, broken
   deliberately by oversized numerals, overlapping imagery, and bleeding type.
5. **Type does the heavy lifting.** Imagery is scarce; typography is the primary visual
   material (true to the logo, which is itself lettering).
6. **Performance is a design feature.** 60fps scroll is non-negotiable. Effects degrade
   gracefully (see §13).

---

## 3. Color System

**The official brand palette** (supplied June 2026 as a Coolors export — overrides the
earlier logo-sampled values; the two agree closely, this is the canonical set).

### 3.1 Brand spectrum (logo order, left to right)

| Token | Hex | Maps to logo | Name |
|---|---|---|---|
| `--saffron` | `#F66917` | "Th" | Saffron — energy, sunrise, the start of movement |
| `--vermilion` | `#F04226` | "h→a" transition | Vermilion — sindoor, intensity |
| `--rani` | `#BD23A2` | "a/y" | Rani pink/magenta — celebration, Holi |
| `--violet` | `#9F26A7` | "yy" | Violet — depth, dusk, devotion |
| `--teal` | `#07AEAE` | "A" | Peacock teal — calm, balance, shine |

### 3.2 Neutrals (the canvas)

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FAF8F4` | Page background — warm paper off-white (official) |
| `--paper-deep` | `#F1EDE5` | Alternate section background, cards (derived from paper) |
| `--ink` | `#0F1112` | Primary text, the "MOVE. RISE. SHINE." bar black (official, never #000) |
| `--ink-soft` | `#5F5D59` | Secondary text, captions (derived) |
| `--hairline` | `rgba(15,17,18,0.14)` | Rules, borders, dividers |
| `--kolam-dot` | `rgba(15,17,18,0.22)` | Kolam dot patterns |

### 3.3 The gradient

```css
--thayya-gradient: linear-gradient(100deg,
  #F66917 0%, #F04226 25%, #BD23A2 50%, #9F26A7 72%, #07AEAE 100%);
```

**Usage is rationed.** The full gradient may appear at most **three times** on any page:
1. The hero ribbon (Three.js)
2. One typographic accent (e.g., gradient-filled italic word in the manifesto)
3. One micro-moment (link underline sweep, button hover fill, or footer wordmark)

Everything else uses **one** spectrum color at a time, assigned per section:

| Section | Accent color |
|---|---|
| Hero | full gradient (ribbon only) |
| Classes | per-card: 01 saffron · 02 rani · 03 violet · 04 teal · 05 vermilion · 06 saffron |
| Pathways | Students → rani · Instructors → violet · Studio owners → teal |
| Journey | saffron (the rising-sun arc of the timeline) |
| Trainings | vermilion (price/save tags) |
| CTA / Footer | gradient wordmark on ink |

### 3.4 Contrast ratios (mandatory)

- Body text: `--ink` on `--paper` = 15.4:1 ✓
- Never set body copy in a spectrum color. Spectrum colors are for display type ≥ 32px,
  tags, rules, and fills only.
- Text on spectrum fills: use `--paper` on violet/teal/vermilion; use `--ink` on saffron.

---

## 4. Typography

### 4.1 Typefaces

| Role | Family | Why | Loading |
|---|---|---|---|
| Display | **Fraunces** (variable: opsz 9–144, wght 100–900, + SOFT/WONK axes) | A soft "wonky" old-style serif. Its ink-trap warmth and slight irregularity echo hand-painted Indian signage and the brushy logo script, while staying gallery-modern. Use `wonk 1` on italic display words for personality. | `next/font/google`, variable, `display: swap` |
| Body / UI | **Hanken Grotesk** | Humanist grotesk, warm counters, excellent at 14–18px. Quiet enough to never compete with Fraunces. | `next/font/google` |
| Indic accent | **Anek Tamil** (by Ek Type) | For Tamil rhythm syllables (தை யா · தக தக) used as texture/marginalia. An authentic contemporary Indian type voice, never a "curry font". | `next/font/google`, subset on demand |

**Banned:** Inter, Roboto, Arial, Space Grotesk, Poppins, system-ui as a visible choice.

### 4.2 Type scale (clamp-based, 1440px reference)

| Token | Size | Usage |
|---|---|---|
| `--type-hero` | `clamp(64px, 11vw, 170px)` | Hero words "Move. Rise. Shine." — Fraunces opsz 144, wght 380, line-height 0.88, tracking −0.03em |
| `--type-h2` | `clamp(44px, 6.5vw, 96px)` | Section headlines — Fraunces, wght 420 |
| `--type-h3` | `clamp(28px, 3vw, 44px)` | Card titles — Fraunces wght 500 |
| `--type-lead` | `clamp(19px, 1.6vw, 24px)` | Manifesto/lead paragraphs — Hanken 400, line-height 1.55 |
| `--type-body` | `16–18px` | Body — Hanken 400, line-height 1.6 |
| `--type-label` | `12–13px` | Overlines, tags — Hanken 700, uppercase, tracking +0.18em |
| `--type-giant-numeral` | `clamp(120px, 22vw, 340px)` | Grid-breaking section numerals — Fraunces, 6–8% opacity ink, outlined variant for class cards |

### 4.3 Typographic devices (the house style)

- **Italic gradient word:** in any display headline, exactly one word may be Fraunces
  italic (`wonk 1`) with gradient fill — e.g., "Find your *rhythm*."
- **Overline + rule:** every section opens with a 13px uppercase label, a 1px hairline,
  and a Tamil syllable right-aligned on the same rule (e.g., `CLASSES ———————— தக`).
- **Marquee strips:** "MOVE · RISE · SHINE · தை யா ·" in outlined ink display type,
  one strip per page maximum.
- Numerals everywhere use Fraunces with `font-feature-settings: "onum"` (old-style
  figures) in body, lining figures in display.

---

## 5. Layout, Grid & Spacing

### 5.1 Grid

- **12-column fluid grid**, max-width `1360px`, gutter `clamp(16px, 2vw, 32px)`,
  outer margin `clamp(20px, 4.5vw, 72px)`.
- Section vertical rhythm: `clamp(96px, 14vh, 200px)` between chapters.
- **Asymmetry rule:** primary content sits on columns 2–8 or 5–12 — never centered
  blocks except the hero and final CTA. Marginalia (Tamil syllables, captions, index
  numbers) live in the leftover columns.

### 5.2 Spacing tokens

`--s1: 4px · --s2: 8px · --s3: 16px · --s4: 24px · --s5: 40px · --s6: 64px ·
--s7: 104px · --s8: 168px` (≈ golden-ratio progression; no arbitrary values in code).

### 5.3 Grid-breaking events (one per section, choose from)

- Giant ghost numeral bleeding off the viewport edge
- Image/video block overlapping the section boundary by `--s7`
- Headline word that escapes the container into the margin
- The pinned horizontal class rail (the largest break on the page)

---

## 6. Indian Design Language (motif library)

Every motif is geometric, single-color, hairline-weight. **No clipart, no photographs of
deities, no Taj Mahal silhouettes.**

| Motif | Construction | Where used |
|---|---|---|
| **Kolam dot grid** | Dots on a 22px diagonal lattice, `--kolam-dot`, density fades with a radial mask | Section background texture (hero bottom edge, journey section), loader |
| **Kolam loop line** | A single continuous SVG path that weaves around dot grid points (true pulli-kolam construction) | Journey timeline connector; draws itself on scroll (`stroke-dashoffset`) |
| **Mandala / rangoli ring** | 12-fold rotational SVG line art, 1px stroke, ink at 10% | Manifesto section backdrop, rotates 1°/scroll-% — barely perceptible |
| **Paisley (mankolam)** | Minimal single-stroke paisley, used as list bullet / divider terminal | Pathway card bullets, footer divider |
| **Temple stair step (gopuram steps)** | Stepped corner cuts on cards/images via `clip-path` | Class cards, training cards image corners |
| **Tamil syllables** | தை · யா · தக · திமி set in Anek Tamil, 12–14px, `--ink-soft` | Marginalia on section rules, marquee, loader counter |
| **Marigold dot** | A solid 8px circle in the section's accent color | Active nav state, list markers, timeline nodes |

**Density budget:** maximum two motif systems visible per viewport.

---

## 7. Motion Design System

### 7.1 Foundations

| Parameter | Value |
|---|---|
| Smooth scroll | Lenis, `lerp: 0.09`, `wheelMultiplier: 1` |
| Scroll engine | GSAP 3 + ScrollTrigger (registered once, in a client provider) |
| Signature easing | `cubic-bezier(0.62, 0.05, 0.01, 0.99)` — "the beat drop" (fast attack, long settle). GSAP equivalent: `expo.inOut` for pins, `power4.out` for reveals |
| Durations | Micro 150–250ms · reveals 0.9–1.2s · pinned chapters 1.5–2.5 viewport-heights |
| Stagger unit | 80ms (type), 120ms (cards) |
| `prefers-reduced-motion` | Lenis off, all ScrollTriggers `toggleActions` to simple fades, ribbon becomes a static gradient image. Mandatory. |

### 7.2 The choreography vocabulary (use these, nothing else)

1. **Line-mask reveal** — headlines rise from behind an invisible mask, per-line,
   80ms stagger, `power4.out`. The house reveal; used everywhere.
2. **Ink draw** — SVG hairlines and kolam paths draw via dash-offset, 1.2s.
3. **Parallax drift** — backgrounds/marginalia move at 0.85–0.92× scroll speed. Subtle.
4. **Pin + scrub** — the classes rail and manifesto word-reveal pin the viewport and
   scrub with scroll.
5. **Counter roll** — numerals roll up odometer-style (loader %, stats, prices).
6. **Magnetic hover** — primary buttons translate ≤6px toward cursor with spring return.
7. **Underline sweep** — links get a 1px gradient underline sweeping left→right, 250ms.

### 7.3 Page-load sequence (the overture)

1. `0–1.4s` Loader: cream field, kolam dots fade in around a counter (0→100, Fraunces),
   Tamil syllables தை→யா tick beside it.
2. `1.4s` Loader curtain wipes up (`expo.inOut`, 0.9s) revealing the hero.
3. `1.6s` Hero words "Move." "Rise." "Shine." line-mask reveal, 120ms stagger.
4. `2.0s` Ribbon particles stream in from the right edge, settling into their flow path.
5. `2.3s` Nav, sub-copy, CTAs fade up (60ms stagger). Page is interactive.

Loader shows only on first visit per session (sessionStorage flag).

---

## 8. Three.js Specification (hero: "The Dupatta")

| Aspect | Spec |
|---|---|
| Stack | `three` + `@react-three/fiber` v9 + `@react-three/drei` |
| Object | GPU particle ribbon: 18,000–24,000 points distributed along a curved band (a wide, twisted Catmull-Rom sweep across the right 60% of the hero) |
| Material | Custom `ShaderMaterial`. Vertex: curl-noise displacement flowing along the band (u-coordinate = phase), giving silk-in-wind motion. Fragment: color = sample of the five-stop brand gradient by particle `u`, soft round sprite, additive-free (normal blending — we're on a light background), alpha 0.55–0.9 |
| Interaction | Mouse: ribbon banks ±4° toward cursor (lerped, 0.04). Scroll: `uScroll` uniform advances flow speed + the ribbon drifts upward and thins as hero exits |
| Camera | Static perspective 35° FOV; all motion in the shader (cheap) |
| Background | Transparent canvas over `--paper`; no fog, no postprocessing (keeps it minimal + fast) |
| Perf budget | ≤ 3.5ms GPU frame on mid-tier laptop; DPR capped at 1.75; particle count halves below 768px viewport |
| Fallbacks | No WebGL → static SVG gradient ribbon (pre-drawn). Reduced motion → same static SVG. Mobile keeps 3D but at 9,000 particles |
| Secondary 3D (optional, post-launch) | Footer CTA: the ribbon returns, condensed into a slowly rotating mandala torus of the same particles — closes the loop. Ship only if perf budget holds |

---

## 9. Information Architecture

Single landing page (v2 scope) with anchor navigation; architecture supports future routes.

```
/                      Landing (this spec)
  #classes             Class formats rail
  #pathways            Students / Instructors / Studios
  #journey             Instructor journey timeline
  #trainings           Upcoming certification trainings
  #community           Social proof
/discover  (future)    Class search by location
/login     (future)    Member area
```

**Nav (desktop):** wordmark (SVG logo) left · Classes / Pathways / Trainings / Community
center-right · `Book a class` (primary pill) + `Log in` (text) right.
**Nav (≤900px):** wordmark + hamburger → full-screen cream overlay, links as Fraunces
display lines with line-mask reveal, kolam dots backdrop, Instagram + "Made in India" in
the overlay footer.
**Nav behavior:** transparent over hero → after 80vh, slides in a `--paper`/85% blur bar
with hairline bottom; hides on scroll-down, reveals on scroll-up.

---

## 10. Section-by-Section Specification

> Copy below is final draft v1 — refine freely at build time, keep the voice: short,
> rhythmic, confident. Sentence case. No exclamation marks except "MOVE. RISE. SHINE."

### 10.1 Hero — "The Dupatta" `#top`

- **Layout:** full viewport. Headline owns columns 1–8, set in three stacked lines:
  `Move.` `Rise.` `Shine.` — `--type-hero`, with "Rise." in italic + gradient fill
  (gradient appearance #2). Ribbon canvas occupies the right/back 60%, flowing behind
  the type (type is always legible — ribbon alpha drops behind glyph bounding area).
- **Marginalia:** vertical "தை யா — rhythm of the south" 12px rotated 90° on the far-left
  margin; scroll cue bottom-left: marigold dot pulsing on the beat (≈96 BPM), "scroll" label.
- **Sub-copy (columns 2–6):** "Movement rooted in Indian rhythms. Find your beat,
  your people, your power — one class at a time."
- **CTAs:** `Book a class` (primary: ink pill, paper text, magnetic, gradient sweep on
  hover) · `Become an instructor` (text link, underline sweep).
- **Bottom edge:** kolam dot lattice fading up, with a stat strip pinned to the hairline:
  `40+ cities · 1,200+ certified instructors · ∞ rhythm` (counter-roll on first view).

### 10.2 Marquee strip

`MOVE · RISE · SHINE · தை யா ·` repeating, outlined ink Fraunces ~80px, two rows moving
opposite directions at 0.6× scroll-velocity (scrubbed, not autoplaying). Hairlines above
and below. This is the page's only marquee.

### 10.3 Manifesto — "Not a workout. A homecoming." `#manifesto`

- **Layout:** columns 3–11. One paragraph set at `--type-h2` scale, pinned for 1.5
  viewports while words fill from `--hairline`-grey to `--ink` sequentially with scroll
  (word-by-word scrub) — the "spotlight reading" effect.
- **Copy:** "Thayya is not a workout. It's a homecoming. Movement built on the talas of
  Indian dance — folk, filmi, classical — where every body is welcome and every beat is
  an invitation. You don't perform. You *belong*." ("belong" = the italic gradient word —
  gradient appearance #3.)
- **Backdrop:** 12-fold rangoli ring, 1px ink 8%, rotating imperceptibly with scroll.
- **Exit:** the section's giant ghost numeral "01" sits behind, bleeding off the left edge.

### 10.4 Classes — "Six ways to move" `#classes`

- **Pattern:** pin + horizontal scrub rail (the page's biggest grid-break). Viewport pins;
  six cards travel right→left across ~2.5 viewport-heights of scroll. Progress shown as a
  thin gradient line filling along the top hairline + `01 / 06` Fraunces counter.
- **Card anatomy (each 420×560px, `--paper-deep`, gopuram-step top-right corner):**
  giant outlined numeral (01–06) in the card's accent color, class name in Fraunces h3,
  one-line description in Hanken, accent hairline, `Find a class →` link. Hover: card
  lifts 6px, numeral fills solid, paisley bullet slides in before the link.
- **Content:** 01 Bolly Groove — filmi-fired dance party · 02 Dance Flow — choreo-driven
  energy · 03 Rhythm Strength — beats + resistance · 04 Low Impact — joint-friendly flow ·
  05 Beat Burst — interval afterburn · 06 Kids Move — family dance jams.
- **Mobile:** rail becomes native horizontal snap-scroll, no pin.

### 10.5 Pathways — "Where do you stand?" `#pathways`

- **Layout:** three tall columns separated by hairlines (table-like, very editorial).
  Each column: overline (FOR STUDENTS / FOR INSTRUCTORS / FOR STUDIO OWNERS in its accent
  color), Fraunces h3 title (Discover & thrive / Teach & earn / Launch & grow), four-item
  list with paisley bullets, CTA.
- **Lists:**
  - Students: Book classes by location & goal · Track progress & streaks · Join
    challenges, earn badges · Move with your crew → `Start moving`
  - Instructors: Get certified by master trainers · Original choreography & music
    library · Manage schedule & bookings · Earnings tracked in real time → `Apply to teach`
  - Studios: Open under the Thayya brand · Onboard & approve your team · Payments &
    analytics built in · Grow a sustainable business → `Open a studio`
- **Motion:** columns line-mask reveal with 120ms stagger; hovering a column tints its
  background `--paper-deep` and shifts its hairlines to the accent color.

### 10.6 Journey — "From first beat to your own studio" `#journey`

- **Layout:** vertical timeline on column 4's hairline; content alternates columns 5–9 /
  marginalia column 2–3. Four nodes: **Train → Certify → Mentor → Launch** (copy from v1:
  structured programs by master trainers / recognized credentials / matched mentors &
  personal brand / open and manage your own studio).
- **Motion:** the connector is a true kolam loop path weaving around lattice dots —
  ink-draws downward as you scroll; each node is a marigold dot that pops (scale
  0→1.15→1, back.out) when the line reaches it; step numerals roll.
- **Backdrop:** ghost numeral "03"; saffron arc (sunrise) rises behind the final node.

### 10.7 Trainings — "Upcoming trainings" `#trainings`

- **Layout:** editorial table rows (not cards): each row = date block (Fraunces, day
  large / month-year small) · title + host · location (truncated, full on hover) ·
  price (old struck-through, new bold) · `Save 40%` tag (vermilion fill, paper text,
  gopuram-step corner) · `Reserve a spot` button.
- **Data (from v1):**
  1. THAYYA™ Level 1 Instructor Training · Abdul · Jun 13–14, 2026 · Chennai ·
     ₹18,000 → ₹10,800 · Save 40%
  2. THAYYA™ Level 1 Instructor Training · Abdul · Jun 20–21, 2026 · Panjim, Goa ·
     ₹18,000 → ₹10,800 · Save 40%
  3. THAYYA™ Level 2 Master Training · Priya Nair · Jul 4–6, 2026 · Bengaluru ·
     ₹26,000 → ₹18,200 · Save 30%
- **Motion:** rows ink-draw their separating hairlines, then content fades up; row hover
  shifts background to `--paper-deep` and slides the arrow CTA 8px right.

### 10.8 Film — "Feel it" (optional media chapter)

- The v1 hero video (`hero-banner-home-page.mp4`, muted, looped, lazy-loaded) inside a
  gopuram-stepped frame spanning columns 2–11, clip-path expands from 62% → 100% width
  while scrolling through (scrub). Caption: "Shot at Thayya trainings across India."
- Include only if the video grades well against the cream palette; otherwise cut.

### 10.9 Community — "The tribe" `#community`

- **Layout:** asymmetric quote collage: three short testimonials set as Fraunces
  pull-quotes at different scales/offsets (columns 2–6, 7–11, 4–9), each with name +
  city in `--type-label`, separated by generous `--s8` air. Marigold dot before each name,
  in rotating accent colors.
- Instagram CTA: `@thayyaofficial ↗` with underline sweep.

### 10.10 CTA + Footer

- **CTA:** ink section (`--ink` background — the page's single dark chapter, mirroring
  the logo's black bar). Centered Fraunces display: "Find your *rhythm*." (italic word in
  gradient — this is the footer gradient appearance). Sub: "Your first class is waiting."
  Primary button inverted (paper pill, ink text). Kolam dots in paper 10% drift behind.
- **Footer (still on ink):** gradient wordmark THAYYA™ · column links (Classes,
  Pathways, Trainings, Become an instructor, Log in) · Instagram ↗ ·
  `© 2026 Thayya™ · Made in India` with a tiny saffron-white-green hairline tricolor
  accent under "India" (subtle, 24px wide) · "MOVE. RISE. SHINE." letterspaced 13px.

---

## 11. Component Library (v1 inventory)

| Component | Variants | Key states |
|---|---|---|
| Button | `primary` (ink pill / paper text) · `inverted` (paper pill) · `text-link` | hover: magnetic + gradient underline/fill sweep · focus: 2px `--teal` offset ring · active: scale 0.97 |
| Tag / Overline | label · save-tag (vermilion) · accent overline | — |
| Class card | 6 accent variants | rest / hover (lift + numeral fill) / drag (rail) |
| Pathway column | 3 accent variants | hover tint |
| Training row | — | hover (bg + arrow slide) |
| Section header | overline + hairline + Tamil marginalia | ink-draw on enter |
| Marquee | single instance | scroll-velocity scrub |
| Nav | transparent / solid / hidden · overlay (mobile) | — |
| Loader | first visit per session | counter roll + curtain wipe |
| Kolam/rangoli SVGs | dot-lattice · loop-path · 12-fold ring · paisley | ink-draw, slow rotate |

All interactive targets ≥ 44×44px. Focus states are designed, not default.

---

## 12. Responsive Strategy

| Breakpoint | Behavior |
|---|---|
| ≥ 1440 | Full spec |
| 1024–1439 | Type scale via clamp; rail cards 380px |
| 768–1023 | Pathways stack to 1×3 rows with hairlines between; journey timeline moves to left edge; hero ribbon 60% particles |
| ≤ 767 | Nav → overlay; classes rail → native snap scroll; trainings rows → stacked cards; hero type 64–80px with ribbon flowing *behind* type vertically; marginalia hidden; ghost numerals at 12vw |
| Touch | No magnetic hover; all hover states have tap equivalents; pin distances shortened 40% |

---

## 13. Accessibility & Performance Budget

**Accessibility**
- Semantic landmarks (`header/main/section/footer`), one `h1` (hero), logical heading order.
- All scroll-driven text must be readable with JS disabled (content present in DOM,
  animations enhance only).
- `prefers-reduced-motion`: see §7.1 — full static experience, no pins, no Lenis, static ribbon.
- Canvas is `aria-hidden`; decorative SVGs `role="presentation"`.
- Keyboard: full tab order, visible focus, overlay nav traps focus, Escape closes.
- Color is never the only signal (tags carry text, states change weight/position too).

**Performance**
- Lighthouse targets: Performance ≥ 90, A11y ≥ 95, LCP ≤ 2.0s (hero headline is the LCP
  element — never the canvas), CLS ≤ 0.02.
- JS budget: three.js chunk lazy-loaded after first paint; GSAP+Lenis ≈ 60KB gz; no other
  animation libraries.
- Fonts: 3 families, variable, subset; `font-display: swap`; preload display face.
- Video: lazy, `preload="none"`, poster image, only loads near viewport.
- Images: `next/image`, AVIF/WebP.

---

## 14. Tech Stack & File Architecture

```
Next.js (App Router, JS)  ·  GSAP + ScrollTrigger  ·  Lenis  ·  three / @react-three/fiber / drei

app/
  layout.jsx              fonts (Fraunces, Hanken Grotesk, Anek Tamil), metadata, <SmoothScroll>
  page.jsx                section assembly only — no logic
  globals.css             tokens from §3–§5, base, utilities
  components/
    providers/SmoothScroll.jsx     Lenis + GSAP ticker bridge
    Loader.jsx
    Nav.jsx                        + overlay
    hero/Hero.jsx
    hero/RibbonCanvas.jsx          R3F scene (dynamic import, ssr:false)
    hero/ribbonShader.js
    Marquee.jsx
    Manifesto.jsx
    Classes.jsx
    Pathways.jsx
    Journey.jsx
    Trainings.jsx
    Film.jsx                       (optional)
    Community.jsx
    FooterCta.jsx
    motifs/Kolam.jsx, Rangoli.jsx, Paisley.jsx, GhostNumeral.jsx
    ui/Button.jsx, SectionHeader.jsx, TamilMark.jsx
public/
  logo.png                official logo
  hero.mp4                from v1 (re-encode ≤ 6MB, 1080p, h264+webm)
```

**Conventions:** design tokens only via CSS variables — no hardcoded hex in components;
every ScrollTrigger created inside `gsap.context()` and killed on unmount; all copy in a
single `content.js` so future CMS migration is trivial.

---

## 15. Reuse Guide (for future pages)

When building `/discover`, `/login`, dashboards, or class detail pages:

1. Inherit §3 tokens and §4 type scale verbatim; pick **one** accent color per page/section
   per the rationing rule (§3.3).
2. Reuse the section-header device (overline + hairline + Tamil marginalia) as the page
   header pattern.
3. Forms: 1px hairline inputs on `--paper`, label-above (Hanken 13px caps), focus ring
   teal, errors vermilion — never red.
4. Dashboards may drop the loader, marquee, and 3D; keep kolam dots, hairline tables
   (Trainings row pattern), and counter-roll numerals.
5. The gradient stays rationed: at most the wordmark + one accent moment per page.
6. Any new motif must pass the test in §2.3: *does it divide, guide, count, or texture?*

---

---

# ADDENDUM v2.0 — "Utsav" direction (June 2026)

The client redirected the experience from *restrained editorial minimalism* to
**vibrant festival maximalism with premium polish**. Structure, content order, and
functionality are unchanged; the visual and motion layers are amplified. Where this
addendum conflicts with §1–§15, the addendum wins.

## A1. Revised creative direction — "Utsav" (celebration)

One sentence: **a continuously colorful, light-filled celebration of Indian rhythm —
gradient atmospheres, glowing ornament, and cinematic motion on every screen.**
The page should never feel flat or empty; every chapter has its own living atmosphere.
Still modern and abstract — never literal temple/deity illustration, no clipart.

## A2. Language constraint (hard rule)

The words **"Zumba"**, **"HIIT"**, and **"fitness"** must never appear in copy.
Use: movement, dance, rhythm, energy, expression, celebration, wellness, community.
Renamed formats: 01 Bolly Groove · 02 Dance Flow · 03 Rhythm Strength · 04 Low Impact ·
05 Beat Burst · 06 Kids Move.

## A3. Extended festival palette

Core five (§3.1) unchanged and still dominant. Supporting tones now sanctioned:

| Token | Hex | Use |
|---|---|---|
| `--marigold` | `#FFB627` | Warm accents, glows, card 06, highlights |
| `--peacock` | `#0E86C4` | Cool accents, gradient extensions |
| `--indigo` | `#34208C` | Depth tones, dark-section gradients |
| `--emerald` | `#0FA36B` | Occasional fresh accent (sparingly) |
| `--gold` | `#D4A437` | Hairline luxury accents on dark chapters |
| `--midnight` | `#14102E` | Dark chapters — deep indigo night replaces near-black |

The §3.3 gradient-rationing rule is RETIRED. Gradients are now ambient and recurring,
but **text legibility is sacred**: body copy stays ink-on-light or paper-on-dark.

## A4. Atmosphere kit (implemented in globals.css)

- `body` — fixed multi-corner radial festival mesh (saffron/rani/teal/violet tints).
- `.aurora` — blurred glowing color blobs, `aurora-drift` 18s alternate; 2–4 per section,
  colored to the section's accent pair.
- `.gradient-live` — 300% animated gradient surface/text (`gradient-shift` 9s).
- `.glass` / `.glass-dark` — frosted cards on light/dark chapters.
- `.grain` — SVG noise overlay so color fields feel filmic, not synthetic.
- `.glow` — saffron/rani glow ring for badges, dots, CTAs.
- `.float` — 7s gentle vertical float for ornaments.
- Buttons: primary = animated gradient pill with colored shadow + hover lift.

## A5. Per-chapter atmospheres (structure unchanged)

| Chapter | Atmosphere |
|---|---|
| Hero | Paper base + saffron→rani aurora behind the 3D mandala; layered type with gradient + outlined echoes |
| Marquee | Gradient-live fill on one row, outlined ink on the other |
| Manifesto | Warm saffron-tinted wash, rangoli backdrop now in color (saffron→rani stroke) |
| Classes | Each card gets a tinted glass surface + its accent aurora; numerals gradient-filled |
| Pathways | Columns become glass cards over a violet→peacock wash |
| Journey | Sunrise atmosphere: marigold→saffron auroras, gold timeline |
| Trainings | Light, but rows glass with vermilion glow accents on price/save |
| Film | Frame glow in rani/violet; ambient auroras around |
| Community | Dusk: violet/indigo tinted wash, quotes with gradient accent words |
| CTA/Footer | `--midnight` indigo night with aurora nebulae, gold hairlines, glowing CTA |

## A6. Three.js — "Digital Rangoli" (replaces §8 Dupatta as the hero scene)

GPU particle system (~24k points) arranged by **polar rangoli/mandala mathematics**:
12-fold symmetric rose-curve rings (r = R·cos(kθ) families + concentric kolam dot rings),
gently rotating (≤ 0.03 rad/s), breathing (radial sine pulse), and **continuously
evolving** — particles morph between 2–3 rangoli formations on a slow cycle.
Color = particle radius mapped through the five-stop brand gradient (+ marigold shimmer
by seed). Mouse: pattern tilts ±6° toward cursor and locally brightens. Scroll: the
mandala loosens into free-flowing silk particles as the hero exits (dupatta DNA retained).
Placement: right-weighted behind the headline, partially clipped by viewport edge.
Same perf budget, DPR cap, mobile particle halving, reduced-motion/no-WebGL static
SVG mandala fallback as §8.

## A7. Motion additions

All §7 choreography retained, plus: ambient continuous animations (auroras, floats,
slow mandala spin) independent of scroll; parallax depth on ornaments (±8%);
magnetic + glow-pulse on primary CTAs; per-chapter color-temperature shift so scrolling
feels like moving through a festival from dawn (hero) to night (footer).
Reduced-motion: ambient loops freeze to their midpoint, everything else per §7.1.

---

---

# ADDENDUM v3.0 — Mobile-First Hero (Design Review Response, June 2026)

Stakeholder review found the hero hard to read on mobile: the dotted rangoli artwork sat
directly behind the headline and copy, the layout read as desktop-scaled-down, and the
CTAs competed with the background. This addendum is the design response. Where it
conflicts with §10.1 / A5 / A6, **this addendum wins for the hero chapter**.

## A8.1 Principles (now binding for the hero)

1. **Mobile is the primary design target.** Hierarchy: headline → supporting copy →
   primary CTA → secondary CTA → decoration, in that order, all above the fold.
2. **Content-safe zone.** A reserved area (top ~55% of the mobile viewport; left ~50%
   of the desktop viewport) where **no decorative asset may render**. Artwork that
   approaches the zone must fade to zero via a mask, not merely dim.
3. **Decoration supports, never competes.** The eye flows headline → copy → CTA, not
   artwork → artwork → text.

## A8.2 Concepts explored

**Concept A — Minimal:** remove the rangoli from the content area entirely; cream
paper + the body's soft festival mesh only; clean typography carries the hero.
*Pro:* maximum readability, fastest paint. *Con:* loses the signature 3D moment and the
"Utsav" promise; hero reads generic next to the rest of the page.

**Concept B — Watermark:** keep the rangoli full-bleed behind the type but at 5–10%
opacity. *Pro:* keeps the motif everywhere. *Con:* at 5–10% the particles read as noise,
not pattern — worst of both worlds (still texture behind glyphs, no longer a feature).

**Concept C — Split / edge accent (RECOMMENDED, implemented):**
- **Mobile:** content owns the top of the viewport on a soft brand wash (auroras at
  reduced opacity). The Digital Rangoli is demoted to a **bottom-edge corner accent** —
  a short band above the stat strip, ~55% opacity, masked so it fades to nothing before
  reaching the copy. Zero artwork behind headline, copy, or CTAs.
- **Desktop/tablet:** the existing split composition, hardened — canvas constrained to
  the right 62% with a left-edge mask (`transparent → black at 35%`) so particles fade
  out before the copy column. The outlined type echo stays (hairline, 10% opacity — it
  was not the complaint and is not dotted texture).
*Rationale:* preserves the award-level 3D signature while making readability structural
(a mask guarantee) rather than tuned (an opacity guess). One mental model across
breakpoints: content column + artwork zone.

## A8.3 Mobile hero spec (≤767px)

```
┌──────────────────────────┐
│  nav                     │
│                          │
│  Move.                   │   content-safe zone
│  Rise.        ← gradient │   (no artwork may
│  Shine.                  │    render here)
│                          │
│  Movement rooted in      │
│  Indian rhythms. …       │
│                          │
│ ┌──────────────────────┐ │
│ │     Book a class     │ │   primary CTA, full-width
│ └──────────────────────┘ │
│    Become an instructor  │   secondary, centered link
│                          │
│      · rangoli band ·    │   bottom accent, 55% opacity,
│ ──────────────────────── │   masked fade-up, clears stats
│  40+   1200+   ∞  (stats)│
└──────────────────────────┘
```

- Section top-aligned; content padding-top `clamp(96px, 14vh, 136px)`.
- CTAs stack vertically: primary `.btn` full-width and centered (most prominent
  element after the headline); secondary `link-sweep` centered beneath.
- Echo and all floating ornaments hidden; auroras reduced to 0.32 opacity (soft
  gradient wash only — backgrounds still never flat).
- Mandala: 12k particles, radius 2.4, weighted to the bottom-right corner of its band.
- Kolam dot lattice behind the stat strip halved in opacity.

## A8.4 Accessibility review

- Headline ink `#0F1112` on paper `#FAF8F4`: ~17.4:1 — passes AAA.
- Body/lead `#5F5D59` on paper: ~6.9:1 — passes AA (and AAA for large text).
- Primary CTA: white on the saffron→violet gradient pill; darkest stops carry it,
  plus 700 weight at 16px — passes AA for UI text against every stop except pure
  saffron, which occupies the leading edge only; the label always overlaps the
  red-magenta midrange. Verified visually at all viewports.
- Gradient italic word ("Rise."): teal/saffron stops sit near 2.6–2.8:1 on cream —
  borderline for large text. Mobile applies `filter: brightness(0.85)` to the word,
  lifting the weakest stop above the 3:1 large-text threshold. Two of three headline
  words remain solid ink, so the headline never depends on the gradient word alone.
- Focus, semantics, reduced-motion: unchanged from §13 (one `h1`, canvas
  `aria-hidden`, static fallback).

## A8.5 Validation matrix

Playwright screenshots required at: 360×800, 375×812, 390×844, 412×915 (mobile),
768×1024 (tablet), 1440×900, 1920×1080 (desktop). Pass = headline, copy, and primary
CTA fully above the fold on every mobile size; no decorative pixel inside the
content-safe zone; no overlap or truncation anywhere.

Concept comparison mockups: `design/hero-concepts.html` (static, token-faithful).

---

*End of specification. Build against this document; deviations should be intentional
and noted back into this file.*
