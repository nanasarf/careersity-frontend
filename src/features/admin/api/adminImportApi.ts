import { baseApi } from '../../../services/api'
import type {
  CurriculumImportRequest,
  CurriculumImportSummaryDto,
  CurriculumImportValidationDto,
} from '../../../types/api'

export const adminImportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validateCurriculumImport: builder.mutation<
      CurriculumImportValidationDto,
      CurriculumImportRequest
    >({
      query: (body) => ({
        url: '/api/admin/curriculum-imports/validate',
        method: 'POST',
        body,
      }),
    }),

    submitCurriculumImport: builder.mutation<
      CurriculumImportSummaryDto,
      CurriculumImportRequest
    >({
      query: (body) => ({
        url: '/api/admin/curriculum-imports',
        method: 'POST',
        body,
      }),
      // Refresh all catalog caches after a successful import.
      invalidatesTags: ['Career', 'CareerCategory', 'Course', 'Skill', 'Pathway', 'Provider'],
    }),
  }),
})

export const { useValidateCurriculumImportMutation, useSubmitCurriculumImportMutation } =
  adminImportApi
