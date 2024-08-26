import { create } from 'zustand';
import { createSession, updateSession, deleteSession } from '../session';
import { verifySession } from '../dal/dal';
import api from '../axios/axiosConfig';

// Définition du type pour notre état d'authentification
interface AuthState {
  username: string | null;
  token: string | null;
  expiresAt: number | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  checkSession: () => Promise<void>;
};

export const useStore = create<AuthState>((set, get) => ({
  username: null,
  token: null,
  expiresAt: null,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/login', { username, password });
      const { user, jwt } = response.data;
      const session = await createSession(user.username, jwt);
      set({
        username: session.username,
        token: session.token,
        expiresAt: session.expiresAt,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.response.data, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    deleteSession();
    set({ username: null, token: null, expiresAt: null });
  },

  refreshToken: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const response = await api.post('/refresh-token', { token });
      const { user, jwt } = response.data;
      const session = await updateSession(user.username, jwt);
      if (session) {
        set({
          token: session.token,
          expiresAt: session.expiresAt,
        });
      }
    } catch (error) {
      get().logout();
    }
  },

  checkSession: async () => {
    try {
      const { username, token, expiresAt } = await verifySession();
      set({ username, token, expiresAt: Number(expiresAt) });
    } catch (error) {
      set({ username: null, token: null, expiresAt: null });
    }
  },
}));

export const getState = useStore.getState;