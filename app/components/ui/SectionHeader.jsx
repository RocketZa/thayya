"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The house section-opening device (UI-UX.md §4.3):
 * OVERLINE ———————————————— தமிழ்
 * Hairline ink-draws on enter; label and Tamil mark fade up.
 */
export default function SectionHeader({ overline, tamil, accent }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".rule", {
        scaleX: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
      gsap.from(".sh-fade", {
        y: 14,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className="section-head" ref={ref}>
      <span className="label sh-fade" style={accent ? { color: accent } : undefined}>
        {overline}
      </span>
      <span className="rule" />
      <span className="tamil sh-fade" aria-hidden="true">
        {tamil}
      </span>
    </div>
  );
}
