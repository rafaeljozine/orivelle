create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  phone_mz text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'operator', 'client')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create index user_roles_user_role_idx on public.user_roles (user_id, role);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  insert into public.user_roles (user_id, role) values (new.id, 'client');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  summary text,
  preview_image_url text,
  price_mzn numeric(12, 2) check (price_mzn is null or price_mzn >= 0),
  config_schema_version integer not null default 1 check (config_schema_version > 0),
  default_config jsonb not null default '{}'::jsonb check (jsonb_typeof(default_config) = 'object'),
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index templates_category_published_idx on public.templates (category_id, is_published, sort_order);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  summary text,
  price_mzn numeric(12, 2) check (price_mzn is null or price_mzn >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.plan_features (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans (id) on delete cascade,
  feature_key text not null,
  enabled boolean not null default false,
  limit_value integer check (limit_value is null or limit_value >= 0),
  unique (plan_id, feature_key)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete restrict,
  template_id uuid references public.templates (id) on delete set null,
  event_name text not null check (char_length(event_name) between 2 and 120),
  event_type text not null check (event_type in ('casamento', 'aniversario', 'noivado', 'cha', 'outro')),
  event_date date not null,
  guest_estimate integer not null check (guest_estimate between 1 and 10000),
  event_location text check (event_location is null or char_length(event_location) <= 180),
  brief text check (brief is null or char_length(brief) <= 1500),
  status text not null default 'submitted' check (status in (
    'submitted', 'reviewing', 'awaiting_payment', 'in_progress',
    'awaiting_approval', 'approved', 'published', 'cancelled'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_customer_created_idx on public.orders (customer_id, created_at desc);
create index orders_status_created_idx on public.orders (status, created_at desc);

create or replace function public.validate_order_event_date()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.event_date < (now() at time zone 'Africa/Maputo')::date then
    raise exception 'event_date must be today or later in Africa/Maputo'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger orders_validate_event_date
  before insert or update of event_date on public.orders
  for each row execute procedure public.validate_order_event_date();

create table public.order_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  storage_path text not null unique,
  original_name text not null,
  content_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  uploaded_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now()
);

create index order_files_order_idx on public.order_files (order_id, created_at);

create table public.order_revisions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete restrict,
  message text not null check (char_length(message) between 1 and 2000),
  revision_number integer not null check (revision_number > 0),
  created_at timestamptz not null default now(),
  unique (order_id, revision_number)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete restrict,
  amount_mzn numeric(12, 2) not null check (amount_mzn > 0),
  method text not null check (method in ('mpesa', 'emola', 'bank_transfer', 'other')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected', 'refunded')),
  reference text,
  proof_storage_path text,
  confirmed_by uuid references auth.users (id) on delete set null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  check ((confirmed_by is null) = (confirmed_at is null)),
  check (status <> 'confirmed' or confirmed_by is not null)
);

create index payments_order_created_idx on public.payments (order_id, created_at desc);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  event_type text not null,
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete restrict,
  plan_id uuid references public.plans (id) on delete set null,
  public_slug text not null unique default encode(extensions.gen_random_bytes(18), 'hex'),
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'published', 'archived')),
  event_timezone text not null default 'Africa/Maputo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invitation_versions (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  version_number integer not null check (version_number > 0),
  schema_version integer not null check (schema_version > 0),
  config jsonb not null check (jsonb_typeof(config) = 'object'),
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'published', 'superseded')),
  created_by uuid not null references auth.users (id) on delete restrict,
  approved_by uuid references auth.users (id) on delete set null,
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (invitation_id, version_number),
  check ((approved_by is null) = (approved_at is null)),
  check (status not in ('approved', 'published') or approved_by is not null),
  check (status <> 'published' or published_at is not null)
);

alter table public.invitations
  add column approved_version_id uuid references public.invitation_versions (id) on delete set null,
  add column published_version_id uuid references public.invitation_versions (id) on delete set null;

create table public.invitation_sections (
  id uuid primary key default gen_random_uuid(),
  invitation_version_id uuid not null references public.invitation_versions (id) on delete cascade,
  section_key text not null,
  section_type text not null,
  position integer not null check (position >= 0),
  config jsonb not null default '{}'::jsonb check (jsonb_typeof(config) = 'object'),
  enabled boolean not null default true,
  unique (invitation_version_id, section_key),
  unique (invitation_version_id, position)
);

create table public.invitation_media (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  storage_path text not null unique,
  media_type text not null check (media_type in ('image', 'audio', 'video')),
  content_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  uploaded_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 160),
  email text,
  phone text,
  plus_ones_allowed smallint not null default 0 check (plus_ones_allowed between 0 and 20),
  created_at timestamptz not null default now()
);

create index guests_invitation_name_idx on public.guests (invitation_id, full_name);

create table public.guest_tokens (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  guest_id uuid references public.guests (id) on delete cascade,
  token_hash bytea not null unique,
  purpose text not null check (purpose in ('invitation', 'checkin')),
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  guest_id uuid not null references public.guests (id) on delete cascade,
  response text not null check (response in ('attending', 'declined', 'maybe')),
  party_size smallint not null default 1 check (party_size between 0 and 21),
  message text check (message is null or char_length(message) <= 500),
  responded_at timestamptz not null default now(),
  unique (invitation_id, guest_id)
);

create table public.event_tables (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  name text not null,
  capacity smallint not null check (capacity > 0),
  position integer not null default 0,
  unique (invitation_id, name)
);

create table public.seat_assignments (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  event_table_id uuid not null references public.event_tables (id) on delete cascade,
  guest_id uuid not null references public.guests (id) on delete cascade,
  seat_label text,
  unique (invitation_id, guest_id)
);

create index seat_assignments_table_idx on public.seat_assignments (event_table_id);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  guest_id uuid not null references public.guests (id) on delete cascade,
  checked_in_by uuid not null references auth.users (id) on delete restrict,
  idempotency_key uuid not null,
  checked_in_at timestamptz not null default now(),
  unique (invitation_id, guest_id),
  unique (invitation_id, idempotency_key)
);

create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  name text not null,
  description text,
  target_amount_mzn numeric(12, 2) check (target_amount_mzn is null or target_amount_mzn > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.gift_reservations (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.gifts (id) on delete cascade,
  guest_id uuid references public.guests (id) on delete set null,
  guest_name text not null,
  status text not null default 'reserved' check (status in ('reserved', 'fulfilled', 'cancelled')),
  created_at timestamptz not null default now()
);

create table public.guest_messages (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  guest_id uuid references public.guests (id) on delete set null,
  guest_name text not null,
  message text not null check (char_length(message) between 1 and 1000),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.event_photos (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  guest_id uuid references public.guests (id) on delete set null,
  storage_path text not null unique,
  caption text check (caption is null or char_length(caption) <= 300),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_unread_idx on public.notifications (user_id, created_at desc) where read_at is null;

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);

create table public.app_settings (
  key text primary key,
  value jsonb not null,
  is_public boolean not null default false,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger templates_set_updated_at before update on public.templates
  for each row execute procedure public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
  for each row execute procedure public.set_updated_at();
create trigger invitations_set_updated_at before update on public.invitations
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.categories enable row level security;
alter table public.templates enable row level security;
alter table public.plans enable row level security;
alter table public.plan_features enable row level security;
alter table public.orders enable row level security;
alter table public.order_files enable row level security;
alter table public.order_revisions enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.invitations enable row level security;
alter table public.invitation_versions enable row level security;
alter table public.invitation_sections enable row level security;
alter table public.invitation_media enable row level security;
alter table public.guests enable row level security;
alter table public.guest_tokens enable row level security;
alter table public.rsvp_responses enable row level security;
alter table public.event_tables enable row level security;
alter table public.seat_assignments enable row level security;
alter table public.checkins enable row level security;
alter table public.gifts enable row level security;
alter table public.gift_reservations enable row level security;
alter table public.guest_messages enable row level security;
alter table public.event_photos enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.app_settings enable row level security;

grant select on public.categories, public.templates, public.plans, public.plan_features, public.app_settings to anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone_mz) on public.profiles to authenticated;
grant select on public.user_roles, public.orders, public.order_files, public.order_revisions,
  public.payments, public.payment_events, public.invitations, public.invitation_versions,
  public.invitation_sections, public.invitation_media, public.guests, public.guest_tokens,
  public.rsvp_responses, public.event_tables, public.seat_assignments, public.checkins,
  public.gifts, public.gift_reservations, public.guest_messages, public.event_photos,
  public.notifications, public.audit_logs, public.app_settings to authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
revoke update on public.profiles from authenticated;
grant update (full_name, phone_mz) on public.profiles to authenticated;
grant insert on public.orders to authenticated;
grant update on public.notifications to authenticated;

create policy "Published categories are public" on public.categories
  for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "Published templates are public" on public.templates
  for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "Published plans are public" on public.plans
  for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "Features of published plans are public" on public.plan_features
  for select to anon, authenticated using (
    exists (select 1 from public.plans p where p.id = plan_id and p.is_published)
    or (select public.is_admin())
  );
create policy "Admins manage categories" on public.categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage templates" on public.templates
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage plans" on public.plans
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage plan features" on public.plan_features
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Users read own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
create policy "Users update own profile" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "Admins manage profiles" on public.profiles
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Users read own roles" on public.user_roles
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "Admins manage roles" on public.user_roles
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Customers read own orders" on public.orders
  for select to authenticated using (customer_id = (select auth.uid()) or (select public.is_admin()));
create policy "Customers submit own orders" on public.orders
  for insert to authenticated with check (
    customer_id = (select auth.uid()) and status = 'submitted'
  );
create policy "Admins manage orders" on public.orders
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Customers read own order files" on public.order_files
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.customer_id = (select auth.uid()))
    or (select public.is_admin())
  );
create policy "Admins manage order file metadata" on public.order_files
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Customers read own revisions" on public.order_revisions
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.customer_id = (select auth.uid()))
    or (select public.is_admin())
  );
create policy "Admins manage revisions" on public.order_revisions
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Customers read own payments" on public.payments
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.customer_id = (select auth.uid()))
    or (select public.is_admin())
  );
create policy "Admins manage payments" on public.payments
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Customers read own payment events" on public.payment_events
  for select to authenticated using (
    exists (
      select 1 from public.payments p join public.orders o on o.id = p.order_id
      where p.id = payment_id and o.customer_id = (select auth.uid())
    ) or (select public.is_admin())
  );
create policy "Admins manage payment events" on public.payment_events
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Customers read own invitations" on public.invitations
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.customer_id = (select auth.uid()))
    or (select public.is_admin())
  );
create policy "Admins manage invitations" on public.invitations
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Customers read own invitation versions" on public.invitation_versions
  for select to authenticated using (
    exists (
      select 1 from public.invitations i join public.orders o on o.id = i.order_id
      where i.id = invitation_id and o.customer_id = (select auth.uid())
    ) or (select public.is_admin())
  );
create policy "Admins manage invitation versions" on public.invitation_versions
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Customers read own invitation sections" on public.invitation_sections
  for select to authenticated using (
    exists (
      select 1 from public.invitation_versions v
      join public.invitations i on i.id = v.invitation_id
      join public.orders o on o.id = i.order_id
      where v.id = invitation_version_id and o.customer_id = (select auth.uid())
    ) or (select public.is_admin())
  );
create policy "Admins manage invitation sections" on public.invitation_sections
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Customers read own invitation media" on public.invitation_media
  for select to authenticated using (
    exists (
      select 1 from public.invitations i join public.orders o on o.id = i.order_id
      where i.id = invitation_id and o.customer_id = (select auth.uid())
    ) or (select public.is_admin())
  );
create policy "Admins manage invitation media" on public.invitation_media
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Customers read own guests" on public.guests
  for select to authenticated using (
    exists (
      select 1 from public.invitations i join public.orders o on o.id = i.order_id
      where i.id = invitation_id and o.customer_id = (select auth.uid())
    ) or (select public.is_admin())
  );
create policy "Admins manage guests" on public.guests
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage guest tokens" on public.guest_tokens
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Customers read own RSVP" on public.rsvp_responses
  for select to authenticated using (
    exists (
      select 1 from public.invitations i join public.orders o on o.id = i.order_id
      where i.id = invitation_id and o.customer_id = (select auth.uid())
    ) or (select public.is_admin())
  );
create policy "Admins manage RSVP" on public.rsvp_responses
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Customers read own event tables" on public.event_tables
  for select to authenticated using (
    exists (
      select 1 from public.invitations i join public.orders o on o.id = i.order_id
      where i.id = invitation_id and o.customer_id = (select auth.uid())
    ) or (select public.is_admin())
  );
create policy "Admins manage event tables" on public.event_tables
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Customers read own seat assignments" on public.seat_assignments
  for select to authenticated using (
    exists (
      select 1 from public.invitations i join public.orders o on o.id = i.order_id
      where i.id = invitation_id and o.customer_id = (select auth.uid())
    ) or (select public.is_admin())
  );
create policy "Admins manage seat assignments" on public.seat_assignments
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage checkins" on public.checkins
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Customers read own gifts" on public.gifts
  for select to authenticated using (
    exists (
      select 1 from public.invitations i join public.orders o on o.id = i.order_id
      where i.id = invitation_id and o.customer_id = (select auth.uid())
    ) or (select public.is_admin())
  );
create policy "Admins manage gifts" on public.gifts
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage gift reservations" on public.gift_reservations
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Customers read own guest messages" on public.guest_messages
  for select to authenticated using (
    exists (
      select 1 from public.invitations i join public.orders o on o.id = i.order_id
      where i.id = invitation_id and o.customer_id = (select auth.uid())
    ) or (select public.is_admin())
  );
create policy "Admins manage guest messages" on public.guest_messages
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Customers read own event photos" on public.event_photos
  for select to authenticated using (
    exists (
      select 1 from public.invitations i join public.orders o on o.id = i.order_id
      where i.id = invitation_id and o.customer_id = (select auth.uid())
    ) or (select public.is_admin())
  );
create policy "Admins manage event photos" on public.event_photos
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Users read own notifications" on public.notifications
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "Users update own notifications" on public.notifications
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Admins manage notifications" on public.notifications
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins read audit logs" on public.audit_logs
  for select to authenticated using ((select public.is_admin()));
create policy "Admins manage audit logs" on public.audit_logs
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public settings are public" on public.app_settings
  for select to anon, authenticated using (is_public or (select public.is_admin()));
create policy "Admins manage settings" on public.app_settings
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'order-files', 'order-files', false, 10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Customers read own order files from storage" on storage.objects
  for select to authenticated using (
    bucket_id = 'order-files'
    and exists (
      select 1 from public.orders o
      where o.id::text = (storage.foldername(name))[1]
        and o.customer_id = (select auth.uid())
    )
  );
create policy "Customers upload own order files to storage" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'order-files'
    and exists (
      select 1 from public.orders o
      where o.id::text = (storage.foldername(name))[1]
        and o.customer_id = (select auth.uid())
    )
  );
create policy "Admins manage order files in storage" on storage.objects
  for all to authenticated using (bucket_id = 'order-files' and (select public.is_admin()))
  with check (bucket_id = 'order-files' and (select public.is_admin()));