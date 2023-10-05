import apiPaths from "../api/paths";
import { useUser } from "../context/UserContext";

function useCustomFetch() {
  const { setUser } = useUser();

  async function customFetch(url: string, options: RequestInit) {
    let response = await fetch(url, options);

    // try refreshing auth token if first request fails
    if (response.status === 401) {
      // Unauthorized or Forbidden
      const refreshResponse = await fetch(apiPaths.refreshToken, {
        method: "POST",
        credentials: "include",
      });

      // successful refresh, try original request again
      if (refreshResponse.ok) {
        response = await fetch(url, options);

        // if request failed second time, log out user (redirects to login because of ProtectedRoutes.tsx)
        if (response.status === 401) {
          setUser(null);
        }
      } else {
        // if refresh failed, log out user (redirects to login because of ProtectedRoutes.tsx)
        setUser(null);
      }
    }

    return response;
  }

  return customFetch;
}

export default useCustomFetch;
