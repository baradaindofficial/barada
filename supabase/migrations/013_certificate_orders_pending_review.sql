-- ═══════════════════════════════════════════════════════════════════
-- 013_certificate_orders_pending_review.sql
-- Barada Academy — add 'pending_review' to certificate_orders.status.
--
-- Problem: app/api/webhooks/razorpay/route.ts re-checks eligibility after
-- payment.captured, and if the learner is no longer eligible (e.g. the
-- course was paused between order creation and payment, or any other
-- late-discovered ineligibility), it previously set status = 'failed'.
-- 'failed' is reserved for payment failure (Razorpay's payment.failed
-- event) -- reusing it here would make a SUCCESSFUL, captured payment
-- indistinguishable from a failed one in any report or dashboard filtered
-- on status = 'failed', risking the money being treated as never
-- received. 'pending_review' is additive and distinct: money captured,
-- certificate correctly withheld, a human decides (issue once genuinely
-- eligible, or refund).
--
-- PURELY ADDITIVE. Widens the status check constraint only; existing
-- rows and their current status values are untouched.
--
-- ROLLBACK: drop the widened constraint and restore the original list
-- (only safe if no row currently has status = 'pending_review' --
-- check first: select count(*) from certificate_orders where status =
-- 'pending_review';).
-- ═══════════════════════════════════════════════════════════════════

alter table public.certificate_orders drop constraint if exists certificate_orders_status_check;
alter table public.certificate_orders add constraint certificate_orders_status_check
  check (status in ('created', 'attempted', 'paid', 'failed', 'refunded', 'expired', 'pending_review'));

comment on column public.certificate_orders.status is
  'created/attempted: order lifecycle before payment. paid: captured and
   certificate issued. failed: payment itself failed or was declined.
   pending_review: payment WAS captured but the learner was found
   ineligible at issuance time (e.g. course paused, or any other
   late-discovered gap) -- money preserved, certificate withheld, needs a
   human decision (issue once eligible, or refund). refunded/expired:
   terminal, human-actioned states.';

-- ── ROLLBACK (only if the pre-check above returns 0) ─────────────────
-- alter table public.certificate_orders drop constraint certificate_orders_status_check;
-- alter table public.certificate_orders add constraint certificate_orders_status_check
--   check (status in ('created', 'attempted', 'paid', 'failed', 'refunded', 'expired'));
