import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sarthak Singh — Developer',
    short_name: 'Portfolio',
    start_url: '/',
    display: 'standalone',
    background_color: '#10110f',
    theme_color: '#d6ff3f',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
