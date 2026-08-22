import { baseApi } from '../../../services/api'
import type {
  AddAnswerOptionRequest,
  AddCoursePrerequisiteRequest,
  AddCourseSkillRequest,
  AddLessonRequest,
  AddQuestionRequest,
  AnswerOptionAdminDto,
  AssessmentAdminDetailDto,
  AssessmentListItemDto,
  ContentStatus,
  CourseDetailDto,
  CourseExternalResourceDto,
  CourseListItemDto,
  CoursePrerequisiteDto,
  CourseSkillDto,
  CourseDifficulty,
  CreateAssessmentRequest,
  CreateCourseRequest,
  CreateProjectRequest,
  LessonDto,
  PagedResult,
  ProjectAdminDetailDto,
  ProjectListItemDto,
  ProjectSubmissionType,
  QuestionAdminDto,
  ReorderAnswerOptionsRequest,
  ReorderLessonsRequest,
  ReorderQuestionsRequest,
  SkillListItemDto,
  AssignExternalResourceToCourseRequest,
  UpdateAnswerOptionRequest,
  UpdateAssessmentRequest,
  UpdateCourseExternalResourceRequest,
  UpdateCoursePrerequisiteRequest,
  UpdateCourseRequest,
  UpdateCourseSkillRequest,
  UpdateLessonRequest,
  UpdateProjectRequest,
  UpdateQuestionRequest,
  ReorderCourseExternalResourcesRequest,
  CreateSkillRequest,
  SkillDto,
  SkillCategory,
  UpdateSkillRequest,
} from '../../../types/api'

// ─── Skills ────────────────────────────────────────────────────────────────────
export interface AdminGetSkillsParams {
  page?: number
  pageSize?: number
  search?: string
  category?: SkillCategory
  status?: ContentStatus
}

// ─── Courses ───────────────────────────────────────────────────────────────────
export interface AdminGetCoursesParams {
  page?: number
  pageSize?: number
  search?: string
  difficulty?: CourseDifficulty
  status?: ContentStatus
  skillId?: string
}

// ─── Assessments ───────────────────────────────────────────────────────────────
export interface AdminGetAssessmentsParams {
  page?: number
  pageSize?: number
  search?: string
  courseId?: string
  status?: ContentStatus
}

// ─── Projects ──────────────────────────────────────────────────────────────────
export interface AdminGetProjectsParams {
  page?: number
  pageSize?: number
  search?: string
  courseId?: string
  submissionType?: ProjectSubmissionType
  status?: ContentStatus
}

export const adminCoursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Skills ────────────────────────────────────────────────────────────
    adminGetSkills: builder.query<PagedResult<SkillListItemDto>, AdminGetSkillsParams>({
      query: (params) => ({ url: '/api/admin/skills', params }),
      providesTags: ['Skill'],
    }),

    adminGetSkill: builder.query<SkillDto, string>({
      query: (id) => `/api/admin/skills/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Skill', id }],
    }),

    adminCreateSkill: builder.mutation<SkillDto, CreateSkillRequest>({
      query: (body) => ({ url: '/api/admin/skills', method: 'POST', body }),
      invalidatesTags: ['Skill'],
    }),

    adminUpdateSkill: builder.mutation<SkillDto, { id: string } & UpdateSkillRequest>({
      query: ({ id, ...body }) => ({ url: `/api/admin/skills/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Skill', id }, 'Skill'],
    }),

    adminPublishSkill: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/skills/${id}/publish`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Skill', id }, 'Skill'],
    }),

    adminArchiveSkill: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/skills/${id}/archive`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Skill', id }, 'Skill'],
    }),

    // ── Courses ───────────────────────────────────────────────────────────
    adminGetCourses: builder.query<PagedResult<CourseListItemDto>, AdminGetCoursesParams>({
      query: (params) => ({ url: '/api/admin/courses', params }),
      providesTags: ['Course'],
    }),

    adminGetCourse: builder.query<CourseDetailDto, string>({
      query: (id) => `/api/admin/courses/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Course', id }],
    }),

    adminCreateCourse: builder.mutation<CourseDetailDto, CreateCourseRequest>({
      query: (body) => ({ url: '/api/admin/courses', method: 'POST', body }),
      invalidatesTags: ['Course'],
    }),

    adminUpdateCourse: builder.mutation<CourseDetailDto, { id: string } & UpdateCourseRequest>({
      query: ({ id, ...body }) => ({ url: `/api/admin/courses/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Course', id }, 'Course'],
    }),

    adminPublishCourse: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/courses/${id}/publish`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Course', id }, 'Course'],
    }),

    adminArchiveCourse: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/courses/${id}/archive`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Course', id }, 'Course'],
    }),

    // ── Lessons ───────────────────────────────────────────────────────────
    adminGetLesson: builder.query<LessonDto, { courseId: string; lessonId: string }>({
      query: ({ courseId, lessonId }) =>
        `/api/admin/courses/${courseId}/lessons/${lessonId}`,
      providesTags: (_r, _e, { lessonId }) => [{ type: 'Lesson', id: lessonId }],
    }),

    adminAddLesson: builder.mutation<LessonDto, { courseId: string } & AddLessonRequest>({
      query: ({ courseId, ...body }) => ({
        url: `/api/admin/courses/${courseId}/lessons`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'Course', id: courseId }],
    }),

    adminUpdateLesson: builder.mutation<
      LessonDto,
      { courseId: string; lessonId: string } & UpdateLessonRequest
    >({
      query: ({ courseId, lessonId, ...body }) => ({
        url: `/api/admin/courses/${courseId}/lessons/${lessonId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { courseId, lessonId }) => [
        { type: 'Course', id: courseId },
        { type: 'Lesson', id: lessonId },
      ],
    }),

    adminDeleteLesson: builder.mutation<void, { courseId: string; lessonId: string }>({
      query: ({ courseId, lessonId }) => ({
        url: `/api/admin/courses/${courseId}/lessons/${lessonId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'Course', id: courseId }],
    }),

    adminReorderLessons: builder.mutation<
      void,
      { courseId: string } & ReorderLessonsRequest
    >({
      query: ({ courseId, ...body }) => ({
        url: `/api/admin/courses/${courseId}/lessons/reorder`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'Course', id: courseId }],
    }),

    // ── Course prerequisites ──────────────────────────────────────────────
    adminAddCoursePrerequisite: builder.mutation<
      CoursePrerequisiteDto,
      { courseId: string } & AddCoursePrerequisiteRequest
    >({
      query: ({ courseId, ...body }) => ({
        url: `/api/admin/courses/${courseId}/prerequisites`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'Course', id: courseId }],
    }),

    adminUpdateCoursePrerequisite: builder.mutation<
      CoursePrerequisiteDto,
      { courseId: string; prerequisiteId: string } & UpdateCoursePrerequisiteRequest
    >({
      query: ({ courseId, prerequisiteId, ...body }) => ({
        url: `/api/admin/courses/${courseId}/prerequisites/${prerequisiteId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'Course', id: courseId }],
    }),

    adminDeleteCoursePrerequisite: builder.mutation<
      void,
      { courseId: string; prerequisiteId: string }
    >({
      query: ({ courseId, prerequisiteId }) => ({
        url: `/api/admin/courses/${courseId}/prerequisites/${prerequisiteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'Course', id: courseId }],
    }),

    // ── Course skills ─────────────────────────────────────────────────────
    adminAddCourseSkill: builder.mutation<
      CourseSkillDto,
      { courseId: string } & AddCourseSkillRequest
    >({
      query: ({ courseId, ...body }) => ({
        url: `/api/admin/courses/${courseId}/skills`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'Course', id: courseId }],
    }),

    adminUpdateCourseSkill: builder.mutation<
      CourseSkillDto,
      { courseId: string; courseSkillId: string } & UpdateCourseSkillRequest
    >({
      query: ({ courseId, courseSkillId, ...body }) => ({
        url: `/api/admin/courses/${courseId}/skills/${courseSkillId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'Course', id: courseId }],
    }),

    adminDeleteCourseSkill: builder.mutation<
      void,
      { courseId: string; courseSkillId: string }
    >({
      query: ({ courseId, courseSkillId }) => ({
        url: `/api/admin/courses/${courseId}/skills/${courseSkillId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'Course', id: courseId }],
    }),

    // ── Course external resources ──────────────────────────────────────────
    adminGetCourseExternalResources: builder.query<CourseExternalResourceDto[], string>({
      query: (courseId) => `/api/admin/courses/${courseId}/external-resources`,
      providesTags: (_r, _e, courseId) => [{ type: 'ExternalResource', id: courseId }],
    }),

    adminAssignExternalResource: builder.mutation<
      CourseExternalResourceDto,
      { courseId: string } & AssignExternalResourceToCourseRequest
    >({
      query: ({ courseId, ...body }) => ({
        url: `/api/admin/courses/${courseId}/external-resources`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { courseId }) => [
        { type: 'Course', id: courseId },
        { type: 'ExternalResource', id: courseId },
      ],
    }),

    adminUpdateCourseExternalResource: builder.mutation<
      CourseExternalResourceDto,
      { courseId: string; assignmentId: string } & UpdateCourseExternalResourceRequest
    >({
      query: ({ courseId, assignmentId, ...body }) => ({
        url: `/api/admin/courses/${courseId}/external-resources/${assignmentId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'Course', id: courseId }, { type: 'ExternalResource', id: courseId }],
    }),

    adminDeleteCourseExternalResource: builder.mutation<
      void,
      { courseId: string; assignmentId: string }
    >({
      query: ({ courseId, assignmentId }) => ({
        url: `/api/admin/courses/${courseId}/external-resources/${assignmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'ExternalResource', id: courseId }],
    }),

    adminReorderCourseExternalResources: builder.mutation<
      void,
      { courseId: string } & ReorderCourseExternalResourcesRequest
    >({
      query: ({ courseId, ...body }) => ({
        url: `/api/admin/courses/${courseId}/external-resources/reorder`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { courseId }) => [{ type: 'Course', id: courseId }, { type: 'ExternalResource', id: courseId }],
    }),

    // ── Assessments ───────────────────────────────────────────────────────
    adminGetAssessments: builder.query<
      PagedResult<AssessmentListItemDto>,
      AdminGetAssessmentsParams
    >({
      query: (params) => ({ url: '/api/admin/assessments', params }),
      providesTags: ['Assessment'],
    }),

    adminGetAssessment: builder.query<AssessmentAdminDetailDto, string>({
      query: (assessmentId) => `/api/admin/assessments/${assessmentId}`,
      providesTags: (_r, _e, id) => [{ type: 'Assessment', id }],
    }),

    adminCreateAssessment: builder.mutation<AssessmentAdminDetailDto, CreateAssessmentRequest>({
      query: (body) => ({ url: '/api/admin/assessments', method: 'POST', body }),
      invalidatesTags: ['Assessment'],
    }),

    adminUpdateAssessment: builder.mutation<
      AssessmentAdminDetailDto,
      { assessmentId: string } & UpdateAssessmentRequest
    >({
      query: ({ assessmentId, ...body }) => ({
        url: `/api/admin/assessments/${assessmentId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { assessmentId }) => [{ type: 'Assessment', id: assessmentId }],
    }),

    adminPublishAssessment: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/assessments/${id}/publish`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Assessment', id }],
    }),

    adminArchiveAssessment: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/assessments/${id}/archive`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Assessment', id }],
    }),

    adminAddQuestion: builder.mutation<
      QuestionAdminDto,
      { assessmentId: string } & AddQuestionRequest
    >({
      query: ({ assessmentId, ...body }) => ({
        url: `/api/admin/assessments/${assessmentId}/questions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { assessmentId }) => [{ type: 'Assessment', id: assessmentId }],
    }),

    adminUpdateQuestion: builder.mutation<
      QuestionAdminDto,
      { assessmentId: string; questionId: string } & UpdateQuestionRequest
    >({
      query: ({ assessmentId, questionId, ...body }) => ({
        url: `/api/admin/assessments/${assessmentId}/questions/${questionId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { assessmentId }) => [{ type: 'Assessment', id: assessmentId }],
    }),

    adminDeleteQuestion: builder.mutation<
      void,
      { assessmentId: string; questionId: string }
    >({
      query: ({ assessmentId, questionId }) => ({
        url: `/api/admin/assessments/${assessmentId}/questions/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { assessmentId }) => [{ type: 'Assessment', id: assessmentId }],
    }),

    adminReorderQuestions: builder.mutation<
      void,
      { assessmentId: string } & ReorderQuestionsRequest
    >({
      query: ({ assessmentId, ...body }) => ({
        url: `/api/admin/assessments/${assessmentId}/questions/reorder`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { assessmentId }) => [{ type: 'Assessment', id: assessmentId }],
    }),

    adminAddAnswerOption: builder.mutation<
      AnswerOptionAdminDto,
      { assessmentId: string; questionId: string } & AddAnswerOptionRequest
    >({
      query: ({ assessmentId, questionId, ...body }) => ({
        url: `/api/admin/assessments/${assessmentId}/questions/${questionId}/answer-options`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { assessmentId }) => [{ type: 'Assessment', id: assessmentId }],
    }),

    adminUpdateAnswerOption: builder.mutation<
      AnswerOptionAdminDto,
      {
        assessmentId: string
        questionId: string
        answerOptionId: string
      } & UpdateAnswerOptionRequest
    >({
      query: ({ assessmentId, questionId, answerOptionId, ...body }) => ({
        url: `/api/admin/assessments/${assessmentId}/questions/${questionId}/answer-options/${answerOptionId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { assessmentId }) => [{ type: 'Assessment', id: assessmentId }],
    }),

    adminDeleteAnswerOption: builder.mutation<
      void,
      { assessmentId: string; questionId: string; answerOptionId: string }
    >({
      query: ({ assessmentId, questionId, answerOptionId }) => ({
        url: `/api/admin/assessments/${assessmentId}/questions/${questionId}/answer-options/${answerOptionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { assessmentId }) => [{ type: 'Assessment', id: assessmentId }],
    }),

    adminReorderAnswerOptions: builder.mutation<
      void,
      { assessmentId: string; questionId: string } & ReorderAnswerOptionsRequest
    >({
      query: ({ assessmentId, questionId, ...body }) => ({
        url: `/api/admin/assessments/${assessmentId}/questions/${questionId}/answer-options/reorder`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { assessmentId }) => [{ type: 'Assessment', id: assessmentId }],
    }),

    // ── Projects ──────────────────────────────────────────────────────────
    adminGetProjects: builder.query<PagedResult<ProjectListItemDto>, AdminGetProjectsParams>({
      query: (params) => ({ url: '/api/admin/projects', params }),
      providesTags: ['Project'],
    }),

    adminGetProject: builder.query<ProjectAdminDetailDto, string>({
      query: (projectId) => `/api/admin/projects/${projectId}`,
      providesTags: (_r, _e, id) => [{ type: 'Project', id }],
    }),

    adminCreateProject: builder.mutation<ProjectAdminDetailDto, CreateProjectRequest>({
      query: (body) => ({ url: '/api/admin/projects', method: 'POST', body }),
      invalidatesTags: ['Project'],
    }),

    adminUpdateProject: builder.mutation<
      ProjectAdminDetailDto,
      { projectId: string } & UpdateProjectRequest
    >({
      query: ({ projectId, ...body }) => ({
        url: `/api/admin/projects/${projectId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { projectId }) => [{ type: 'Project', id: projectId }],
    }),

    adminPublishProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/projects/${id}/publish`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Project', id }],
    }),

    adminArchiveProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/projects/${id}/archive`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Project', id }],
    }),
  }),
})

export const {
  useAdminGetSkillsQuery,
  useAdminGetSkillQuery,
  useAdminCreateSkillMutation,
  useAdminUpdateSkillMutation,
  useAdminPublishSkillMutation,
  useAdminArchiveSkillMutation,
  useAdminGetCoursesQuery,
  useAdminGetCourseQuery,
  useAdminCreateCourseMutation,
  useAdminUpdateCourseMutation,
  useAdminPublishCourseMutation,
  useAdminArchiveCourseMutation,
  useAdminGetLessonQuery,
  useAdminAddLessonMutation,
  useAdminUpdateLessonMutation,
  useAdminDeleteLessonMutation,
  useAdminReorderLessonsMutation,
  useAdminAddCoursePrerequisiteMutation,
  useAdminUpdateCoursePrerequisiteMutation,
  useAdminDeleteCoursePrerequisiteMutation,
  useAdminAddCourseSkillMutation,
  useAdminUpdateCourseSkillMutation,
  useAdminDeleteCourseSkillMutation,
  useAdminGetCourseExternalResourcesQuery,
  useAdminAssignExternalResourceMutation,
  useAdminUpdateCourseExternalResourceMutation,
  useAdminDeleteCourseExternalResourceMutation,
  useAdminReorderCourseExternalResourcesMutation,
  useAdminGetAssessmentsQuery,
  useAdminGetAssessmentQuery,
  useAdminCreateAssessmentMutation,
  useAdminUpdateAssessmentMutation,
  useAdminPublishAssessmentMutation,
  useAdminArchiveAssessmentMutation,
  useAdminAddQuestionMutation,
  useAdminUpdateQuestionMutation,
  useAdminDeleteQuestionMutation,
  useAdminReorderQuestionsMutation,
  useAdminAddAnswerOptionMutation,
  useAdminUpdateAnswerOptionMutation,
  useAdminDeleteAnswerOptionMutation,
  useAdminReorderAnswerOptionsMutation,
  useAdminGetProjectsQuery,
  useAdminGetProjectQuery,
  useAdminCreateProjectMutation,
  useAdminUpdateProjectMutation,
  useAdminPublishProjectMutation,
  useAdminArchiveProjectMutation,
} = adminCoursesApi
