import { Reveal } from '@/components/motion/Reveal';
import { Intertitle } from '@/components/ui/Intertitle';
import { SectionLabel } from '@/components/ui/SectionLabel';

const entries = [
  {
    dates: '2024 — now',
    role: 'TODO: Your role',
    company: 'TODO: Company',
    description: 'TODO: Add the outcome and scope of your current work.',
  },
  {
    dates: '2022 — 2024',
    role: 'TODO: Previous role',
    company: 'TODO: Company',
    description: 'TODO: Add a concise, outcome-led description.',
  },
];

export function Experience() {
  return (
    <section className="section experience" id="experience" aria-labelledby="experience-title">
      <Intertitle number="04">Practice</Intertitle>
      <div className="container" id="experience-body">
        <SectionLabel number="04">Practice</SectionLabel>
        <div className="section-heading-row">
          <Reveal as="h2" id="experience-title" className="font-display section-title">
            A line of <em className="font-serif">inquiry.</em>
          </Reveal>
          <p>Experience is a practice, not a list of titles.</p>
        </div>
        <ol className="timeline">
          {entries.map((entry) => (
            <li key={`${entry.company}-${entry.dates}`}>
              <span className="timeline-node" aria-hidden="true" />
              <p className="eyebrow">{entry.dates}</p>
              <div>
                <h3>
                  {entry.role} <span>— {entry.company}</span>
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
