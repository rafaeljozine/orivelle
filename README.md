# Orivelle

Plataforma web de convites digitais personalizados. A equipa cria e publica os convites; clientes acompanham pedidos e aprovam versões. Não há edição de design pelo cliente nem funcionalidades de IA.

## Arquitectura

O código é organizado por funcionalidades. A estrutura planeada para as quatro fases é:

```text
src/
  app/                 Arranque, providers e rotas
  components/          Componentes de interface partilhados
  config/              Ambiente e configuração da aplicação
  features/
    auth/              Sessão, registo e perfil
    public-site/       Website, catálogo e páginas públicas
    client/            Área e dashboard do cliente
    orders/            Pedidos e revisões
    invitations/       Convites publicados e versões
    editor/            Editor administrativo de formulários
    guests/            Convidados, tokens e RSVP
    checkin/           QR e validação de entradas
    seating/           Mesas e lugares
    payments/          Pagamentos manuais
    gallery/           Álbum e fotografias
    notifications/     Notificações
    admin/             Operação administrativa e auditoria
  lib/                 Clientes externos e utilitários
  tests/               Configuração e utilitários de teste
supabase/
  migrations/          SQL versionado, RLS e constraints
  functions/           Edge Functions futuras
docs/                  Arquitectura, segurança e operação
scripts/               Operações manuais controladas
e2e/                   Testes Playwright
```

A Fase 1 implementa `auth`, `public-site`, `client` e `orders`. Os outros módulos ficam planeados, sem páginas vazias. Decisões de segurança e dados estão em [docs/architecture.md](docs/architecture.md).

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm 10+
- Projecto Supabase para autenticação e gravação real

## Desenvolvimento

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Sem variáveis Supabase, o website usa referências visuais de demonstração, identificadas como tal. Registo, login e pedidos ficam indisponíveis e não são guardados localmente. Não são usados clientes, pagamentos ou encomendas fictícias como dados reais.

## Variáveis

| Variável | Finalidade |
| --- | --- |
| `VITE_SUPABASE_URL` | URL público do projecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon/publishable pública, sempre limitada por RLS |
| `VITE_DEFAULT_TIMEZONE` | Fuso horário dos eventos; por omissão `Africa/Maputo` |

Nunca colocar `service_role`, tokens privados ou segredos em variáveis `VITE_*`. Configure esses valores apenas em Edge Functions ou no backend. Resend fica para uma fase futura.

## Supabase

1. Crie um projecto Supabase e configure as variáveis de ambiente.
2. Reveja e aplique `supabase/migrations/202610290001_initial_schema.sql` num projecto novo.
3. Crie manualmente o primeiro utilizador em Supabase Auth e atribua o papel `admin` com o procedimento descrito em [scripts/assign-admin.sql](scripts/assign-admin.sql).
4. Não crie administradores através do registo público. A migração atribui apenas o papel `client` a novas contas.

Configure também os URLs autorizados de Auth para o domínio local e de produção, incluindo o callback de recuperação em `/entrar`.

A migração activa RLS em todas as 28 tabelas, publica apenas categorias/modelos/planos marcados como publicados e cria um bucket privado `order-files`. Não está configurado qualquer dado comercial seed. A aplicação não executa migrações automaticamente.

## Verificação

```powershell
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Para Playwright, instale o browser uma vez com `npx playwright install chromium`.

## Deploy

O build de produção é `npm run build`, com saída em `dist/`. O ficheiro `vercel.json` encaminha rotas SPA para a aplicação. Configure as variáveis públicas Supabase no projecto Vercel. Migrações e atribuição de administrador são operações manuais; não há deploy ou migração automática.
