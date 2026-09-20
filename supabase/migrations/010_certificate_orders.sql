-- ============================================================
-- Migration 010: certificate_orders
-- Sprint 5 — Payment tracking for Razorpay certificate purchases
-- CTO approved: 2026-09-20
-- ============================================================
-- Purpose: track every Razorpay order/payment attempt for a
-- certificate purchase, independently of the `certificates` table
-- (which represents only the issued credential). Enables webhook
-- idempotency, duplicate-webhook handling, and visibility into
-- failed/abandoned payments for funnel analysis and reconciliation.
--
-- Does NOT modify `certificates` in any way -- course_slug,
-- payment_id, and all existing columns/constraints on that table
-- are left completely untouched, per CTO decision.
-- ============================================================

-- -- CERTIFICATE ORDERS --------------------------------------------
create table if not exists public.certificate_orders (
  order_id            uuid primary key default uuid_generate_v4(),
  learner_id          uuid not null references public.learners(learner_id) on delete restrict,
  course_id           uuid not null references public.courses(course_id) on delete restrict,

  razorpay_order_id   text not null,
  razorpay_payment_id text,
  razorpay_signature  text,
  webhook_event_id    text,

  amount_paise        int not null,
  currency            text not null default 'INR',

  status              text not null default 'created'
                       check (status in ('created', 'attempted', 'paid', 'failed', 'refunded', 'expired')),
  failure_reason       text,

  certificate_id      text references public.certificates(certificate_id) on delete set null,

  created_at          timestamptz not null default now(),
  paid_at             timestamptz,
  updated_at          timestamptz not null default now()
);

comment on table public.certificate_orders is
  'One row per Razorpay order attempt for a certificate purchase. certificates.status remains the source of truth for whether a credential is issued; this table tracks the payment lifecycle (created/attempted/paid/failed/refunded/expired) leading up to that.';

-- -- IDEMPOTENCY CONSTRAINTS (CTO approved) --------------------------
create unique index if not exists uq_certificate_orders_razorpay_order_id
  on public.certificate_orders (razorpay_order_id);

create unique index if not exists uq_certificate_orders_razorpay_payment_id
  on public.certificate_orders (razorpay_payment_id)
  where razorpay_payment_id is not null;

create unique index if not exists uq_certificate_orders_webhook_event_id
  on public.certificate_orders (webhook_event_id)
  where webhook_event_id is not null;

-- -- LOOKUP INDEXES ---------------------------------------------------
create index if not exists idx_certificate_orders_learner    on public.certificate_orders(learner_id);
create index if not exists idx_certificate_orders_course     on public.certificate_orders(course_id);
create index if not exists idx_certificate_orders_status     on public.certificate_orders(status);
create index if not exists idx_certificate_orders_created_at on public.certificate_orders(created_at);

-- -- updated_at TRIGGER (reuses existing shared function) -----------
create trigger set_certificate_orders_updated_at
  before update on public.certificate_orders
  for each row execute procedure public.set_updated_at();

-- -- ROW LEVEL SECURITY -------------------------------------------------
alter table public.certificate_orders enable row level security;

create policy "learner: read own certificate orders"
  on public.certificate_orders for select
  using (learner_id = auth.uid());

create policy "admin: manage certificate orders"
  on public.certificate_orders for all
  using (public.is_admin());
