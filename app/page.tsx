import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { Contact } from "@/components/sections/Contact";
import { Ethos } from "@/components/sections/Ethos";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Shipped } from "@/components/sections/Shipped";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Cursor />
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Services />
        <Shipped />
        <Ethos />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
