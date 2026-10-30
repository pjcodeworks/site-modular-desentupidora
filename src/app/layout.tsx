import type { Metadata } from 'next';
import { getPublishedConfig } from '@/lib/config-store';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPublishedConfig();
  return {
    title: config.seo.title,
    description: config.seo.description,
    metadataBase: config.seo.canonicalUrl ? new URL(config.seo.canonicalUrl) : undefined,
    alternates: config.seo.canonicalUrl ? { canonical: config.seo.canonicalUrl } : undefined,
    openGraph: config.media.socialImageUrl ? { images: [config.media.socialImageUrl] } : undefined,
    icons: config.company.faviconUrl ? { icon: config.company.faviconUrl } : undefined,
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
