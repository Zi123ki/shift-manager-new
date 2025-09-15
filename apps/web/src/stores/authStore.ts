import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  theme?: any;
}

interface AuthState {
  user: User | null;
  company: Company | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      company: null,
      loading: true,

      login: async (username: string, password: string) => {
        try {
          set({ loading: true });

          const response = await axios.post('/auth/login', {
            username,
            password,
          });

          if (response.data.success) {
            const { user, company } = response.data.data;
            set({ user, company, loading: false });
            toast.success('התחברת בהצלחה!');
            return true;
          }

          toast.error(response.data.error || 'שגיאה בהתחברות');
          set({ loading: false });
          return false;
        } catch (error: any) {
          console.error('Login error:', error);
          const errorMessage = error.response?.data?.error || 'שגיאה בהתחברות';
          toast.error(errorMessage);
          set({ loading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          await axios.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ user: null, company: null, loading: false });
          toast.success('התנתקת בהצלחה');
        }
      },

      checkAuth: async () => {
        try {
          const response = await axios.get('/auth/me');

          if (response.data.success) {
            const { user, company } = response.data.data;
            set({ user, company, loading: false });
          } else {
            set({ user: null, company: null, loading: false });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({ user: null, company: null, loading: false });
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          const response = await axios.post('/auth/change-password', {
            currentPassword,
            newPassword,
          });

          if (response.data.success) {
            toast.success('הסיסמה שונתה בהצלחה');
            return true;
          }

          toast.error(response.data.error || 'שגיאה בשינוי סיסמה');
          return false;
        } catch (error: any) {
          console.error('Change password error:', error);
          const errorMessage = error.response?.data?.error || 'שגיאה בשינוי סיסמה';
          toast.error(errorMessage);
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        company: state.company,
      }),
    }
  )
);