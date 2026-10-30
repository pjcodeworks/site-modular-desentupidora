# site-modular-desentupidora

Base independente e configurável baseada na direção moderna/tecnológica. Inclui site público, casa SVG interativa e acessível, validação de cobertura, WhatsApp contextualizado e painel com rascunho/publicação/histórico.

As ilustrações técnicas padrão de hidrojateamento, vídeo inspeção e limpeza de tubulações ficam em `public/assets/services`. Cada uma pode ser substituída pelo painel em **Imagens**, sem alterar os componentes ou o layout. A casa é um mapa ilustrativo para seleção do ponto e não representa a instalação real de um imóvel.

## Executar localmente

1. Instale: `pnpm install`
2. Gere credenciais: `pnpm setup:admin -- "uma-senha-forte-com-12-caracteres"`
3. Copie `.env.example` para `.env.local` e preencha `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` e `SESSION_SECRET`.
4. Inicie: `pnpm dev`
5. Site: `http://localhost:3000`; painel: `http://localhost:3000/admin`

## Persistência

- `data/config.draft.json`: rascunho.
- `data/config.published.json`: versão pública.
- `data/history/`: cópias anteriores.
- `data/uploads/`: imagens da instalação.

Esses arquivos são ignorados pelo Git e devem ser preservados pelo volume persistente do ambiente de produção. Esta versão não é compatível com hospedagem somente estática ou filesystem efêmero.

## Segurança

- Sessão assinada (`jose`) em cookie HttpOnly, SameSite=Lax e Secure em produção.
- Senha comparada com hash bcrypt; nenhum segredo é incluído no frontend.
- Toda mutação administrativa verifica sessão no servidor.
- Upload limitado a PNG/JPG/WebP de até 2 MB; nomes aleatórios e rota com `nosniff`.
- Importação validada por Zod e sem reapontar uploads de outra instalação.
- Para exposição pública do painel, aplique rate limiting no proxy/plataforma e considere um provedor de autenticação com MFA. Esta instalação usa um único administrador por variáveis de ambiente.

## Comandos de validação

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Deploy

Use um runtime Node com disco/volume persistente. Configure as três variáveis de autenticação e faça backup da pasta `data`. Não publique os dados de demonstração sem revisar nome, contato, serviços, regiões e textos.
