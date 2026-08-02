import { createClient } from '@/lib/supabase/server'







function mapEnrollment(d: any) {


  return { enrollmentId: d.enrollment_id, learnerId: d.learner_id, courseSlug: d.course_slug, status: d.status, completionPercentage: d.completion_percentage, enrolledAt: d.enrolled_at, lastAccessedAt: d.last_accessed_at, completedAt: d.completed_at }


}





export async function getEnrollment(learnerId: string, courseSlug: string) {


  const supabase = await createClient()




  const { data } = await (supabase as any).from('enrollments').select('*').eq('learner_id', learnerId).eq('course_slug', courseSlug).single()


  if (!data) return null


  return mapEnrollment(data)


}





export async function getLearnerEnrollments(learnerId: string) {


  const supabase = await createClient()




  const { data } = await (supabase as any).from('enrollments').select('*').eq('learner_id', learnerId).order('last_accessed_at', { ascending: false, nullsFirst: false })


  return (data ?? []).map(mapEnrollment)


}





export async function enrollLearner(learnerId: string, courseSlug: string) {


  const supabase = await createClient()




  const { data, error } = await (supabase as any).from('enrollments').insert({ learner_id: learnerId, course_slug: courseSlug }).select().single()


  return { data, error }


}





export async function isEnrolled(learnerId: string, courseSlug: string): Promise<boolean> {


  const supabase = await createClient()




  const { count } = await (supabase as any).from('enrollments').select('*', { count: 'exact', head: true }).eq('learner_id', learnerId).eq('course_slug', courseSlug)


  return (count ?? 0) > 0


}


