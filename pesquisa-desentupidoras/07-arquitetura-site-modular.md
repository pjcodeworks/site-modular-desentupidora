# 07 — Arquitetura do site modular

## Requisitos de produto (hipótese inicial)

**Funcionais essenciais**

1. Configurar marca, contato, serviços, cidades/bairros e textos.
2. Apresentar rota rápida de emergência e rota distinta para B2B/preventiva.
3. Coletar contexto mínimo e encaminhar uma mensagem estruturada ao WhatsApp ou ligação.
4. Exibir provas e condições somente quando fornecidas/validadas pelo cliente.
5. Criar páginas reais de serviço/localidade sem conteúdo automático vazio.

**Não funcionais**

- Mobile-first, legível em rede limitada, acessível por teclado e com movimento reduzido.
- Conteúdo estático e CTA primário devem renderizar sem depender de API externa.
- Sem preço, disponibilidade, prazo, avaliação, garantia ou certificado fictício.

**Fora do MVP**

- Agenda em tempo real, rastreamento de frota, IA de diagnóstico, preço automático, CRM completo, login de cliente, 3D e upload persistente.

## Módulos reutilizáveis

| Módulo | Configurações | Dependências | Regra de segurança |
|---|---|---|---|
| `BrandHeader` | logo, nome, telefone, CTA | nenhuma | logo fornecido; não redesenhar marca |
| `EmergencyHero` | sintomas, mensagem, contato | telefone/WhatsApp | só exibir “24h” se configurado/confirmado |
| `ServiceSelector` | serviços e descrições | catálogo | não diagnostica ou cota |
| `CoverageCheck` | cidades/bairros/aviso | cobertura | resposta é confirmação, não disponibilidade factual |
| `WhatsAppIntake` | perguntas por segmento | número/consentimento | dados mínimos; texto codificado |
| `ProcessSteps` | etapas e condições | operação real | refletir fluxo do cliente |
| `TrustEvidence` | docs, avaliações, fotos, garantia | ativos aprovados | origem/data e possibilidade de desligar |
| `B2BRequest` | segmento, acesso, janela | canal comercial | sem promessa de contrato/visita |
| `ServicePage` | SEO, conteúdo, FAQ real | conteúdo único | evitar escala de páginas vazias |
| `FooterLegal` | CNPJ, política, canais | dados legais | não preencher com dados de exemplo em produção |

## Modelo de configuração (conceitual)

```ts
type ClientConfig = {
  brand: { name: string; logoUrl?: string; colors: { primary: string } };
  contact: { phone: string; whatsapp: string; businessHours: string };
  coverage: { cities: string[]; neighborhoods?: string[]; confirmationCopy: string };
  services: Array<{ slug: string; name: string; audiences: ('residential'|'business')[] }>;
  claims: { emergency24h?: boolean; budgetPolicy?: string; warrantyPolicy?: string };
  modules: { intake: boolean; b2b: boolean; evidence: boolean; gallery: boolean };
};
```

Campos opcionais não significam alegações default. O template começa conservador e só ativa prova/claim após preenchimento pelo operador.

## Fluxos

```text
Emergência: Sintoma → endereço/bairro → contexto curto → WhatsApp/Ligar
Planejado: segmento → objetivo/manutenção → imóvel/acesso → pedido comercial
Pós-serviço (futuro): atendimento concluído → documento autorizado → solicitação de avaliação
```

## Evolução técnica

1. **Estático configurável:** repositório por cliente ou `config.ts`; sem banco.
2. **Gerador controlado:** mesma base, dados por cliente, checklist de prova e revisão humana antes de publicar.
3. **Operação conectada:** endpoint, CRM e agenda com autorização, LGPD, logs e responsável operacional.

## Critérios de aceite do MVP

- Alterar logo, cores, serviços, área e WhatsApp sem tocar nos componentes centrais.
- Rota de urgência chega ao contato em até poucos toques, sem campo obrigatório irrelevante.
- Não há conteúdo-fantasma de prova social, documentos ou disponibilidade.
- Página de serviço/localidade possui conteúdo próprio e CTA consistente.
