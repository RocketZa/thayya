"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FOOTER, COMMUNITY } from "../content";
import Paisley from "./motifs/Paisley";
import styles from "./FooterCta.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
 * CTA + Footer (UI-UX.md §10.10) — the page's single dark chapter,
 * mirroring the logo's "MOVE. RISE. SHINE." black bar. The gradient
 * returns twice here by design ration: italic CTA word + wordmark.
 */

// "© 2026 Thayya™ · Made in India" — tricolor hairline sits under "India"
function Copyright({ text }) {
  const idx = text.lastIndexOf("India");
  if (idx === -1) return <p className={styles.copyright}>{text}</p>;
  return (
    <p className={styles.copyright}>
      {text.slice(0, idx)}
      <span className={styles.india}>
        India
        <span className={styles.tricolor} aria-hidden="true" />
      </span>
      {text.slice(idx + "India".length)}
    </p>
  );
}

export default function FooterCta() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray(".line-mask > span", sectionRef.current);

      if (reduce) {
        gsap.set(lines, { y: 0 });
      } else {
        gsap.to(lines, {
          y: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: `.${styles.cta}`, start: "top 75%" },
        });

        // kolam dots drift, very subtle, looping
        gsap.to(`.${styles.dots}`, {
          y: 22,
          duration: 16,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // aurora nebulae drift on parallax (transform-only, scrubbed)
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
      }

      gsap.from(`.${styles.ctaBtn}`, {
        autoAlpha: 0,
        y: reduce ? 0 : 18,
        duration: 0.8,
        delay: reduce ? 0 : 0.3,
        ease: "power4.out",
        scrollTrigger: { trigger: `.${styles.cta}`, start: "top 70%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* midnight nebulae — violet / rani / peacock auroras under the dots */}
      <div className={`${styles.orb} ${styles.orbA}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <div className={`${styles.orb} ${styles.orbB}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <div className={`${styles.orb} ${styles.orbC}`} aria-hidden="true">
        <span className="aurora" />
      </div>
      <div className={`kolam-field ${styles.dots}`} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {/* ---------- CTA ---------- */}
      <div className={`wrap ${styles.cta}`}>
        <h2 className={`display ${styles.ctaTitle}`}>
          <span className="line-mask">
            <span>
              {FOOTER.cta.pre}
              <em className="display-italic gradient-text gradient-live">
                {FOOTER.cta.gradientWord}
              </em>
              {FOOTER.cta.post}
            </span>
          </span>
        </h2>
        <p className={styles.ctaSub}>
          <span className="line-mask">
            <span>{FOOTER.cta.sub}</span>
          </span>
        </p>
        <a
          className={`btn inverted ${styles.ctaBtn}`}
          href={FOOTER.cta.button.href}
        >
          {FOOTER.cta.button.label}
        </a>
      </div>

      {/* ---------- footer ---------- */}
      <footer className={styles.footer}>
        {/* paisley divider terminal on the separating rule (§6) */}
        <span className={styles.paisleyMark} aria-hidden="true">
          <Paisley size={18} />
        </span>
        <div className={`wrap ${styles.footerGrid}`}>
          <span className={`display gradient-text ${styles.wordmark}`}>
            THAYYA™
          </span>

          <nav className={styles.nav} aria-label="Footer">
            {FOOTER.links.map((link) => (
              <a
                className={`link-sweep ${styles.navLink}`}
                href={link.href}
                key={link.label}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.colophon}>
            <a
              className={`link-sweep ${styles.navLink}`}
              href={COMMUNITY.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>
            <Copyright text={FOOTER.copyright} />
          </div>
        </div>

        <p className={styles.motto}>{FOOTER.motto}</p>
      </footer>
    </section>
  );
}
