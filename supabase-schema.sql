-- ── DocGen AI V2 — Supabase Database Schema ──────────────────────────────
-- Supabase dashboard এ SQL Editor এ এটা run করো

-- Documents table
create table if not exists documents (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  doc_type    text not null check (doc_type in ('cv','resume','sop','cover','linkedin')),
  title       text not null,
  content     text not null,
  form_data   jsonb,
  template_id text default 'modern',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Enable Row Level Security
alter table documents enable row level security;

-- Policy: users can only see their own documents
create policy "Users see own documents"
  on documents for select
  using (auth.uid() = user_id);

-- Policy: users can insert their own documents
create policy "Users insert own documents"
  on documents for insert
  with check (auth.uid() = user_id);

-- Policy: users can update their own documents
create policy "Users update own documents"
  on documents for update
  using (auth.uid() = user_id);

-- Policy: users can delete their own documents
create policy "Users delete own documents"
  on documents for delete
  using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists documents_user_id_idx on documents(user_id);
create index if not exists documents_created_at_idx on documents(created_at desc);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_documents_updated_at
  before update on documents
  for each row execute function update_updated_at();
