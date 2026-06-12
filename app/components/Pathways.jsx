"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PATHWAYS } from "../content";
import SectionHeader from "./ui/SectionHeader";
import Paisley from "./motifs/Paisley";
import styles from "./Pathways.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * §10.5 Pathways — three editorial columns split by hairline rules.
 * Columns rise+fade in with a 0.12s stagger; hover tints a column and
 * shifts its rules to its accent color (CSS only).
 */
export default function Pathways() {
  const ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const cols = ref.current.querySelectorAll("[data-col]");

      if (reduced) {
        // simple fade, no movement
        gsap.from(cols, {
          autoAlpha: 0,
          duration: 0.01,
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        });
        return;
      }

      gsap.from(cols, {
        y: 48,
        autoAlpha: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pathways" className={`chapter ${styles.section}`} ref={ref}>
      <div className="wrap">
        <SectionHeader overline={PATHWAYS.overline} tamil={PATHWAYS.tamil} />
        <h2 className={`display ${styles.title}`}>{PATHWAYS.title}</h2>

        <div className={styles.cols}>
          {PATHWAYS.columns.map((col) => (
            <article
              key={col.overline}
              data-col=""
              className={styles.col}
              style={{ "--accent": col.accent }}
            >
              <span className={`label ${styles.colOverline}`}>{col.overline}</span>
              <h3 className={`display ${styles.colTitle}`}>{col.title}</h3>
              <ul className={styles.list}>
                {col.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <Paisley size={14} className={styles.bullet} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href={col.cta.href} className={`link-sweep ${styles.cta}`}>
                {col.cta.label}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
