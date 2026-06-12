import Loader from "./components/Loader";
import Nav from "./components/Nav";
import Hero from "./components/hero/Hero";
import Marquee from "./components/Marquee";
import Manifesto from "./components/Manifesto";
import Classes from "./components/Classes";
import Pathways from "./components/Pathways";
import Journey from "./components/Journey";
import Trainings from "./components/Trainings";
import Film from "./components/Film";
import Community from "./components/Community";
import FooterCta from "./components/FooterCta";

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
