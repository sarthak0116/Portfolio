import Link from 'next/link';
import { FilmLayer } from '@/components/film/FilmLayer';

export default function NotFound() {
  return (
    <>
      <FilmLayer variant="plain" />
      <main className="not-found">
        <p className="eyebrow">404 / Lost signal</p>
        <h1 className="font-display">
          This page
          <br />
          <em className="font-serif">wandered off.</em>
        </h1>
        <p>The link may be old, or the page is still becoming.</p>
        <Link className="arrow-link" href="/">
          Return home <span aria-hidden="true">↗</span>
        </Link>
      </main>
    </>
  );
}
