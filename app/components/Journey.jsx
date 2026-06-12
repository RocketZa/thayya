"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JOURNEY } from "../content";
import SectionHeader from "./ui/SectionHeader";
import styles from "./Journey.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
 * Journey — "From first beat to your own studio" (UI-UX.md §10.6)
 * A kolam loop line ink-draws down the left third; marigold nodes pop
 * as the line reaches them. Accent: saffron (the rising-sun arc).
 */

// Single continuous kolam path: gentle S-curves weaving alternating loops
// around 4 evenly spaced lattice points (y = 150 / 450 / 750 / 1050 in a
// 80×1200 box). True pulli-kolam construction: the line encircles each dot.
const KOLAM_PATH = [
  "M 40 10",
  "C 40 20, 40 30, 40 40",
  // node 1 (y=150) — loop right
  "C 40 80, 64 100, 64 150",
  "C 64 186, 16 186, 16 150",
  "C 16 114, 40 110, 48 142",
  "C 56 174, 44 210, 40 240",
  "C 36 280, 44 310, 40 340",
  // node 2 (y=450) — loop left
  "C 40 380, 16 400, 16 450",
  "C 16 486, 64 486, 64 450",
  "C 64 414, 40 410, 32 442",
  "C 24 474, 36 510, 40 540",
  "C 44 580, 36 610, 40 640",
  // node 3 (y=750) — loop right
  "C 40 680, 64 700, 64 750",
  "C 64 786, 16 786, 16 750",
  "C 16 714, 40 710, 48 742",
  "C 56 774, 44 810, 40 840",
  "C 36 880, 44 910, 40 940",
  // node 4 (y=1050) — loop left
  "C 40 980, 16 1000, 16 1050",
  "C 16 1086, 64 1086, 64 1050",
  "C 64 1014, 40 1010, 32 1042",
  "C 24 1074, 36 1110, 40 1140",
  "C 40 1165, 40 1180, 40 1192",
].join(" ");

export default function Journey() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const glowPathRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // headline line-mask reveal
      const titleLine = sectionRef.current.querySelector(".line-mask > span");
      if (reduce) {
        gsap.set(titleLine, { y: 0 });
      } else {
        gsap.to(titleLine, {
          y: 0,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });
      }

      const steps = gsap.utils.toArray(`.${styles.step}`);

      if (reduce) {
        // static line, simple fades only
        steps.forEach((step) => {
          gsap.from(step.querySelector(`.${styles.body}`), {
            autoAlpha: 0,
            duration: 0.6,
            scrollTrigger: { trigger: step, start: "top 85%" },
          });
        });
        return;
      }

      // kolam line (gold) + its saffron glow echo draw downward together,
      // scrubbed across the section
      const paths = [glowPathRef.current, pathRef.current];
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.to(paths, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: `.${styles.timeline}`,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 1,
        },
      });

      // sunrise auroras drift on parallax (transform-only, scrubbed)
      gsap.utils.toArray(`.${styles.orb}`).forEach((orb, i) => {
        gsap.fromTo(
          orb,
          { yPercent: i % 2 ? 8 : -8 },
          {
            yPercent: i % 2 ? -8 : 8,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });

      // marigold node pops + content fade-ups (individual triggers, so each
      // dot fires roughly as the drawn line reaches it)
      steps.forEach((step) => {
        gsap.fromTo(
          step.querySelector(`.${styles.dot}`),
          { scale: 0 },
          {
            scale: 1,
            duration: 0.6,
            ease: "back.out(3)", // overshoots ≈1.15 then settles
            scrollTrigger: { trigger: step, start: "top 68%" },
          }
        );
        gsap.from(step.querySelector(`.${styles.body}`), {
          y: 28,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: step, start: "top 72%" },
        });
      });

      // sunrise arc breathes in behind the last node
      gsap.from(`.${styles.arc}`, {
        autoAlpha: 0,
        y: 60,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: { trigger: steps[steps.length - 1], start: "top 70%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" className={`chapter ${styles.section}`} ref={sectionRef}>
      {/* sunrise atmosphere — marigold + saffron auroras under a film grain */}
      <div className={`${styles.orb} ${styles.orbA}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <div className={`${styles.orb} ${styles.orbB}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <div className={`${styles.orb} ${styles.orbC}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <div className="grain" aria-hidden="true" />
      <span className={`ghost-numeral ${styles.ghost}`} aria-hidden="true">
        03
      </span>
      <div className="wrap">
        <SectionHeader
          overline={JOURNEY.overline}
          tamil={JOURNEY.tamil}
          accent="var(--saffron)"
        />
        <h2 className={`display ${styles.title}`}>
          <span className="line-mask">
            <span>{JOURNEY.title}</span>
          </span>
        </h2>

        <div className={styles.timeline}>
          <svg
            className={styles.kolamLine}
            viewBox="0 0 80 1200"
            preserveAspectRatio="none"
            role="presentation"
            aria-hidden="true"
          >
            {/* soft saffron glow echo underneath the gold line */}
            <path
              ref={glowPathRef}
              d={KOLAM_PATH}
              fill="none"
              stroke="var(--saffron)"
              strokeWidth="7"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.35"
            />
            <path
              ref={pathRef}
              d={KOLAM_PATH}
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className={styles.arc} aria-hidden="true" />

          <ol className={styles.steps}>
            {JOURNEY.steps.map((step) => (
              <li className={styles.step} key={step.n}>
                <span className={styles.rail} aria-hidden="true">
                  <span className={`${styles.dot} glow`} />
                </span>
                <div className={styles.body}>
                  <span className={styles.num} aria-hidden="true">
                    0{step.n}
                  </span>
                  <h3 className={`display ${styles.stepTitle}`}>{step.title}</h3>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
