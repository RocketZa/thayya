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
 * §10.3 Manifesto + Utsav A5 — "spotlight reading": the section pins for
 * ~1.5 viewports while words fill from a warm saffron tint to ink with
 * scroll, inside a saffron/marigold aurora atmosphere with a colorful
 * counter-rotating double-rangoli backdrop.
 */
export default function Manifesto() {
  const ref = useRef(null);
  const rangoliARef = useRef(null);
  const rangoliBRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const rootStyles = getComputedStyle(document.documentElement);
    const inkColor = rootStyles.getPropertyValue("--ink").trim();
    // warm pre-reveal word tint, defined as a module variable on .section
    const warmColor =
      getComputedStyle(ref.current).getPropertyValue("--mword-from").trim() ||
      rootStyles.getPropertyValue("--hairline").trim();

    const ctx = gsap.context(() => {
      const words = ref.current.querySelectorAll("[data-mword]");

      if (!reduced) {
        // aurora parallax drift — GSAP scrubs the WRAPPER divs, so the
        // global .aurora animation keeps ownership of the child's transform
        gsap.utils.toArray(`.${styles.orb}`).forEach((orb, i) => {
          gsap.fromTo(
            orb,
            { yPercent: i % 2 ? 8 : -8 },
            {
              yPercent: i % 2 ? -8 : 8,
              ease: "none",
              scrollTrigger: {
                trigger: ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        });
      }

      if (reduced || mobile) {
        // No pin — words simply ink-in on enter.
        gsap.fromTo(
          words,
          { color: warmColor },
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
        { color: warmColor },
        { color: inkColor, duration: 1, ease: "none", stagger: { amount: 4 } },
        0
      );

      // stacked rangolis counter-rotate (extends the original scrubbed spin)
      tl.fromTo(
        rangoliARef.current,
        { rotation: 0 },
        { rotation: 30, duration: 5, ease: "none" },
        0
      );
      tl.fromTo(
        rangoliBRef.current,
        { rotation: 6 },
        { rotation: -24, duration: 5, ease: "none" },
        0
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" className={`chapter ${styles.section}`} ref={ref}>
      {/* warm saffron atmosphere — auroras in parallax wrappers + film grain */}
      <div className={`${styles.orb} ${styles.orbA}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <div className={`${styles.orb} ${styles.orbB}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <div className="grain" aria-hidden="true" />

      <span className={`ghost-numeral ${styles.ghost}`} aria-hidden="true">
        01
      </span>

      <div className={styles.rangoli} aria-hidden="true">
        <div className={styles.rangoliSaffron} ref={rangoliARef}>
          <Rangoli size={760} />
        </div>
        <div className={styles.rangoliRani} ref={rangoliBRef}>
          <Rangoli size={760} />
        </div>
      </div>

      <div className={`wrap ${styles.inner}`}>
        <SectionHeader overline={MANIFESTO.overline} tamil={MANIFESTO.tamil} />
        <p className={`display ${styles.text}`}>{renderWords(MANIFESTO.text)}</p>
      </div>
    </section>
  );
}
