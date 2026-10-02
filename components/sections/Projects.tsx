import type { Route } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { projects } from '@/content/projects';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function Projects() {
  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionLabel number="03">Projects</SectionLabel>
        <div className="section-heading-row">
          <Reveal as="h2" id="projects-title" className="font-display section-title">
            Things I’ve <em className="font-serif">built.</em>
          </Reveal>
          <p>Three projects. The code for each one is on GitHub.</p>
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
                  <p className="eyebrow">
                    {project.tags.join(' · ')}
                    {project.status === 'In progress' ? ' · In progress' : ''}
                  </p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
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
