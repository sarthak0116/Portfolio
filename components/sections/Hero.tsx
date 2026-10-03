import { Reveal } from '@/components/motion/Reveal';
import { TextMorph } from '@/components/motion/TextMorph';
import { site } from '@/content/site';
import { skills } from '@/content/skills';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { SectionLabel } from '@/components/ui/SectionLabel';

/** The role line decodes through the real stack: the role, then each skill group as code-ish text. */
const roleLines = [
  site.role,
  ...skills.groups.map((group) => group.items.map((i) => i.name).join(' · ')),
];

export function Hero() {
  return (
    <section className="section hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-eclipse" aria-hidden="true" />
      <div className="container hero-inner">
        <SectionLabel number="01">Arrival</SectionLabel>
        <div className="hero-card">
          <p className="availability">
            <span className="status-dot" aria-hidden="true" />
            {site.availability}
          </p>
          <Reveal as="h1" id="hero-title" className="font-display hero-title">
            {site.name}
          </Reveal>
          <p className="hero-role">
            <TextMorph phrases={roleLines} />
          </p>
        </div>
        <div className="hero-bottom">
          <p className="hero-pitch font-serif">{site.pitch}</p>
          <div className="hero-actions">
            {site.resumePath ? <ArrowLink href={site.resumePath}>View resume</ArrowLink> : null}
            <ArrowLink href="#contact-body">Start a conversation</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
