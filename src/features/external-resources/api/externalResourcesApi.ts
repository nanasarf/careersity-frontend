import { baseApi } from '../../../services/api'
import type {
  ExternalLearningResourceDetailDto,
  ExternalLearningResourceListItemDto,
  InstructorDto,
  LearningProviderDto,
} from '../../../types/api'

export const externalResourcesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLearningProviders: builder.query<LearningProviderDto[], void>({
      query: () => '/api/learning-providers',
      providesTags: ['Provider'],
    }),
    getLearningProviderBySlug: builder.query<LearningProviderDto, string>({
      query: (slug) => `/api/learning-providers/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Provider', id: slug }],
    }),
    getProviderInstructors: builder.query<InstructorDto[], string>({
      query: (providerId) => `/api/learning-providers/${providerId}/instructors`,
      providesTags: ['Instructor'],
    }),
    getExternalLearningResources: builder.query<ExternalLearningResourceListItemDto[], void>({
      query: () => '/api/external-learning-resources',
      providesTags: ['ExternalResource'],
    }),
    getExternalLearningResource: builder.query<ExternalLearningResourceDetailDto, string>({
      query: (resourceId) => `/api/external-learning-resources/${resourceId}`,
      providesTags: (_result, _error, resourceId) => [
        { type: 'ExternalResource', id: resourceId },
      ],
    }),
  }),
})

export const {
  useGetLearningProvidersQuery,
  useGetLearningProviderBySlugQuery,
  useGetProviderInstructorsQuery,
  useGetExternalLearningResourcesQuery,
  useGetExternalLearningResourceQuery,
} = externalResourcesApi
