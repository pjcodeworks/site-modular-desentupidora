import type { ServiceId, SiteConfig } from './config-schema';

export function normalizeRegion(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function findRegionCandidates(config: SiteConfig, query: string) {
  const normalized = normalizeRegion(query);
  if (!normalized) return [];

  const entries = config.regions.map((region) => ({ region, terms: [region.name, ...region.aliases].map(normalizeRegion).filter(Boolean) }));
  const exact = entries.filter(({ terms }) => terms.includes(normalized)).map(({ region }) => region);
  if (exact.length) return exact;

  const paddedQuery = ` ${normalized} `;
  return entries
    .filter(({ terms }) => terms.some((term) => term.length >= 4 && paddedQuery.includes(` ${term} `)))
    .map(({ region }) => region);
}

export function findRegion(config: SiteConfig, query: string) {
  const candidates = findRegionCandidates(config, query);
  return candidates.length === 1 ? candidates[0] : null;
}

export function buildWhatsAppUrl(config: SiteConfig, serviceId?: ServiceId, region?: string) {
  const service = config.services.find((item) => item.id === serviceId && item.enabled);
  const parts = ['Olá!', service?.whatsappMessage ?? 'Gostaria de solicitar uma avaliação.'];
  if (region?.trim()) parts.push(`Região informada: ${region.trim()}.`);
  parts.push('Podem me orientar sobre o atendimento? Se ajudar na avaliação, posso enviar foto ou vídeo por aqui.');
  return `https://wa.me/${config.company.whatsapp}?text=${encodeURIComponent(parts.join(' '))}`;
}

export function slugify(value: string) {
  return normalizeRegion(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}
