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
 * §10.5 Pathways + Utsav A5 — three glass cards over a violet→peacock
 * wash with drifting auroras. Cards rise+fade in with a 0.12s stagger;
 * hover lifts a card toward its accent color (CSS only).
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
      {/* violet→peacock dusk atmosphere — auroras in parallax wrappers + grain */}
      <div className={`${styles.orb} ${styles.orbA}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <div className={`${styles.orb} ${styles.orbB}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <div className="grain" aria-hidden="true" />

      <div className={`wrap ${styles.inner}`}>
        <SectionHeader overline={PATHWAYS.overline} tamil={PATHWAYS.tamil} />
        <h2 className={`display ${styles.title}`}>{PATHWAYS.title}</h2>

        <div className={styles.cols}>
          {PATHWAYS.columns.map((col) => (
            <article
              key={col.overline}
              data-col=""
              className={`${styles.col} glass`}
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
