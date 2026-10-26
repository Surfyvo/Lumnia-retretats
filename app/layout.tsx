import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://yvonne-cordoba-lumnia.yvo2025.chatgpt.site');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Yvonne Córdoba × LumnIA — Guest Intelligence',
  description: 'Guest Intelligence, Applied AI and Hospitality Operations by Yvonne Córdoba, founder of LumnIA.',
  openGraph: {
    title: 'Yvonne Córdoba × LumnIA — Guest Intelligence',
    description: 'The intelligence behind anticipatory guest experiences — guest, operation and territory connected.',
    type: 'website',
    siteName: 'Yvonne Córdoba × LumnIA',
    images: [{ url: '/og.jpg', width: 1200, height: 675, alt: 'Yvonne Córdoba × LumnIA — Guest Intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yvonne Córdoba × LumnIA — Guest Intelligence',
    description: 'The intelligence behind anticipatory guest experiences — guest, operation and territory connected.',
    images: ['/og.jpg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
