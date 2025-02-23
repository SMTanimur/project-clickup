import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateToken } from '@/lib/utils/jwt';
import { setCookie, deleteCookie } from 'cookies-next';
import { nanoid } from 'nanoid';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  avatar?: string;
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
}

interface SignupData {
  email: string;
  password: string;
  name: string;
}

const COOKIE_OPTIONS = {
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? 'your-domain.com' : undefined,
};

const setCookieWithOptions = (token: string) => {
  console.log({COOKIE_OPTIONS:token})
  // First try with all options
  try {
    setCookie('clickup_session', token );
  } catch (error) {
    // If that fails, try with minimal options
    console.error('Failed to set cookie with full options:', error);
    try {
      setCookie('clickup_session', token, {
        path: '/',
        sameSite: 'lax',
      });
    } catch (error) {
      console.error('Failed to set cookie with minimal options:', error);
    }
  }
};

export const useUserStore = create<UserState>()(
  persist<UserState>(
    (set, get) => ({
      users: [] as User[],
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
          deleteCookie('clickup_session', COOKIE_OPTIONS);
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
        console.log({ token });
        setCookieWithOptions(token);
      },
      signup: async data => {
        const users = get().users;
        if (users.find(user => user.email === data.email)) {
          throw new Error('User already exists');
        }

        const newUser = {
          id: nanoid(),
          ...data,
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
        console.log({ token });
        setCookieWithOptions(token);
      },
      logout: () => {
        set({ currentUser: null });
        try {
          deleteCookie('clickup_session', COOKIE_OPTIONS);
        } catch (error) {
          console.error('Failed to delete cookie:', error);
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
