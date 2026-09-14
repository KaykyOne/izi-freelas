# PWA e botão "Instalar app"

## Resumo

O izi Freelas virou um PWA instalável (manifest, service worker e ícones) e ganhou um botão
"Instalar app" na landing page e no dashboard inicial.

## Arquivos alterados

- `app/manifest.ts` (novo)
- `public/sw.js` (novo)
- `public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` (novos)
- `hooks/use-pwa-install.ts` (novo)
- `components/pwa-register.tsx` (novo)
- `components/install-app-button.tsx` (novo)
- `app/layout.tsx`
- `app/_components/landing-page.tsx`
- `app/dashboard/page.tsx`

## Alterações

- `app/manifest.ts` gera `/manifest.webmanifest` no build (`dynamic = "force-static"`, exigido pelo
  `output: "export"`). `start_url` aponta pro `/dashboard`; `display: standalone`.
- `public/sw.js`: navegação network-first com fallback de cache offline; `/_next/static/` e ícones
  cache-first; requisições de outra origem (Supabase) nunca passam pelo cache.
- `PwaRegister` (no `RootLayout`) registra o SW só em produção.
- `usePwaInstall` captura o `beforeinstallprompt`, detecta iOS e modo standalone e expõe `install()`.
- `InstallAppButton` (componente compartilhado em `components/`): dispara o prompt nativo; no iOS abre
  um Dialog com o passo a passo "Compartilhar → Adicionar à Tela de Início". Some quando o app já está
  instalado ou quando o navegador não oferece instalação.
- Layout ganhou `appleWebApp`, `apple-touch-icon` e `viewport.themeColor` (claro/escuro).
- Botão na landing: terceiro botão do hero (`ghost`). No dashboard: à direita da saudação (`outline`).

## Decisões

- URLs do manifest são relativas e o SW é resolvido a partir do `<link rel="manifest">`: o GitHub
  Pages (`configure-pages`) pode injetar `basePath`, e caminhos absolutos quebrariam a instalação.
- O `beforeinstallprompt` é guardado em escopo de módulo no hook, porque ele dispara uma vez só no
  carregamento e o botão pode montar depois (ex.: landing → dashboard).
- Sem biblioteca (next-pwa/serwist): SW escrito à mão, pequeno e compatível com export estático.
- Ícones são o glifo `UsersRound` da marca em branco sobre `#18181b`, gerados como PNG.
- Ao mudar a estratégia de cache, incrementar `CACHE_VERSION` em `public/sw.js` para limpar caches antigos.

## Estado atual

Build estático gera manifest e ícones; SW registra e ativa no escopo raiz e pré-carrega `/`,
`/dashboard` e `/login`. Em Chrome/Edge/Android o botão aparece e abre o prompt nativo; no Safari iOS
abre as instruções manuais; Firefox desktop não mostra o botão (não suporta instalação).

## Pendências

- O `apple-touch-icon` em `metadata.icons` é caminho absoluto; se o deploy usar `basePath`, validar
  se o Next o prefixa ou ajustar.
