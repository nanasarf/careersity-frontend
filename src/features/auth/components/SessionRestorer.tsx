import { useEffect, useRef } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useRefreshMutation } from "../api/authApi";
import { authSlice } from "../authSlice";

/**
 * Runs once on mount. If a stored refresh token exists but there is no access
 * token in memory (e.g. page reload), attempts a silent refresh to restore the
 * session. Marks sessionRestored=true on completion regardless of outcome.
 */
export default function SessionRestorer() {
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [refresh] = useRefreshMutation();
  const attempted = useRef(false);

  useEffect(() => {
    // Already have a live access token or nothing to restore
    if (!refreshToken || accessToken) {
      dispatch(authSlice.actions.setSessionRestored());
      return;
    }

    if (attempted.current) return;
    attempted.current = true;

    refresh({ refreshToken })
      .unwrap()
      .then((result) => {
        dispatch(
          authSlice.actions.setTokens({
            user: result.user,
            accessToken: result.accessToken,
            accessTokenExpiresAtUtc: result.accessTokenExpiresAtUtc,
            refreshToken: result.refreshToken,
            refreshTokenExpiresAtUtc: result.refreshTokenExpiresAtUtc,
          }),
        );
      })
      .catch(() => {
        dispatch(authSlice.actions.clearSession());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
