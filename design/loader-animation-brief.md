# Thayya — Loader Animation Design Brief

> **Purpose of this file.** This is a self-contained creative + technical brief you can hand
> to a design/animation agent (or a human motion designer) to produce a *world-class* loading
> animation for Thayya. It contains the brand soul, the exact visual tokens, the cultural
> inspiration, several elaborate concept directions, a frame-accurate motion choreography, and
> the hard technical contract the animation must satisfy to drop into the codebase. Read it
> top to bottom. You are encouraged to be ambitious — this loader is the first thing a visitor
> ever sees, the curtain before the show. Make it unforgettable, not decorative.

---

## 0. TL;DR for the agent

Design a **first-visit overture**: a ~2.0–2.8s animated loading sequence on a warm cream field
that builds from stillness to a single rhythmic "strike," then lifts like a curtain to reveal the
site. The animation must be **rooted in Bharatanatyam rhythm and kolam/rangoli geometry**, use the
**Thayya gradient** (saffron → vermilion → rani → violet → teal), feel **musical and on-the-beat**
(≈96 BPM), and respect a strict handoff contract (fire `thayya:reveal`, honor reduced-motion, gate
to first visit per session). Deliver concept + motion spec + a production implementation (GSAP +
SVG/Canvas preferred; Lottie or lightweight WebGL acceptable). No generic spinners. No clichés.

---

## 1. What Thayya is (one breath)

Thayya is a movement brand — dance and fitness **rooted in Indian rhythms**. The promise is
**"Move. Rise. Shine."** It is *Made in India* and proud of it, but it is not a tourist postcard:
the Indian-ness is **structural and rhythmic**, never costume. People come here to find their beat,
their people, and their power — one class at a time. The aesthetic is editorial, confident, warm,
and a little cinematic: cream paper, ink type, hairline rules, and sudden blooms of saturated color.

**The single most important idea:** *Thayya is rhythm made visible.* The loader should feel like the
**count-in before a dance** — the moment a teacher claps the tala and the room snaps to attention.

---

## 2. The soul — the Indian inspiration (use this richly, not literally)

### 2.1 The name is a drum
"**Thayya**" is itself a spoken-rhythm syllable. The brand's motif syllables —
**தை (thai) · யா (yaa) · தக (taka) · திமி (thimi)** — are **konnakol / solkattu**: the vocal
percussion of Carnatic music and Bharatanatyam, the way dancers and percussionists *speak* a rhythm
before they play or step it ("ta-ka-di-mi, ta-ka-jham…"). The loader's count-up is not a generic
progress number — it is a **count-in**. Treat the syllables as the soundtrack you are visualizing.

### 2.2 Bharatanatyam vocabulary (authentic seeds — pick, don't pile on)
- **Tala** — the rhythmic cycle; a loop with a clear "sam" (the downbeat, the moment of resolution).
- **Adavu** — the basic step-units of the dance; crisp, geometric, repeatable.
- **Aramandi** — the half-sitting grounded posture; everything springs from this coiled stillness.
- **Mudra** — precise hand gestures; *pataka* (flat hand), *alapadma* (the blooming lotus), *tripataka*.
- **Nritta** — pure rhythmic dance, no narrative — geometry and timing for their own beauty.
- **Salangai / ghungroo** — ankle bells; light catches them, and they ring on every strike.
- **Teermanam / jathi** — a rhythmic phrase that ends on a decisive accent (your reveal *is* this accent).

> Design rule: the animation should have a **count-in, a build, and a single decisive "sam"** — the
> strike on which the curtain lifts. Everything resolves on that beat.

### 2.3 Kolam & rangoli (the geometry)
- **Kolam (pulli kolam):** a lattice of dots with a single continuous looping line woven *around* the
  dots — drawn freehand each dawn on the threshold. It is math you can dance. Use **dot lattices** and
  **self-drawing loop paths** (stroke-dashoffset reveals).
- **Rangoli / mandala:** **12-fold rotational** line art, radial symmetry, blooming outward from a center.
- **Mankolam (paisley):** a single-stroke paisley/mango motif; elegant terminal/bullet.
- **Threshold meaning:** kolam is drawn at the doorway to welcome. A loader *is* a threshold. Lean in.

### 2.4 Atmosphere
Warm temple-dawn light, marigold and saffron, the haze of incense and stage lighting — rendered as
**aurora blooms** (soft radial color) and a **filmic grain** wash. Never flat, never sterile.

**Avoid the clichés:** no literal lotus-logo spin, no Taj Mahal, no "Om", no Bollywood gold filigree,
no mehndi borders as mere decoration, no diya/flame emoji energy. Abstract the rhythm and geometry.

---

## 3. The visual system (exact tokens — use these real values)

### 3.1 Color
| Token | Hex | Role |
|---|---|---|
| `--saffron` | `#f66917` | primary warm; count-in glow |
| `--vermilion` | `#f04226` | heat / accent |
| `--rani` | `#bd23a2` | rani pink; mid-gradient |
| `--violet` | `#9f26a7` | depth |
| `--teal` | `#07aeae` | cool resolve; end of gradient |
| `--marigold` | `#ffb627` | bell/spark highlights |
| `--peacock` | `#0e86c4` | secondary cool |
| `--indigo` | `#34208c` | shadow color |
| `--gold` | `#d4a437` | ghungroo / metallic glints |
| `--midnight` | `#14102e` | deep night (if you invert) |
| `--paper` | `#faf8f4` | **the loader ground** (warm cream) |
| `--paper-deep` | `#f1ede5` | paper shadow |
| `--ink` | `#0f1112` | type |
| `--ink-soft` | `#5f5d59` | secondary type |
| `--kolam-dot` | `rgba(15,17,18,0.22)` | dot lattice |

**Signature gradient (`--thayya-gradient`)** — the brand's living color, used on the counter and the strike:
```
linear-gradient(100deg, #f66917 0%, #f04226 25%, #bd23a2 50%, #9f26a7 72%, #07aeae 100%)
```
This gradient should **shift / flow** during the build (animated background-position), so the color
feels alive, like stage light moving across a body.

### 3.2 Typography
- **Display:** *Unbounded* (variable, bold, rounded, energetic) — `--font-display`. Use for the counter.
- **Body / label:** *Plus Jakarta Sans* — `--font-body`. Use for the motto, set in small caps / tracked.
- **Tamil:** *Anek Tamil* — `--font-tamil`. Use for the konnakol syllables (தை · யா · தக · திமி).
- Counter numerals: **tabular-nums**, odometer behavior, `clamp(72px, 10vw, 140px)`.

### 3.3 Motion grammar (the house style — match it)
- **Beat:** the brand moves at **~96 BPM** (one beat ≈ 625ms). Time accents to the beat.
- **Signature easing (`--ease-beat`):** `cubic-bezier(0.62, 0.05, 0.01, 0.99)` — slow coil, fast release.
  This is *aramandi → jump*: tension then snap. Use it for the strike and the curtain.
- **Curtain wipe:** `expo.inOut`, ~0.9s, `yPercent: -100` (the ground lifts up and away).
- **Counter roll:** odometer 0→100, `power2.inOut`, ~1.3s.
- **Ink-draw:** SVG paths reveal via `stroke-dashoffset` over ~1.0–1.4s (kolam drawing itself).
- **Durations:** micro `200ms`; reveal `~1s`. Keep the whole loader **≤ 2.8s** on first paint.

---

## 4. The loader's job (functional spec — non-negotiable behavior)

1. **First visit per session only.** Gated by `sessionStorage` (`thayya-loaded`). On repeat
   navigations within the session, the loader does **not** play.
2. **It is a curtain over the real page.** It sits full-viewport (`position: fixed; inset: 0;
   z-index: 100`) above the already-rendered hero, then lifts to reveal it. The hero's `<h1>` is the
   LCP element and is painted *behind* the loader — the loader must **never delay or block** it.
3. **It hands off on a single signal.** When the animation completes it MUST:
   - set `window.__thayyaRevealed = true`, and
   - dispatch `window.dispatchEvent(new CustomEvent("thayya:reveal"))`.
   The hero and other sections start their entrance animations on this event. **If you break this
   contract, the site never animates in.** (If reduced-motion or repeat-visit, fire it immediately.)
4. **Reduced motion.** If `matchMedia("(prefers-reduced-motion: reduce)").matches`, skip the whole
   sequence: no curtain, no count — reveal instantly. Provide a calm, static fallback if anything shows.
5. **JS-gated visibility.** The loader is only ever displayed when JS is present to dismiss it
   (the document root gets an `html.js` class before paint). Never trap a no-JS user behind a curtain.

**Current baseline (what exists today — you are replacing/elevating this):** cream field, kolam dot
lattice, two aurora blooms (saffron + violet), a gradient counter 0→100 with the four Tamil syllables
ticking under it, a grain wash, the motto "MOVE. RISE. SHINE." pinned at the bottom, then a curtain
wipe up. It works but it is *quiet*. We want **artful, rhythmic, memorable** — without betraying the
calm-then-bloom personality.

---

## 5. Creative directions (pick one and go deep, or fuse two)

Each is a fully-formed concept. Don't do all of them — choose the one with the strongest single idea
and execute it to a very high finish. Every direction must still satisfy §4.

### Direction A — "The Kolam Draws Itself" (geometry / self-drawing line)
A pulli-kolam dot lattice fades in. A **single continuous loop line** then **draws itself** around the
dots (stroke-dashoffset), tracing an intricate symmetric kolam in one unbroken gesture — as if an
unseen hand is welcoming you at the threshold. The line is stroked with the **flowing Thayya gradient**.
As the path closes its final loop (the "sam"), the whole figure **pulses once**, light blooms from the
center, and the cream ground **lifts** to reveal the site. The counter (0→100) lives small in a corner
or at the lattice center, odometer-rolling in time with the line's progress. *Why it's great: it is
literally the brand's geometry performing itself, and the "drawn in one stroke" reveal is mesmerizing.*

### Direction B — "Count-In" (konnakol / rhythm made visible)
Pure rhythm. The screen is still. Four **beats** land — தை · யா · தக · திமி — each syllable striking in
in sync with a visual accent: a **ring of marigold sparks** (ghungroo bells) flares on each beat, a
low concentric shock-ring expands, the gradient counter jumps in steps (not smooth) — **25 → 50 → 75 →
100** — quantized to the beat. On the fourth strike ("sam"), everything resolves: the sparks settle, a
**12-fold rangoli** snaps into existence around the number, and the curtain lifts on the downbeat.
Sound-design-ready (even silent, it should *feel* like you can hear it). *Why it's great: it turns a
boring progress number into a percussion solo; deeply on-brand to the name itself.*

### Direction C — "Rangoli Bloom" (radial symmetry / alapadma mudra)
From a single point of saffron light, a **12-fold rangoli mandala blooms outward** petal by petal, like
the *alapadma* (lotus) mudra opening — rotational symmetry unfurling in time with the count. Layers of
line-art stack and rotate at different speeds (a living mandala). At 100, the mandala reaches full
bloom, over-saturates into the gradient, and **dissolves into grain** as the curtain wipes. *Why it's
great: the bloom is a perfect metaphor for "Rise. Shine." and reads instantly as celebratory, feminine,
powerful.*

### Direction D — "Ribbon of Light" (the dancer's trail / cloth in motion)
A single **ribbon of the Thayya gradient** — think a dupatta or the arc a hand leaves in a long-exposure
of a dancer — sweeps across the cream field in flowing, rhythmic strokes, folding into transient
**kolam-like knots** and releasing. It choreographs the four beats as four sweeps, tightening to a
luminous knot at the center on the "sam," then the ribbon **unfurls upward** and carries the curtain
with it. Can be done with WebGL/shader trails or animated SVG. *Why it's great: most "premium / motion-
reel" feel; pairs with the existing hero ribbon canvas for visual continuity.*

### Direction E — "Aramandi → Leap" (posture / energy, most abstract)
Everything is coiled and low. A grounded, compressed form (a heavy gradient orb, or a bowed line —
the *aramandi* crouch) holds tension while the counter builds. On 100, using `--ease-beat`, it
**explodes upward** in one decisive leap — color streaks, grain flares — and the leap *is* the curtain
lift. Minimal, athletic, gym-meets-classical. *Why it's great: most directly expresses "Move. Rise."
and the fitness side of the brand; very few elements, very high impact.*

> **Recommended default if unsure:** fuse **A (kolam self-draw)** as the build with **B (count-in
> beats)** as the timing spine — geometry performing itself, quantized to konnakol. It is the most
> "Thayya" possible: the threshold welcome drawn in rhythm.

---

## 6. Motion choreography (frame-accurate target — adapt to your concept)

Total budget **≈ 2.4s** (hard ceiling 2.8s). Times are from first paint. Beat ≈ 625ms (96 BPM).

| Phase | Time | What happens | Easing |
|---|---|---|---|
| **0 · Stillness** | 0–0.15s | Cream field + grain present. A single point/seed of saffron light. Held breath. | — |
| **1 · Count-in** | 0.15–1.45s | Counter rolls 0→100 (odometer). Konnakol syllables tick தை→யா→தக→திமி. The build (kolam draws / mandala blooms / ribbon sweeps) tracks the number. Gradient flows. | `power2.inOut` + beat accents on each ¼ |
| **2 · The Sam (strike)** | 1.45–1.70s | The decisive accent: figure closes/blooms fully, a single light-bloom + ghungroo spark ring, micro over-saturation into the gradient. Everything lands on one beat. | `--ease-beat` (coil→snap) |
| **3 · Curtain lift** | 1.70–2.55s | The cream ground lifts (`yPercent:-100`), or unfurls upward, revealing the hero already in place. **Fire `thayya:reveal` as the lift begins**, so the hero animates in *underneath* the rising curtain (overlap, don't wait). | `expo.inOut` / `--ease-beat` |
| **4 · Handoff** | ~2.55s | Loader unmounts. Hero/sequence owns the screen. | — |

Choreography notes:
- **Overlap the handoff.** Dispatch `thayya:reveal` at the *start* of the curtain lift, not after it,
  so the hero's entrance and the curtain's exit cross-fade. This is what makes it feel expensive.
- **Accent, don't drift.** Indian rhythm is about *crisp landings*. Snap key moments to the beat;
  let only atmosphere (aurora, grain, gradient flow) move continuously.
- **One hero moment.** The "sam" is the single thing people remember. Spend your polish budget there.

---

## 7. Technical integration contract (must drop into the codebase)

**Stack & conventions (match these):**
- Next.js (App Router) **client component**, React 19. File: `app/components/Loader.jsx`,
  styles in `app/components/Loader.module.css` (CSS Modules). Animation lib: **GSAP** (already a
  dependency, with `ScrollTrigger`). SVG and/or Canvas welcome. **Lottie** acceptable if exported
  lightweight and colors are themable. **WebGL/Three** acceptable (Three + R3F are already deps) but
  only if it stays within the performance budget and degrades gracefully.
- Use the **CSS custom properties / tokens in §3** (they exist in `app/globals.css` — reference
  `var(--saffron)`, `var(--thayya-gradient)`, `var(--ease-beat)`, etc.; do not hardcode new hexes).
- Existing utility classes you can reuse: `.kolam-field` (dot lattice), `.aurora` (drifting bloom),
  `.grain` (film grain), `.gradient-live` (animated gradient text), `.tamil`, `.display`, `.label`.

**The reveal contract (copy this behavior exactly):**
```js
function reveal() {
  window.__thayyaRevealed = true;
  window.dispatchEvent(new CustomEvent("thayya:reveal"));
}
// First-visit gate + reduced-motion:
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const seen = sessionStorage.getItem("thayya-loaded");
if (seen || reduced) { /* show nothing */ reveal(); return; }
sessionStorage.setItem("thayya-loaded", "1");
// ...run the animation, then in the timeline call reveal() as the curtain starts lifting...
```
- The loader element: `position:fixed; inset:0; z-index:100; background:var(--paper);` and only
  shown under `html.js` (a `:global(html.js) .loader { display:flex }` rule).
- On completion, set local state so the component returns `null` (unmounts) — don't leave an
  invisible full-screen layer trapping clicks.

**Performance budget (hard requirements):**
- **Do not block or delay the hero `<h1>` (LCP).** The loader paints over an already-rendered page.
- 60fps on a mid-range laptop and a 2021 mid-range phone. Animate only **transform / opacity /
  background-position / stroke-dashoffset** (compositor-friendly). No layout thrash, no animating
  width/height/top/left.
- Total added JS for the loader ≤ ~30KB gzip beyond existing deps. If using Lottie JSON, ≤ ~150KB and
  lazy-load it. If using WebGL, guard for context-loss and weak GPUs (fall back to the SVG/Canvas version).
- No external network fetch on the critical path (no remote fonts/JSON blocking the reveal). The reveal
  must fire on a **timeout-safe** basis — if an asset fails, still reveal within the budget (never hang).
- Respect `prefers-reduced-motion` and also keep CPU/GPU calm (this is the first impression on battery).

**Theming / robustness:**
- Must look correct on the warm cream `--paper` ground (not pure white) and survive a dark fallback.
- Must be crisp from 320px mobile to 1440px+ desktop (use the `clamp()` type sizes in §3.2).
- The four Tamil syllables must render with Anek Tamil; provide a graceful look if the Tamil font is slow.

---

## 8. Accessibility

- `aria-hidden="true"` on the whole decorative loader; it conveys no information a user needs.
- Honor `prefers-reduced-motion: reduce` → instant reveal, no motion (see §4.5, §7).
- Never trap focus or block interaction longer than the budget; the curtain must always lift.
- No flashing faster than 3 Hz and no large full-field luminance strobes (photosensitivity safety).
  The "ghungroo spark" accents must be small and soft, not a screen-wide flash.
- Sufficient contrast for the motto text (`--ink-soft` on `--paper` is fine; don't go lighter).

---

## 9. Deliverables

1. **Concept rationale** (½–1 page): which direction, the single hero idea, and how it expresses
   "rhythm made visible" without cliché.
2. **Motion spec / storyboard:** the phase timeline (§6) tuned to the chosen concept — key poses,
   timings, easings, and exactly when `thayya:reveal` fires.
3. **Production implementation:** drop-in `Loader.jsx` + `Loader.module.css` (and any `motifs/*` SVG
   assets or a single Lottie/JSON), wired to the §7 contract, tokenized to §3, within the §7 budget.
4. **A short preview** (GIF/MP4 or a runnable route) at desktop and mobile widths, plus the
   reduced-motion path shown.
5. **Notes:** any new dependency (justify it against the budget), and a fallback description.

---

## 10. Acceptance criteria (definition of done)

- [ ] Reads as **distinctly Indian and distinctly Thayya** — rhythm + kolam/rangoli geometry — with
      **zero** tourist clichés (no lotus-spin, Om, Taj, gold filigree, flame emojis).
- [ ] Has a clear **count-in → build → single "sam" → curtain lift** structure; the reveal lands on a beat.
- [ ] Uses the real tokens (§3): Thayya gradient, palette, Unbounded/Jakarta/Anek Tamil, `--ease-beat`.
- [ ] **Fires `thayya:reveal` + sets `window.__thayyaRevealed`** at the curtain lift; the hero animates
      in correctly underneath. Reduced-motion and repeat-visit both reveal instantly.
- [ ] First-visit-per-session gate via `sessionStorage` works; no loader on subsequent navigations.
- [ ] ≤ 2.8s total, 60fps, no LCP regression, compositor-only animation, graceful asset-failure reveal.
- [ ] Beautiful and crisp from 320px to 1440px+, on the cream ground, with the grain wash intact.
- [ ] Leaves you thinking *"do that again."* It is the curtain before the show — make the room go quiet.

---

## 11. Glossary (so the agent gets the references right)

- **Konnakol / solkattu** — spoken/vocal percussion syllables of Carnatic music & Bharatanatyam
  ("tha-ka-di-mi…"); the source of தை·யா·தக·திமி and of the name *Thayya*.
- **Tala** — rhythmic cycle; **sam** — its emphatic first beat / point of resolution.
- **Adavu** — basic Bharatanatyam step-units (geometric, crisp). **Nritta** — pure rhythmic dance.
- **Aramandi** — the half-sitting grounded base posture (coiled energy).
- **Mudra** — codified hand gestures; **alapadma** — the blooming-lotus gesture; **pataka** — flat hand.
- **Kolam / pulli kolam** — threshold floor art: dot lattice + single continuous looping line.
- **Rangoli / mandala** — radially symmetric (often 12-fold) floor/▲ art that blooms from a center.
- **Mankolam** — the paisley/mango single-stroke motif.
- **Salangai / ghungroo** — dancers' ankle bells; light and sound on every strike.
- **Teermanam / jathi** — a rhythmic phrase ending on a decisive accent (your reveal).

---

*Hand this whole file to your design agent. Encourage ambition; enforce §4, §7, and §10.*
