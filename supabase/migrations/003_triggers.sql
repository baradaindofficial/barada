-- ═══════════════════════════════════════════════════════════════════
-- 003_triggers.sql
-- Database triggers for automation
-- ═══════════════════════════════════════════════════════════════════

-- ── Auto-create learner profile on auth signup ────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.learners (
    learner_id,
    name,
    email,
    status
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'active'
  )
  on conflict (learner_id) do nothing;
  return new;
end;
$$;

-- Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Auto-update updated_at on learner changes ─────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_learners_updated_at
  before update on public.learners
  for each row execute procedure public.set_updated_at();

create trigger set_config_updated_at
  before update on public.config_settings
  for each row execute procedure public.set_updated_at();

-- ── Recalculate enrollment completion % when lesson marked done ───
create or replace function public.update_enrollment_progress()
returns trigger
language plpgsql
security definer
as $$
declare
  v_total_lessons int;
  v_completed_lessons int;
  v_pct int;
begin
  -- Count total lessons for the course (static lookup per course slug)
  -- This would normally reference a courses table; using config for now
  -- Admin can update total_lessons_by_slug in config_settings
  select cast(value as int) into v_total_lessons
  from public.config_settings
  where key = 'total_lessons_' || new.course_slug;

  if v_total_lessons is null then
    v_total_lessons := 17; -- default fallback
  end if;

  -- Count completed lessons
  select count(*) into v_completed_lessons
  from public.lesson_progress
  where learner_id = new.learner_id
    and course_slug = new.course_slug
    and is_completed = true;

  v_pct := least(100, (v_completed_lessons * 100) / v_total_lessons);

  -- Update enrollment
  update public.enrollments
  set
    completion_percentage = v_pct,
    last_accessed_at = now(),
    status = case when v_pct = 100 then 'completed' else 'active' end,
    completed_at = case when v_pct = 100 and completed_at is null then now() else completed_at end
  where learner_id = new.learner_id
    and course_slug = new.course_slug;

  return new;
end;
$$;

create trigger update_enrollment_on_lesson_complete
  after insert or update on public.lesson_progress
  for each row
  when (new.is_completed = true)
  execute procedure public.update_enrollment_progress();

-- ── Learner stats function ─────────────────────────────────────────
create or replace function public.get_learner_stats(p_learner_id uuid)
returns table (
  enrolled_count      bigint,
  completed_count     bigint,
  certificate_count   bigint,
  total_watch_seconds bigint
)
language sql
security definer
stable
as $$
  select
    (select count(*) from public.enrollments where learner_id = p_learner_id) as enrolled_count,
    (select count(*) from public.enrollments where learner_id = p_learner_id and status = 'completed') as completed_count,
    (select count(*) from public.certificates where learner_id = p_learner_id and status = 'issued') as certificate_count,
    (select coalesce(sum(watched_seconds), 0) from public.lesson_progress where learner_id = p_learner_id) as total_watch_seconds;
$$;
