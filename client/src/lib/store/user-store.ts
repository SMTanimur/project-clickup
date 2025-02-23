import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateToken } from '@/lib/utils/jwt';
import { setCookie, deleteCookie} from 'cookies-next';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserState {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  clearCurrentUser: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      currentUser: null,
      setCurrentUser: user => {
        set({ currentUser: user });
        const token = generateToken({
          userId: user.id,
          email: user.email,
          name: user.name,
        });
        setCookie('clickup_session', token, COOKIE_OPTIONS);
      },
      clearCurrentUser: () => {
        set({ currentUser: null });
        deleteCookie('clickup_session', COOKIE_OPTIONS);
      },
      login: async (email, password) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) throw new Error('Login failed');

          const user = await response.json();
          set({ currentUser: user });

          const token = generateToken({
            userId: user.id,
            email: user.email,
            name: user.name,
          });
          setCookie('clickup_session', token, COOKIE_OPTIONS);
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      signup: async data => {
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (!response.ok) throw new Error('Signup failed');

          const user = await response.json();
          set({ currentUser: user });

          const token = generateToken({
            userId: user.id,
            email: user.email,
            name: user.name,
          });
          setCookie('clickup_session', token, COOKIE_OPTIONS);
        } catch (error) {
          console.error('Signup error:', error);
          throw error;
        }
      },
      logout: () => {
        set({ currentUser: null });
        deleteCookie('clickup_session', COOKIE_OPTIONS);
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
