import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: (token, user) => {
    if (typeof window !== 'undefined') localStorage.setItem('token', token);
    set({ token, user });
  },
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
