import { describe, expect, it } from 'vitest';
import { defaultSiteConfig } from './config-schema';
import { buildWhatsAppUrl, findRegion, findRegionCandidates, normalizeRegion, slugify } from './site-utils';

describe('site utilities', () => {
  it('normalizes accents and spacing', () => expect(normalizeRegion('  Região   Central ')).toBe('regiao central'));
  it('matches configured region aliases', () => expect(findRegion(defaultSiteConfig, 'centro')?.id).toBe('regiao-central'));
  it('matches a configured alias inside a common city format', () => expect(findRegion(defaultSiteConfig, 'Centro - SP')?.id).toBe('regiao-central'));
  it('normalizes punctuation used in region searches', () => expect(normalizeRegion('  Centro, São Paulo/SP ')).toBe('centro sao paulo sp'));
  it('does not accept partial region names', () => expect(findRegion(defaultSiteConfig, 'central')).toBeNull());
  it('keeps ambiguous region aliases unresolved', () => {
    const config = structuredClone(defaultSiteConfig);
    config.regions.push({ id: 'centro-historico', name: 'Centro Histórico', aliases: ['centro'] });
    expect(findRegionCandidates(config, 'centro')).toHaveLength(2);
    expect(findRegion(config, 'centro')).toBeNull();
  });
  it('builds a contextual WhatsApp URL without inventing coverage', () => {
    const url = decodeURIComponent(buildWhatsAppUrl(defaultSiteConfig, 'sink', 'Centro'));
    expect(url).toContain('avaliação para desentupimento de pia');
    expect(url).toContain('Região informada: Centro');
    expect(url).not.toContain('cobertura confirmada');
  });
  it('creates stable slugs', () => expect(slugify('São Bernardo do Campo')).toBe('sao-bernardo-do-campo'));
});
