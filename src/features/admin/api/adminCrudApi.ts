import { baseApi } from '../../../services/api'
import type { ContentStatus, PagedResult } from '../../../types/api'

export interface AdminRow { id: string; status: ContentStatus; [key: string]: unknown }
export interface CatalogArgs { resource: string; page: number; pageSize: number; search?: string; status?: ContentStatus; category?: string; categoryId?: string; difficulty?: string; courseId?: string; skillId?: string; submissionType?: string }
const paths: Record<string, string> = {
  skills: 'skills', providers: 'learning-providers', instructors: 'instructors',
  'external-resources': 'external-learning-resources', courses: 'courses',
  'career-categories': 'career-categories', careers: 'careers', assessments: 'assessments', projects: 'projects',
}
const tagFor = (resource: string) => resource === 'skills' ? 'Skill' as const : resource === 'courses' ? 'Course' as const : resource === 'careers' ? 'Career' as const : resource === 'career-categories' ? 'CareerCategory' as const : resource === 'providers' ? 'Provider' as const : resource === 'instructors' ? 'Instructor' as const : resource === 'external-resources' ? 'ExternalResource' as const : resource === 'assessments' ? 'Assessment' as const : 'Project' as const

export const adminCrudApi = baseApi.injectEndpoints({ endpoints: builder => ({
  adminCatalog: builder.query<PagedResult<AdminRow>, CatalogArgs>({
    query: ({ resource, ...params }) => ({ url: `/api/admin/${paths[resource]}`, params }),
    transformResponse: (response: PagedResult<AdminRow> | AdminRow[]) => Array.isArray(response) ? { items: response, page: 1, pageSize: response.length, totalCount: response.length } : response,
    providesTags: (_r, _e, { resource }) => [tagFor(resource)],
  }),
  adminCatalogItem: builder.query<AdminRow, { resource: string; id: string }>({ query: ({ resource, id }) => `/api/admin/${paths[resource]}/${id}`, providesTags: (_r, _e, { resource, id }) => [{ type: tagFor(resource), id }] }),
  adminCreateCatalogItem: builder.mutation<AdminRow, { resource: string; body: Record<string, unknown> }>({
    query: ({ resource, body }) => ({ url: `/api/admin/${paths[resource]}`, method: 'POST', body }), invalidatesTags: ['Skill','Course','Career','CareerCategory','Provider','Instructor','ExternalResource','Assessment','Project'],
  }),
  adminUpdateCatalogItem: builder.mutation<AdminRow, { resource: string; id: string; body: Record<string, unknown> }>({
    query: ({ resource, id, body }) => ({ url: `/api/admin/${paths[resource]}/${id}`, method: 'PUT', body }), invalidatesTags: ['Skill','Course','Career','CareerCategory','Provider','Instructor','ExternalResource','Assessment','Project'],
  }),
  adminCatalogStatus: builder.mutation<void, { resource: string; id: string; action: 'publish' | 'archive' | 'mark-reviewed' }>({
    query: ({ resource, id, action }) => ({ url: `/api/admin/${paths[resource]}/${id}/${action}`, method: 'POST' }), invalidatesTags: ['Skill','Course','Career','CareerCategory','Provider','Instructor','ExternalResource','Assessment','Project'],
  }),
}) })

export const { useAdminCatalogQuery, useAdminCatalogItemQuery, useAdminCreateCatalogItemMutation, useAdminUpdateCatalogItemMutation, useAdminCatalogStatusMutation } = adminCrudApi
