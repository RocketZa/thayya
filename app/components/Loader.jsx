"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Loader.module.css";

const SYLLABLES = ["தை", "யா", "தக", "திமி"];

/**
 * First-visit overture (UI-UX.md §7.3). Counts 0→100 while Tamil syllables
 * tick, then the cream curtain wipes up. Signals the hero via the
 * `thayya:reveal` event + `window.__thayyaRevealed` flag.
 */
export default function Loader() {
  const [active, setActive] = useState(true);
  const rootRef = useRef(null);
  const numRef = useRef(null);
  const sylRef = useRef(null);

  useEffect(() => {
    const reveal = () => {
      window.__thayyaRevealed = true;
      window.dispatchEvent(new CustomEvent("thayya:reveal"));
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("thayya-loaded");

    if (seen || reduced) {
      setActive(false);
      reveal();
      return;
    }
    sessionStorage.setItem("thayya-loaded", "1");

    const counter = { n: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        reveal();
        setActive(false);
      },
    });

    tl.to(counter, {
      n: 100,
      duration: 1.3,
      ease: "power2.inOut",
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = String(Math.round(counter.n)).padStart(2, "0");
        }
        if (sylRef.current) {
          sylRef.current.textContent =
            SYLLABLES[Math.min(SYLLABLES.length - 1, Math.floor((counter.n / 100) * SYLLABLES.length))];
        }
      },
    }).to(rootRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: "expo.inOut",
    });

    return () => tl.kill();
  }, []);

  if (!active) return null;

  return (
    <div className={styles.loader} ref={rootRef} aria-hidden="true">
      <div className="kolam-field" />
      <div className={`aurora ${styles.auroraA}`} />
      <div className={`aurora ${styles.auroraB}`} />
      <div className={styles.center}>
        <span className={`display gradient-live ${styles.num}`} ref={numRef}>
          00
        </span>
        <span className={`tamil ${styles.syl}`} ref={sylRef}>
          தை
        </span>
      </div>
      <span className={`label ${styles.motto}`}>MOVE. RISE. SHINE.</span>
      <div className="grain" />
    </div>
  );
}
