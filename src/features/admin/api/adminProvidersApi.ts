import { baseApi } from '../../../services/api'
import type {
  AssignExternalResourceToCourseRequest,
  ChangeInstructorProviderRequest,
  ContentStatus,
  CourseExternalResourceDto,
  CreateExternalLearningResourceRequest,
  CreateInstructorRequest,
  CreateLearningProviderRequest,
  ExternalLearningResourceDetailDto,
  ExternalLearningResourceListItemDto,
  InstructorDto,
  LearningProviderDto,
  PagedResult,
  UpdateExternalLearningResourceRequest,
  UpdateInstructorRequest,
  UpdateLearningProviderRequest,
} from '../../../types/api'

export interface AdminGetProvidersParams {
  page?: number
  pageSize?: number
  search?: string
  status?: ContentStatus
}

export interface AdminGetInstructorsParams {
  page?: number
  pageSize?: number
  search?: string
  status?: ContentStatus
}

export interface AdminGetResourcesParams {
  page?: number
  pageSize?: number
  search?: string
  status?: ContentStatus
}

export const adminProvidersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Learning providers ────────────────────────────────────────────────
    adminGetProviders: builder.query<PagedResult<LearningProviderDto>, AdminGetProvidersParams>({
      query: (params) => ({ url: '/api/admin/learning-providers', params }),
      providesTags: ['Provider'],
    }),

    adminGetProvider: builder.query<LearningProviderDto, string>({
      query: (id) => `/api/admin/learning-providers/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Provider', id }],
    }),

    adminCreateProvider: builder.mutation<LearningProviderDto, CreateLearningProviderRequest>({
      query: (body) => ({ url: '/api/admin/learning-providers', method: 'POST', body }),
      invalidatesTags: ['Provider'],
    }),

    adminUpdateProvider: builder.mutation<
      LearningProviderDto,
      { id: string } & UpdateLearningProviderRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/learning-providers/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Provider', id }, 'Provider'],
    }),

    adminPublishProvider: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/learning-providers/${id}/publish`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Provider', id }],
    }),

    adminArchiveProvider: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/learning-providers/${id}/archive`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Provider', id }],
    }),

    // ── Instructors ───────────────────────────────────────────────────────
    adminGetInstructors: builder.query<PagedResult<InstructorDto>, AdminGetInstructorsParams>({
      query: (params) => ({ url: '/api/admin/instructors', params }),
      providesTags: ['Instructor'],
    }),

    adminGetInstructor: builder.query<InstructorDto, string>({
      query: (id) => `/api/admin/instructors/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Instructor', id }],
    }),

    adminCreateInstructor: builder.mutation<InstructorDto, CreateInstructorRequest>({
      query: (body) => ({ url: '/api/admin/instructors', method: 'POST', body }),
      invalidatesTags: ['Instructor'],
    }),

    adminUpdateInstructor: builder.mutation<
      InstructorDto,
      { id: string } & UpdateInstructorRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/instructors/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Instructor', id }],
    }),

    adminChangeInstructorProvider: builder.mutation<
      InstructorDto,
      { id: string } & ChangeInstructorProviderRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/instructors/${id}/provider`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Instructor', id }, 'Instructor'],
    }),

    adminPublishInstructor: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/instructors/${id}/publish`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Instructor', id }],
    }),

    adminArchiveInstructor: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/instructors/${id}/archive`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Instructor', id }],
    }),

    // ── External learning resources ───────────────────────────────────────
    adminGetExternalResources: builder.query<
      PagedResult<ExternalLearningResourceListItemDto>,
      AdminGetResourcesParams
    >({
      query: (params) => ({ url: '/api/admin/external-learning-resources', params }),
      providesTags: ['ExternalResource'],
    }),

    adminGetExternalResource: builder.query<ExternalLearningResourceDetailDto, string>({
      query: (id) => `/api/admin/external-learning-resources/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'ExternalResource', id }],
    }),

    adminCreateExternalResource: builder.mutation<
      ExternalLearningResourceDetailDto,
      CreateExternalLearningResourceRequest
    >({
      query: (body) => ({
        url: '/api/admin/external-learning-resources',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ExternalResource'],
    }),

    adminUpdateExternalResource: builder.mutation<
      ExternalLearningResourceDetailDto,
      { id: string } & UpdateExternalLearningResourceRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/external-learning-resources/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'ExternalResource', id }],
    }),

    adminPublishExternalResource: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/admin/external-learning-resources/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, id) => [{ type: 'ExternalResource', id }],
    }),

    adminArchiveExternalResource: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/admin/external-learning-resources/${id}/archive`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, id) => [{ type: 'ExternalResource', id }],
    }),

    adminMarkResourceReviewed: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/admin/external-learning-resources/${id}/mark-reviewed`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, id) => [{ type: 'ExternalResource', id }],
    }),

    // ── Course external resource assignments (admin) ───────────────────────
    adminAssignResourceToCourse: builder.mutation<
      CourseExternalResourceDto,
      { courseId: string } & AssignExternalResourceToCourseRequest
    >({
      query: ({ courseId, ...body }) => ({
        url: `/api/admin/courses/${courseId}/external-resources`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ExternalResource'],
    }),
  }),
})

export const {
  useAdminGetProvidersQuery,
  useAdminGetProviderQuery,
  useAdminCreateProviderMutation,
  useAdminUpdateProviderMutation,
  useAdminPublishProviderMutation,
  useAdminArchiveProviderMutation,
  useAdminGetInstructorsQuery,
  useAdminGetInstructorQuery,
  useAdminCreateInstructorMutation,
  useAdminUpdateInstructorMutation,
  useAdminChangeInstructorProviderMutation,
  useAdminPublishInstructorMutation,
  useAdminArchiveInstructorMutation,
  useAdminGetExternalResourcesQuery,
  useAdminGetExternalResourceQuery,
  useAdminCreateExternalResourceMutation,
  useAdminUpdateExternalResourceMutation,
  useAdminPublishExternalResourceMutation,
  useAdminArchiveExternalResourceMutation,
  useAdminMarkResourceReviewedMutation,
  useAdminAssignResourceToCourseMutation,
} = adminProvidersApi
