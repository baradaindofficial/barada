import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/resources/lesson/[lessonId]
 * Returns all published assets attached to a lesson.
 * Enrollment checked for non-free-preview lessons.
 * Role: learner (enrolled) or guest (free preview only)
 */
export async function GET(
  _req: Request,
  { params }: { params: { lessonId: string } }
) {
  const route = `/api/resources/lesson/${params.lessonId}`
  try {
    const supabase = await createClient()

    // Get lesson to check free preview status
    const { data: lessonRaw } = await supabase
      .from('lessons')
      .select('lesson_id, course_id, is_free_preview, status')
      .eq('lesson_id', params.lessonId)
      .eq('status', 'published')
      .maybeSingle()

    if (!lessonRaw) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }
    const lesson = lessonRaw as any

    // Non-free-preview lessons require enrollment
    if (!lesson.is_free_preview) {
      const auth = await getAuthenticatedLearner()
      if (!auth) {
        return NextResponse.json({ error: 'Enrollment required' }, { status: 403 })
      }
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('enrollment_id')
        .eq('learner_id', auth.learnerId)
        .eq('course_id', lesson.course_id)
        .maybeSingle()

      if (!enrollment) {
        return NextResponse.json({ error: 'Enrollment required' }, { status: 403 })
      }
    }

    // Get all published assets attached to this lesson
    const { data: attachments } = await supabase
      .from('asset_attachments')
      .select(`
        attachment_id, role, sort_order,
        assets(
          asset_id, asset_type, title, description,
          provider_id, provider_ref, resolved_url, cdn_url,
          status, is_downloadable, file_size_bytes, mime_type,
          duration_seconds, language_code
        )
      `)
      .eq('entity_type', 'lesson')
      .eq('entity_id', params.lessonId)
      .order('sort_order')

    const resources = (attachments || [])
      .filter((a: any) => (a.assets as any)?.status === 'published')
      .map((a: any) => {
        const asset = a.assets as any
        return {
          attachmentId: a.attachment_id,
          role: a.role,
          sortOrder: a.sort_order,
          assetId: asset.asset_id,
          assetType: asset.asset_type,
          title: asset.title,
          description: asset.description,
          providerId: asset.provider_id,
          isDownloadable: asset.is_downloadable,
          fileSizeBytes: asset.file_size_bytes,
          mimeType: asset.mime_type,
          durationSeconds: asset.duration_seconds,
          languageCode: asset.language_code,
          // Never expose provider_ref — use /api/resources/download/[assetId]
        }
      })

    return NextResponse.json({ data: { resources } })
  } catch (e: any) {
    await logger.error({
      error_type: 'resource_fetch_error',
      message: e?.message,
      route,
    })
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}
