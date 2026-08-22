// ─── Primitive aliases ────────────────────────────────────────────────────────
export type UUID = string
export type UtcDateTime = string

// ─── Enums ────────────────────────────────────────────────────────────────────
export type ContentStatus = 'Draft' | 'Published' | 'Archived'
export type CourseDifficulty = 'Foundation' | 'Beginner' | 'Intermediate' | 'Advanced'
export type LessonContentType = 'Article' | 'Video' | 'Exercise' | 'ExternalResource' | 'Mixed'
export type QuestionType = 'SingleChoice' | 'MultipleChoice' | 'TrueFalse'
export type SkillCategory =
  | 'Technical'
  | 'Analytical'
  | 'Communication'
  | 'Professional'
  | 'DomainKnowledge'
  | 'Tool'
export type SkillProficiencyLevel = 'Awareness' | 'Beginner' | 'Intermediate' | 'Advanced'
export type ProjectSubmissionType =
  | 'RepositoryUrl'
  | 'PortfolioUrl'
  | 'DocumentUrl'
  | 'VideoUrl'
  | 'TextResponse'
  | 'Mixed'
export type UserRole = 'Learner' | 'Administrator'
export type EnrollmentStatus = 'Active' | 'Paused' | 'Completed' | 'Withdrawn'
export type AssessmentAttemptStatus = 'InProgress' | 'Passed' | 'Failed'
export type CourseAvailabilityStatus = 'Locked' | 'Available' | 'InProgress' | 'Completed'
export type ExternalResourceType =
  | 'LectureVideo'
  | 'VideoPlaylist'
  | 'Reading'
  | 'Exercise'
  | 'ExternalAssessment'
  | 'Assignment'
  | 'AnswerGuide'
  | 'CourseWebsite'
  | 'CertificateOpportunity'
  | 'Dataset'
  | 'SoftwareTool'
  | 'Other'
export type ResourceAccessType =
  | 'Free'
  | 'FreeWithAccount'
  | 'AuditFree'
  | 'Paid'
  | 'InstitutionRestricted'
  | 'Unknown'

// ─── Common ───────────────────────────────────────────────────────────────────
export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
}

export interface ApiProblem {
  type: string
  title: string
  status: number
  detail?: string
  instance?: string
  traceId?: string
  errors?: Record<string, string[]>
}

export function isApiProblem(value: unknown): value is ApiProblem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'title' in value &&
    'status' in value
  )
}

// ─── Auth / Identity ──────────────────────────────────────────────────────────
export interface AuthenticatedUserDto {
  id: UUID
  email: string
  firstName: string
  lastName: string
  fullName: string
  role: UserRole
}

export interface AuthenticationResultDto {
  user: AuthenticatedUserDto
  accessToken: string
  accessTokenExpiresAtUtc: UtcDateTime
  refreshToken: string
  refreshTokenExpiresAtUtc: UtcDateTime
}

export interface UserProfileDto extends AuthenticatedUserDto {
  isActive: boolean
  lastLoginAtUtc: UtcDateTime | null
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

// ─── Auth requests ────────────────────────────────────────────────────────────
export interface RegisterRequest {
  email: string
  firstName: string
  lastName: string
  password: string
  confirmPassword: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RefreshAccessTokenRequest {
  refreshToken: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface ChangeMyPasswordRequest {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface UpdateMyProfileRequest {
  firstName: string
  lastName: string
}

// ─── Career catalog DTOs ──────────────────────────────────────────────────────
export interface CareerCategoryDto {
  id: UUID
  name: string
  slug: string
  description: string | null
  status: ContentStatus
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

export interface CareerListItemDto {
  id: UUID
  careerCategoryId: UUID
  categoryName: string
  title: string
  slug: string
  shortDescription: string
  estimatedDurationWeeks: number | null
  status: ContentStatus
}

export interface CareerSkillDto {
  id: UUID
  skillId: UUID
  skillName: string
  skillSlug: string
  skillCategory: SkillCategory
  requiredProficiencyLevel: SkillProficiencyLevel
  isRequired: boolean
  displayOrder: number
}

export interface PathwayLevelCourseDto {
  id: UUID
  courseId: UUID
  courseTitle: string
  courseSlug: string
  difficulty: CourseDifficulty
  estimatedDurationMinutes: number
  order: number
  isRequired: boolean
}

export interface PathwayLevelDto {
  id: UUID
  name: string
  description: string | null
  order: number
  courses: PathwayLevelCourseDto[]
}

export interface CareerPathwayDto {
  id: UUID
  careerId: UUID
  name: string
  description: string | null
  version: string
  isPrimary: boolean
  status: ContentStatus
  levels: PathwayLevelDto[]
}

export interface CareerDetailDto {
  id: UUID
  careerCategory: CareerCategoryDto
  title: string
  slug: string
  shortDescription: string
  detailedDescription: string | null
  responsibilities: string | null
  estimatedDurationWeeks: number | null
  status: ContentStatus
  skills: CareerSkillDto[]
  primaryPathway: CareerPathwayDto | null
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

// ─── Skill DTOs ───────────────────────────────────────────────────────────────
export interface SkillListItemDto {
  id: UUID
  name: string
  slug: string
  category: SkillCategory
  status: ContentStatus
}

export interface SkillDto extends SkillListItemDto {
  description: string | null
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

// ─── Course / Lesson DTOs ─────────────────────────────────────────────────────
export interface LessonSummaryDto {
  id: UUID
  title: string
  slug: string
  summary: string | null
  contentType: LessonContentType
  estimatedDurationMinutes: number
  order: number
  isRequired: boolean
}

export interface LessonDto extends LessonSummaryDto {
  courseId: UUID
  content: string | null
  externalResourceUrl: string | null
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

export interface CoursePrerequisiteDto {
  id: UUID
  prerequisiteCourseId: UUID
  prerequisiteCourseTitle: string
  prerequisiteCourseSlug: string
  isRequired: boolean
}

export interface CourseSkillDto {
  id: UUID
  skillId: UUID
  skillName: string
  skillSlug: string
  skillCategory: SkillCategory
  proficiencyLevel: SkillProficiencyLevel
  isPrimary: boolean
}

export interface CourseListItemDto {
  id: UUID
  title: string
  slug: string
  shortDescription: string
  difficulty: CourseDifficulty
  estimatedDurationMinutes: number
  status: ContentStatus
  lessonCount: number
  skillCount: number
}

export interface CourseDetailDto {
  id: UUID
  title: string
  slug: string
  shortDescription: string
  detailedDescription: string | null
  difficulty: CourseDifficulty
  estimatedDurationMinutes: number
  status: ContentStatus
  lessons: LessonSummaryDto[]
  prerequisites: CoursePrerequisiteDto[]
  skills: CourseSkillDto[]
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

// ─── Assessment / Project public DTOs ────────────────────────────────────────
export interface PublicAssessmentSummaryDto {
  id: UUID
  title: string
  description: string | null
  passingScorePercentage: number
  maximumAttempts: number | null
  questionCount: number
  totalPoints: number
}

export interface PublicProjectSummaryDto {
  id: UUID
  title: string
  description: string
  submissionType: ProjectSubmissionType
  estimatedDurationMinutes: number
}

export interface PublicProjectDetailDto extends PublicProjectSummaryDto {
  courseId: UUID
  courseTitle: string
  courseSlug: string
  instructions: string
  expectedOutput: string | null
  evaluationCriteria: string | null
}

// ─── Provider / Instructor / External resource DTOs ───────────────────────────
export interface LearningProviderDto {
  id: UUID
  name: string
  slug: string
  description: string | null
  websiteUrl: string | null
  logoUrl: string | null
  status: ContentStatus
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

export interface InstructorDto {
  id: UUID
  learningProviderId: UUID
  providerName: string
  name: string
  title: string | null
  biography: string | null
  profileUrl: string | null
  status: ContentStatus
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

export interface ExternalLearningResourceListItemDto {
  id: UUID
  title: string
  resourceType: ExternalResourceType
  accessType: ResourceAccessType
  url: string
  providerId: UUID
  providerName: string
  instructorId: UUID | null
  instructorName: string | null
  estimatedDurationMinutes: number | null
  lastReviewedAtUtc: UtcDateTime | null
  status: ContentStatus
}

export interface ExternalLearningResourceDetailDto {
  id: UUID
  title: string
  description: string | null
  resourceType: ExternalResourceType
  accessType: ResourceAccessType
  url: string
  sourceLabel: string | null
  provider: LearningProviderDto
  instructor: InstructorDto | null
  estimatedDurationMinutes: number | null
  lastReviewedAtUtc: UtcDateTime | null
  status: ContentStatus
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

export interface PublicExternalResourceDto {
  resourceId: UUID
  title: string
  description: string | null
  resourceType: ExternalResourceType
  accessType: ResourceAccessType
  url: string
  sourceLabel: string | null
  providerName: string
  instructorName: string | null
  estimatedDurationMinutes: number | null
  order: number
  isRequired: boolean
}

// ─── Enrollment / Progress DTOs ───────────────────────────────────────────────
export interface EnrollmentCareerDto {
  id: UUID
  title: string
  slug: string
}

export interface EnrollmentPathwayDto {
  id: UUID
  name: string
  version: string
}

export interface CurrentCourseDto {
  courseId: UUID
  title: string
  slug: string
  pathwayLevelName: string
  pathwayLevelOrder: number
  courseOrder: number
  progressPercentage: number
}

export interface LearnerLessonProgressDto {
  lessonId: UUID
  title: string
  slug: string
  summary: string | null
  contentType: LessonContentType
  estimatedDurationMinutes: number
  order: number
  isRequired: boolean
  isStarted: boolean
  isCompleted: boolean
  startedAtUtc: UtcDateTime | null
  completedAtUtc: UtcDateTime | null
}

export interface LearnerCourseProgressDto {
  courseId: UUID
  title: string
  slug: string
  difficulty: CourseDifficulty
  estimatedDurationMinutes: number
  order: number
  isRequired: boolean
  availabilityStatus: CourseAvailabilityStatus
  isStarted: boolean
  isCompleted: boolean
  progressPercentage: number
  completedLessonCount: number
  totalRequiredLessonCount: number
  startedAtUtc: UtcDateTime | null
  completedAtUtc: UtcDateTime | null
  completedRequiredExternalResourceCount: number
  totalRequiredExternalResourceCount: number
}

export interface LearnerPathwayLevelDto {
  id: UUID
  name: string
  description: string | null
  order: number
  isCompleted: boolean
  progressPercentage: number
  courses: LearnerCourseProgressDto[]
}

export interface CareerEnrollmentListItemDto {
  id: UUID
  careerId: UUID
  careerTitle: string
  careerSlug: string
  careerPathwayId: UUID
  pathwayName: string
  pathwayVersion: string
  status: EnrollmentStatus
  enrolledAtUtc: UtcDateTime
  startedAtUtc: UtcDateTime | null
  completedAtUtc: UtcDateTime | null
  overallProgressPercentage: number
  completedCourseCount: number
  totalRequiredCourseCount: number
  currentCourse: CurrentCourseDto | null
}

export interface CareerEnrollmentDetailDto {
  id: UUID
  career: EnrollmentCareerDto
  pathway: EnrollmentPathwayDto
  status: EnrollmentStatus
  enrolledAtUtc: UtcDateTime
  startedAtUtc: UtcDateTime | null
  pausedAtUtc: UtcDateTime | null
  completedAtUtc: UtcDateTime | null
  withdrawnAtUtc: UtcDateTime | null
  overallProgressPercentage: number
  completedRequiredCourseCount: number
  totalRequiredCourseCount: number
  levels: LearnerPathwayLevelDto[]
}

export interface LearnerExternalResourceProgressDto {
  assignmentId: UUID
  resourceId: UUID
  title: string
  description: string | null
  resourceType: ExternalResourceType
  accessType: ResourceAccessType
  url: string
  providerName: string
  instructorName: string | null
  estimatedDurationMinutes: number | null
  order: number
  isRequired: boolean
  isStarted: boolean
  isCompleted: boolean
  startedAtUtc: UtcDateTime | null
  completedAtUtc: UtcDateTime | null
}

export interface LearnerCourseDetailDto {
  courseId: UUID
  title: string
  slug: string
  shortDescription: string
  detailedDescription: string | null
  difficulty: CourseDifficulty
  estimatedDurationMinutes: number
  availabilityStatus: CourseAvailabilityStatus
  isStarted: boolean
  isCompleted: boolean
  progressPercentage: number
  prerequisites: CoursePrerequisiteDto[]
  lessons: LearnerLessonProgressDto[]
  projects: PublicProjectSummaryDto[]
  assessmentSummaries: PublicAssessmentSummaryDto[]
  externalResources: LearnerExternalResourceProgressDto[] | null
  completedRequiredExternalResourceCount: number
  totalRequiredExternalResourceCount: number
}

export interface LearnerLessonDetailDto extends LearnerLessonProgressDto {
  courseId: UUID
  content: string | null
  externalResourceUrl: string | null
}

// ─── Assessment attempt DTOs ──────────────────────────────────────────────────
export interface LearnerAssessmentSummaryDto {
  assessmentId: UUID
  title: string
  description: string | null
  passingScorePercentage: number
  maximumAttempts: number | null
  attemptsUsed: number
  attemptsRemaining: number | null
  hasPassed: boolean
  activeAttemptId: UUID | null
  questionCount: number
  totalPoints: number
}

export interface LearnerAnswerOptionDto {
  answerOptionId: UUID
  text: string
  order: number
}

export interface LearnerAssessmentQuestionDto {
  questionId: UUID
  prompt: string
  questionType: QuestionType
  order: number
  points: number
  answerOptions: LearnerAnswerOptionDto[]
}

export interface AssessmentAttemptStartDto {
  attemptId: UUID
  assessmentId: UUID
  attemptNumber: number
  status: AssessmentAttemptStatus
  startedAtUtc: UtcDateTime
  questions: LearnerAssessmentQuestionDto[]
}

export interface LearnerAssessmentResponseDto {
  questionId: UUID
  selectedAnswerOptionIds: UUID[]
  isCorrect: boolean | null
  pointsAwarded: number | null
}

export interface AssessmentAttemptDetailDto {
  attemptId: UUID
  assessmentId: UUID
  assessmentTitle: string
  attemptNumber: number
  status: AssessmentAttemptStatus
  startedAtUtc: UtcDateTime
  submittedAtUtc: UtcDateTime | null
  scorePercentage: number | null
  pointsEarned: number | null
  totalPoints: number | null
  passed: boolean
  responses: LearnerAssessmentResponseDto[]
}

export interface AssessmentAttemptHistoryItemDto {
  attemptId: UUID
  attemptNumber: number
  status: AssessmentAttemptStatus
  startedAtUtc: UtcDateTime
  submittedAtUtc: UtcDateTime | null
  scorePercentage: number | null
  passed: boolean
}

export interface SaveAssessmentResponseRequest {
  questionId: UUID
  selectedAnswerOptionIds: UUID[]
}

export interface SaveAssessmentResponsesRequest {
  responses: SaveAssessmentResponseRequest[]
}

export interface SubmitAssessmentAttemptRequest {
  responses?: SaveAssessmentResponseRequest[] | null
}

// ─── Admin response-only DTOs ─────────────────────────────────────────────────
export interface AnswerOptionAdminDto {
  id: UUID
  questionId: UUID
  text: string
  isCorrect: boolean
  order: number
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

export interface QuestionAdminDto {
  id: UUID
  assessmentId: UUID
  prompt: string
  questionType: QuestionType
  order: number
  points: number
  answerOptions: AnswerOptionAdminDto[]
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

export interface AssessmentListItemDto {
  id: UUID
  courseId: UUID
  title: string
  description: string | null
  passingScorePercentage: number
  maximumAttempts: number | null
  status: ContentStatus
  questionCount: number
  totalPoints: number
}

export interface AssessmentAdminDetailDto {
  id: UUID
  courseId: UUID
  courseTitle: string
  title: string
  description: string | null
  passingScorePercentage: number
  maximumAttempts: number | null
  status: ContentStatus
  questions: QuestionAdminDto[]
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

export interface ProjectListItemDto {
  id: UUID
  courseId: UUID
  courseTitle: string
  title: string
  description: string
  submissionType: ProjectSubmissionType
  estimatedDurationMinutes: number
  status: ContentStatus
}

export interface ProjectAdminDetailDto extends ProjectListItemDto {
  instructions: string
  expectedOutput: string | null
  evaluationCriteria: string | null
  createdAtUtc: UtcDateTime
  updatedAtUtc: UtcDateTime | null
}

export interface CourseExternalResourceDto {
  assignmentId: UUID
  courseId: UUID
  resourceId: UUID
  title: string
  description: string | null
  resourceType: ExternalResourceType
  accessType: ResourceAccessType
  url: string
  providerName: string
  instructorName: string | null
  order: number
  isRequired: boolean
  notes: string | null
  estimatedDurationMinutes: number | null
}

export interface CurriculumImportIssue {
  path: string
  code: string
  message: string
}

export interface CurriculumImportCounts {
  categories: number
  careers: number
  skills: number
  providers: number
  instructors: number
  resources: number
  courses: number
  lessons: number
  pathways: number
  levels: number
  assignments: number
}

export interface CurriculumImportValidationDto {
  isValid: boolean
  errors: CurriculumImportIssue[]
  warnings: CurriculumImportIssue[]
  counts: CurriculumImportCounts
}

export interface CurriculumImportSummaryDto {
  importId: UUID
  created: CurriculumImportCounts
  categoryId: UUID
  categorySlug: string
  careerId: UUID
  careerSlug: string
  pathwayId: UUID
}

// ─── Admin request types ──────────────────────────────────────────────────────
export interface CreateCareerCategoryRequest {
  name: string
  slug: string
  description: string | null
}

export type UpdateCareerCategoryRequest = CreateCareerCategoryRequest

export interface CreateCareerRequest {
  careerCategoryId: UUID
  title: string
  slug: string
  shortDescription: string
  detailedDescription: string | null
  responsibilities: string | null
  estimatedDurationWeeks: number | null
}

export type UpdateCareerRequest = Omit<CreateCareerRequest, 'careerCategoryId'>

export interface ChangeCareerCategoryRequest {
  careerCategoryId: UUID
}

export interface AssignCareerSkillRequest {
  skillId: UUID
  requiredProficiencyLevel: SkillProficiencyLevel
  isRequired: boolean
  displayOrder: number
}

export type UpdateCareerSkillRequest = Omit<AssignCareerSkillRequest, 'skillId'>

export interface CreateCareerPathwayRequest {
  careerId: UUID
  name: string
  description: string | null
  version: string
  isPrimary: boolean
}

export type UpdateCareerPathwayRequest = Omit<CreateCareerPathwayRequest, 'careerId'>

export interface AddPathwayLevelRequest {
  name: string
  description: string | null
  order: number
}

export type UpdatePathwayLevelRequest = AddPathwayLevelRequest

export interface AddPathwayLevelCourseRequest {
  courseId: UUID
  order: number
  isRequired: boolean
}

export interface UpdatePathwayLevelCourseRequest {
  order: number
  isRequired: boolean
}

export interface ReorderPathwayLevelsRequest {
  levels: Array<{ levelId: UUID; order: number }>
}

export interface ReorderPathwayCoursesRequest {
  courses: Array<{ assignmentId: UUID; order: number }>
}

export interface CreateSkillRequest {
  name: string
  slug: string
  description: string | null
  category: SkillCategory
}

export type UpdateSkillRequest = CreateSkillRequest

export interface CreateCourseRequest {
  title: string
  slug: string
  shortDescription: string
  detailedDescription: string | null
  difficulty: CourseDifficulty
  estimatedDurationMinutes: number
}

export type UpdateCourseRequest = CreateCourseRequest

export interface AddLessonRequest {
  title: string
  slug: string
  summary: string | null
  content: string | null
  contentType: LessonContentType
  externalResourceUrl: string | null
  estimatedDurationMinutes: number
  order: number
  isRequired: boolean
}

export type UpdateLessonRequest = AddLessonRequest

export interface ReorderLessonsRequest {
  lessons: Array<{ lessonId: UUID; order: number }>
}

export interface AddCoursePrerequisiteRequest {
  prerequisiteCourseId: UUID
  isRequired: boolean
}

export interface UpdateCoursePrerequisiteRequest {
  isRequired: boolean
}

export interface AddCourseSkillRequest {
  skillId: UUID
  proficiencyLevel: SkillProficiencyLevel
  isPrimary: boolean
}

export interface UpdateCourseSkillRequest {
  proficiencyLevel: SkillProficiencyLevel
  isPrimary: boolean
}

export interface CreateAssessmentRequest {
  courseId: UUID
  title: string
  description: string | null
  passingScorePercentage: number
  maximumAttempts: number | null
}

export type UpdateAssessmentRequest = Omit<CreateAssessmentRequest, 'courseId'>

export interface AddQuestionRequest {
  prompt: string
  questionType: QuestionType
  order: number
  points: number
}

export type UpdateQuestionRequest = AddQuestionRequest

export interface ReorderQuestionsRequest {
  questions: Array<{ questionId: UUID; order: number }>
}

export interface AddAnswerOptionRequest {
  text: string
  isCorrect: boolean
  order: number
}

export type UpdateAnswerOptionRequest = AddAnswerOptionRequest

export interface ReorderAnswerOptionsRequest {
  answerOptions: Array<{ answerOptionId: UUID; order: number }>
}

export interface CreateProjectRequest {
  courseId: UUID
  title: string
  description: string
  instructions: string
  expectedOutput: string | null
  evaluationCriteria: string | null
  submissionType: ProjectSubmissionType
  estimatedDurationMinutes: number
}

export type UpdateProjectRequest = Omit<CreateProjectRequest, 'courseId'>

export interface CreateLearningProviderRequest {
  name: string
  slug: string
  description: string | null
  websiteUrl: string | null
  logoUrl: string | null
}

export type UpdateLearningProviderRequest = CreateLearningProviderRequest

export interface CreateInstructorRequest {
  learningProviderId: UUID
  name: string
  title: string | null
  biography: string | null
  profileUrl: string | null
}

export type UpdateInstructorRequest = Omit<CreateInstructorRequest, 'learningProviderId'>

export interface ChangeInstructorProviderRequest {
  learningProviderId: UUID
}

export interface CreateExternalLearningResourceRequest {
  learningProviderId: UUID
  instructorId: UUID | null
  title: string
  description: string | null
  resourceType: ExternalResourceType
  accessType: ResourceAccessType
  url: string
  sourceLabel: string | null
  estimatedDurationMinutes: number | null
}

export type UpdateExternalLearningResourceRequest = CreateExternalLearningResourceRequest

export interface AssignExternalResourceToCourseRequest {
  externalLearningResourceId: UUID
  order: number
  isRequired: boolean
  notes: string | null
}

export interface UpdateCourseExternalResourceRequest {
  order: number
  isRequired: boolean
  notes: string | null
}

export interface ReorderCourseExternalResourcesRequest {
  resources: Array<{ assignmentId: UUID; order: number }>
}

export interface CurriculumImportCourseLesson {
  title: string
  slug: string
  contentType: LessonContentType
  estimatedDurationMinutes: number
  order: number
  isRequired: boolean
  summary?: string | null
  externalResourceUrl?: string | null
}

export interface CurriculumImportCourseResource {
  providerSlug: string
  title: string
  resourceType: ExternalResourceType
  accessType: ResourceAccessType
  url: string
  order: number
  isRequired: boolean
  instructorName?: string | null
  estimatedDurationMinutes?: number | null
}

export interface CurriculumImportRequest {
  category: { name: string; slug: string; description?: string | null }
  career: {
    title: string
    slug: string
    shortDescription: string
    estimatedDurationWeeks?: number | null
  }
  skills: Array<{ name: string; slug: string; category: SkillCategory; description?: string | null }>
  providers: Array<{
    name: string
    slug: string
    websiteUrl?: string | null
    description?: string | null
  }>
  instructors?: Array<{
    providerSlug: string
    name: string
    title?: string | null
    profileUrl?: string | null
  }> | null
  courses: Array<{
    title: string
    slug: string
    difficulty: CourseDifficulty
    estimatedDurationMinutes: number
    shortDescription?: string | null
    skills: Array<{ skillSlug: string; proficiencyLevel: SkillProficiencyLevel; isPrimary: boolean }>
    lessons: CurriculumImportCourseLesson[]
    externalResources: CurriculumImportCourseResource[]
  }>
  pathway: {
    name: string
    version: string
    isPrimary: boolean
    description?: string | null
    levels: Array<{
      name: string
      order: number
      description?: string | null
      courses: Array<{ courseSlug: string; order: number; isRequired: boolean }>
    }>
  }
  mode?: 'CreateOnly'
}
