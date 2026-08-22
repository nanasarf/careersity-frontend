import { baseApi } from '../../../services/api'
import type {
  CourseDifficulty,
  CourseDetailDto,
  CourseListItemDto,
  LessonDto,
  PagedResult,
  PublicAssessmentSummaryDto,
  PublicExternalResourceDto,
  PublicProjectDetailDto,
  PublicProjectSummaryDto,
} from '../../../types/api'

export interface GetCoursesParams {
  page?: number
  pageSize?: number
  search?: string
  difficulty?: CourseDifficulty
  skillId?: string
}

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<PagedResult<CourseListItemDto>, GetCoursesParams>({
      query: (params) => ({ url: '/api/courses', params }),
      providesTags: ['Course'],
    }),

    getCourseBySlug: builder.query<CourseDetailDto, string>({
      query: (slug) => `/api/courses/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Course', id: slug }],
    }),

    getLesson: builder.query<LessonDto, { courseSlug: string; lessonSlug: string }>({
      query: ({ courseSlug, lessonSlug }) =>
        `/api/courses/${courseSlug}/lessons/${lessonSlug}`,
      providesTags: (_result, _error, { lessonSlug }) => [{ type: 'Lesson', id: lessonSlug }],
    }),

    getCourseExternalResources: builder.query<PublicExternalResourceDto[], string>({
      query: (courseSlug) => `/api/courses/${courseSlug}/external-resources`,
    }),

    getCourseAssessments: builder.query<PublicAssessmentSummaryDto[], string>({
      query: (courseSlug) => `/api/courses/${courseSlug}/assessments`,
    }),

    getCourseProjects: builder.query<PublicProjectSummaryDto[], string>({
      query: (courseSlug) => `/api/courses/${courseSlug}/projects`,
    }),

    getProjectDetail: builder.query<
      PublicProjectDetailDto,
      { courseSlug: string; projectId: string }
    >({
      query: ({ courseSlug, projectId }) =>
        `/api/courses/${courseSlug}/projects/${projectId}`,
    }),
  }),
})

export const {
  useGetCoursesQuery,
  useGetCourseBySlugQuery,
  useGetLessonQuery,
  useGetCourseExternalResourcesQuery,
  useGetCourseAssessmentsQuery,
  useGetCourseProjectsQuery,
  useGetProjectDetailQuery,
} = coursesApi
