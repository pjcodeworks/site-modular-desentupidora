import 'server-only';

import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { defaultServiceImages, defaultSiteConfig, siteConfigSchema, type ServiceId, type SiteConfig } from './config-schema';

const dataDir = path.join(process.cwd(), 'data');
const historyDir = path.join(dataDir, 'history');
const draftPath = path.join(dataDir, 'config.draft.json');
const publishedPath = path.join(dataDir, 'config.published.json');

async function writeJsonAtomic(filePath: string, data: SiteConfig) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(data, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
  await rename(tempPath, filePath);
}

async function readConfig(filePath: string) {
  try {
    const content = await readFile(filePath, 'utf8');
    const raw = JSON.parse(content) as { services?: Array<Record<string, unknown>> };
    raw.services = raw.services?.map((service) => ({
      ...service,
      imageUrl: Object.hasOwn(service, 'imageUrl') ? service.imageUrl : defaultServiceImages[service.id as ServiceId] ?? '',
    }));
    return siteConfigSchema.parse(raw);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    const seeded = { ...defaultSiteConfig, updatedAt: new Date().toISOString() };
    await writeJsonAtomic(filePath, seeded);
    return seeded;
  }
}

export async function getPublishedConfig() {
  return readConfig(publishedPath);
}

export async function getDraftConfig() {
  try {
    return await readConfig(draftPath);
  } catch {
    const published = await getPublishedConfig();
    await writeJsonAtomic(draftPath, published);
    return published;
  }
}

export async function saveDraftConfig(input: SiteConfig) {
  const parsed = siteConfigSchema.parse({ ...input, updatedAt: new Date().toISOString() });
  await writeJsonAtomic(draftPath, parsed);
  return parsed;
}

export async function publishDraftConfig() {
  const draft = await getDraftConfig();
  try {
    const previous = await getPublishedConfig();
    await mkdir(historyDir, { recursive: true });
    const historyFile = path.join(historyDir, `${Date.now()}-${previous.updatedAt.replace(/[:.]/g, '-')}.json`);
    await writeJsonAtomic(historyFile, previous);
  } catch {
    // First publication has no previous version to preserve.
  }
  const published = { ...draft, updatedAt: new Date().toISOString() };
  await writeJsonAtomic(publishedPath, published);
  await writeJsonAtomic(draftPath, published);
  return published;
}

export async function restorePreviousConfig() {
  await mkdir(historyDir, { recursive: true });
  const files = (await readdir(historyDir)).filter((file) => file.endsWith('.json')).sort().reverse();
  const latest = files[0];
  if (!latest) return null;
  const restored = await readConfig(path.join(historyDir, latest));
  const next = { ...restored, updatedAt: new Date().toISOString() };
  await writeJsonAtomic(draftPath, next);
  return next;
}

export async function exportDraftConfig() {
  return JSON.stringify(await getDraftConfig(), null, 2);
}

export async function importDraftConfig(raw: string) {
  const imported = siteConfigSchema.parse(JSON.parse(raw));
  const current = await getDraftConfig();
  // Imported config never points to another installation's uploads.
  const safeImport = {
    ...imported,
    company: { ...imported.company, logoUrl: current.company.logoUrl, faviconUrl: current.company.faviconUrl },
    services: imported.services.map((service) => ({
      ...service,
      imageUrl: service.imageUrl.startsWith('/media/')
        ? current.services.find((item) => item.id === service.id)?.imageUrl ?? ''
        : service.imageUrl,
    })),
    media: current.media,
    updatedAt: new Date().toISOString(),
  };
  return saveDraftConfig(safeImport);
}
