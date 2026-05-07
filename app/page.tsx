import { BackgroundMorph } from "@/components/BackgroundMorph";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Shipped } from "@/components/sections/Shipped";

export default function Home() {
  return (
    <>
      <BackgroundMorph />
      <Loader />
      <Nav />
      <main>
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
