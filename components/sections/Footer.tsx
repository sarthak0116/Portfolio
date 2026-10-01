import { site } from '@/content/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <div>
          <a href={site.socials.linkedin} rel="noopener noreferrer" target="_blank">
            LinkedIn
          </a>
          <a href={site.socials.github} rel="noopener noreferrer" target="_blank">
            GitHub
          </a>
          <a href={site.socials.leetcode} rel="noopener noreferrer" target="_blank">
            LeetCode
          </a>
        </div>
        <p className="eyebrow">Built with intent</p>
      </div>
    </footer>
  );
}
