import axios from "axios";

export const api = axios.create({
  baseURL: "/api/",
});

// Request Interceptor: Attach the current Access Token to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle token expiration (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't tried to refresh yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

      if (refreshToken && refreshToken !== "null") {
        try {
          // Attempt to refresh the access token
          const { data } = await axios.post("/api/users/token/refresh/", {
            refresh: refreshToken,
          });

          const newAccessToken = data.access;
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", newAccessToken);
          }

          // Update the failed request's header and retry
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear everything and redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);
