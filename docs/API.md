# API Reference

**Barada Academy — API Route Documentation**
Last updated: July 2025 | Base URL: `https://barada.in`

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Error Format](#3-error-format)
4. [Routes — Auth](#4-routes--auth)
5. [Routes — Enrollment](#5-routes--enrollment)
6. [Routes — Progress](#6-routes--progress)
7. [Routes — Planned (Sprint 4)](#7-routes--planned-sprint-4)

---

## 1. Overview

All API routes are Next.js 14 Route Handlers located in `app/api/`. They are server-side only — never imported into Client Components.

### Conventions

- All requests and responses use `Content-Type: application/json`
- All timestamps are ISO 8601 UTC strings
- All IDs are UUIDs unless noted otherwise
- Course slugs are kebab-case strings (e.g. `chatgpt-for-professionals`)
- Module and lesson numbers are 1-indexed integers

### Rate limiting

Not yet implemented. Planned for Sprint 4 via Vercel Edge Middleware.
Current mitigation: Supabase RLS prevents cross-user data access even if a route is abused.

---

## 2. Authentication

All protected routes validate the session server-side using `supabase.auth.getUser()`. This makes a network call to Supabase to validate the JWT — it cannot be bypassed by cookie manipulation.

### How to authenticate

Requests from the browser are authenticated automatically via the session cookie set by Supabase Auth. There is no `Authorization: Bearer` header pattern — this is a server-rendered app, not a public API.

### Unauthenticated response

```json
HTTP 401 Unauthorized
{
  "error": "Unauthorized"
}
```

---

## 3. Error Format

All errors follow this shape:

```json
{
  "error": "Human-readable error message",
  "details": {}   // optional — Zod validation errors when body is malformed
}
```

### Status codes used

| Code | Meaning |
|---|---|
| `200` | Success (also used for idempotent actions like "already enrolled") |
| `201` | Created (new enrollment, new progress record) |
| `400` | Bad request — invalid body, missing fields, validation failure |
| `401` | Unauthenticated — no valid session |
| `403` | Forbidden — authenticated but not authorised (wrong role) |
| `404` | Resource not found |
| `409` | Conflict — duplicate where uniqueness is expected |
| `500` | Internal server error — DB failure, unexpected exception |

---

## 4. Routes — Auth

### `GET /api/auth/callback`

Handles the redirect from Supabase after email verification or OAuth sign-in. This is called by Supabase directly — not by application code.

**Query parameters:**

| Parameter | Required | Description |
|---|---|---|
| `code` | Yes | One-time auth code from Supabase |
| `next` | No | Relative path to redirect to after auth. Defaults to `/dashboard`. Validated: must start with `/` and not contain `://` |
| `error` | No | Set by Supabase on auth failure (e.g. `access_denied`, `link_expired`) |

**Success response:**
```
HTTP 302 Found
Location: /dashboard   (or the validated `next` path)
```

**Error responses:**
```
HTTP 302 Found
Location: /login?error=link_expired       (Supabase returned an error)
Location: /login?error=auth_callback_failed  (code exchange failed)
```

**Security:** The `next` parameter is sanitised by `sanitiseNext()` before use. Only relative paths starting with `/` and not containing `://` are accepted. Anything else falls back to `/dashboard`.

---

### `POST /api/auth/signout`

Signs out the authenticated user and redirects to the homepage.

**Request:** No body required.

**Authentication:** Optional. If no session exists, still redirects cleanly.

**Success response:**
```
HTTP 302 Found
Location: /
Set-Cookie: [Supabase session cookies cleared]
```

**Notes:** Called from the sign-out `<form>` in the dashboard. Using a form POST (not a client-side fetch) ensures the redirect works correctly even if JavaScript fails.

---

## 5. Routes — Enrollment

### `POST /api/enrollment`

Enrolls the authenticated learner in a course.

**Authentication:** Required.

**Request body:**
```json
{
  "courseSlug": "chatgpt-for-professionals"
}
```

**Validation:**
- `courseSlug`: string, min 1 char, max 100 chars

**Success — new enrollment:**
```json
HTTP 201 Created
{
  "status": "enrolled",
  "enrollment": {
    "enrollment_id": "a1b2c3d4-...",
    "learner_id": "e5f6g7h8-...",
    "course_slug": "chatgpt-for-professionals",
    "status": "active",
    "completion_percentage": 0,
    "enrolled_at": "2025-07-25T10:00:00.000Z"
  }
}
```

**Success — already enrolled (idempotent):**
```json
HTTP 200 OK
{
  "status": "already_enrolled",
  "message": "You are already enrolled in this course"
}
```

**Error — unauthenticated:**
```json
HTTP 401
{ "error": "Unauthorized" }
```

**Error — invalid body:**
```json
HTTP 400
{ "error": "Invalid request body" }
```

**Error — DB failure:**
```json
HTTP 500
{ "error": "Failed to enroll" }
```

---

## 6. Routes — Progress

### `POST /api/progress`

Marks a specific lesson as complete for the authenticated learner. Idempotent — calling it multiple times for the same lesson has no additional effect.

**Authentication:** Required.

**Request body:**
```json
{
  "courseSlug": "chatgpt-for-professionals",
  "moduleNumber": 1,
  "lessonNumber": 3
}
```

**Validation:**
- `courseSlug`: string, min 1 char, max 100 chars; must match a real course slug in `data/courses.ts`
- `moduleNumber`: integer, 1–10
- `lessonNumber`: integer, 1–30

**Side effects (handled by database trigger):**
After this INSERT/UPSERT into `lesson_progress`, the `update_enrollment_progress` trigger fires and recalculates `completion_percentage` on the corresponding `enrollments` row. If completion reaches 100%, `enrollments.status` is set to `'completed'`.

**Success:**
```json
HTTP 200 OK
{
  "status": "progress_saved"
}
```

**Error — unauthenticated:**
```json
HTTP 401
{ "error": "Unauthorized" }
```

**Error — invalid body:**
```json
HTTP 400
{
  "error": "Invalid body",
  "details": {
    "fieldErrors": {
      "moduleNumber": ["Number must be greater than or equal to 1"]
    }
  }
}
```

**Error — course not found:**
```json
HTTP 404
{ "error": "Course not found" }
```

**Error — DB failure:**
```json
HTTP 500
{ "error": "Failed to save progress" }
```

---

## 7. Routes — Planned (Sprint 4)

These routes are designed but not yet implemented. They are documented here to guide Sprint 4 development.

---

### `POST /api/quiz` *(Sprint 4)*

Submit a quiz attempt for a course final exam.

**Authentication:** Required. Learner must be enrolled in the course.

**Request body:**
```json
{
  "courseSlug": "chatgpt-for-professionals",
  "answers": [2, 0, 1, 3, 1]
}
```

**Response:**
```json
{
  "score": 80,
  "passed": true,
  "correctCount": 4,
  "totalQuestions": 5,
  "attemptNumber": 1,
  "certificateEligible": true
}
```

**Logic:**
1. Validate enrollment exists
2. Retrieve correct answers for this course from static data or DB
3. Calculate score
4. Insert `quiz_attempts` row
5. If passed and completion = 100%, create `certificates` row with `status = 'pending_payment'`

---

### `POST /api/certificates/initiate` *(Sprint 4)*

Create a Razorpay order for certificate payment.

**Authentication:** Required. Learner must have passed the quiz.

**Request body:**
```json
{
  "courseSlug": "chatgpt-for-professionals"
}
```

**Response:**
```json
{
  "orderId": "order_xxxx",
  "amount": 29900,
  "currency": "INR",
  "razorpayKeyId": "rzp_live_xxx"
}
```

---

### `POST /api/certificates/confirm` *(Sprint 4)*

Verify Razorpay payment signature and issue the certificate.

**Authentication:** Required.

**Request body:**
```json
{
  "courseSlug": "chatgpt-for-professionals",
  "razorpayPaymentId": "pay_xxx",
  "razorpayOrderId": "order_xxx",
  "razorpaySignature": "sha256_hash"
}
```

**Logic:**
1. Verify HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`
2. Update `certificates.status = 'issued'` and `certificates.payment_id`
3. Generate certificate PDF
4. Send certificate email via Resend
5. Insert audit log entry

**Response:**
```json
{
  "certificateId": "BAC-CGP-2025-00001",
  "downloadUrl": "/dashboard/certificates/BAC-CGP-2025-00001",
  "verificationUrl": "https://barada.in/verify/BAC-CGP-2025-00001"
}
```

---

### `GET /api/certificates/verify/[id]` *(Sprint 4)*

Public certificate verification endpoint. Returns only safe public fields.

**Authentication:** Not required.

**Response — issued certificate:**
```json
{
  "valid": true,
  "certificateId": "BAC-CGP-2025-00001",
  "learnerName": "Rahul Sharma",
  "courseTitle": "ChatGPT for Professionals",
  "issuedAt": "2025-07-25T10:00:00.000Z"
}
```

**Response — not found or revoked:**
```json
{
  "valid": false
}
```

---

### `GET /api/admin/stats` *(Sprint 4)*

Platform statistics for the admin dashboard.

**Authentication:** Required. Admin role required.

**Response:**
```json
{
  "totalLearners": 1247,
  "totalEnrollments": 3891,
  "totalCertificates": 312,
  "enrollmentsByCoure": [
    { "courseSlug": "chatgpt-for-professionals", "count": 892 }
  ],
  "recentEnrollments": []
}
```
