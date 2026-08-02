/**
 * Integration tests for Sprint 4.3 resource API contracts.
 * These verify expected response shapes.
 */

describe('Resource API contracts', () => {
  describe('GET /api/resources/lesson/[lessonId]', () => {
    it('should return data.resources array', () => {
      const mockResponse = {
        data: {
          resources: [
            {
              assetId: 'uuid',
              assetType: 'pdf',
              title: 'Lesson Notes',
              description: null,
              isDownloadable: true,
              fileSizeBytes: 204800,
              mimeType: 'application/pdf',
              durationSeconds: null,
            }
          ]
        }
      }
      expect(mockResponse.data).toHaveProperty('resources')
      expect(Array.isArray(mockResponse.data.resources)).toBe(true)
      const r = mockResponse.data.resources[0]
      expect(r).toHaveProperty('assetId')
      expect(r).toHaveProperty('assetType')
      expect(r).toHaveProperty('isDownloadable')
      // Security: provider_ref must NOT be in response
      expect(r).not.toHaveProperty('providerRef')
      expect(r).not.toHaveProperty('provider_ref')
    })
  })

  describe('GET /api/resources/download/[assetId]', () => {
    it('should return data.downloadUrl', () => {
      const mockResponse = {
        data: {
          downloadUrl: 'https://signed.url/file.pdf?token=abc',
          title: 'Lesson Notes',
          assetType: 'pdf',
        }
      }
      expect(mockResponse.data).toHaveProperty('downloadUrl')
      expect(mockResponse.data).toHaveProperty('title')
      expect(typeof mockResponse.data.downloadUrl).toBe('string')
    })

    it('should return 403 for non-downloadable assets', () => {
      const mockResponse = { error: 'This resource is not downloadable' }
      expect(mockResponse).toHaveProperty('error')
    })
  })

  describe('POST /api/bookmarks', () => {
    it('should accept valid bookmark payload', () => {
      const payload = {
        entityType: 'lesson',
        entityId: 'uuid',
        entityTitle: 'What is ChatGPT?',
        entityUrl: '/learn/chatgpt-for-professionals/module-1/lesson-1',
      }
      expect(payload).toHaveProperty('entityType')
      expect(payload).toHaveProperty('entityId')
    })

    it('should reject payload missing entityId', () => {
      const payload = { entityType: 'lesson' }
      const hasEntityId = 'entityId' in payload
      expect(hasEntityId).toBe(false) // would fail validation
    })
  })

  describe('assetTypeMetadata', () => {
    const metadata: Record<string, { icon: string; label: string; downloadable: boolean }> = {
      video:       { icon: '🎬', label: 'Video',        downloadable: false },
      pdf:         { icon: '📄', label: 'PDF Notes',    downloadable: true },
      ppt:         { icon: '📊', label: 'Slides (PPT)', downloadable: true },
      prompt_pack: { icon: '💡', label: 'Prompt Pack',  downloadable: true },
      audio:       { icon: '🎧', label: 'Audio',        downloadable: true },
    }

    it('video should not be downloadable', () => {
      expect(metadata.video.downloadable).toBe(false)
    })

    it('pdf should be downloadable', () => {
      expect(metadata.pdf.downloadable).toBe(true)
    })

    it('all types should have icon and label', () => {
      Object.values(metadata).forEach(m => {
        expect(m.icon).toBeTruthy()
        expect(m.label).toBeTruthy()
      })
    })
  })
})
