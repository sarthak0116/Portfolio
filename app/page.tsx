import { Nav } from '@/components/ui/Nav';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { MasterLine } from '@/components/line/MasterLine';
import { Preloader } from '@/components/motion/Preloader';
import { ScrollProvider } from '@/components/motion/ScrollProvider';
import { TypeMotion } from '@/components/motion/TypeMotion';
import { ShapeLayer } from '@/components/three/ShapeLayer';
import { features } from '@/config/features';
import { site } from '@/content/site';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {features.preloader ? <Preloader /> : null}
      {features.shape ? <ShapeLayer /> : null}
      <ScrollProvider />
      <TypeMotion />
      <Nav />
      <main id="main" className="page">
        <MasterLine />
        <Hero />
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1, 2, 3].map((copy) => (
              <span key={copy}>
                C&nbsp; ✳ &nbsp;ARM64 assembly&nbsp; ✳ &nbsp;Python&nbsp; ✳ &nbsp;JavaScript&nbsp; ✳
                &nbsp;React&nbsp; ✳ &nbsp;
              </span>
            ))}
          </div>
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
