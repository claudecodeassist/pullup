-- Friendships table
create type friendship_status as enum ('pending', 'accepted', 'declined');

create table friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id text not null references profiles(id) on delete cascade,
  addressee_id text not null references profiles(id) on delete cascade,
  status friendship_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friendships_no_self check (requester_id <> addressee_id),
  constraint friendships_unique_pair unique (requester_id, addressee_id)
);

-- Indexes for efficient lookups
create index idx_friendships_requester on friendships(requester_id);
create index idx_friendships_addressee on friendships(addressee_id);
create index idx_friendships_status on friendships(status);

-- Open RLS (same pattern as other tables in this app)
alter table friendships enable row level security;

create policy "Anyone can read friendships"
  on friendships for select using (true);

create policy "Anyone can insert friendships"
  on friendships for insert with check (true);

create policy "Anyone can update friendships"
  on friendships for update using (true);

create policy "Anyone can delete friendships"
  on friendships for delete using (true);
