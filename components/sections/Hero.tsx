import { Reveal } from '@/components/motion/Reveal';
import { site } from '@/content/site';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function Hero() {
  return (
    <section className="section hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-orbit" aria-hidden="true">
        <span>Scroll down · Scroll down · </span>
      </div>
      <div className="container hero-inner">
        <SectionLabel number="01">Intro</SectionLabel>
        <p className="availability">
          <span className="status-dot" aria-hidden="true" />
          {site.availability}
        </p>
        <Reveal as="h1" id="hero-title" className="font-display hero-title">
          {site.name}
          <br />
          <span className="hero-sub">
            builds from <em className="font-serif">scratch.</em>
          </span>
        </Reveal>
        <div className="hero-bottom">
          <p className="hero-pitch">{site.pitch}</p>
          <div className="hero-actions">
            {site.resumePath ? <ArrowLink href={site.resumePath}>View resume</ArrowLink> : null}
            <ArrowLink href="#projects">See the projects</ArrowLink>
            <ArrowLink href="#contact">Get in touch</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
