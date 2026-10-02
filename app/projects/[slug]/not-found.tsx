import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">Project not found</p>
      <h1 className="font-display">
        Wrong
        <br />
        <em className="font-serif">turn.</em>
      </h1>
      <Link className="arrow-link" href="/">
        Return home <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
