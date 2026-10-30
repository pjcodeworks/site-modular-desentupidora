import { z } from 'zod';

export const serviceIds = ['sink', 'toilet', 'drain', 'sewer', 'hydrojet', 'camera', 'pipes', 'external'] as const;
export type ServiceId = (typeof serviceIds)[number];

const serviceSchema = z.object({
  id: z.enum(serviceIds),
  enabled: z.boolean(),
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().min(10).max(220),
  whatsappMessage: z.string().trim().min(10).max(280),
  imageUrl: z.string().trim().max(300).default(''),
});

export const defaultServiceImages: Partial<Record<ServiceId, string>> = {
  hydrojet: '/assets/services/hidrojateamento-blueprint-v1.png',
  camera: '/assets/services/video-inspecao-blueprint-v1.png',
  pipes: '/assets/services/limpeza-tubulacoes-blueprint-v1.png',
};

const regionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/).max(80),
  name: z.string().trim().min(2).max(80),
  aliases: z.array(z.string().trim().min(2).max(80)).max(30),
});

const verifiedInfoDefaults = {
  enabled: false,
  hours: '',
  base: '',
  cnpj: '',
  paymentMethods: '',
  issuesInvoice: false,
  warranties: '',
  licenses: '',
  insurance: '',
  reviewsLabel: '',
  reviewsSourceUrl: '',
};

const verifiedInfoSchema = z.object({
  enabled: z.boolean(),
  hours: z.string().trim().max(120),
  base: z.string().trim().max(120),
  cnpj: z.union([z.literal(''), z.string().trim().regex(/^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/, 'Use 14 números ou o formato 00.000.000/0000-00.')]),
  paymentMethods: z.string().trim().max(180),
  issuesInvoice: z.boolean(),
  warranties: z.string().trim().max(220),
  licenses: z.string().trim().max(220),
  insurance: z.string().trim().max(220),
  reviewsLabel: z.string().trim().max(120),
  reviewsSourceUrl: z.union([z.literal(''), z.string().url()]),
}).superRefine((info, context) => {
  if (Boolean(info.reviewsLabel) !== Boolean(info.reviewsSourceUrl)) {
    context.addIssue({ code: 'custom', message: 'Informe a descrição e o link de origem das avaliações.' });
  }
}).default(verifiedInfoDefaults);

export const siteConfigSchema = z.object({
  version: z.literal(1),
  company: z.object({
    legalName: z.string().trim().max(100),
    displayName: z.string().trim().min(2).max(48),
    logoUrl: z.string().trim().max(300),
    faviconUrl: z.string().trim().max(300),
    whatsapp: z.string().regex(/^\d{10,15}$/),
    phone: z.string().trim().min(8).max(24),
    email: z.union([z.literal(''), z.string().email()]),
  }),
  theme: z.object({
    primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    surface: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    fontPreset: z.enum(['modern', 'humanist']),
  }),
  content: z.object({
    eyebrow: z.string().trim().min(3).max(60),
    headline: z.string().trim().min(8).max(100),
    subheadline: z.string().trim().min(20).max(240),
    about: z.string().trim().min(20).max(800),
    finalCta: z.string().trim().min(8).max(100),
  }),
  verifiedInfo: verifiedInfoSchema,
  services: z.array(serviceSchema).length(serviceIds.length),
  regions: z.array(regionSchema).max(300),
  media: z.object({
    heroUrl: z.string().trim().max(300),
    socialImageUrl: z.string().trim().max(300),
    teamUrl: z.string().trim().max(300).default(''),
    equipmentUrl: z.string().trim().max(300).default(''),
  }),
  seo: z.object({
    title: z.string().trim().min(8).max(65),
    description: z.string().trim().min(20).max(170),
    canonicalUrl: z.union([z.literal(''), z.string().url()]),
  }),
  updatedAt: z.string().datetime(),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;

const baseServices: SiteConfig['services'] = [
  { id: 'sink', enabled: true, name: 'Pia', description: 'Água descendo devagar ou pia entupida? Descreva o que está acontecendo para a equipe avaliar.', whatsappMessage: 'Gostaria de solicitar uma avaliação para desentupimento de pia.', imageUrl: '' },
  { id: 'toilet', enabled: true, name: 'Vaso sanitário', description: 'Retorno de água, escoamento lento ou obstrução no vaso sanitário.', whatsappMessage: 'Gostaria de solicitar uma avaliação para o vaso sanitário.', imageUrl: '' },
  { id: 'drain', enabled: true, name: 'Ralo', description: 'Água acumulada, escoamento lento ou retorno em ralos internos e externos.', whatsappMessage: 'Gostaria de solicitar uma avaliação para desentupimento de ralo.', imageUrl: '' },
  { id: 'sewer', enabled: true, name: 'Rede de esgoto', description: 'Sinais de obstrução em diferentes pontos podem exigir avaliação da rede principal.', whatsappMessage: 'Gostaria de solicitar uma avaliação da rede de esgoto.', imageUrl: '' },
  { id: 'hydrojet', enabled: true, name: 'Hidrojateamento', description: 'Limpeza técnica com água sob pressão, indicada após avaliação das condições da tubulação.', whatsappMessage: 'Gostaria de solicitar uma avaliação para hidrojateamento.', imageUrl: defaultServiceImages.hydrojet ?? '' },
  { id: 'camera', enabled: true, name: 'Vídeo inspeção', description: 'Inspeção visual para auxiliar na localização e documentação de problemas internos.', whatsappMessage: 'Gostaria de saber se a vídeo inspeção é indicada para o meu caso.', imageUrl: defaultServiceImages.camera ?? '' },
  { id: 'pipes', enabled: true, name: 'Limpeza de tubulações', description: 'Avaliação e limpeza de tubulações conforme o tipo de uso e a condição encontrada.', whatsappMessage: 'Gostaria de solicitar uma avaliação para limpeza de tubulações.', imageUrl: defaultServiceImages.pipes ?? '' },
  { id: 'external', enabled: false, name: 'Redes externas', description: 'Atendimento de redes externas sujeito à avaliação da estrutura e do acesso.', whatsappMessage: 'Gostaria de solicitar uma avaliação para uma rede externa.', imageUrl: '' },
];

export const defaultSiteConfig: SiteConfig = {
  version: 1,
  company: {
    legalName: '',
    displayName: 'Nexo Hidro',
    logoUrl: '',
    faviconUrl: '',
    whatsapp: '5511999999999',
    phone: '(11) 99999-9999',
    email: '',
  },
  theme: { primary: '#112934', accent: '#b7cf3a', surface: '#f4f1e9', fontPreset: 'modern' },
  content: {
    eyebrow: 'Desentupimento residencial e comercial',
    headline: 'Qual é o problema?',
    subheadline: 'Selecione o ponto do imóvel, informe sua região e fale com a equipe para avaliar o atendimento.',
    about: 'Cada instalação possui características próprias. A representação da casa é ilustrativa e ajuda a identificar o ponto do problema; a solução adequada depende de avaliação.',
    finalCta: 'Conte o que está acontecendo',
  },
  verifiedInfo: verifiedInfoDefaults,
  services: baseServices,
  regions: [
    { id: 'regiao-central', name: 'Região Central', aliases: ['centro'] },
    { id: 'zona-norte', name: 'Zona Norte', aliases: [] },
  ],
  media: { heroUrl: '', socialImageUrl: '', teamUrl: '', equipmentUrl: '' },
  seo: {
    title: 'Nexo Hidro | Atendimento para entupimentos',
    description: 'Identifique o ponto do problema, confirme a região atendida e fale com a equipe pelo WhatsApp.',
    canonicalUrl: '',
  },
  updatedAt: new Date(0).toISOString(),
};
