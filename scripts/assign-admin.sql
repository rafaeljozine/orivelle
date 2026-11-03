-- Operação manual, fora do registo público. Executar no SQL Editor de Supabase
-- depois de criar e verificar a conta de administrador em Authentication.
-- Substituir ambos os valores pela identidade confirmada na tabela auth.users.
-- Não executar com UUID/email de um utilizador não autorizado.

insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where id = 'SUBSTITUIR-PELO-UUID-VERIFICADO'::uuid
  and lower(email) = lower('SUBSTITUIR-PELO-EMAIL-VERIFICADO')
on conflict (user_id, role) do nothing;