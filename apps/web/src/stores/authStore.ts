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

          // Mock authentication for demo purposes - Multi-tenant support
          const mockUsers = [
            {
              username: 'zvika',
              password: 'Zz321321',
              user: {
                id: '1',
                username: 'zvika',
                email: 'zvika@techcorp.com',
                role: 'ADMIN' as const,
              },
              company: {
                id: 'techcorp',
                name: 'TechCorp Industries',
                slug: 'techcorp',
                theme: {
                  primary: '#3b82f6',
                  secondary: '#64748b',
                },
              },
            },
            {
              username: 'manager',
              password: 'Manager123',
              user: {
                id: '2',
                username: 'manager',
                email: 'manager@healthplus.com',
                role: 'MANAGER' as const,
              },
              company: {
                id: 'healthplus',
                name: 'HealthPlus Medical Center',
                slug: 'healthplus',
                theme: {
                  primary: '#10b981',
                  secondary: '#6b7280',
                },
              },
            },
            {
              username: 'admin',
              password: 'password',
              user: {
                id: '3',
                username: 'admin',
                email: 'admin@shiftmanager.com',
                role: 'ADMIN' as const,
              },
              company: {
                id: 'shiftmanager',
                name: 'מערכת ניהול משמרות',
                slug: 'shiftmanager',
                theme: {
                  primary: '#3b82f6',
                  secondary: '#6b7280',
                },
              },
            },
          ];

          // Find matching user
          const matchedUser = mockUsers.find(u => u.username === username && u.password === password);

          if (matchedUser) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            set({ user: matchedUser.user, company: matchedUser.company, loading: false });
            toast.success(`ברוך הבא ${matchedUser.company.name}! 🎉`);
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