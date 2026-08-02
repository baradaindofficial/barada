import { createClient } from '@/lib/supabase/server'

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'
type Severity  = 'low' | 'medium' | 'high' | 'critical'

interface LogPayload {
  app_id?: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  route?: string
  user_id?: string
}

interface ErrorPayload {
  app_id?: string
  error_type: string
  error_code?: string
  message: string
  stack_trace?: string
  context?: Record<string, unknown>
  route?: string
  user_id?: string
  severity?: Severity
}

interface EventPayload {
  event_type: string
  app_id?: string
  actor_id?: string
  actor_type?: 'learner' | 'admin' | 'system' | 'ai_factory'
  entity_type?: string
  entity_id?: string
  payload?: Record<string, unknown>
}

/**
 * Platform logger — writes to platform.logs, platform.error_events, platform.events.
 * All methods are fire-and-forget (never throw).
 */
export const logger = {
  async log(payload: LogPayload): Promise<void> {
    try {
      const supabase = await createClient()
      await (supabase as any).from('platform.logs').insert({
        app_id: payload.app_id || 'academy',
        level: payload.level,
        message: payload.message,
        context: payload.context || {},
        route: payload.route,
        user_id: payload.user_id,
        logged_at: new Date().toISOString(),
      })
    } catch { /* never throw from logger */ }
  },

  async error(payload: ErrorPayload): Promise<void> {
    // Always console.error as well for Vercel logs
    console.error(`[${payload.error_type}] ${payload.message}`, payload.context)
    try {
      const supabase = await createClient()
      await (supabase as any).schema('platform').from('error_events').insert({
        app_id: payload.app_id || 'academy',
        error_type: payload.error_type,
        error_code: payload.error_code,
        message: payload.message,
        stack_trace: payload.stack_trace,
        context: payload.context || {},
        route: payload.route,
        user_id: payload.user_id,
        severity: payload.severity || 'error',
        occurred_at: new Date().toISOString(),
      })
    } catch { /* never throw from logger */ }
  },

  async event(payload: EventPayload): Promise<void> {
    try {
      const supabase = await createClient()
      await (supabase as any).schema('platform').from('events').insert({
        event_type: payload.event_type,
        app_id: payload.app_id || 'academy',
        actor_id: payload.actor_id,
        actor_type: payload.actor_type || 'learner',
        entity_type: payload.entity_type,
        entity_id: payload.entity_id,
        payload: payload.payload || {},
        published_at: new Date().toISOString(),
      })
    } catch { /* never throw from logger */ }
  },
}
