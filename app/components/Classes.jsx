"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLASSES } from "../content";
import SectionHeader from "./ui/SectionHeader";
import Paisley from "./motifs/Paisley";
import styles from "./Classes.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * §10.4 Classes — the pinned horizontal rail, the page's biggest grid-break.
 * Desktop: viewport pins, six cards scrub right→left across ~2.5 viewports.
 * Mobile / reduced motion: native horizontal scroll-snap, no pin.
 */
export default function Classes() {
  const ref = useRef(null);
  const railRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const counterRef = useRef(null);

  const total = String(CLASSES.items.length).padStart(2, "0");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const pinned = desktop && !reduced;

    const railEl = railRef.current;
    if (pinned) railEl.classList.add(styles.isPinned);

    const ctx = gsap.context(() => {
      // h2 line-mask reveal on enter
      gsap.to(ref.current.querySelectorAll(".line-mask > *"), {
        y: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });

      if (!pinned) return;

      const track = trackRef.current;
      const count = CLASSES.items.length;

      gsap.to(track, {
        x: () => -(track.scrollWidth - railEl.clientWidth),
        ease: "none",
        scrollTrigger: {
          trigger: railEl,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (fillRef.current) {
              gsap.set(fillRef.current, { scaleX: self.progress });
            }
            if (counterRef.current) {
              const n = Math.min(count, Math.floor(self.progress * count) + 1);
              counterRef.current.textContent = String(n).padStart(2, "0");
            }
          },
        },
      });
    }, ref);

    return () => {
      ctx.revert();
      if (pinned) railEl.classList.remove(styles.isPinned);
    };
  }, []);

  return (
    <section id="classes" className={`chapter ${styles.section}`} ref={ref}>
      <div className="wrap">
        <SectionHeader overline={CLASSES.overline} tamil={CLASSES.tamil} />
        <h2 className={`display ${styles.title}`}>
          <span className="line-mask">
            <span>{CLASSES.title}</span>
          </span>
        </h2>
      </div>

      <div className={styles.rail} ref={railRef}>
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressLine}>
            <span className={styles.progressFill} ref={fillRef} />
          </span>
          <span className={styles.counter}>
            <span ref={counterRef}>01</span> / {total}
          </span>
        </div>

        <ul className={styles.track} ref={trackRef}>
          {CLASSES.items.map((item) => (
            <li
              key={item.num}
              className={`${styles.card} gopuram-corner`}
              style={{ "--accent": item.accent }}
            >
              <span className={styles.cardNum} aria-hidden="true">
                {item.num}
              </span>
              <div className={styles.cardBody}>
                <h3 className={`display ${styles.cardTitle}`}>{item.title}</h3>
                <p className={styles.cardSub}>{item.sub}</p>
                <span className={styles.cardRule} aria-hidden="true" />
                <a href="#trainings" className={`link-sweep ${styles.cardLink}`}>
                  <Paisley size={14} className={styles.cardPaisley} />
                  <span>Find a class →</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
