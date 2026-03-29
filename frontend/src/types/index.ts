export interface User {
  id: number
  email: string
  name: string
  role: 'student' | 'club_admin' | 'admin'
  avatar?: string
  phone?: string
}

export interface StudentProfile {
  id: number
  userId: number
  studentId?: string
  school?: string
  faculty?: string
  major?: string
  grade?: number
  weeklyHours?: number
  skills?: string[]
  personalityTags?: string[]
  goalTags?: string[]
  interestTags?: string[]
  questionnaireDone: boolean
}

export interface ClubCategory {
  id: number
  name: string
  icon?: string
}

export interface ClubTag {
  id: number
  tag: string
  tagType: 'interest' | 'skill' | 'requirement' | 'goal'
}

export interface Club {
  id: number
  name: string
  categoryId?: number
  logo?: string
  cover?: string
  slogan?: string
  description?: string
  foundedYear?: number
  memberCount: number
  activityFrequency?: string
  contactEmail?: string
  contactQq?: string
  status: 'pending' | 'active' | 'inactive'
  viewCount: number
  createdAt: string
  tags?: ClubTag[]
  category?: ClubCategory
  recruitmentConfig?: ClubRecruitmentConfig | null
}

export interface ClubRecruitmentConfig {
  id: number
  clubId: number
  batchId: number
  quota?: number
  requirements?: string
  skillRequirements?: string[]
  acceptBeginner: boolean
  assessmentIntensity: number
  hasInterview: boolean
  customQuestions?: any[]
  status: 'draft' | 'published' | 'closed'
  batch?: RecruitmentBatch
}

export interface RecruitmentBatch {
  id: number
  name: string
  startDate: string
  endDate: string
  status: 'upcoming' | 'active' | 'ended'
  description?: string
}

export interface Application {
  id: number
  userId: number
  clubId: number
  batchId: number
  priority: number
  motivation?: string
  status: 'pending' | 'reviewing' | 'interview' | 'admitted' | 'rejected' | 'withdrawn'
  score?: number
  remark?: string
  createdAt: string
  club?: Club
  batch?: RecruitmentBatch
  interview?: Interview
  user?: User
}

export interface Interview {
  id: number
  applicationId: number
  interviewTime: string
  location?: string
  onlineLink?: string
  notes?: string
  result: 'pending' | 'pass' | 'fail'
  feedback?: string
}

export interface Notification {
  id: number
  userId: number
  title: string
  content: string
  type: 'system' | 'application' | 'interview' | 'result' | 'announcement'
  isRead: boolean
  meta?: any
  createdAt: string
}

export interface QuestionnaireQuestion {
  id: number
  section: 'interest' | 'time' | 'skill' | 'personality' | 'goal'
  sortOrder: number
  question: string
  type: 'single' | 'multi' | 'scale'
  options: Array<{ value: string; label: string; tags: string[] }>
}

export interface RecommendedClub {
  club: Club
  score: number
  reasons: string[]
  config: ClubRecruitmentConfig | null
}

export interface Announcement {
  id: number
  title: string
  content: string
  cover?: string
  isActive: boolean
  createdAt: string
}
