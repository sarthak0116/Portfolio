import type { Route } from 'next';
import Link from 'next/link';

export function ArrowLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const content = (
    <>
      {children}
      <span aria-hidden="true">↗</span>
    </>
  );
  // Only app routes go through next/link; anchors, mailto and external URLs are plain links.
  if (!external && href.startsWith('/')) {
    return (
      <Link href={href as Route} className="arrow-link">
        {content}
      </Link>
    );
  }
  const props = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a href={href} className="arrow-link" {...props}>
      {content}
    </a>
  );
}
