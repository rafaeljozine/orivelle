# Arquitectura e segurança

## Limites da Fase 1

Inclui website público, catálogo, autenticação Supabase, envio autenticado de pedidos e área de acompanhamento. Não inclui pagamentos, editor, aprovação/publicação, RSVP, QR, check-in ou comunicações externas. As estruturas de dados para fases posteriores existem no esquema; as respectivas interfaces e processos ainda não estão activos.

## Camadas

- `app`: composição de providers React Query, sessão e React Router.
- `features/<domínio>`: páginas, componentes, serviços, schemas Zod, hooks e tipos pertencentes ao domínio.
- `components`: biblioteca partilhada de interface quando necessária.
- `lib`: clientes de serviços e formatação sem regras de negócio.
- `config`: leitura e validação de configuração pública.
- `supabase/migrations`: fonte versionada de tabelas, constraints, índices e RLS.
- `supabase/functions`: ponto de entrada futuro para RSVP, leitura de tokens, check-in e notificações privilegiadas.

Os fluxos dependem de serviços de domínio, não importam directamente componentes de outros domínios. O cliente Supabase só é instanciado quando URL e chave pública existem.

## Identidade e autorização

Supabase Auth é a fonte de identidade. Um trigger cria `profiles` e atribui `client` no registo. O papel `admin` nunca é atribuído pelo browser nem pelo registo público. `public.is_admin()` é `SECURITY DEFINER`, tem `search_path` vazio e consulta a tabela de papéis qualificada; por isso, as políticas não provocam recursão RLS.

Todas as tabelas têm RLS. Clientes podem ler o próprio perfil, pedidos e os recursos de convite pertencentes a pedidos seus; só podem inserir pedidos com `customer_id = auth.uid()` e estado inicial `submitted`. Não recebem política de update para design ou estado do pedido. A gestão é reservada a `admin`. Sem política correspondente, o acesso é negado.

O catálogo público só revela linhas publicadas. Tokens de convidados armazenam apenas hash, e tabelas de token/RSVP não têm acesso anónimo directo. A futura validação pública deve acontecer numa Edge Function com token opaco, limites de utilização e privilégios mínimos.

## Dados e estados

- Pedidos ligam cliente, modelo opcional, tipo de evento, data, número estimado, localização, briefing e estado.
- `invitations` conserva o `public_slug`; as versões são registos separados e apontados por `approved_version_id` e `published_version_id`.
- Configurações são `jsonb` com `schema_version`; a aplicação deve validar com Zod por versão e renderizar componentes registados. Nunca interpretar HTML ou JavaScript da base de dados.
- MZN é a moeda de apresentação e `Africa/Maputo` o fuso horário por omissão.
- O esquema não contém dados comerciais iniciais. As referências de catálogo no fallback local são marcadas como demonstração e não permitem criar pedidos por modelo fictício.

## Ficheiros

`order-files` é um bucket privado com limite de 10 MiB e PDF/JPEG/PNG/WebP. As políticas Storage relacionam o primeiro segmento do caminho com o ID de um pedido pertencente ao cliente. A Fase 1 recolhe briefing textual; upload e comprovativos ainda não estão ligados à interface.

Nunca guardar service role no cliente. Ficheiros públicos de convites, tokens, confirmação de pagamentos, check-in concorrente e notificações exigem Edge Functions e políticas específicas antes de serem activados.

## Segurança operacional

1. Rever a migração e aplicá-la num projecto Supabase novo, sem operações destrutivas.
2. Criar uma conta de administrador manualmente e executar o script administrativo com UUID e email verificados.
3. Configurar apenas URL e chave anon/publishable na Vercel; RLS é obrigatória para essas chamadas.
4. Testar políticas com utilizadores distintos (cliente A, cliente B, administrador e anon) antes de qualquer publicação.
5. Configurar domínio de email, política de retenção, consentimento e contacto institucional antes de recolher dados reais.