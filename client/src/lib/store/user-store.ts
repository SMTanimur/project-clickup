import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateToken } from '@/lib/utils/jwt';
import { setCookie, deleteCookie } from 'cookies-next';
import { nanoid } from 'nanoid';

export interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  password: string;
  avatar?: string;
  phoneNumber?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  timezone: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  clearCurrentUser: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  displayName?: string;
  phoneNumber?: string;
  language?: string;
  timezone?: string;
}

const COOKIE_OPTIONS = {
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? 'your-domain.com' : undefined,
};

const setCookieWithOptions = (token: string) => {
  try {
    setCookie('auth_token', token, COOKIE_OPTIONS);
  } catch (error) {
    console.error('Failed to set cookie with full options:', error);
    try {
      setCookie('auth_token', token, {
        path: '/',
        sameSite: 'lax',
      });
    } catch (error) {
      console.error('Failed to set cookie with minimal options:', error);
    }
  }
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      setCurrentUser: user => {
        set({ currentUser: user });
        const token = generateToken({
          userId: user.id,
          email: user.email,
          name: user.name,
        });
        setCookieWithOptions(token);
      },

      clearCurrentUser: () => {
        set({ currentUser: null });
        try {
          deleteCookie('auth_token', COOKIE_OPTIONS);
        } catch (error) {
          console.error('Failed to delete cookie:', error);
        }
      },

      login: async (email, password) => {
        const user = get().users.find(
          user => user.email === email && user.password === password
        );
        if (!user) throw new Error('Invalid credentials');

        set({ currentUser: user });
        const token = generateToken({
          userId: user.id,
          email: user.email,
          name: user.name,
        });
        setCookieWithOptions(token);
      },

      signup: async data => {
        const users = get().users;
        if (users.find(user => user.email === data.email)) {
          throw new Error('User already exists');
        }

        const newUser: User = {
          id: nanoid(),
          email: data.email,
          name: data.name,
          displayName: data.displayName,
          password: data.password,
          phoneNumber: data.phoneNumber,
          status: 'ACTIVE',
          timezone: data.timezone || 'UTC',
          language: data.language || 'en',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser,
        }));

        const token = generateToken({
          userId: newUser.id,
          email: newUser.email,
          name: newUser.name,
        });
        setCookieWithOptions(token);
      },

      logout: () => {
        set({ currentUser: null });
        try {
          deleteCookie('auth_token', COOKIE_OPTIONS);
        } catch (error) {
          console.error('Failed to delete cookie:', error);
        }
      },

      updateProfile: async data => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error('No user logged in');

        const updatedUser = {
          ...currentUser,
          ...data,
          updatedAt: new Date(),
        };

        set(state => ({
          users: state.users.map(u =>
            u.id === currentUser.id ? updatedUser : u
          ),
          currentUser: updatedUser,
        }));
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
