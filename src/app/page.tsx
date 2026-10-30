import { getSession } from '@/lib/auth';
import { getDraftConfig, getPublishedConfig } from '@/lib/config-store';
import { PublicSite } from '@/components/site/PublicSite';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const { preview } = await searchParams;
  const canPreview = preview === 'draft' && Boolean(await getSession());
  const config = canPreview ? await getDraftConfig() : await getPublishedConfig();
  return <PublicSite config={config} preview={canPreview} />;
}
