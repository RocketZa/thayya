"use client";

import { useEffect, useRef, useState } from "react";
import { NAV } from "../content";
import styles from "./Nav.module.css";

/**
 * Transparent over the hero → solid blurred paper bar after 80vh;
 * hides on scroll-down, returns on scroll-up (UI-UX.md §9).
 * ≤900px: hamburger → full-screen cream overlay.
 */
export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.8);
      setHidden(y > lastY.current && y > window.innerHeight && !open);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={[
        styles.nav,
        solid ? styles.solid : "",
        hidden ? styles.hidden : "",
      ].join(" ")}
    >
      <div className={styles.bar}>
        <a href="#top" className={`display ${styles.wordmark}`} aria-label="Thayya home">
          <span className={`gradient-live ${styles.wordmarkText}`}>Thayya</span>
          <sup className={styles.tm}>™</sup>
        </a>

        <nav className={styles.links} aria-label="Primary">
          {NAV.links.map((l) => (
            <a key={l.href} href={l.href} className={`link-sweep ${styles.link}`}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          <a href={NAV.cta.href} className={`btn ${styles.cta}`}>
            {NAV.cta.label}
          </a>
          <button
            className={styles.burger}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`} aria-hidden={!open}>
        <div className="kolam-field" />
        <nav className={styles.overlayLinks} aria-label="Mobile">
          {NAV.links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={`display ${styles.overlayLink}`}
              style={{ transitionDelay: open ? `${0.1 + i * 0.07}s` : "0s" }}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              {l.label}
            </a>
          ))}
          <a
            href={NAV.cta.href}
            className={`btn ${styles.overlayCta}`}
            style={{ transitionDelay: open ? "0.4s" : "0s" }}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            {NAV.cta.label}
          </a>
        </nav>
        <div className={styles.overlayFoot}>
          <a
            href="https://www.instagram.com/thayyaofficial/"
            target="_blank"
            rel="noreferrer"
            className="link-sweep"
            tabIndex={open ? 0 : -1}
          >
            Instagram ↗
          </a>
          <span className="label">Made in India</span>
        </div>
      </div>
    </header>
  );
}
