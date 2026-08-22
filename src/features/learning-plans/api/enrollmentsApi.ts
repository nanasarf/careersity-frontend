import { baseApi } from '../../../services/api'
import type {
  AssessmentAttemptDetailDto,
  AssessmentAttemptHistoryItemDto,
  AssessmentAttemptStartDto,
  CareerEnrollmentDetailDto,
  CareerEnrollmentListItemDto,
  EnrollmentStatus,
  LearnerAssessmentSummaryDto,
  LearnerCourseDetailDto,
  LearnerExternalResourceProgressDto,
  LearnerLessonDetailDto,
  PagedResult,
  SaveAssessmentResponseRequest,
  SaveAssessmentResponsesRequest,
} from '../../../types/api'

export interface GetEnrollmentsParams {
  status?: EnrollmentStatus
  includeHistory?: boolean
  page?: number
  pageSize?: number
}

interface AssessmentAttemptPath {
  enrollmentId: string
  courseId: string
  assessmentId: string
  attemptId: string
}

interface SaveResponsesArgs extends AssessmentAttemptPath {
  responses: SaveAssessmentResponseRequest[]
}

interface SubmitAttemptArgs extends AssessmentAttemptPath {
  responses?: SaveAssessmentResponseRequest[] | null
}

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Enrollment lifecycle ────────────────────────────────────────────────
    getEnrollments: builder.query<
      PagedResult<CareerEnrollmentListItemDto>,
      GetEnrollmentsParams
    >({
      query: (params) => ({ url: '/api/me/career-enrollments', params }),
      providesTags: ['Enrollment'],
    }),

    enrollInCareer: builder.mutation<CareerEnrollmentDetailDto, { careerId: string }>({
      query: (body) => ({ url: '/api/me/career-enrollments', method: 'POST', body }),
      invalidatesTags: ['Enrollment'],
    }),

    getEnrollment: builder.query<CareerEnrollmentDetailDto, string>({
      query: (enrollmentId) => `/api/me/career-enrollments/${enrollmentId}`,
      providesTags: (_result, _error, id) => [{ type: 'Enrollment', id }],
    }),

    pauseEnrollment: builder.mutation<void, string>({
      query: (enrollmentId) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/pause`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Enrollment', id }, 'Enrollment'],
    }),

    resumeEnrollment: builder.mutation<void, string>({
      query: (enrollmentId) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/resume`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Enrollment', id }, 'Enrollment'],
    }),

    withdrawEnrollment: builder.mutation<void, string>({
      query: (enrollmentId) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/withdraw`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Enrollment', id }, 'Enrollment'],
    }),

    // ── Course progress ─────────────────────────────────────────────────────
    getEnrollmentCourse: builder.query<
      LearnerCourseDetailDto,
      { enrollmentId: string; courseId: string }
    >({
      query: ({ enrollmentId, courseId }) =>
        `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}`,
      providesTags: (_result, _error, { enrollmentId, courseId }) => [
        { type: 'CourseProgress', id: `${enrollmentId}:${courseId}` },
      ],
    }),

    startCourse: builder.mutation<
      LearnerCourseDetailDto,
      { enrollmentId: string; courseId: string }
    >({
      query: ({ enrollmentId, courseId }) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/start`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { enrollmentId }) => [
        { type: 'Enrollment', id: enrollmentId },
        'CourseProgress',
      ],
    }),

    completeCourse: builder.mutation<
      LearnerCourseDetailDto,
      { enrollmentId: string; courseId: string }
    >({
      query: ({ enrollmentId, courseId }) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { enrollmentId }) => [
        { type: 'Enrollment', id: enrollmentId },
        'Enrollment',
        'CourseProgress',
      ],
    }),

    // ── Lesson progress ─────────────────────────────────────────────────────
    getEnrollmentLesson: builder.query<
      LearnerLessonDetailDto,
      { enrollmentId: string; courseId: string; lessonId: string }
    >({
      query: ({ enrollmentId, courseId, lessonId }) =>
        `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/lessons/${lessonId}`,
      providesTags: (_result, _error, { lessonId }) => [
        { type: 'LessonProgress', id: lessonId },
      ],
    }),

    startLesson: builder.mutation<
      LearnerLessonDetailDto,
      { enrollmentId: string; courseId: string; lessonId: string }
    >({
      query: ({ enrollmentId, courseId, lessonId }) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/lessons/${lessonId}/start`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { lessonId }) => [
        { type: 'LessonProgress', id: lessonId },
        'CourseProgress',
      ],
    }),

    completeLesson: builder.mutation<
      LearnerLessonDetailDto,
      { enrollmentId: string; courseId: string; lessonId: string }
    >({
      query: ({ enrollmentId, courseId, lessonId }) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/lessons/${lessonId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { enrollmentId }) => [
        { type: 'Enrollment', id: enrollmentId },
        'Enrollment',
        'CourseProgress',
        'LessonProgress',
      ],
    }),

    // ── External resource progress ──────────────────────────────────────────
    getExternalResourceProgress: builder.query<
      LearnerExternalResourceProgressDto[],
      { enrollmentId: string; courseId: string }
    >({
      query: ({ enrollmentId, courseId }) =>
        `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/external-resources`,
      providesTags: ['CourseProgress'],
    }),

    startExternalResource: builder.mutation<
      LearnerExternalResourceProgressDto,
      { enrollmentId: string; courseId: string; assignmentId: string }
    >({
      query: ({ enrollmentId, courseId, assignmentId }) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/external-resources/${assignmentId}/start`,
        method: 'POST',
      }),
      invalidatesTags: ['CourseProgress'],
    }),

    completeExternalResource: builder.mutation<
      LearnerExternalResourceProgressDto,
      { enrollmentId: string; courseId: string; assignmentId: string }
    >({
      query: ({ enrollmentId, courseId, assignmentId }) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/external-resources/${assignmentId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { enrollmentId }) => [
        { type: 'Enrollment', id: enrollmentId },
        'Enrollment',
        'CourseProgress',
      ],
    }),

    // ── Assessment attempts ─────────────────────────────────────────────────
    getEnrollmentAssessments: builder.query<
      LearnerAssessmentSummaryDto[],
      { enrollmentId: string; courseId: string }
    >({
      query: ({ enrollmentId, courseId }) =>
        `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/assessments`,
      providesTags: ['AssessmentProgress'],
    }),

    startAssessmentAttempt: builder.mutation<
      AssessmentAttemptStartDto,
      { enrollmentId: string; courseId: string; assessmentId: string }
    >({
      query: ({ enrollmentId, courseId, assessmentId }) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/assessments/${assessmentId}/attempts`,
        method: 'POST',
      }),
      invalidatesTags: ['AssessmentProgress'],
    }),

    getAssessmentAttemptHistory: builder.query<
      AssessmentAttemptHistoryItemDto[],
      { enrollmentId: string; courseId: string; assessmentId: string }
    >({
      query: ({ enrollmentId, courseId, assessmentId }) =>
        `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/assessments/${assessmentId}/attempts`,
    }),

    getAssessmentAttempt: builder.query<AssessmentAttemptDetailDto, AssessmentAttemptPath>({
      query: ({ enrollmentId, courseId, assessmentId, attemptId }) =>
        `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/assessments/${assessmentId}/attempts/${attemptId}`,
    }),

    saveAssessmentResponses: builder.mutation<AssessmentAttemptDetailDto, SaveResponsesArgs>({
      query: ({ enrollmentId, courseId, assessmentId, attemptId, responses }) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/assessments/${assessmentId}/attempts/${attemptId}/responses`,
        method: 'PUT',
        body: { responses } satisfies SaveAssessmentResponsesRequest,
      }),
    }),

    submitAssessmentAttempt: builder.mutation<AssessmentAttemptDetailDto, SubmitAttemptArgs>({
      query: ({ enrollmentId, courseId, assessmentId, attemptId, responses }) => ({
        url: `/api/me/career-enrollments/${enrollmentId}/courses/${courseId}/assessments/${assessmentId}/attempts/${attemptId}/submit`,
        method: 'POST',
        body: { responses },
      }),
      invalidatesTags: (_result, _error, { enrollmentId }) => [
        { type: 'Enrollment', id: enrollmentId },
        'Enrollment',
        'CourseProgress',
        'AssessmentProgress',
      ],
    }),
  }),
})

export const {
  useGetEnrollmentsQuery,
  useEnrollInCareerMutation,
  useGetEnrollmentQuery,
  usePauseEnrollmentMutation,
  useResumeEnrollmentMutation,
  useWithdrawEnrollmentMutation,
  useGetEnrollmentCourseQuery,
  useStartCourseMutation,
  useCompleteCourseMutation,
  useGetEnrollmentLessonQuery,
  useStartLessonMutation,
  useCompleteLessonMutation,
  useGetExternalResourceProgressQuery,
  useStartExternalResourceMutation,
  useCompleteExternalResourceMutation,
  useGetEnrollmentAssessmentsQuery,
  useStartAssessmentAttemptMutation,
  useGetAssessmentAttemptHistoryQuery,
  useGetAssessmentAttemptQuery,
  useLazyGetAssessmentAttemptQuery,
  useSaveAssessmentResponsesMutation,
  useSubmitAssessmentAttemptMutation,
} = enrollmentsApi
