import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1 className="font-display">
        Nothing
        <br />
        <em className="font-serif">here.</em>
      </h1>
      <p>The link may be old or mistyped.</p>
      <Link className="arrow-link" href="/">
        Return home <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
