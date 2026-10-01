import { Nav } from '@/components/ui/Nav';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { site } from '@/content/site';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <div className="marquee" aria-label="Creative engineering, motion, systems">
          <span aria-hidden="true">
            Creative engineering&nbsp; · &nbsp;Motion systems&nbsp; · &nbsp;Useful weirdness&nbsp; ·
            &nbsp;
          </span>
          <span aria-hidden="true">
            Creative engineering&nbsp; · &nbsp;Motion systems&nbsp; · &nbsp;Useful weirdness&nbsp; ·
            &nbsp;
          </span>
        </div>
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
