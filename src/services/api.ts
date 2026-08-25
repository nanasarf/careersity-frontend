import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { authSlice } from '../features/auth/authSlice'
import type { AuthenticationResultDto } from '../types/api'
import { normalizeApiError } from '../app/api/apiProblem'
import { attachCorrelationId } from '../app/api/correlationId'
import { isAuthenticationEndpoint, redirectToLogin, requestUrl } from '../app/api/authRefresh'

// Avoid a circular dependency by not importing RootState from store.
// Use a structural type that matches only the slices we need here.
interface ApiAuthState {
  auth: {
    accessToken: string | null
    refreshToken: string | null
  }
}

// Shared promise so concurrent 401 errors coordinate through one refresh call.
let refreshPromise: Promise<string | null> | null = null

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7080'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    attachCorrelationId(headers)
    const token = (getState() as ApiAuthState).auth.accessToken
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)
  const url = requestUrl(args)

  if (result.error?.status === 401 && !isAuthenticationEndpoint(url)) {
    const refreshToken = (api.getState() as ApiAuthState).auth.refreshToken

    // Never attempt to refresh on a 403; that is a role/policy denial.
    if (refreshToken) {
      if (!refreshPromise) {
        refreshPromise = Promise.resolve(
          rawBaseQuery(
            { url: '/api/auth/refresh', method: 'POST', body: { refreshToken } },
            api,
            extraOptions,
          ),
        ).then((refreshResult) => {
            if (refreshResult.data) {
              const data = refreshResult.data as AuthenticationResultDto
              api.dispatch(
                authSlice.actions.setTokens({
                  user: data.user,
                  accessToken: data.accessToken,
                  accessTokenExpiresAtUtc: data.accessTokenExpiresAtUtc,
                  refreshToken: data.refreshToken,
                  refreshTokenExpiresAtUtc: data.refreshTokenExpiresAtUtc,
                }),
              )
              return data.accessToken
            }
            api.dispatch(authSlice.actions.clearSession())
            redirectToLogin()
            return null
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      const newAccessToken = await refreshPromise

      if (newAccessToken) {
        // Retry original request once with the fresh access token.
        const retryArgs: FetchArgs =
          typeof args === 'string'
            ? { url: args, headers: { Authorization: `Bearer ${newAccessToken}` } }
            : {
                ...args,
                headers: {
                  ...(args.headers as Record<string, string> | undefined),
                  Authorization: `Bearer ${newAccessToken}`,
                },
              }
        result = await rawBaseQuery(retryArgs, api, extraOptions)
        if (result.error?.status === 401) {
          api.dispatch(authSlice.actions.clearSession())
          redirectToLogin()
        }
      }
    } else {
      api.dispatch(authSlice.actions.clearSession())
      redirectToLogin()
    }
  }

  if (result.error) result.error = normalizeApiError(result.error)
  else if (api.type === 'mutation') {
    // Admin curriculum relationships cross aggregate boundaries (for example a
    // Course lesson can change one or more Careers). Invalidate active backend
    // readiness queries after successful mutations rather than guessing Career IDs.
    api.dispatch(baseApi.util.invalidateTags(['CareerReadiness']))
  }
  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Career',
    'CareerReadiness',
    'CareerCategory',
    'Course',
    'Skill',
    'Pathway',
    'Lesson',
    'Enrollment',
    'Profile',
    'Provider',
    'Instructor',
    'ExternalResource',
    'Assessment',
    'Project',
    'CourseProgress',
    'LessonProgress',
    'AssessmentProgress',
  ],
  endpoints: () => ({}),
})
