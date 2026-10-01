import Link from 'next/link';
import { site } from '@/content/site';
import { sections } from '@/config/sections';
import { Controls } from './Controls';

export function Nav() {
  return (
    <header className="site-nav">
      <Link className="wordmark" href="/" aria-label={`${site.name}, home`}>
        <span aria-hidden="true">✳</span>
        <span>{site.name}</span>
      </Link>
      <nav aria-label="Primary">
        <ul className="nav-list">
          {sections.slice(1, -1).map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
      <div className="nav-actions">
        {site.resumePath ? (
          <a className="resume-link" href={site.resumePath} download>
            Resume <span aria-hidden="true">↓</span>
          </a>
        ) : null}
        <Controls />
      </div>
    </header>
  );
}
