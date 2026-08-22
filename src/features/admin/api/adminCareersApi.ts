import { baseApi } from '../../../services/api'
import type {
  AssignCareerSkillRequest,
  CareerCategoryDto,
  CareerDetailDto,
  CareerListItemDto,
  CareerPathwayDto,
  CareerSkillDto,
  ChangeCareerCategoryRequest,
  ContentStatus,
  CreateCareerCategoryRequest,
  CreateCareerPathwayRequest,
  CreateCareerRequest,
  AddPathwayLevelCourseRequest,
  AddPathwayLevelRequest,
  PagedResult,
  PathwayLevelCourseDto,
  PathwayLevelDto,
  ReorderPathwayCoursesRequest,
  ReorderPathwayLevelsRequest,
  UpdateCareerCategoryRequest,
  UpdateCareerPathwayRequest,
  UpdateCareerRequest,
  UpdateCareerSkillRequest,
  UpdatePathwayLevelCourseRequest,
  UpdatePathwayLevelRequest,
} from '../../../types/api'

export interface AdminGetCareersParams {
  page?: number
  pageSize?: number
  search?: string
  categoryId?: string
  status?: ContentStatus
}

export const adminCareersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Career categories ───────────────────────────────────────────────────
    adminGetCareerCategories: builder.query<CareerCategoryDto[], void>({
      query: () => '/api/admin/career-categories',
      providesTags: ['CareerCategory'],
    }),

    adminGetCareerCategory: builder.query<CareerCategoryDto, string>({
      query: (id) => `/api/admin/career-categories/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'CareerCategory', id }],
    }),

    adminCreateCareerCategory: builder.mutation<
      CareerCategoryDto,
      CreateCareerCategoryRequest
    >({
      query: (body) => ({
        url: '/api/admin/career-categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CareerCategory'],
    }),

    adminUpdateCareerCategory: builder.mutation<
      CareerCategoryDto,
      { id: string } & UpdateCareerCategoryRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/career-categories/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'CareerCategory', id }, 'CareerCategory'],
    }),

    adminPublishCareerCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/admin/career-categories/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, id) => [{ type: 'CareerCategory', id }, 'CareerCategory'],
    }),

    adminArchiveCareerCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/admin/career-categories/${id}/archive`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, id) => [{ type: 'CareerCategory', id }, 'CareerCategory'],
    }),

    // ── Careers ─────────────────────────────────────────────────────────────
    adminGetCareers: builder.query<PagedResult<CareerListItemDto>, AdminGetCareersParams>({
      query: (params) => ({ url: '/api/admin/careers', params }),
      providesTags: ['Career'],
    }),

    adminGetCareer: builder.query<CareerDetailDto, string>({
      query: (id) => `/api/admin/careers/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Career', id }],
    }),

    adminCreateCareer: builder.mutation<CareerDetailDto, CreateCareerRequest>({
      query: (body) => ({ url: '/api/admin/careers', method: 'POST', body }),
      invalidatesTags: ['Career'],
    }),

    adminUpdateCareer: builder.mutation<
      CareerDetailDto,
      { id: string } & UpdateCareerRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/careers/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Career', id }, 'Career'],
    }),

    adminChangeCareerCategory: builder.mutation<
      void,
      { id: string } & ChangeCareerCategoryRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/careers/${id}/category`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Career', id }],
    }),

    adminPublishCareer: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/careers/${id}/publish`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Career', id }, 'Career'],
    }),

    adminArchiveCareer: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/admin/careers/${id}/archive`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Career', id }, 'Career'],
    }),

    // ── Career skills ────────────────────────────────────────────────────────
    adminGetCareerSkills: builder.query<CareerSkillDto[], string>({
      query: (careerId) => `/api/admin/careers/${careerId}/skills`,
      providesTags: (_r, _e, careerId) => [{ type: 'Career', id: `skills-${careerId}` }],
    }),

    adminAssignCareerSkill: builder.mutation<
      CareerSkillDto,
      { careerId: string } & AssignCareerSkillRequest
    >({
      query: ({ careerId, ...body }) => ({
        url: `/api/admin/careers/${careerId}/skills`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { careerId }) => [{ type: 'Career', id: careerId }, { type: 'Career', id: `skills-${careerId}` }],
    }),

    adminUpdateCareerSkill: builder.mutation<
      CareerSkillDto,
      { careerId: string; careerSkillId: string } & UpdateCareerSkillRequest
    >({
      query: ({ careerId, careerSkillId, ...body }) => ({
        url: `/api/admin/careers/${careerId}/skills/${careerSkillId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { careerId }) => [{ type: 'Career', id: careerId }, { type: 'Career', id: `skills-${careerId}` }],
    }),

    adminDeleteCareerSkill: builder.mutation<
      void,
      { careerId: string; careerSkillId: string }
    >({
      query: ({ careerId, careerSkillId }) => ({
        url: `/api/admin/careers/${careerId}/skills/${careerSkillId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { careerId }) => [{ type: 'Career', id: careerId }, { type: 'Career', id: `skills-${careerId}` }],
    }),

    // ── Career pathways ──────────────────────────────────────────────────────
    adminGetCareerPathways: builder.query<CareerPathwayDto[], string>({
      query: (careerId) => `/api/admin/careers/${careerId}/pathways`,
      providesTags: ['Pathway'],
    }),

    adminGetCareerPathway: builder.query<
      CareerPathwayDto,
      { careerId: string; pathwayId: string }
    >({
      query: ({ careerId, pathwayId }) =>
        `/api/admin/careers/${careerId}/pathways/${pathwayId}`,
      providesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),

    adminCreateCareerPathway: builder.mutation<
      CareerPathwayDto,
      { careerId: string } & CreateCareerPathwayRequest
    >({
      query: ({ careerId, ...body }) => ({
        url: `/api/admin/careers/${careerId}/pathways`,
        method: 'POST',
        body: { careerId, ...body },
      }),
      invalidatesTags: ['Pathway'],
    }),

    adminUpdateCareerPathway: builder.mutation<
      CareerPathwayDto,
      { careerId: string; pathwayId: string } & UpdateCareerPathwayRequest
    >({
      query: ({ careerId, pathwayId, ...body }) => ({
        url: `/api/admin/careers/${careerId}/pathways/${pathwayId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),

    adminPublishCareerPathway: builder.mutation<
      void,
      { careerId: string; pathwayId: string }
    >({
      query: ({ careerId, pathwayId }) => ({
        url: `/api/admin/careers/${careerId}/pathways/${pathwayId}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),

    adminArchiveCareerPathway: builder.mutation<
      void,
      { careerId: string; pathwayId: string }
    >({
      query: ({ careerId, pathwayId }) => ({
        url: `/api/admin/careers/${careerId}/pathways/${pathwayId}/archive`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),

    // ── Pathway levels ───────────────────────────────────────────────────────
    adminAddPathwayLevel: builder.mutation<
      PathwayLevelDto,
      { careerId: string; pathwayId: string } & AddPathwayLevelRequest
    >({
      query: ({ careerId, pathwayId, ...body }) => ({
        url: `/api/admin/careers/${careerId}/pathways/${pathwayId}/levels`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),

    adminUpdatePathwayLevel: builder.mutation<
      PathwayLevelDto,
      { careerId: string; pathwayId: string; levelId: string } & UpdatePathwayLevelRequest
    >({
      query: ({ careerId, pathwayId, levelId, ...body }) => ({
        url: `/api/admin/careers/${careerId}/pathways/${pathwayId}/levels/${levelId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),

    adminDeletePathwayLevel: builder.mutation<
      void,
      { careerId: string; pathwayId: string; levelId: string }
    >({
      query: ({ careerId, pathwayId, levelId }) => ({
        url: `/api/admin/careers/${careerId}/pathways/${pathwayId}/levels/${levelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),

    adminReorderPathwayLevels: builder.mutation<
      void,
      { careerId: string; pathwayId: string } & ReorderPathwayLevelsRequest
    >({
      query: ({ careerId, pathwayId, ...body }) => ({
        url: `/api/admin/careers/${careerId}/pathways/${pathwayId}/levels/reorder`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),

    // ── Pathway level courses ────────────────────────────────────────────────
    adminAddPathwayLevelCourse: builder.mutation<
      PathwayLevelCourseDto,
      { careerId: string; pathwayId: string; levelId: string } & AddPathwayLevelCourseRequest
    >({
      query: ({ careerId, pathwayId, levelId, ...body }) => ({
        url: `/api/admin/careers/${careerId}/pathways/${pathwayId}/levels/${levelId}/courses`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),

    adminUpdatePathwayLevelCourse: builder.mutation<
      PathwayLevelCourseDto,
      {
        careerId: string
        pathwayId: string
        levelId: string
        assignmentId: string
      } & UpdatePathwayLevelCourseRequest
    >({
      query: ({ careerId, pathwayId, levelId, assignmentId, ...body }) => ({
        url: `/api/admin/careers/${careerId}/pathways/${pathwayId}/levels/${levelId}/courses/${assignmentId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),

    adminDeletePathwayLevelCourse: builder.mutation<
      void,
      { careerId: string; pathwayId: string; levelId: string; assignmentId: string }
    >({
      query: ({ careerId, pathwayId, levelId, assignmentId }) => ({
        url: `/api/admin/careers/${careerId}/pathways/${pathwayId}/levels/${levelId}/courses/${assignmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),

    adminReorderPathwayLevelCourses: builder.mutation<
      void,
      {
        careerId: string
        pathwayId: string
        levelId: string
      } & ReorderPathwayCoursesRequest
    >({
      query: ({ careerId, pathwayId, levelId, ...body }) => ({
        url: `/api/admin/careers/${careerId}/pathways/${pathwayId}/levels/${levelId}/courses/reorder`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { pathwayId }) => [{ type: 'Pathway', id: pathwayId }],
    }),
  }),
})

export const {
  useAdminGetCareerCategoriesQuery,
  useAdminGetCareerCategoryQuery,
  useAdminCreateCareerCategoryMutation,
  useAdminUpdateCareerCategoryMutation,
  useAdminPublishCareerCategoryMutation,
  useAdminArchiveCareerCategoryMutation,
  useAdminGetCareersQuery,
  useAdminGetCareerQuery,
  useAdminCreateCareerMutation,
  useAdminUpdateCareerMutation,
  useAdminChangeCareerCategoryMutation,
  useAdminPublishCareerMutation,
  useAdminArchiveCareerMutation,
  useAdminGetCareerSkillsQuery,
  useAdminAssignCareerSkillMutation,
  useAdminUpdateCareerSkillMutation,
  useAdminDeleteCareerSkillMutation,
  useAdminGetCareerPathwaysQuery,
  useAdminGetCareerPathwayQuery,
  useAdminCreateCareerPathwayMutation,
  useAdminUpdateCareerPathwayMutation,
  useAdminPublishCareerPathwayMutation,
  useAdminArchiveCareerPathwayMutation,
  useAdminAddPathwayLevelMutation,
  useAdminUpdatePathwayLevelMutation,
  useAdminDeletePathwayLevelMutation,
  useAdminReorderPathwayLevelsMutation,
  useAdminAddPathwayLevelCourseMutation,
  useAdminUpdatePathwayLevelCourseMutation,
  useAdminDeletePathwayLevelCourseMutation,
  useAdminReorderPathwayLevelCoursesMutation,
} = adminCareersApi
