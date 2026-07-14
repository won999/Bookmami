alter table family_members
  add column if not exists reading_personality text,
  add column if not exists reading_personality_updated_at timestamptz;
