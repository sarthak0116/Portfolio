import { Reveal } from '@/components/motion/Reveal';
import { site } from '@/content/site';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionLabel number="05">Contact</SectionLabel>
        <div className="contact-inner">
          <Reveal as="h2" id="contact-title" className="font-display contact-title">
            Say <em className="font-serif">hello.</em>
          </Reveal>
          <p className="contact-copy">
            I’m looking for my next role. If you’re hiring, or you want to ask about one of these
            projects, send me an email.
          </p>
          <div className="contact-actions">
            <ArrowLink href={`mailto:${site.email}`}>Email me</ArrowLink>
            {site.bookingUrl ? (
              <ArrowLink href={site.bookingUrl} external>
                Book a call
              </ArrowLink>
            ) : null}
          </div>
          <p className="fallback-email">
            Or copy the address: <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
