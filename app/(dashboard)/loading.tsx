/**
 * app/(dashboard)/loading.tsx — Dashboard loading skeleton
 * Shown by Next.js while the async Server Component fetches data.
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50" aria-label="Loading dashboard" aria-busy="true">
      {/* Top bar skeleton */}
      <div className="bg-white border-b border-gray-200 h-14 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome banner skeleton */}
        <div className="bg-gradient-to-br from-[#0D183D] to-[#1A2B5E] rounded-2xl p-8 mb-6 animate-pulse">
          <div className="h-4 w-32 bg-white/10 rounded mb-3" />
          <div className="h-8 w-64 bg-white/10 rounded mb-2" />
          <div className="h-4 w-48 bg-white/10 rounded mb-6" />
          <div className="h-9 w-40 bg-white/10 rounded-lg" />
        </div>

        {/* Stats row skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="h-8 w-12 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>

        {/* Course list skeleton */}
        <div className="mb-4 flex justify-between">
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 mb-3 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-1.5 w-full bg-gray-100 rounded-full" />
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
