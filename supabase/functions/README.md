# Edge Functions

Nenhuma função privilegiada é activada na Fase 1. Reservar este espaço para fluxos que não devem ser executados com privilégios de browser, como:

- validar tokens opacos e submeter RSVP;
- confirmar pagamentos depois de revisão administrativa;
- executar check-in com operação atómica/idempotente;
- emitir URLs assinados de ficheiros privados;
- enviar notificações através de Resend.

As funções futuras devem validar payloads com Zod, verificar identidade/limites, usar segredos apenas no ambiente Edge e manter service role fora do cliente. Não activar um endpoint público sem rate limit, auditoria e teste de RLS associado.