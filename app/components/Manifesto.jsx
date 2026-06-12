"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MANIFESTO } from "../content";
import SectionHeader from "./ui/SectionHeader";
import Rangoli from "./motifs/Rangoli";
import styles from "./Manifesto.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Deterministic, server-safe word split. The *asterisk-marked* word becomes
 * the italic gradient word (gradient appearance #3) and is exempt from the
 * grey→ink scrub.
 */
function renderWords(text) {
  return text.split(" ").map((token, i) => {
    const marked = token.match(/^\*([^*]+)\*(.*)$/);
    if (marked) {
      return (
        <span key={i} className={styles.word}>
          <em className="display-italic gradient-text">{marked[1]}</em>
          {marked[2]}{" "}
        </span>
      );
    }
    return (
      <span key={i} data-mword="" className={styles.word}>
        {token}{" "}
      </span>
    );
  });
}

/**
 * §10.3 Manifesto — "spotlight reading": the section pins for ~1.5 viewports
 * while words fill from hairline-grey to ink with scroll.
 */
export default function Manifesto() {
  const ref = useRef(null);
  const rangoliRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const rootStyles = getComputedStyle(document.documentElement);
    const greyColor = rootStyles.getPropertyValue("--hairline").trim();
    const inkColor = rootStyles.getPropertyValue("--ink").trim();

    const ctx = gsap.context(() => {
      const words = ref.current.querySelectorAll("[data-mword]");

      if (reduced || mobile) {
        // No pin — words simply ink-in on enter.
        gsap.fromTo(
          words,
          { color: greyColor },
          {
            color: inkColor,
            duration: reduced ? 0.01 : 0.9,
            ease: "power4.out",
            stagger: reduced ? 0 : 0.015,
            clearProps: "color",
            scrollTrigger: { trigger: ref.current, start: "top 75%" },
          }
        );
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: true,
        },
      });

      tl.fromTo(
        words,
        { color: greyColor },
        { color: inkColor, duration: 1, ease: "none", stagger: { amount: 4 } },
        0
      );

      tl.fromTo(
        rangoliRef.current,
        { rotation: 0 },
        { rotation: 30, duration: 5, ease: "none" },
        0
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" className={`chapter ${styles.section}`} ref={ref}>
      <span className={`ghost-numeral ${styles.ghost}`} aria-hidden="true">
        01
      </span>

      <div className={styles.rangoli} ref={rangoliRef} aria-hidden="true">
        <Rangoli size={760} />
      </div>

      <div className={`wrap ${styles.inner}`}>
        <SectionHeader overline={MANIFESTO.overline} tamil={MANIFESTO.tamil} />
        <p className={`display ${styles.text}`}>{renderWords(MANIFESTO.text)}</p>
      </div>
    </section>
  );
}
