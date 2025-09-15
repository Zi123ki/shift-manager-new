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

          // Mock authentication for demo purposes
          if (username === 'zvika' && password === 'Zz321321') {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser: User = {
              id: '1',
              username: 'zvika',
              email: 'admin@example.com',
              role: 'ADMIN',
            };

            const mockCompany: Company = {
              id: '1',
              name: 'Default Company',
              slug: 'default-company',
              theme: {
                primary: '#3b82f6',
                secondary: '#64748b',
              },
            };

            set({ user: mockUser, company: mockCompany, loading: false });
            toast.success('התחברת בהצלחה! 🎉');
            return true;
          }

          // If credentials don't match
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast.error('שם משתמש או סיסמה שגויים');
          set({ loading: false });
          return false;
        } catch (error: any) {
          console.error('Login error:', error);
          toast.error('שגיאה בהתחברות');
          set({ loading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          // Mock logout - no API call needed
          set({ user: null, company: null, loading: false });
          toast.success('התנתקת בהצלחה');
        } catch (error) {
          console.error('Logout error:', error);
          set({ user: null, company: null, loading: false });
        }
      },

      checkAuth: async () => {
        try {
          // Mock auth check - just set loading to false
          // In a real app, this would check for valid session
          set({ loading: false });
        } catch (error) {
          console.error('Auth check error:', error);
          set({ user: null, company: null, loading: false });
        }
      },

      changePassword: async (currentPassword: string, _newPassword: string) => {
        try {
          // Mock password change
          if (currentPassword === 'Zz321321') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('הסיסמה שונתה בהצלחה');
            return true;
          }

          toast.error('הסיסמה הנוכחית שגויה');
          return false;
        } catch (error: any) {
          console.error('Change password error:', error);
          toast.error('שגיאה בשינוי סיסמה');
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