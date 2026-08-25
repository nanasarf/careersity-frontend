import { baseApi } from '../../../services/api'
import type {
  CareerCategoryDto,
  CareerDetailDto,
  CareerListItemDto,
  CareerPathwayDto,
  PagedResult,
  SkillCategory,
  SkillDto,
  SkillListItemDto,
} from '../../../types/api'

export interface GetCareersParams {
  page?: number
  pageSize?: number
  search?: string
  categoryId?: string
}

export interface GetSkillsParams {
  page?: number
  pageSize?: number
  search?: string
  category?: SkillCategory
}

export const careersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCareerCategories: builder.query<CareerCategoryDto[], void>({
      query: () => '/api/career-categories',
      providesTags: ['CareerCategory'],
    }),

    getCareers: builder.query<PagedResult<CareerListItemDto>, GetCareersParams>({
      query: (params) => ({ url: '/api/careers', params }),
      providesTags: ['Career'],
    }),

    getCareerBySlug: builder.query<CareerDetailDto, string>({
      query: (slug) => `/api/careers/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Career', id: slug }],
    }),

    getCareerPathway: builder.query<CareerPathwayDto, string>({
      query: (careerId) => `/api/careers/${careerId}/pathway`,
      providesTags: (_result, _error, careerId) => [{ type: 'Pathway', id: careerId }],
    }),

    getSkills: builder.query<PagedResult<SkillListItemDto>, GetSkillsParams>({
      query: (params) => ({ url: '/api/skills', params }),
      providesTags: ['Skill'],
    }),

    getSkillBySlug: builder.query<SkillDto, string>({
      query: (slug) => `/api/skills/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Skill', id: slug }],
    }),
  }),
})

export const {
  useGetCareerCategoriesQuery,
  useGetCareersQuery,
  useGetCareerBySlugQuery,
  useLazyGetCareerBySlugQuery,
  useGetCareerPathwayQuery,
  useGetSkillsQuery,
  useGetSkillBySlugQuery,
} = careersApi
