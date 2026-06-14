import dynamic from "next/dynamic";
import Loader from "./components/Loader";
import Nav from "./components/Nav";
import Hero from "./components/hero/Hero";
import Marquee from "./components/Marquee";

// Below-the-fold sections are code-split and lazy-loaded so their client JS
// doesn't block initial paint/hydration. SSR stays on (default), so the markup
// is still server-rendered — no SEO loss and no layout shift.
const Manifesto = dynamic(() => import("./components/Manifesto"));
const Classes = dynamic(() => import("./components/Classes"));
const Pathways = dynamic(() => import("./components/Pathways"));
const Journey = dynamic(() => import("./components/Journey"));
const Trainings = dynamic(() => import("./components/Trainings"));
const Film = dynamic(() => import("./components/Film"));
const Community = dynamic(() => import("./components/Community"));
const FooterCta = dynamic(() => import("./components/FooterCta"));

export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Classes />
        <Pathways />
        <Journey />
        <Trainings />
        <Film />
        <Community />
      </main>
      <FooterCta />
    </>
  );
}
