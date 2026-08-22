import { baseApi } from '../../../services/api'
import type {
  AuthenticationResultDto,
  ChangeMyPasswordRequest,
  LoginRequest,
  LogoutRequest,
  RefreshAccessTokenRequest,
  RegisterRequest,
  UpdateMyProfileRequest,
  UserProfileDto,
} from '../../../types/api'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthenticationResultDto, RegisterRequest>({
      query: (body) => ({ url: '/api/auth/register', method: 'POST', body }),
    }),
    login: builder.mutation<AuthenticationResultDto, LoginRequest>({
      query: (body) => ({ url: '/api/auth/login', method: 'POST', body }),
    }),
    logout: builder.mutation<void, LogoutRequest>({
      query: (body) => ({ url: '/api/auth/logout', method: 'POST', body }),
      invalidatesTags: ['Profile', 'Enrollment'],
    }),
    refresh: builder.mutation<AuthenticationResultDto, RefreshAccessTokenRequest>({
      query: (body) => ({ url: '/api/auth/refresh', method: 'POST', body }),
    }),
    revokeAll: builder.mutation<void, void>({
      query: () => ({ url: '/api/auth/revoke-all', method: 'POST' }),
    }),
    changePassword: builder.mutation<AuthenticationResultDto, ChangeMyPasswordRequest>({
      query: (body) => ({ url: '/api/auth/change-password', method: 'POST', body }),
    }),
    getProfile: builder.query<UserProfileDto, void>({
      query: () => '/api/users/me',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<UserProfileDto, UpdateMyProfileRequest>({
      query: (body) => ({ url: '/api/users/me', method: 'PUT', body }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useRevokeAllMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi
