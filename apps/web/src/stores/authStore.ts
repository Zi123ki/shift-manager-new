import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  validatePassword,
  loginRateLimiter,
  auditLogger,
  sanitizeInput
} from '../utils/security';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
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
  loginWithoutMfa: (user: User, company: Company) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateCompany: (company: Partial<Company>) => void;
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

          // Sanitize inputs
          const cleanUsername = sanitizeInput(username);
          const cleanPassword = sanitizeInput(password);

          // Rate limiting check
          const userIdentifier = cleanUsername || 'unknown';
          if (!loginRateLimiter.isAllowed(userIdentifier)) {
            const timeUntilReset = Math.ceil(loginRateLimiter.getTimeUntilReset(userIdentifier) / 1000 / 60);
            auditLogger.log({
              userId: userIdentifier,
              action: 'LOGIN_BLOCKED',
              resource: 'auth',
              success: false,
              details: { reason: 'rate_limit_exceeded' }
            });
            toast.error(`נחסמת זמנית בגלל ניסיונות כניסה מרובים. נסה שוב בעוד ${timeUntilReset} דקות`);
            set({ loading: false });
            return false;
          }

          // Mock authentication for demo purposes - Multi-tenant support
          const mockUsers = [
            {
              username: 'superadmin',
              password: 'SuperAdmin123!',
              user: {
                id: '0',
                username: 'superadmin',
                email: 'admin@shift-manager-system.com',
                role: 'SUPER_ADMIN' as const,
              },
              company: {
                id: 'system',
                name: 'Shift Manager - מערכת ניהול',
                slug: 'system',
                theme: {
                  primary: '#dc2626',
                  secondary: '#7c2d12',
                },
              },
            },
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
                name: 'מערכת ניהול משמרות',
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
          const matchedUser = mockUsers.find(u => u.username === cleanUsername && u.password === cleanPassword);

          if (matchedUser) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reset rate limiter on successful login
            loginRateLimiter.reset(userIdentifier);

            // Log successful login
            auditLogger.log({
              userId: matchedUser.user.id,
              action: 'LOGIN',
              resource: 'auth',
              success: true,
              details: {
                username: cleanUsername,
                role: matchedUser.user.role,
                company: matchedUser.company.name
              }
            });

            set({ user: matchedUser.user, company: matchedUser.company, loading: false });
            toast.success(`ברוך הבא ${matchedUser.company.name}! 🎉`);
            return true;
          }

          // If credentials don't match
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Log failed login attempt
          auditLogger.log({
            userId: userIdentifier,
            action: 'LOGIN',
            resource: 'auth',
            success: false,
            details: {
              username: cleanUsername,
              reason: 'invalid_credentials'
            }
          });

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

      loginWithoutMfa: (user: User, company: Company) => {
        // Direct login without MFA verification - used after successful MFA
        set({ user, company, loading: false });
        toast.success(`ברוך הבא ${company.name}! 🎉`);
      },

      logout: async () => {
        try {
          const currentUser = useAuthStore.getState().user;

          // Log logout event
          if (currentUser) {
            auditLogger.log({
              userId: currentUser.id,
              action: 'LOGOUT',
              resource: 'auth',
              success: true,
              details: {
                username: currentUser.username
              }
            });
          }

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

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          const currentUser = useAuthStore.getState().user;
          if (!currentUser) {
            toast.error('משתמש לא מחובר');
            return false;
          }

          // Validate new password strength
          const passwordValidation = validatePassword(newPassword);
          if (!passwordValidation.isValid) {
            toast.error(`סיסמה לא תקינה: ${passwordValidation.errors.join(', ')}`);
            return false;
          }

          if (passwordValidation.strength === 'weak') {
            toast.error('הסיסמה חלשה מדי - אנא בחר סיסמה חזקה יותר');
            return false;
          }

          // Mock password change
          if (currentPassword === 'Zz321321') {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Log password change
            auditLogger.log({
              userId: currentUser.id,
              action: 'PASSWORD_CHANGE',
              resource: 'auth',
              success: true,
              details: {
                username: currentUser.username,
                passwordStrength: passwordValidation.strength
              }
            });

            toast.success('הסיסמה שונתה בהצלחה');
            return true;
          }

          // Log failed password change
          auditLogger.log({
            userId: currentUser.id,
            action: 'PASSWORD_CHANGE',
            resource: 'auth',
            success: false,
            details: {
              username: currentUser.username,
              reason: 'invalid_current_password'
            }
          });

          toast.error('הסיסמה הנוכחית שגויה');
          return false;
        } catch (error: any) {
          console.error('Change password error:', error);
          toast.error('שגיאה בשינוי סיסמה');
          return false;
        }
      },

      updateCompany: (companyUpdates: Partial<Company>) => {
        set((state) => ({
          company: state.company ? { ...state.company, ...companyUpdates } : null
        }));
        toast.success('פרטי החברה עודכנו בהצלחה');
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