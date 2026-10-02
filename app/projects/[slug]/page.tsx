import type { Metadata, Route } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { projectBySlug, projects } from '@/content/projects';
import { site } from '@/content/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <header className="case-nav">
        <Link href="/">← Back home</Link>
        <a href={`mailto:${site.email}`}>Contact</a>
      </header>
      <main className="case-study">
        <p className="eyebrow">
          Project / {project.year} / {project.status}
        </p>
        <h1 className="font-display">{project.title}</h1>
        <p className="case-summary">{project.summary}</p>
        <div className="case-facts">
          <p>
            <span className="eyebrow">Role</span>
            {project.role}
          </p>
          <p>
            <span className="eyebrow">Stack</span>
            {project.stack.join(' · ')}
          </p>
          <p>
            <span className="eyebrow">Where it stands</span>
            {project.result}
          </p>
        </div>
        <article>
          {project.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display">{section.heading}</h2>
              <p>{section.text}</p>
            </section>
          ))}
          <p className="case-links">
            <ArrowLink href={project.repo} external>
              Code on GitHub
            </ArrowLink>
          </p>
        </article>
        <nav className="case-next" aria-label="More projects">
          <Link href="/#projects">← All projects</Link>
          {next && next.slug !== project.slug ? (
            <Link href={`/projects/${next.slug}` as Route}>Next: {next.title} →</Link>
          ) : null}
        </nav>
      </main>
    </>
  );
}
