/** types/index.ts — Application-level types */

// ── Auth ──────────────────────────────────────────────────────────
export interface AuthUser {
  id: string
  email: string
  emailVerified: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  fullName: string
  email: string
  password: string
  profession?: string
}

// ── Learner ───────────────────────────────────────────────────────
export interface Learner {
  learnerId: string
  name: string
  email: string
  avatarUrl: string | null
  bio: string | null
  profession: string | null
  linkedinUrl: string | null
  status: 'active' | 'suspended' | 'pending_verification'
  createdAt: string
}

export interface LearnerStats {
  enrolledCount: number
  completedCount: number
  certificateCount: number
  totalWatchSeconds: number
}

// ── Course ────────────────────────────────────────────────────────
export interface CourseModule {
  number: number
  title: string
  lessons: CourseLesson[]
}

export interface CourseLesson {
  number: number
  title: string
  duration: string
  youtubeId?: string    // Set when video is uploaded
  audioUrl?: string     // Set when audio is recorded
  keyPoints: string
}

export interface Course {
  slug: string
  title: string
  subtitle: string
  tagline: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  icon: string
  themeColor: string
  status: 'active' | 'coming_soon'
  isFree: boolean
  certPricePaise: number        // 29900 = ₹299
  modules: CourseModule[]
  outcomes: string[]
  targetAudience: string[]
  prerequisites: string[]
}

// ── Enrollment ────────────────────────────────────────────────────
export interface Enrollment {
  enrollmentId: string
  learnerId: string
  courseSlug: string
  status: 'active' | 'completed' | 'paused'
  completionPercentage: number
  enrolledAt: string
  lastAccessedAt: string | null
  completedAt: string | null
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Pick<Course, 'slug' | 'title' | 'icon' | 'themeColor' | 'difficulty'>
  nextLesson: { module: number; lesson: number } | null
}

// ── Progress ──────────────────────────────────────────────────────
export interface LessonProgress {
  courseSlug: string
  moduleNumber: number
  lessonNumber: number
  isCompleted: boolean
  completedAt: string | null
  watchedSeconds: number
}

// ── Quiz ──────────────────────────────────────────────────────────
export interface QuizQuestion {
  id: number
  text: string
  options: [string, string, string, string]
  correctIndex: number
  explanation: string
}

export interface QuizResult {
  score: number          // 0–100
  passed: boolean        // score >= 60
  correctCount: number
  totalQuestions: number
  attemptNumber: number
}

// ── Certificate ───────────────────────────────────────────────────
export interface Certificate {
  certificateId: string
  learnerId: string
  courseSlug: string
  learnerName: string
  courseTitle: string
  issuedAt: string
  status: 'pending_payment' | 'issued' | 'revoked'
  verificationUrl: string
}

// ── API responses ─────────────────────────────────────────────────
export interface ApiResponse<T = void> {
  data?: T
  error?: string
  status: 'success' | 'error'
}
