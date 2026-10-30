# 06 — Tecnologias, bibliotecas e ferramentas

**Conclusão:** tecnologia deve seguir o estágio do produto. O MVP pode ser estático e rápido, com uma pequena ilha de interatividade para a triagem. Integrações, dados pessoais e agenda pedem backend e operação definida.

## Arquitetura recomendada por estágio

| Estágio | Proposta | Por quê | Limite |
|---|---|---|---|
| Essencial | Next.js App Router, TypeScript, CSS/Tailwind se aprovado, JSON de configuração, hospedagem estática | páginas por serviço/local com boa base SEO e personalização | não recebe/guarda leads no servidor |
| Interativo | mesmo front + formulário client-side que abre WhatsApp com texto codificado | baixo custo operacional e implementação rápida | não há CRM, agenda ou anexo persistente |
| Avançado | front + endpoint/BaaS aprovado + CRM/agenda/WhatsApp oficial | registro, consentimento, roteamento e integrações reais | exige segurança, LGPD, observabilidade e suporte |

O Next suporta exportação estática com `output: 'export'`, que gera HTML/JS/CSS e pode ser hospedada em servidor estático; recursos que precisam de runtime não funcionam nesse modo. [Documentação oficial](https://nextjs.org/docs/app/guides/static-exports) Isso favorece o primeiro nível. O App Router organiza páginas e layouts por arquivos. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

## Escolhas de ferramenta — recomendadas e condicionais

| Necessidade | Escolha inicial | Decisão/guardrail |
|---|---|---|
| Design e responsividade | CSS nativo ou Tailwind já aprovado | não instalar biblioteca só para cards/efeitos |
| Formulário | HTML nativo + validação leve | schema/form library somente se regras crescem |
| Animação | CSS para feedback de botão/accordion | Motion/GSAP apenas para transição que explique estado; respeitar redução de movimento |
| Conteúdo | arquivos tipados/JSON por cliente | CMS apenas quando pessoas não técnicas precisarem editar frequentemente |
| Mapas | lista de cidades/bairros no início | geocoding/mapa só com caso de uso, custo, chave e consentimento aprovados |
| WhatsApp | link `wa.me` com mensagem estruturada | automação exige canal oficial, consentimento, custos e definição de suporte |
| Analytics | eventos mínimos e consentimento conforme operação | medir CTA/envio, não atribuir venda sem conectar ao resultado comercial |
| 3D/Rive/Lottie | não no MVP | adotar somente com ativo/licença, orçamento de peso e benefício validado |

## SEO e dados estruturados

Usar páginas reais de serviços e localidades atendidas, dados empresariais consistentes e `LocalBusiness` somente para informação presente e verdadeira. O Google descreve `LocalBusiness` como modo de informar dados do negócio e exige aderência às diretrizes. [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/local-business?via=topaitools) Não usar schema para inventar avaliações, horário, preço ou cobertura.

## Segurança e privacidade antes do nível avançado

- Não colocar chaves de API no navegador/repositório.
- Upload de foto exige tipo/tamanho, varredura, expiração, controle de acesso e aviso de privacidade.
- Captura de lead deve definir base legal, retenção, acesso e resposta a solicitação de dados; validar a política jurídica com responsável.
- Integração de WhatsApp, CRM ou agenda só após definir quem recebe, SLA humano, falhas e custo recorrente.

## Tecnologias não escolhidas ainda

Astro, React Three Fiber/Three.js, Spline, Rive, Lottie, bibliotecas de mapas e automação podem ser avaliados em protótipos específicos. Esta pesquisa não identificou requisito que justifique instalá-los agora. A escolha de stack permanece revisável após validação do MVP.
