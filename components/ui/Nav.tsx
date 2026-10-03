import Link from 'next/link';
import { site } from '@/content/site';
import { sections } from '@/config/sections';
import { Chapters } from './Chapters';
import { Controls } from './Controls';

export function Nav() {
  return (
    <header className="site-nav">
      <Link className="wordmark" href="/" aria-label={`${site.name}, home`}>
        <span className="wordmark-ring" aria-hidden="true" />
        <span>{site.name}</span>
      </Link>
      <nav aria-label="Primary">
        <ul className="nav-list">
          {sections.slice(1, -1).map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}-body`}>{section.title}</a>
            </li>
          ))}
          <li>
            <a href="#contact-body">Contact</a>
          </li>
        </ul>
      </nav>
      <div className="nav-actions">
        {site.resumePath ? (
          <a className="resume-link" href={site.resumePath} download>
            Resume <span aria-hidden="true">↓</span>
          </a>
        ) : null}
        <Chapters />
        <Controls />
      </div>
    </header>
  );
}
