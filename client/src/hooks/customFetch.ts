import { useCallback } from "react";
import apiPaths from "../api/paths";
import { useUser } from "../context/UserContext";

function useCustomFetch() {
  const { setUser } = useUser();

  return useCallback(async (url: string, options: RequestInit = {}) => {
    const requestOptions: RequestInit = {
      credentials: "include",
      ...options,
    };

    let response = await fetch(url, requestOptions);

    // Try refreshing auth token if the request is unauthorized.
    if (response.status === 401) {
      const refreshResponse = await fetch(apiPaths.refreshToken, {
        method: "POST",
        credentials: "include",
      });

      if (!refreshResponse.ok) {
        setUser(null);
        return response;
      }

      response = await fetch(url, requestOptions);

      if (response.status === 401 || response.status === 403) {
        setUser(null);
      }
    } else if (response.status === 403) {
      setUser(null);
    }

    return response;
  }, [setUser]);
}

export default useCustomFetch;
