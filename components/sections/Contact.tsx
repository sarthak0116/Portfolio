import { site } from '@/content/site';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionLabel number="05">Next move</SectionLabel>
        <div className="contact-inner">
          <h2 id="contact-title" className="font-display contact-title">
            Let’s make
            <br />
            <em className="font-serif">something</em> move.
          </h2>
          <p className="contact-copy">
            Have a product, team, or strange idea that needs a careful pair of hands? I’d love to
            hear about it.
          </p>
          <div className="contact-actions">
            <ArrowLink href={`mailto:${site.email}`}>Email me</ArrowLink>
            {site.bookingUrl ? (
              <ArrowLink href={site.bookingUrl} external>
                Book a conversation
              </ArrowLink>
            ) : null}
          </div>
          <p className="fallback-email">
            Or write directly: <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
