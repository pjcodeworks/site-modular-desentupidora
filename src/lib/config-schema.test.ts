import { describe, expect, it } from 'vitest';
import { defaultServiceImages, defaultSiteConfig, siteConfigSchema } from './config-schema';

describe('service images', () => {
  it('ships the three technical cards with replaceable default assets', () => {
    const config = siteConfigSchema.parse(defaultSiteConfig);

    expect(config.services.find((service) => service.id === 'hydrojet')?.imageUrl).toBe(defaultServiceImages.hydrojet);
    expect(config.services.find((service) => service.id === 'camera')?.imageUrl).toBe(defaultServiceImages.camera);
    expect(config.services.find((service) => service.id === 'pipes')?.imageUrl).toBe(defaultServiceImages.pipes);
  });

  it('keeps an intentional empty image instead of restoring a default', () => {
    const config = structuredClone(defaultSiteConfig);
    const hydrojet = config.services.find((service) => service.id === 'hydrojet');
    if (hydrojet) hydrojet.imageUrl = '';

    expect(siteConfigSchema.parse(config).services.find((service) => service.id === 'hydrojet')?.imageUrl).toBe('');
  });

  it('adds safe defaults when loading a configuration created before verified information existed', () => {
    const legacy = structuredClone(defaultSiteConfig) as unknown as Record<string, unknown>;
    delete legacy.verifiedInfo;
    const media = legacy.media as Record<string, unknown>;
    delete media.teamUrl;
    delete media.equipmentUrl;

    const parsed = siteConfigSchema.parse(legacy);
    expect(parsed.verifiedInfo.enabled).toBe(false);
    expect(parsed.media.teamUrl).toBe('');
    expect(parsed.media.equipmentUrl).toBe('');
  });

  it('requires a source when reviews are shown', () => {
    const config = structuredClone(defaultSiteConfig);
    config.verifiedInfo.reviewsLabel = 'Avaliações verificadas';
    expect(siteConfigSchema.safeParse(config).success).toBe(false);
  });
});
