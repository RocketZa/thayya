"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COMMUNITY } from "../content";
import SectionHeader from "./ui/SectionHeader";
import styles from "./Community.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
 * Community — "The tribe" (UI-UX.md §10.9)
 * Three pull-quotes as an asymmetric editorial collage, marigold dots in
 * rotating accent colors before each name, generous --s8 air between.
 */
export default function Community() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const figures = gsap.utils.toArray(`.${styles.quote}`);

      figures.forEach((fig, i) => {
        const line = fig.querySelector(".line-mask > span");
        const caption = fig.querySelector("figcaption");

        if (reduce) {
          gsap.set(line, { y: 0 });
          gsap.from(fig, {
            autoAlpha: 0,
            duration: 0.6,
            scrollTrigger: { trigger: fig, start: "top 85%" },
          });
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: { trigger: fig, start: "top 80%" },
          delay: (i % 3) * 0.08, // house stagger unit
        });
        tl.to(line, { y: 0, duration: 1.1, ease: "power4.out" });
        tl.from(
          caption,
          { y: 14, autoAlpha: 0, duration: 0.7, ease: "power4.out" },
          "-=0.5"
        );
      });

      const insta = sectionRef.current.querySelector(`.${styles.instagram}`);
      gsap.from(insta, {
        autoAlpha: 0,
        y: reduce ? 0 : 14,
        duration: 0.7,
        ease: "power4.out",
        scrollTrigger: { trigger: insta, start: "top 90%" },
      });

      // dusk ornaments drift on parallax (transform-only, scrubbed)
      if (!reduce) {
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
        gsap.fromTo(
          `.${styles.syllable}`,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="community" className={`chapter ${styles.section}`} ref={sectionRef}>
      {/* dusk atmosphere — violet + peacock auroras, faint Tamil syllable */}
      <div className={`${styles.orb} ${styles.orbA}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <div className={`${styles.orb} ${styles.orbB}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <span className={`tamil ${styles.syllable}`} aria-hidden="true">
        தா
      </span>
      <div className="grain" aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <SectionHeader overline={COMMUNITY.overline} tamil={COMMUNITY.tamil} />

        <div className={styles.collage}>
          {COMMUNITY.quotes.map((quote, i) => (
            <figure
              className={`${styles.quote} ${styles[`q${i + 1}`]}`}
              key={quote.name}
            >
              <blockquote className={`display ${styles.text}`}>
                <span className="line-mask">
                  <span>&ldquo;{quote.text}&rdquo;</span>
                </span>
              </blockquote>
              <figcaption className={`label ${styles.attribution}`}>
                <span
                  className={`${styles.dot} glow`}
                  style={{ background: quote.accent }}
                  aria-hidden="true"
                />
                {quote.name}, {quote.city}
              </figcaption>
            </figure>
          ))}
        </div>

        <a
          className={`link-sweep ${styles.instagram}`}
          href={COMMUNITY.instagram.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {COMMUNITY.instagram.label} ↗
        </a>
      </div>
    </section>
  );
}
