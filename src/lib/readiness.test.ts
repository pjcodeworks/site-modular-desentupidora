import { describe, expect, it } from 'vitest';
import { defaultSiteConfig } from './config-schema';
import { getPublicationReadiness } from './readiness';

describe('publication readiness', () => {
  it('flags demonstration contact data without blocking optional fields', () => {
    const items = getPublicationReadiness(defaultSiteConfig);
    expect(items.find((item) => item.label === 'WhatsApp')?.status).toBe('attention');
    expect(items.find((item) => item.label === 'Dados legais')?.status).toBe('optional');
  });

  it('blocks an installation with no enabled services', () => {
    const config = structuredClone(defaultSiteConfig);
    config.services.forEach((service) => { service.enabled = false; });
    expect(getPublicationReadiness(config).find((item) => item.label === 'Serviços')?.status).toBe('blocking');
  });
});
