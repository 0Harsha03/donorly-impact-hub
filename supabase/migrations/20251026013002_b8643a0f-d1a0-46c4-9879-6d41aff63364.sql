-- Create enum for user roles
create type public.app_role as enum ('donor', 'ngo', 'admin');

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role),
  created_at timestamp with time zone default now()
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Create security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone_number text,
  location text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create NGOs table
create table public.ngos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  ngo_name text not null,
  ngo_id text not null unique,
  logo_url text,
  description text,
  location text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on ngos
alter table public.ngos enable row level security;

-- Create donations table
create table public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid references public.profiles(id) on delete cascade not null,
  donation_type text not null,
  description text not null,
  quantity text,
  location text not null,
  status text default 'available',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on donations
alter table public.donations enable row level security;

-- RLS Policies for user_roles
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "NGOs can view donor profiles for location-matched donations"
  on public.profiles for select
  using (
    public.has_role(auth.uid(), 'ngo') and
    id in (
      select d.donor_id 
      from public.donations d
      join public.ngos n on n.user_id = auth.uid()
      where d.location = n.location
    )
  );

-- RLS Policies for ngos
create policy "NGOs can view their own profile"
  on public.ngos for select
  using (auth.uid() = user_id);

create policy "NGOs can insert their own profile"
  on public.ngos for insert
  with check (auth.uid() = user_id);

create policy "NGOs can update their own profile"
  on public.ngos for update
  using (auth.uid() = user_id);

create policy "Anyone can view NGO profiles"
  on public.ngos for select
  using (true);

-- RLS Policies for donations
create policy "Donors can view their own donations"
  on public.donations for select
  using (auth.uid() = donor_id);

create policy "Donors can create donations"
  on public.donations for insert
  with check (auth.uid() = donor_id);

create policy "Donors can update their own donations"
  on public.donations for update
  using (auth.uid() = donor_id);

create policy "NGOs can view donations in their location"
  on public.donations for select
  using (
    public.has_role(auth.uid(), 'ngo') and
    exists (
      select 1 from public.ngos
      where ngos.user_id = auth.uid()
      and ngos.location = donations.location
    )
  );

-- Create trigger function for updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.ngos
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.donations
  for each row
  execute function public.handle_updated_at();