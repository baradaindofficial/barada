import { createClient } from '@/lib/supabase/server'

const SIGNED_URL_EXPIRES_SECONDS = 300 // 5 minutes

/**
 * Generates a secure signed download URL for a Supabase Storage asset.
 * For external URLs, returns them directly.
 * For YouTube, returns null (not downloadable via signed URL).
 */
export async function generateDownloadUrl(
  providerId: string,
  providerRef: string | null,
  resolvedUrl: string | null,
  cdnUrl: string | null
): Promise<string | null> {
  if (!providerRef && !resolvedUrl && !cdnUrl) return null

  switch (providerId) {
    case 'supabase': {
      if (!providerRef) return resolvedUrl || cdnUrl
      try {
        const supabase = await createClient()
        // providerRef format: "bucket/path/to/file"
        const [bucket, ...pathParts] = providerRef.split('/')
        const path = pathParts.join('/')
        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, SIGNED_URL_EXPIRES_SECONDS)
        if (error || !data?.signedUrl) return resolvedUrl || null
        return data.signedUrl
      } catch {
        return resolvedUrl || null
      }
    }
    case 'external':
    case 'github':
    case 'gdrive':
    case 's3':
    case 'r2':
      return resolvedUrl || cdnUrl || providerRef
    case 'youtube':
      return null // YouTube assets are embedded, not downloaded
    default:
      return resolvedUrl || cdnUrl || null
  }
}

/**
 * Returns the icon and label for a given asset type.
 */
export function assetTypeMetadata(assetType: string): { icon: string; label: string; downloadable: boolean } {
  const map: Record<string, { icon: string; label: string; downloadable: boolean }> = {
    video:        { icon: '🎬', label: 'Video',           downloadable: false },
    audio:        { icon: '🎧', label: 'Audio',           downloadable: true  },
    pdf:          { icon: '📄', label: 'PDF Notes',       downloadable: true  },
    ppt:          { icon: '📊', label: 'Slides (PPT)',    downloadable: true  },
    prompt_pack:  { icon: '💡', label: 'Prompt Pack',     downloadable: true  },
    assignment:   { icon: '📝', label: 'Assignment',      downloadable: true  },
    transcript:   { icon: '📃', label: 'Transcript',      downloadable: true  },
    image:        { icon: '🖼️', label: 'Image',           downloadable: true  },
    download:     { icon: '📦', label: 'Download',        downloadable: true  },
    script:       { icon: '📋', label: 'Script',          downloadable: false },
    template_file:{ icon: '📐', label: 'Template',        downloadable: true  },
    whitepaper:   { icon: '📰', label: 'Whitepaper',      downloadable: true  },
  }
  return map[assetType] || { icon: '📁', label: 'Resource', downloadable: true }
}
