import { Nav } from '@/components/ui/Nav';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { AsciiField } from '@/components/film/AsciiField';
import { FilmLayer } from '@/components/film/FilmLayer';
import { Scrubber } from '@/components/film/Scrubber';
import { Preloader } from '@/components/motion/Preloader';
import { ScrollProvider } from '@/components/motion/ScrollProvider';
import { WorldLayer } from '@/components/three/WorldLayer';
import { features } from '@/config/features';
import { site } from '@/content/site';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {features.preloader ? <Preloader /> : null}
      {features.world ? <WorldLayer /> : null}
      <AsciiField />
      <ScrollProvider />
      <FilmLayer />
      <Scrubber />
      <Nav />
      <main id="main" className="page">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: site.name,
            jobTitle: site.role,
            url: site.seo.url,
            sameAs: [site.socials.linkedin, site.socials.github, site.socials.leetcode],
          }),
        }}
      />
    </>
  );
}
