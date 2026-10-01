import { site } from '@/content/site';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function Hero() {
  return (
    <section className="section hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-orbit" aria-hidden="true">
        <span>Scroll to explore · Scroll to explore · </span>
      </div>
      <div className="container hero-inner">
        <SectionLabel number="01">Arrival</SectionLabel>
        <p className="availability">
          <span className="status-dot" aria-hidden="true" />
          {site.availability}
        </p>
        <h1 id="hero-title" className="font-display hero-title">
          {site.name}
          <br />
          <em className="font-serif">moves</em> things.
        </h1>
        <div className="hero-bottom">
          <p className="hero-pitch">{site.pitch}</p>
          <div className="hero-actions">
            {site.resumePath ? <ArrowLink href={site.resumePath}>View resume</ArrowLink> : null}
            <ArrowLink href="#contact">Start a conversation</ArrowLink>
          </div>
        </div>
        <a className="scroll-hint" href="#about">
          <span>Scroll to begin</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
