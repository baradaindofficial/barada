import {
  getActiveLearnersTrend,
  getCoursePopularity,
  getCourseCompletionRates,
  getRevenueEstimate,
} from '@/lib/db/admin-analytics'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Analytics',
  robots: { index: false },
}

function formatRupees(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export default async function AdminAnalyticsPage() {
  const [activeLearners, popularity, completionRates, revenue] = await Promise.all([
    getActiveLearnersTrend(8),
    getCoursePopularity(),
    getCourseCompletionRates(),
    getRevenueEstimate(),
  ])

  const maxActive = Math.max(1, ...activeLearners.map((w) => w.activeLearnerCount))
  const maxPopularity = Math.max(1, ...popularity.map((c) => c.enrollmentCount))

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-display font-bold text-2xl text-[#0D183D]">Platform Analytics</h1>

      {/* Active learners trend */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="text-sm font-semibold text-[#0D183D] mb-3">Active Learners per Week</div>
        {activeLearners.length === 0 ? (
          <div className="text-xs text-gray-400 py-8 text-center">No activity yet</div>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {activeLearners.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end h-24">
                  <div
                    className="w-full rounded-t bg-[#0D183D]"
                    style={{ height: `${Math.max(4, (w.activeLearnerCount / maxActive) * 100)}%`, minHeight: 2 }}
                    title={`${w.weekStart}: ${w.activeLearnerCount} active`}
                  />
                </div>
                <div className="text-[10px] text-gray-400">
                  {new Date(w.weekStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Course popularity */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm font-semibold text-[#0D183D] mb-3">Course Popularity</div>
          {popularity.length === 0 ? (
            <div className="text-xs text-gray-400 py-8 text-center">No courses yet</div>
          ) : (
            <div className="space-y-2">
              {popularity.slice(0, 10).map((c) => (
                <div key={c.courseId} className="flex items-center gap-3">
                  <div className="w-32 text-xs text-gray-600 truncate flex-shrink-0">{c.title}</div>
                  <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-[#D11A1A] rounded"
                      style={{ width: `${Math.max(4, (c.enrollmentCount / maxPopularity) * 100)}%` }}
                    />
                  </div>
                  <div className="w-8 text-xs text-gray-400 text-right flex-shrink-0">{c.enrollmentCount}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completion rates */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm font-semibold text-[#0D183D] mb-3">Completion Rate by Course</div>
          {completionRates.length === 0 ? (
            <div className="text-xs text-gray-400 py-8 text-center">No enrollment data yet</div>
          ) : (
            <div className="space-y-2">
              {completionRates.map((c) => (
                <div key={c.courseId} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 truncate">{c.title}</span>
                  <span className="font-semibold text-[#0D183D] flex-shrink-0 ml-2">
                    {c.completionRatePct}% ({c.completedEnrollments}/{c.totalEnrollments})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revenue estimate */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-semibold text-[#0D183D]">Estimated Certificate Revenue</div>
          <span className="text-[10px] uppercase tracking-wide text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Estimate only</span>
        </div>
        <p className="text-[11px] text-gray-400 mb-4">
          Based on issued certificates × list price. No payment records exist to verify actual transactions.
        </p>
        <div className="text-2xl font-black text-[#0D183D] mb-4">
          {formatRupees(revenue.estimatedRevenueRupees)}
          <span className="text-sm font-normal text-gray-400 ml-2">
            from {revenue.totalIssuedCertificates} certificate{revenue.totalIssuedCertificates !== 1 ? 's' : ''}
          </span>
        </div>
        {revenue.byCourse.length > 0 && (
          <div className="space-y-1.5">
            {revenue.byCourse.map((c) => (
              <div key={c.courseId} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 truncate">{c.title}</span>
                <span className="text-gray-400 flex-shrink-0 ml-2">
                  {c.certificatesIssued} × = {formatRupees(c.revenueRupees)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
