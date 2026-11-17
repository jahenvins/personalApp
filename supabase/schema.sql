-- Enable Authentication > Providers > Anonymous sign-ins, then run this file.
create table profiles(id uuid primary key references auth.users on delete cascade,name text,age int,height_cm numeric,weight_kg numeric,created_at timestamptz default now());
create table sessions(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,started_at timestamptz default now(),completed_at timestamptz,step int default 0,completed boolean default false,compatibility int default 100);
create table answers(id uuid primary key default gen_random_uuid(),session_id uuid references sessions on delete cascade,user_id uuid not null,question_id text not null,option_index int,answer_text text,answered_at timestamptz default now(),unique(session_id,question_id));
create table option_images(question_id text,option_index int,path text,primary key(question_id,option_index));
create table photos(id uuid primary key default gen_random_uuid(),path text not null,caption text,meta jsonb,created_at timestamptz default now());
create table settings(key text primary key,value jsonb);  -- keys include quiz_questions, music_track, and polaroid_* paths
create table admins(user_id uuid primary key references auth.users);
create function is_admin() returns boolean language sql stable security definer as $$select exists(select 1 from admins where user_id=auth.uid())$$;
alter table profiles enable row level security;alter table sessions enable row level security;alter table answers enable row level security;
alter table option_images enable row level security;alter table photos enable row level security;alter table settings enable row level security;alter table admins enable row level security;
create policy own_p on profiles for all using(id=auth.uid() or is_admin()) with check(id=auth.uid());
create policy own_s on sessions for all using(user_id=auth.uid() or is_admin()) with check(user_id=auth.uid());
create policy own_a on answers for all using(user_id=auth.uid() or is_admin()) with check(user_id=auth.uid());
create policy r_oi on option_images for select using(true);create policy w_oi on option_images for all using(is_admin()) with check(is_admin());
create policy r_ph on photos for select using(true);create policy w_ph on photos for all using(is_admin()) with check(is_admin());
create policy r_se on settings for select using(true);create policy w_se on settings for all using(is_admin()) with check(is_admin());
create policy r_ad on admins for select using(user_id=auth.uid());
insert into storage.buckets(id,name,public) values('photos','photos',true) on conflict do nothing;
create policy photos_admin_write on storage.objects for all using(bucket_id='photos' and is_admin()) with check(bucket_id='photos' and is_admin());
create policy photos_read on storage.objects for select using(bucket_id='photos');
-- After creating your admin login in Auth > Users:  insert into admins values('<your-user-uuid>');
