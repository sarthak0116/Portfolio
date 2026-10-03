import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif, Jost } from 'next/font/google';
import { headers } from 'next/headers';
import { site } from '@/content/site';
import { themeScript } from '@/lib/theme';
import './globals.css';

const display = Jost({ variable: '--font-display', subsets: ['latin'], display: 'swap' });
const serif = Instrument_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});
const geist = Geist({ variable: '--font-sans', subsets: ['latin'], display: 'swap' });
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.seo.url),
  title: { default: site.seo.title, template: `%s — ${site.name}` },
  description: site.seo.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: site.seo.title,
    description: site.seo.description,
    url: site.seo.url,
    siteName: site.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.seo.title,
    description: site.seo.description,
  },
};

export const viewport: Viewport = { themeColor: '#040405', width: 'device-width', initialScale: 1 };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before first paint so the saved theme and motion preference never flash. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${display.variable} ${serif.variable} ${geist.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
