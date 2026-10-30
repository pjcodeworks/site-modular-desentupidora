import { defaultServiceImages, defaultSiteConfig, type SiteConfig } from './config-schema';

export type ReadinessStatus = 'complete' | 'attention' | 'optional' | 'blocking';
export type ReadinessItem = { label: string; detail: string; status: ReadinessStatus };

export function getPublicationReadiness(config: SiteConfig): ReadinessItem[] {
  const enabledServices = config.services.filter((service) => service.enabled);
  const usesDefaultContent = config.content.eyebrow === defaultSiteConfig.content.eyebrow
    && config.content.headline === defaultSiteConfig.content.headline
    && config.content.subheadline === defaultSiteConfig.content.subheadline;
  const usesDemoImages = config.services.some((service) => Object.values(defaultServiceImages).includes(service.imageUrl));
  const placeholderPhone = config.company.phone === defaultSiteConfig.company.phone;
  const placeholderWhatsapp = config.company.whatsapp === defaultSiteConfig.company.whatsapp;

  return [
    { label: 'Nome da empresa', detail: config.company.displayName ? 'Nome comercial configurado.' : 'Informe o nome comercial.', status: config.company.displayName ? 'complete' : 'blocking' },
    { label: 'Logotipo', detail: config.company.logoUrl ? 'Arquivo de logotipo definido.' : 'A marca tipográfica será usada enquanto não houver arquivo.', status: config.company.logoUrl ? 'complete' : 'attention' },
    { label: 'WhatsApp', detail: placeholderWhatsapp ? 'O número ainda é o valor demonstrativo.' : 'Número válido configurado.', status: placeholderWhatsapp ? 'attention' : 'complete' },
    { label: 'Telefone', detail: placeholderPhone ? 'Revise o telefone demonstrativo antes de publicar.' : 'Telefone revisado.', status: placeholderPhone ? 'attention' : 'complete' },
    { label: 'Regiões', detail: config.regions.length ? `${config.regions.length} região(ões) cadastrada(s).` : 'Cadastre ao menos uma região para a consulta.', status: config.regions.length ? 'complete' : 'attention' },
    { label: 'Serviços', detail: enabledServices.length ? `${enabledServices.length} serviço(s) habilitado(s).` : 'Nenhum serviço está habilitado.', status: enabledServices.length ? 'complete' : 'blocking' },
    { label: 'URL canônica', detail: config.seo.canonicalUrl ? 'URL canônica configurada.' : 'Pode ficar vazia enquanto o domínio não estiver publicado.', status: config.seo.canonicalUrl ? 'complete' : 'optional' },
    { label: 'Conteúdo demonstrativo', detail: usesDefaultContent ? 'O texto-base ainda está ativo. Confirme se ele representa a empresa.' : 'Texto principal personalizado.', status: usesDefaultContent ? 'attention' : 'complete' },
    { label: 'Imagens demonstrativas', detail: usesDemoImages ? 'Há ilustrações técnicas padrão em uso.' : 'Nenhuma ilustração padrão identificada.', status: usesDemoImages ? 'attention' : 'complete' },
    { label: 'Dados legais', detail: config.company.legalName ? 'Nome legal informado.' : 'Preencha somente quando a empresa decidir exibir essa informação.', status: config.company.legalName ? 'complete' : 'optional' },
    { label: 'SEO', detail: config.seo.title && config.seo.description ? 'Título e descrição preenchidos.' : 'Revise o título e a descrição.', status: config.seo.title && config.seo.description ? 'complete' : 'attention' },
  ];
}
