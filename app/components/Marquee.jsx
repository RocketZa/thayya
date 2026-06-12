"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MARQUEE } from "../content";
import styles from "./Marquee.module.css";

gsap.registerPlugin(ScrollTrigger);

const REPS = 6;
const hasTamil = (s) => /[஀-௿]/.test(s);

function RowSequence({ variant = "outline" }) {
  // "gradient" rows wear the living gradient surface, clipped to the glyphs
  // (the module rule re-asserts background-clip: text — see .gradientWord)
  const wordClass =
    variant === "gradient"
      ? `gradient-live ${styles.word} ${styles.gradientWord}`
      : styles.word;
  const out = [];
  for (let r = 0; r < REPS; r += 1) {
    MARQUEE.forEach((word, i) => {
      out.push(
        <span
          key={`w-${r}-${i}`}
          className={
            hasTamil(word) ? `tamil ${wordClass} ${styles.tamilWord}` : wordClass
          }
        >
          {word}
        </span>,
        <span key={`s-${r}-${i}`} className={styles.sep}>
          ·
        </span>
      );
    });
  }
  return out;
}

/**
 * §10.2 + Utsav A5 — the page's only marquee. One row of outlined ink
 * display type, one row of living gradient text, scrubbed by scroll in
 * opposite directions (never autoplaying) over a faint festival wash.
 */
export default function Marquee() {
  const ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const ctx = gsap.context(() => {
      const rows = ref.current.querySelectorAll("[data-dir]");
      rows.forEach((row) => {
        const dir = Number(row.dataset.dir);
        // Opposite directions, same 20% travel, scrubbed across the
        // section's pass through the viewport.
        gsap.fromTo(
          row,
          { xPercent: dir === 1 ? -20 : 0 },
          {
            xPercent: dir === 1 ? 0 : -20,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.strip} ref={ref}>
      {/* faint saffron→rani→teal wash behind the strip */}
      <div className={styles.wash} aria-hidden="true" />

      {/* Plain-text copy for screen readers */}
      <p className={styles.srOnly}>{MARQUEE.join(" · ")}</p>

      <div className={styles.rows} aria-hidden="true">
        <div className={styles.row}>
          <div className={styles.rowInner} data-dir="-1">
            <RowSequence variant="gradient" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.rowInner} data-dir="1">
            <RowSequence />
          </div>
        </div>
      </div>
    </section>
  );
}
