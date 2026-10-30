'use server';

import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSession, deleteSession, requireSession, verifyCredentials } from '@/lib/auth';
import { getDraftConfig, importDraftConfig, publishDraftConfig, restorePreviousConfig, saveDraftConfig } from '@/lib/config-store';
import { serviceIds, siteConfigSchema, type ServiceId, type SiteConfig } from '@/lib/config-schema';
import { slugify } from '@/lib/site-utils';

export async function loginAction(_state: { error: string }, formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  if (!(await verifyCredentials(email, password))) return { error: 'Credenciais inválidas.' };
  await createSession(email);
  redirect('/admin');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/admin/login');
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function parseRegions(raw: string): SiteConfig['regions'] {
  return raw.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const [name, aliases = ''] = line.split('|');
    return { id: slugify(name), name: name.trim(), aliases: aliases.split(',').map((item) => item.trim()).filter(Boolean) };
  });
}

export async function saveDraftAction(_state: { ok: boolean; error: string }, formData: FormData) {
  await requireSession();
  const current = await getDraftConfig();
  const services = serviceIds.map((id) => ({
    id,
    enabled: formData.get(`service.${id}.enabled`) === 'on',
    name: value(formData, `service.${id}.name`),
    description: value(formData, `service.${id}.description`),
    whatsappMessage: value(formData, `service.${id}.whatsappMessage`),
    imageUrl: current.services.find((service) => service.id === id)?.imageUrl ?? '',
  }));
  const candidate: SiteConfig = {
    version: 1,
    company: {
      legalName: value(formData, 'legalName'),
      displayName: value(formData, 'displayName'),
      logoUrl: current.company.logoUrl,
      faviconUrl: current.company.faviconUrl,
      whatsapp: value(formData, 'whatsapp').replace(/\D/g, ''),
      phone: value(formData, 'phone'),
      email: value(formData, 'email'),
    },
    theme: {
      primary: value(formData, 'primary'),
      accent: value(formData, 'accent'),
      surface: value(formData, 'surface'),
      fontPreset: value(formData, 'fontPreset') as SiteConfig['theme']['fontPreset'],
    },
    content: {
      eyebrow: value(formData, 'eyebrow'), headline: value(formData, 'headline'), subheadline: value(formData, 'subheadline'),
      about: value(formData, 'about'), finalCta: value(formData, 'finalCta'),
    },
    verifiedInfo: {
      enabled: formData.get('verifiedInfo.enabled') === 'on',
      hours: value(formData, 'verifiedInfo.hours'),
      base: value(formData, 'verifiedInfo.base'),
      cnpj: value(formData, 'verifiedInfo.cnpj'),
      paymentMethods: value(formData, 'verifiedInfo.paymentMethods'),
      issuesInvoice: formData.get('verifiedInfo.issuesInvoice') === 'on',
      warranties: value(formData, 'verifiedInfo.warranties'),
      licenses: value(formData, 'verifiedInfo.licenses'),
      insurance: value(formData, 'verifiedInfo.insurance'),
      reviewsLabel: value(formData, 'verifiedInfo.reviewsLabel'),
      reviewsSourceUrl: value(formData, 'verifiedInfo.reviewsSourceUrl'),
    },
    services,
    regions: parseRegions(value(formData, 'regions')),
    media: current.media,
    seo: { title: value(formData, 'seoTitle'), description: value(formData, 'seoDescription'), canonicalUrl: value(formData, 'canonicalUrl') },
    updatedAt: new Date().toISOString(),
  };
  const parsed = siteConfigSchema.safeParse(candidate);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Configuração inválida.' };
  await saveDraftConfig(parsed.data);
  revalidatePath('/admin');
  revalidatePath('/');
  return { ok: true, error: '' };
}

export async function publishAction() {
  await requireSession();
  await publishDraftConfig();
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function restoreAction() {
  await requireSession();
  await restorePreviousConfig();
  revalidatePath('/admin');
}

export async function importAction(_state: { ok: boolean; error: string }, formData: FormData) {
  await requireSession();
  const file = formData.get('config');
  if (!(file instanceof File) || file.size === 0 || file.size > 512_000) return { ok: false, error: 'Selecione um JSON de até 500 KB.' };
  try {
    await importDraftConfig(await file.text());
    revalidatePath('/admin');
    return { ok: true, error: '' };
  } catch {
    return { ok: false, error: 'O arquivo não contém uma configuração válida.' };
  }
}

const uploadTypes = new Map([['image/png', 'png'], ['image/jpeg', 'jpg'], ['image/webp', 'webp']]);

export async function uploadImageAction(_state: { ok: boolean; error: string }, formData: FormData) {
  await requireSession();
  const file = formData.get('image');
  const target = value(formData, 'target');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Selecione uma imagem.' };
  const extension = uploadTypes.get(file.type);
  if (!extension || file.size > 2_000_000) return { ok: false, error: 'Use PNG, JPG ou WebP de até 2 MB.' };
  const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
  await mkdir(uploadsDir, { recursive: true });
  const filename = `${randomUUID()}.${extension}`;
  await writeFile(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()), { mode: 0o600 });
  const config = await getDraftConfig();
  const mediaUrl = `/media/${filename}`;
  if (target === 'logo') config.company.logoUrl = mediaUrl;
  if (target === 'favicon') config.company.faviconUrl = mediaUrl;
  if (target === 'hero') config.media.heroUrl = mediaUrl;
  if (target === 'social') config.media.socialImageUrl = mediaUrl;
  if (target === 'team') config.media.teamUrl = mediaUrl;
  if (target === 'equipment') config.media.equipmentUrl = mediaUrl;
  if (target.startsWith('service:')) {
    const serviceId = target.slice('service:'.length) as ServiceId;
    const service = config.services.find((item) => item.id === serviceId);
    if (service) service.imageUrl = mediaUrl;
  }
  await saveDraftConfig(config);
  revalidatePath('/admin');
  return { ok: true, error: '' };
}

export async function removeImageAction(formData: FormData) {
  await requireSession();
  const target = value(formData, 'target');
  const config = await getDraftConfig();
  if (target === 'logo') config.company.logoUrl = '';
  if (target === 'favicon') config.company.faviconUrl = '';
  if (target === 'hero') config.media.heroUrl = '';
  if (target === 'social') config.media.socialImageUrl = '';
  if (target === 'team') config.media.teamUrl = '';
  if (target === 'equipment') config.media.equipmentUrl = '';
  if (target.startsWith('service:')) {
    const serviceId = target.slice('service:'.length) as ServiceId;
    const service = config.services.find((item) => item.id === serviceId);
    if (service) service.imageUrl = '';
  }
  await saveDraftConfig(config);
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function getServiceName(config: SiteConfig, id: ServiceId) {
  return config.services.find((service) => service.id === id)?.name ?? id;
}
