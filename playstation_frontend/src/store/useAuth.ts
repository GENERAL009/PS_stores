import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  login: (accessToken: string, refreshToken: string, user: any) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuth = create<AuthState>((set) => ({
  accessToken: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  user: null, // Initially null, will be populated by profile fetch
  login: (accessToken, refreshToken, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
    set({ accessToken, refreshToken, user });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    set({ accessToken: null, refreshToken: null, user: null });
  },
  setAccessToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
    set({ accessToken: token });
  },
}));
