import { Reveal } from '@/components/motion/Reveal';
import { timeline } from '@/content/timeline';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function Experience() {
  return (
    <section className="section experience" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <SectionLabel number="04">Timeline</SectionLabel>
        <div className="section-heading-row">
          <Reveal as="h2" id="experience-title" className="font-display section-title">
            How I got <em className="font-serif">here.</em>
          </Reveal>
          <p>Taken from my commit history, most recent first.</p>
        </div>
        <ol className="timeline">
          {timeline.map((entry) => (
            <li key={`${entry.title}-${entry.dates}`}>
              <span className="timeline-node" aria-hidden="true" />
              <p className="eyebrow">{entry.dates}</p>
              <div>
                <h3>
                  {entry.title} <span>— {entry.kind}</span>
                </h3>
                <p>{entry.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
