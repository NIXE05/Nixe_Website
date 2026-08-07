import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ScrollHUD } from "@/components/ScrollHUD";
import { SmoothScroll } from "@/components/SmoothScroll";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Shipped } from "@/components/sections/Shipped";

/**
 * The page is a stack of opaque PLATES that alternate tone — paper, bone, ink —
 * with hard edges between them. Each one owns its background and its layout;
 * nothing bleeds across a boundary.
 *
 *   hero      paper   line-field + headline
 *   01 work   bone    project cards
 *   02 svcs   INK     pinned panels (300vh track)
 *   03 shipd  paper   Courtsy split + datasheet
 *   04 about  bone    statement + capability index
 *   05 cntct  INK     form + direct lines
 *   footer    INK     continues the contact plate
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <ScrollHUD />
      <Nav />
      <main className="relative">
        <Hero />
        <FeaturedProjects />
        <Services />
        <Shipped />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
