import type { MetadataRoute } from 'next';
import { getPublishedConfig } from '@/lib/config-store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = await getPublishedConfig();
  if (!config.seo.canonicalUrl) return [];
  return [{ url: config.seo.canonicalUrl, lastModified: new Date(config.updatedAt), changeFrequency: 'monthly', priority: 1 }];
}
