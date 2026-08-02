import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedLearner } from '@/lib/auth/get-authenticated-learner'
import { generateDownloadUrl } from '@/lib/utils/signed-url'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/resources/download/[assetId]
 * Generates a secure, time-limited download URL for an asset.
 * Tracks the download in download_history.
 * Security:
 *   - Checks learner is authenticated
 *   - Checks asset is published and downloadable
 *   - Checks enrollment for non-free-preview assets
 *   - Generates signed URL (5 min expiry for Supabase Storage)
 *   - Never exposes raw storage paths to client
 */
export async function GET(
  req: Request,
  { params }: { params: { assetId: string } }
) {
  const route = `/api/resources/download/${params.assetId}`
  try {
    const auth = await getAuthenticatedLearner()
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const supabase = await createClient()

    // Get asset
    const { data: assetRaw } = await supabase
      .from('assets')
      .select('asset_id, asset_type, title, provider_id, provider_ref, resolved_url, cdn_url, status, is_downloadable')
      .eq('asset_id', params.assetId)
      .eq('status', 'published')
      .maybeSingle()

    if (!assetRaw) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }
    const asset = assetRaw as any

    if (!asset.is_downloadable) {
      return NextResponse.json({ error: 'This resource is not downloadable' }, { status: 403 })
    }

    // Check enrollment via asset_attachments → lesson → enrollment
    const { data: attachment } = await supabase
      .from('asset_attachments')
      .select('entity_type, entity_id')
      .eq('asset_id', params.assetId)
      .eq('entity_type', 'lesson')
      .maybeSingle()
    const att = attachment as any

    if (att?.entity_id) {
      const { data: lessonRaw } = await supabase
        .from('lessons')
        .select('course_id, is_free_preview')
        .eq('lesson_id', att.entity_id)
        .maybeSingle()
      const lesson = lessonRaw as any

      if (lesson && !lesson.is_free_preview) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('enrollment_id')
          .eq('learner_id', auth.learnerId)
          .or(`course_id.eq.${lesson.course_id}`)
          .maybeSingle()

        if (!enrollment) {
          return NextResponse.json({ error: 'Enrollment required to download this resource' }, { status: 403 })
        }
      }
    }

    // Generate secure download URL
    const downloadUrl = await generateDownloadUrl(
      asset.provider_id,
      asset.provider_ref,
      asset.resolved_url,
      asset.cdn_url
    )

    if (!downloadUrl) {
      return NextResponse.json({ error: 'Download not available for this resource type' }, { status: 422 })
    }

    // Track download (fire and forget)
    const searchParams = new URL(req.url).searchParams
    const entityId = searchParams.get('entityId')
    const entityType = searchParams.get('entityType') || 'lesson';

    (supabase as any).from('download_history').insert({
      asset_id: params.assetId,
      learner_id: auth.learnerId,
      app_id: 'academy',
      entity_type: entityType,
      entity_id: entityId,
      download_source: 'lesson',
      downloaded_at: new Date().toISOString(),
    }).then(() => {}).catch(() => {})

    // Log metric
    await logger.event({
      event_type: 'academy.resource.downloaded',
      actor_id: auth.learnerId,
      entity_type: 'asset',
      entity_id: params.assetId,
      payload: { asset_type: asset.asset_type, title: asset.title },
    })

    return NextResponse.json({ data: { downloadUrl, title: asset.title, assetType: asset.asset_type } })
  } catch (e: any) {
    await logger.error({
      error_type: 'resource_download_error',
      message: e?.message,
      route,
    })
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
  }
}
