import { Reveal } from '@/components/motion/Reveal';
import type { Route } from 'next';
import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';

const projects = [
  {
    slug: 'kinetic-systems',
    title: 'Kinetic Systems',
    description: 'TODO: A one-line case study summary.',
    tags: ['Product', 'Interaction'],
  },
  {
    slug: 'future-project',
    title: 'TODO: Next project',
    description: 'Replace this with a flagship project that shows range.',
    tags: ['Brand', 'Web'],
  },
];

export function Projects() {
  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionLabel number="03">Selected work</SectionLabel>
        <div className="section-heading-row">
          <Reveal as="h2" id="projects-title" className="font-display section-title">
            Proof, not <em className="font-serif">promises.</em>
          </Reveal>
          <p>Selected projects where strategy, craft, and shipping meet.</p>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <Link
              className="project-card"
              href={`/projects/${project.slug}` as Route}
              key={project.slug}
            >
              <div className="project-image" aria-hidden="true">
                <span>0{index + 1}</span>
              </div>
              <div className="project-meta">
                <div>
                  <p className="eyebrow">{project.tags.join(' · ')}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
