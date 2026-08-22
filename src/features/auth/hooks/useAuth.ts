import { useAppSelector } from '../../../hooks/useAppSelector'

export function useAuth() {
  const user = useAppSelector((state) => state.auth.user)
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const refreshToken = useAppSelector((state) => state.auth.refreshToken)
  const sessionRestored = useAppSelector((state) => state.auth.sessionRestored)

  return {
    user,
    sessionRestored,
    isAuthenticated: !!accessToken || !!refreshToken,
    isAdmin: user?.role === 'Administrator',
    isLearner: user?.role === 'Learner',
  }
}
