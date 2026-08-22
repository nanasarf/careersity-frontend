import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthenticatedUserDto } from '../../types/api'

const REFRESH_TOKEN_KEY = 'careersity_rt'

export interface AuthState {
  user: AuthenticatedUserDto | null
  accessToken: string | null
  accessTokenExpiresAtUtc: string | null
  refreshToken: string | null
  refreshTokenExpiresAtUtc: string | null
  /** true once we have attempted session restoration on page load */
  sessionRestored: boolean
}

export interface SetTokensPayload {
  user: AuthenticatedUserDto
  accessToken: string
  accessTokenExpiresAtUtc: string
  refreshToken: string
  refreshTokenExpiresAtUtc: string
}

function loadRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    return null
  }
}

const storedRefreshToken = loadRefreshToken()

const initialState: AuthState = {
  user: null,
  accessToken: null,
  accessTokenExpiresAtUtc: null,
  refreshToken: storedRefreshToken,
  refreshTokenExpiresAtUtc: null,
  // If there is no stored token we have nothing to restore; mark as done.
  sessionRestored: storedRefreshToken === null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, { payload }: PayloadAction<SetTokensPayload>) {
      state.user = payload.user
      state.accessToken = payload.accessToken
      state.accessTokenExpiresAtUtc = payload.accessTokenExpiresAtUtc
      state.refreshToken = payload.refreshToken
      state.refreshTokenExpiresAtUtc = payload.refreshTokenExpiresAtUtc
      state.sessionRestored = true
      try {
        localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken)
      } catch {
        // storage unavailable — continue without persistence
      }
    },
    clearSession(state) {
      state.user = null
      state.accessToken = null
      state.accessTokenExpiresAtUtc = null
      state.refreshToken = null
      state.refreshTokenExpiresAtUtc = null
      state.sessionRestored = true
      try {
        localStorage.removeItem(REFRESH_TOKEN_KEY)
      } catch {
        // storage unavailable
      }
    },
    setSessionRestored(state) {
      state.sessionRestored = true
    },
  },
})
