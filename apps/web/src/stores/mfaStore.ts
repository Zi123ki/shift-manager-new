import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export interface MfaMethod {
  id: string;
  type: 'authenticator' | 'email';
  name: string;
  enabled: boolean;
  isDefault: boolean;
  createdAt: string;
  lastUsed?: string;
  // For authenticator
  secret?: string;
  qrCode?: string;
  // For email
  email?: string;
  verified: boolean;
}

export interface MfaSession {
  id: string;
  userId: string;
  method: 'authenticator' | 'email';
  code: string;
  expiresAt: string;
  verified: boolean;
  attempts: number;
  maxAttempts: number;
}

interface MfaState {
  methods: MfaMethod[];
  sessions: MfaSession[];
  pendingLogin: {
    username: string;
    password: string;
    user: any;
    company: any;
  } | null;
  loading: boolean;

  // Method management
  getMethods: (userId: string) => MfaMethod[];
  addMethod: (userId: string, type: 'authenticator' | 'email', data: any) => Promise<MfaMethod>;
  removeMethod: (userId: string, methodId: string) => Promise<boolean>;
  setDefaultMethod: (userId: string, methodId: string) => Promise<boolean>;
  verifyMethodSetup: (userId: string, methodId: string, code: string) => Promise<boolean>;

  // Authentication flow
  initiateMfa: (username: string, password: string, user: any, company: any) => Promise<MfaSession | null>;
  verifyMfaCode: (sessionId: string, code: string) => Promise<boolean>;
  sendEmailCode: (sessionId: string) => Promise<boolean>;

  // Session management
  getSession: (sessionId: string) => MfaSession | null;
  cleanupExpiredSessions: () => void;

  // Authenticator helpers
  generateSecret: () => string;
  generateQrCode: (secret: string, userEmail: string, issuer: string) => string;
  verifyTotpCode: (secret: string, code: string) => boolean;
}

// TOTP implementation for authenticator app
function generateRandomSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateTotpCode(secret: string): string {
  // This is a simplified TOTP implementation for demo purposes
  // In production, use a proper TOTP library like 'otpauth'
  const timeStep = Math.floor(Date.now() / 1000 / 30);
  const hash = simpleHash(secret + timeStep.toString());
  return (hash % 1000000).toString().padStart(6, '0');
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function verifyTotpCode(secret: string, inputCode: string): boolean {
  const currentTime = Math.floor(Date.now() / 1000 / 30);

  // Check current time step and ±1 for clock skew tolerance
  for (let i = -1; i <= 1; i++) {
    const timeStep = currentTime + i;
    const hash = simpleHash(secret + timeStep.toString());
    const expectedCode = (hash % 1000000).toString().padStart(6, '0');
    if (expectedCode === inputCode) {
      return true;
    }
  }
  return false;
}

export const useMfaStore = create<MfaState>()(
  persist(
    (set, get) => ({
      methods: [],
      sessions: [],
      pendingLogin: null,
      loading: false,

      getMethods: (userId: string) => {
        return get().methods.filter(method => method.id.startsWith(userId));
      },

      addMethod: async (userId: string, type: 'authenticator' | 'email', data: any) => {
        set({ loading: true });

        try {
          let newMethod: MfaMethod;

          if (type === 'authenticator') {
            const secret = generateRandomSecret();
            const qrCode = `otpauth://totp/ShiftManager:${data.email}?secret=${secret}&issuer=ShiftManager`;

            newMethod = {
              id: `${userId}_${type}_${Date.now()}`,
              type: 'authenticator',
              name: 'Authenticator App',
              enabled: false, // Will be enabled after verification
              isDefault: get().methods.filter(m => m.id.startsWith(userId)).length === 0,
              createdAt: new Date().toISOString(),
              secret,
              qrCode,
              verified: false,
            };
          } else {
            newMethod = {
              id: `${userId}_${type}_${Date.now()}`,
              type: 'email',
              name: `Email: ${data.email}`,
              enabled: false, // Will be enabled after verification
              isDefault: get().methods.filter(m => m.id.startsWith(userId)).length === 0,
              createdAt: new Date().toISOString(),
              email: data.email,
              verified: false,
            };
          }

          set(state => ({
            methods: [...state.methods, newMethod],
            loading: false
          }));

          toast.success(`שיטת ${type === 'authenticator' ? 'אפליקציית אימות' : 'אימייל'} נוספה בהצלחה`);
          return newMethod;
        } catch (error) {
          console.error('Error adding MFA method:', error);
          toast.error('שגיאה בהוספת שיטת אימות');
          set({ loading: false });
          throw error;
        }
      },

      removeMethod: async (userId: string, methodId: string) => {
        try {
          const method = get().methods.find(m => m.id === methodId);
          if (!method || !method.id.startsWith(userId)) {
            toast.error('שיטת אימות לא נמצאה');
            return false;
          }

          set(state => ({
            methods: state.methods.filter(m => m.id !== methodId)
          }));

          toast.success('שיטת האימות הוסרה בהצלחה');
          return true;
        } catch (error) {
          console.error('Error removing MFA method:', error);
          toast.error('שגיאה בהסרת שיטת אימות');
          return false;
        }
      },

      setDefaultMethod: async (userId: string, methodId: string) => {
        try {
          const method = get().methods.find(m => m.id === methodId);
          if (!method || !method.id.startsWith(userId) || !method.verified) {
            toast.error('שיטת אימות לא תקינה');
            return false;
          }

          set(state => ({
            methods: state.methods.map(m => ({
              ...m,
              isDefault: m.id.startsWith(userId) ? m.id === methodId : m.isDefault
            }))
          }));

          toast.success('שיטת האימות הראשית עודכנה');
          return true;
        } catch (error) {
          console.error('Error setting default MFA method:', error);
          toast.error('שגיאה בעדכון שיטת אימות ראשית');
          return false;
        }
      },

      verifyMethodSetup: async (userId: string, methodId: string, code: string) => {
        try {
          const method = get().methods.find(m => m.id === methodId);
          if (!method || !method.id.startsWith(userId)) {
            toast.error('שיטת אימות לא נמצאה');
            return false;
          }

          let isValid = false;

          if (method.type === 'authenticator' && method.secret) {
            isValid = verifyTotpCode(method.secret, code);
          } else if (method.type === 'email') {
            // For demo purposes, accept any 6-digit code for email verification
            isValid = /^\d{6}$/.test(code);
          }

          if (isValid) {
            set(state => ({
              methods: state.methods.map(m =>
                m.id === methodId ? { ...m, verified: true, enabled: true } : m
              )
            }));

            toast.success('שיטת האימות אומתה בהצלחה');
            return true;
          } else {
            toast.error('קוד אימות שגוי');
            return false;
          }
        } catch (error) {
          console.error('Error verifying MFA method setup:', error);
          toast.error('שגיאה באימות השיטה');
          return false;
        }
      },

      initiateMfa: async (username: string, password: string, user: any, company: any) => {
        try {
          const userMethods = get().getMethods(user.id).filter(m => m.enabled && m.verified);

          if (userMethods.length === 0) {
            // No MFA methods configured, proceed with login
            return null;
          }

          // Use default method or first available method
          const method = userMethods.find(m => m.isDefault) || userMethods[0];

          const session: MfaSession = {
            id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: user.id,
            method: method.type,
            code: method.type === 'email' ? Math.floor(100000 + Math.random() * 900000).toString() : '',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
            verified: false,
            attempts: 0,
            maxAttempts: 3,
          };

          set(state => ({
            sessions: [...state.sessions, session],
            pendingLogin: { username, password, user, company }
          }));

          if (method.type === 'email') {
            // Simulate sending email
            toast.success(`קוד אימות נשלח לאימייל ${method.email}`);
          }

          return session;
        } catch (error) {
          console.error('Error initiating MFA:', error);
          toast.error('שגיאה ביצירת אימות דו-שלבי');
          return null;
        }
      },

      verifyMfaCode: async (sessionId: string, code: string) => {
        try {
          const session = get().sessions.find(s => s.id === sessionId);
          if (!session) {
            toast.error('מושב אימות לא נמצא');
            return false;
          }

          if (new Date() > new Date(session.expiresAt)) {
            toast.error('מושב האימות פג תוקף');
            return false;
          }

          if (session.attempts >= session.maxAttempts) {
            toast.error('חריגה ממספר הניסיונות המותר');
            return false;
          }

          // Increment attempts
          set(state => ({
            sessions: state.sessions.map(s =>
              s.id === sessionId ? { ...s, attempts: s.attempts + 1 } : s
            )
          }));

          let isValid = false;

          if (session.method === 'authenticator') {
            // Find the authenticator method for this user
            const userMethods = get().getMethods(session.userId);
            const authMethod = userMethods.find(m => m.type === 'authenticator' && m.enabled);
            if (authMethod && authMethod.secret) {
              isValid = verifyTotpCode(authMethod.secret, code);
            }
          } else if (session.method === 'email') {
            // For demo purposes, accept the generated code or any 6-digit code
            isValid = code === session.code || /^\d{6}$/.test(code);
          }

          if (isValid) {
            set(state => ({
              sessions: state.sessions.map(s =>
                s.id === sessionId ? { ...s, verified: true } : s
              )
            }));

            // Update last used time for the method
            const userMethods = get().getMethods(session.userId);
            const usedMethod = userMethods.find(m => m.type === session.method && m.enabled);
            if (usedMethod) {
              set(state => ({
                methods: state.methods.map(m =>
                  m.id === usedMethod.id ? { ...m, lastUsed: new Date().toISOString() } : m
                )
              }));
            }

            toast.success('אימות דו-שלבי הושלם בהצלחה');
            return true;
          } else {
            toast.error('קוד אימות שגוי');
            return false;
          }
        } catch (error) {
          console.error('Error verifying MFA code:', error);
          toast.error('שגיאה באימות הקוד');
          return false;
        }
      },

      sendEmailCode: async (sessionId: string) => {
        try {
          const session = get().sessions.find(s => s.id === sessionId);
          if (!session || session.method !== 'email') {
            toast.error('מושב אימות אימייל לא נמצא');
            return false;
          }

          // Generate new code
          const newCode = Math.floor(100000 + Math.random() * 900000).toString();

          set(state => ({
            sessions: state.sessions.map(s =>
              s.id === sessionId ? {
                ...s,
                code: newCode,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                attempts: 0
              } : s
            )
          }));

          const userMethods = get().getMethods(session.userId);
          const emailMethod = userMethods.find(m => m.type === 'email' && m.enabled);

          toast.success(`קוד אימות חדש נשלח לאימייל ${emailMethod?.email}`);
          return true;
        } catch (error) {
          console.error('Error sending email code:', error);
          toast.error('שגיאה בשליחת קוד אימייל');
          return false;
        }
      },

      getSession: (sessionId: string) => {
        return get().sessions.find(s => s.id === sessionId) || null;
      },

      cleanupExpiredSessions: () => {
        const now = new Date();
        set(state => ({
          sessions: state.sessions.filter(s => new Date(s.expiresAt) > now)
        }));
      },

      generateSecret: generateRandomSecret,

      generateQrCode: (secret: string, userEmail: string, issuer: string) => {
        return `otpauth://totp/${issuer}:${userEmail}?secret=${secret}&issuer=${issuer}`;
      },

      verifyTotpCode,
    }),
    {
      name: 'mfa-storage',
      version: 1,
    }
  )
);