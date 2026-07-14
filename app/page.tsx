import { BackgroundMorph } from "@/components/BackgroundMorph";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { RevealOnMount } from "@/components/RevealOnMount";
import { ScrollHUD } from "@/components/ScrollHUD";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WorldCanvas } from "@/components/WorldCanvas";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Shipped } from "@/components/sections/Shipped";

export default function Home() {
  return (
    <>
      <RevealOnMount />
      <BackgroundMorph />
      <SmoothScroll />
      <WorldCanvas />
      <ScrollHUD />
      <Nav />
      <main className="relative z-[1]">
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
