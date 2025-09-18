import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ClientCompany {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  status: 'active' | 'suspended' | 'trial' | 'expired';
  createdAt: string;
  expiryDate: string;
  maxEmployees: number;
  currentEmployees: number;
  plan: 'basic' | 'professional' | 'enterprise';
  monthlyPrice: number;
  lastPayment?: string;
  nextPayment?: string;
  adminUser: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    phone: string;
  };
  features: {
    shifts: boolean;
    employees: boolean;
    departments: boolean;
    reports: boolean;
    integrations: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    advancedSecurity: boolean;
  };
  usage: {
    monthlyShifts: number;
    monthlyReports: number;
    apiCalls: number;
    storageUsed: number; // in MB
  };
}

export interface PendingRegistration {
  id: string;
  companyName: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  companyPhone: string;
  companyAddress: string;
  requestedPlan: 'basic' | 'professional' | 'enterprise';
  message?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  createdBy: string;
  permissions: {
    manageCompanies: boolean;
    manageUsers: boolean;
    viewAnalytics: boolean;
    managePlans: boolean;
    approveRegistrations: boolean;
  };
}

interface SuperAdminState {
  companies: ClientCompany[];
  pendingRegistrations: PendingRegistration[];
  systemUsers: SystemUser[];
  loading: boolean;

  // Company management
  addCompany: (company: any) => void;
  updateCompany: (id: string, updates: Partial<ClientCompany>) => void;
  deleteCompany: (id: string) => void;
  suspendCompany: (id: string) => void;
  activateCompany: (id: string) => void;

  // Registration management
  addPendingRegistration: (registration: Omit<PendingRegistration, 'id' | 'submittedAt' | 'status'>) => void;
  approveRegistration: (id: string, reviewerId: string) => ClientCompany | null;
  rejectRegistration: (id: string, reviewerId: string, reason: string) => void;

  // User management
  addSystemUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => void;
  updateSystemUser: (id: string, updates: Partial<SystemUser>) => void;
  deleteSystemUser: (id: string) => void;
  activateSystemUser: (id: string) => void;
  deactivateSystemUser: (id: string) => void;

  // Data fetching
  initializeSuperAdminData: () => void;

  // Analytics
  getTotalRevenue: () => number;
  getActiveCompaniesCount: () => number;
  getTrialCompaniesCount: () => number;
  getExpiredCompaniesCount: () => number;
}

export const useSuperAdminStore = create<SuperAdminState>()(
  persist(
    (set, get) => ({
      companies: [],
      pendingRegistrations: [],
      systemUsers: [],
      loading: false,

      addCompany: (companyData) => {
        const newCompany: ClientCompany = {
          ...companyData,
          id: `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          companies: [...state.companies, newCompany]
        }));
      },

      updateCompany: (id, updates) => {
        set((state) => ({
          companies: state.companies.map(company =>
            company.id === id ? { ...company, ...updates } : company
          )
        }));
      },

      deleteCompany: (id) => {
        set((state) => ({
          companies: state.companies.filter(company => company.id !== id)
        }));
      },

      suspendCompany: (id) => {
        set((state) => ({
          companies: state.companies.map(company =>
            company.id === id ? { ...company, status: 'suspended' } : company
          )
        }));
      },

      activateCompany: (id) => {
        set((state) => ({
          companies: state.companies.map(company =>
            company.id === id ? { ...company, status: 'active' } : company
          )
        }));
      },

      addPendingRegistration: (registrationData) => {
        const newRegistration: PendingRegistration = {
          ...registrationData,
          id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          submittedAt: new Date().toISOString(),
          status: 'pending',
        };

        set((state) => ({
          pendingRegistrations: [...state.pendingRegistrations, newRegistration]
        }));
      },

      approveRegistration: (id, reviewerId) => {
        const registration = get().pendingRegistrations.find(r => r.id === id);
        if (!registration) return null;

        // Create new company from registration
        const planPricing = {
          basic: 299,
          professional: 599,
          enterprise: 1299
        };

        const planFeatures = {
          basic: {
            shifts: true,
            employees: true,
            departments: true,
            reports: false,
            integrations: false,
            customBranding: false,
            apiAccess: false,
            advancedSecurity: false,
          },
          professional: {
            shifts: true,
            employees: true,
            departments: true,
            reports: true,
            integrations: true,
            customBranding: true,
            apiAccess: false,
            advancedSecurity: false,
          },
          enterprise: {
            shifts: true,
            employees: true,
            departments: true,
            reports: true,
            integrations: true,
            customBranding: true,
            apiAccess: true,
            advancedSecurity: true,
          }
        };

        const maxEmployees = {
          basic: 50,
          professional: 200,
          enterprise: 1000
        };

        const newCompany: ClientCompany = {
          id: `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: registration.companyName,
          slug: registration.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          email: registration.adminEmail,
          phone: registration.companyPhone,
          address: registration.companyAddress,
          status: 'trial',
          createdAt: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days trial
          maxEmployees: maxEmployees[registration.requestedPlan],
          currentEmployees: 0,
          plan: registration.requestedPlan,
          monthlyPrice: planPricing[registration.requestedPlan],
          adminUser: {
            id: `admin_${Date.now()}`,
            username: registration.adminEmail.split('@')[0],
            email: registration.adminEmail,
            fullName: registration.adminName,
            phone: registration.adminPhone,
          },
          features: planFeatures[registration.requestedPlan],
          usage: {
            monthlyShifts: 0,
            monthlyReports: 0,
            apiCalls: 0,
            storageUsed: 0,
          }
        };

        set((state) => ({
          companies: [...state.companies, newCompany],
          pendingRegistrations: state.pendingRegistrations.map(r =>
            r.id === id ? {
              ...r,
              status: 'approved' as const,
              reviewedBy: reviewerId,
              reviewedAt: new Date().toISOString(),
            } : r
          )
        }));

        return newCompany;
      },

      rejectRegistration: (id, reviewerId, reason) => {
        set((state) => ({
          pendingRegistrations: state.pendingRegistrations.map(r =>
            r.id === id ? {
              ...r,
              status: 'rejected' as const,
              reviewedBy: reviewerId,
              reviewedAt: new Date().toISOString(),
              rejectionReason: reason,
            } : r
          )
        }));
      },

      // User management functions
      addSystemUser: (userData) => {
        const newUser: SystemUser = {
          ...userData,
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          systemUsers: [...state.systemUsers, newUser]
        }));
      },

      updateSystemUser: (id, updates) => {
        set((state) => ({
          systemUsers: state.systemUsers.map(user =>
            user.id === id ? { ...user, ...updates } : user
          )
        }));
      },

      deleteSystemUser: (id) => {
        set((state) => ({
          systemUsers: state.systemUsers.filter(user => user.id !== id)
        }));
      },

      activateSystemUser: (id) => {
        set((state) => ({
          systemUsers: state.systemUsers.map(user =>
            user.id === id ? { ...user, status: 'active' } : user
          )
        }));
      },

      deactivateSystemUser: (id) => {
        set((state) => ({
          systemUsers: state.systemUsers.map(user =>
            user.id === id ? { ...user, status: 'inactive' } : user
          )
        }));
      },

      initializeSuperAdminData: () => {
        const state = get();
        if (state.companies.length === 0 || state.pendingRegistrations.length === 0 || state.systemUsers.length === 0) {
          // Initialize with demo data
          const demoCompanies: ClientCompany[] = [
            {
              id: 'company_1',
              name: 'טכנולוגיות המדען',
              slug: 'tech-scientist',
              email: 'admin@tech-scientist.co.il',
              phone: '03-1234567',
              address: 'רחוב הטכנולוגיה 15, תל אביב',
              website: 'www.tech-scientist.co.il',
              status: 'active',
              createdAt: '2024-01-15T08:00:00Z',
              expiryDate: '2024-12-31T23:59:59Z',
              maxEmployees: 200,
              currentEmployees: 45,
              plan: 'professional',
              monthlyPrice: 599,
              lastPayment: '2024-12-01T10:00:00Z',
              nextPayment: '2025-01-01T10:00:00Z',
              adminUser: {
                id: 'admin_1',
                username: 'admin',
                email: 'admin@tech-scientist.co.il',
                fullName: 'דוד כהן',
                phone: '050-1234567',
              },
              features: {
                shifts: true,
                employees: true,
                departments: true,
                reports: true,
                integrations: true,
                customBranding: true,
                apiAccess: false,
                advancedSecurity: false,
              },
              usage: {
                monthlyShifts: 1250,
                monthlyReports: 85,
                apiCalls: 0,
                storageUsed: 145,
              }
            },
            {
              id: 'company_2',
              name: 'מרכז רפואי שלום',
              slug: 'shalom-medical',
              email: 'it@shalom-medical.co.il',
              phone: '02-9876543',
              address: 'רחוב הרפואה 25, ירושלים',
              status: 'trial',
              createdAt: '2024-12-01T14:30:00Z',
              expiryDate: '2024-12-31T23:59:59Z',
              maxEmployees: 1000,
              currentEmployees: 120,
              plan: 'enterprise',
              monthlyPrice: 1299,
              adminUser: {
                id: 'admin_2',
                username: 'manager',
                email: 'it@shalom-medical.co.il',
                fullName: 'שרה לוי',
                phone: '050-9876543',
              },
              features: {
                shifts: true,
                employees: true,
                departments: true,
                reports: true,
                integrations: true,
                customBranding: true,
                apiAccess: true,
                advancedSecurity: true,
              },
              usage: {
                monthlyShifts: 2840,
                monthlyReports: 124,
                apiCalls: 1450,
                storageUsed: 423,
              }
            }
          ];

          const demoPendingRegistrations: PendingRegistration[] = [
            {
              id: 'reg_1',
              companyName: 'מפעל הפלסטיק החדש',
              adminName: 'מיכאל אברהם',
              adminEmail: 'michael@newplastic.co.il',
              adminPhone: '054-1111111',
              companyPhone: '04-8888888',
              companyAddress: 'רחוב התעשייה 45, חיפה',
              requestedPlan: 'basic',
              message: 'אנו מפעל פלסטיק עם 35 עובדים ומחפשים מערכת לניהול משמרות',
              submittedAt: '2024-12-15T09:15:00Z',
              status: 'pending',
            },
            {
              id: 'reg_2',
              companyName: 'רשת חנויות אופטיקה',
              adminName: 'רחל גרין',
              adminEmail: 'rachel@optics-chain.co.il',
              adminPhone: '052-2222222',
              companyPhone: '03-7777777',
              companyAddress: 'רחוב דיזינגוף 123, תל אביב',
              requestedPlan: 'professional',
              message: 'רשת של 12 סניפי אופטיקה עם צורך בניהול משמרות מתקדם',
              submittedAt: '2024-12-16T16:45:00Z',
              status: 'pending',
            }
          ];

          const demoSystemUsers: SystemUser[] = [
            {
              id: 'user_1',
              name: 'אדמין ראשי',
              email: 'admin@shiftmanager.co.il',
              role: 'SUPER_ADMIN',
              status: 'active',
              createdAt: '2024-01-01T00:00:00Z',
              lastLogin: '2024-12-18T10:30:00Z',
              createdBy: 'system',
              permissions: {
                manageCompanies: true,
                manageUsers: true,
                viewAnalytics: true,
                managePlans: true,
                approveRegistrations: true,
              }
            },
            {
              id: 'user_2',
              name: 'יובל מנהל',
              email: 'yuval@shiftmanager.co.il',
              role: 'ADMIN',
              status: 'active',
              createdAt: '2024-06-15T14:20:00Z',
              lastLogin: '2024-12-17T16:45:00Z',
              createdBy: 'user_1',
              permissions: {
                manageCompanies: true,
                manageUsers: false,
                viewAnalytics: true,
                managePlans: false,
                approveRegistrations: true,
              }
            },
            {
              id: 'user_3',
              name: 'שרה תמיכה',
              email: 'sara@shiftmanager.co.il',
              role: 'MANAGER',
              status: 'active',
              createdAt: '2024-09-10T11:00:00Z',
              lastLogin: '2024-12-18T09:15:00Z',
              createdBy: 'user_1',
              permissions: {
                manageCompanies: false,
                manageUsers: false,
                viewAnalytics: true,
                managePlans: false,
                approveRegistrations: false,
              }
            }
          ];

          set({
            companies: demoCompanies,
            pendingRegistrations: demoPendingRegistrations,
            systemUsers: demoSystemUsers,
          });
        }
      },

      getTotalRevenue: () => {
        return get().companies
          .filter(c => c.status === 'active')
          .reduce((total, company) => total + company.monthlyPrice, 0);
      },

      getActiveCompaniesCount: () => {
        return get().companies.filter(c => c.status === 'active').length;
      },

      getTrialCompaniesCount: () => {
        return get().companies.filter(c => c.status === 'trial').length;
      },

      getExpiredCompaniesCount: () => {
        return get().companies.filter(c => c.status === 'expired').length;
      },

    }),
    {
      name: 'super-admin-storage',
      version: 1,
    }
  )
);