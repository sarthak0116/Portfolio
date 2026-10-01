import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { site } from '@/content/site';

const caseStudies = {
  'kinetic-systems': {
    title: 'Kinetic Systems',
    summary: 'TODO: Replace with the project premise.',
    role: 'TODO: Your role',
    year: '2025',
    stack: ['TypeScript', 'React', 'Next.js'],
    outcome: 'TODO: Add an outcome with a metric.',
    body: 'TODO: Write the full case study: context, constraints, decisions, and what changed.',
  },
} as const;

export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = caseStudies[slug as keyof typeof caseStudies];
  if (!project) notFound();
  return (
    <>
      <header className="case-nav">
        <Link href="/">← Back home</Link>
        <a href={`mailto:${site.email}`}>Contact</a>
      </header>
      <main className="case-study">
        <p className="eyebrow">Case study / {project.year}</p>
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
            <span className="eyebrow">Outcome</span>
            {project.outcome}
          </p>
        </div>
        <div className="case-placeholder">
          <p className="eyebrow">Project visual</p>
          <p>TODO: Add a descriptive screenshot or diagram with a real alt text.</p>
        </div>
        <article>
          <h2 className="font-display">The work</h2>
          <p>{project.body}</p>
        </article>
        <nav className="case-next" aria-label="Case study navigation">
          <Link href="/">← All projects</Link>
        </nav>
      </main>
    </>
  );
}
