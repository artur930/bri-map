import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BRI Interactive Map | Belt and Road Initiative',
  description:
    'Interactive visualization of Belt and Road Initiative infrastructure — ports, airports, trade corridors, and economic corridors across Asia, Africa, and Europe.',
  keywords: 'Belt and Road Initiative, BRI, Silk Road, infrastructure map, trade routes, China',
  openGraph: {
    title: 'BRI Interactive Map',
    description: 'Explore Belt and Road Initiative infrastructure across 152 countries.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
