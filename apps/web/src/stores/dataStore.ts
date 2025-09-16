import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  departmentId: string;
  salary: number;
  startDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
  skills: string[];
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  workHours: {
    sunday: { start: string; end: string; isWorking: boolean };
    monday: { start: string; end: string; isWorking: boolean };
    tuesday: { start: string; end: string; isWorking: boolean };
    wednesday: { start: string; end: string; isWorking: boolean };
    thursday: { start: string; end: string; isWorking: boolean };
    friday: { start: string; end: string; isWorking: boolean };
    saturday: { start: string; end: string; isWorking: boolean };
  };
}

export interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  managerId: string;
  location: string;
  employeeCount: number;
  color: string;
  budget?: number;
  status: 'active' | 'inactive';
  costCenter: string;
  parentDepartmentId?: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'morning' | 'evening' | 'night' | 'custom';
  department: string;
  departmentId: string;
  location?: string;
  requiredEmployees: number;
  assignedEmployees: string[];
  color: string;
  description?: string;
  isRecurring: boolean;
  recurringDays?: string[];
  breaks: {
    start: string;
    end: string;
    duration: number; // minutes
  }[];
  specialRequirements?: string[];
  payRate?: number;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
}

export interface AbsenceRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency' | 'parental' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approver?: string;
  approverId?: string;
  responseDate?: string;
  notes?: string;
  attachments?: string[];
  isHalfDay?: boolean;
  partialDays?: {
    date: string;
    hours: number;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  userId: string;
  actionUrl?: string;
}

interface DataState {
  // Data
  employees: Employee[];
  departments: Department[];
  shifts: Shift[];
  absenceRequests: AbsenceRequest[];
  notifications: Notification[];

  // Loading states
  loading: {
    employees: boolean;
    departments: boolean;
    shifts: boolean;
    absenceRequests: boolean;
  };

  // Employees actions
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;
  getEmployeesByDepartment: (departmentId: string) => Employee[];

  // Departments actions
  addDepartment: (department: Omit<Department, 'id' | 'employeeCount'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  getDepartment: (id: string) => Department | undefined;

  // Shifts actions
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  getShift: (id: string) => Shift | undefined;
  getShiftsByDate: (date: string) => Shift[];
  getShiftsByEmployee: (employeeId: string) => Shift[];
  assignEmployeeToShift: (shiftId: string, employeeId: string) => void;
  removeEmployeeFromShift: (shiftId: string, employeeId: string) => void;

  // Absence requests actions
  addAbsenceRequest: (request: Omit<AbsenceRequest, 'id' | 'requestDate'>) => void;
  updateAbsenceRequest: (id: string, request: Partial<AbsenceRequest>) => void;
  deleteAbsenceRequest: (id: string) => void;
  approveAbsenceRequest: (id: string, approverId: string, notes?: string) => void;
  rejectAbsenceRequest: (id: string, approverId: string, notes?: string) => void;

  // Notifications actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  deleteNotification: (id: string) => void;

  // Utility actions
  initializeData: () => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
}

// Generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Sample data
const generateSampleData = () => {
  const departments: Department[] = [
    {
      id: 'dept-1',
      name: 'ייצור',
      description: 'מחלקת הייצור הראשית אחראית על כל פעילויות הייצור והתפוקה',
      manager: 'דני כהן',
      managerId: 'emp-1',
      location: 'אולם ייצור A-B',
      employeeCount: 0,
      color: '#3b82f6',
      budget: 250000,
      status: 'active',
      costCenter: 'CC-001'
    },
    {
      id: 'dept-2',
      name: 'אחזקה',
      description: 'מחלקת האחזקה מתאמת תחזוקה מתוכננת ותחזוקה שוטפת',
      manager: 'שרה לוי',
      managerId: 'emp-2',
      location: 'מתחם המכונות',
      employeeCount: 0,
      color: '#10b981',
      budget: 150000,
      status: 'active',
      costCenter: 'CC-002'
    },
    {
      id: 'dept-3',
      name: 'בקרת איכות',
      description: 'מחלקת בקרת האיכות מבטיחה עמידה בתקנים ובדרישות איכות',
      manager: 'רחל כהן',
      managerId: 'emp-4',
      location: 'מעבדת איכות',
      employeeCount: 0,
      color: '#f59e0b',
      budget: 120000,
      status: 'active',
      costCenter: 'CC-003'
    },
    {
      id: 'dept-4',
      name: 'לוגיסטיקה',
      description: 'מחלקת הלוגיסטיקה מנהלת מלאים, רכש וחלוקה',
      manager: 'יוסי שמיר',
      managerId: 'emp-5',
      location: 'מחסן ראשי',
      employeeCount: 0,
      color: '#8b5cf6',
      budget: 180000,
      status: 'active',
      costCenter: 'CC-004'
    }
  ];

  const employees: Employee[] = [
    {
      id: 'emp-1',
      name: 'דני כהן',
      email: 'danny@company.com',
      phone: '050-1234567',
      position: 'מנהל משמרת',
      department: 'ייצור',
      departmentId: 'dept-1',
      salary: 12000,
      startDate: '2023-01-15',
      status: 'active',
      skills: ['ניהול', 'בטיחות', 'תפעול'],
      address: 'תל אביב',
      emergencyContact: {
        name: 'שרה כהן',
        phone: '050-7654321',
        relation: 'אשה'
      },
      workHours: {
        sunday: { start: '08:00', end: '16:00', isWorking: true },
        monday: { start: '08:00', end: '16:00', isWorking: true },
        tuesday: { start: '08:00', end: '16:00', isWorking: true },
        wednesday: { start: '08:00', end: '16:00', isWorking: true },
        thursday: { start: '08:00', end: '16:00', isWorking: true },
        friday: { start: '08:00', end: '14:00', isWorking: true },
        saturday: { start: '00:00', end: '00:00', isWorking: false }
      }
    },
    {
      id: 'emp-2',
      name: 'שרה לוי',
      email: 'sara@company.com',
      phone: '050-2345678',
      position: 'טכנאית בכירה',
      department: 'אחזקה',
      departmentId: 'dept-2',
      salary: 9000,
      startDate: '2023-03-20',
      status: 'active',
      skills: ['תחזוקה', 'חשמל', 'מכונות'],
      address: 'פתח תקווה',
      emergencyContact: {
        name: 'משה לוי',
        phone: '050-8765432',
        relation: 'בעל'
      },
      workHours: {
        sunday: { start: '07:00', end: '15:00', isWorking: true },
        monday: { start: '07:00', end: '15:00', isWorking: true },
        tuesday: { start: '07:00', end: '15:00', isWorking: true },
        wednesday: { start: '07:00', end: '15:00', isWorking: true },
        thursday: { start: '07:00', end: '15:00', isWorking: true },
        friday: { start: '07:00', end: '13:00', isWorking: true },
        saturday: { start: '00:00', end: '00:00', isWorking: false }
      }
    },
    {
      id: 'emp-3',
      name: 'מיכאל אברהם',
      email: 'michael@company.com',
      phone: '050-3456789',
      position: 'עובד ייצור',
      department: 'ייצור',
      departmentId: 'dept-1',
      salary: 7500,
      startDate: '2023-06-10',
      status: 'active',
      skills: ['הפעלת מכונות', 'בקרת איכות', 'בטיחות'],
      address: 'רמת גן',
      emergencyContact: {
        name: 'רינה אברהם',
        phone: '050-9876543',
        relation: 'אמא'
      },
      workHours: {
        sunday: { start: '16:00', end: '00:00', isWorking: true },
        monday: { start: '16:00', end: '00:00', isWorking: true },
        tuesday: { start: '16:00', end: '00:00', isWorking: true },
        wednesday: { start: '16:00', end: '00:00', isWorking: true },
        thursday: { start: '16:00', end: '00:00', isWorking: true },
        friday: { start: '00:00', end: '00:00', isWorking: false },
        saturday: { start: '00:00', end: '00:00', isWorking: false }
      }
    },
    {
      id: 'emp-4',
      name: 'רחל כהן',
      email: 'rachel@company.com',
      phone: '050-4567890',
      position: 'מפקחת איכות',
      department: 'בקרת איכות',
      departmentId: 'dept-3',
      salary: 10000,
      startDate: '2023-02-28',
      status: 'active',
      skills: ['בקרת איכות', 'תקנים', 'בדיקות מעבדה'],
      address: 'הרצליה',
      emergencyContact: {
        name: 'אבי כהן',
        phone: '050-1357924',
        relation: 'בעל'
      },
      workHours: {
        sunday: { start: '09:00', end: '17:00', isWorking: true },
        monday: { start: '09:00', end: '17:00', isWorking: true },
        tuesday: { start: '09:00', end: '17:00', isWorking: true },
        wednesday: { start: '09:00', end: '17:00', isWorking: true },
        thursday: { start: '09:00', end: '17:00', isWorking: true },
        friday: { start: '09:00', end: '15:00', isWorking: true },
        saturday: { start: '00:00', end: '00:00', isWorking: false }
      }
    },
    {
      id: 'emp-5',
      name: 'יוסי שמיר',
      email: 'yossi@company.com',
      phone: '050-5678901',
      position: 'מנהל לוגיסטיקה',
      department: 'לוגיסטיקה',
      departmentId: 'dept-4',
      salary: 11000,
      startDate: '2022-12-01',
      status: 'active',
      skills: ['ניהול מלאי', 'רכש', 'תפעול'],
      address: 'ראשון לציון',
      emergencyContact: {
        name: 'יהודית שמיר',
        phone: '050-2468135',
        relation: 'אשה'
      },
      workHours: {
        sunday: { start: '08:30', end: '16:30', isWorking: true },
        monday: { start: '08:30', end: '16:30', isWorking: true },
        tuesday: { start: '08:30', end: '16:30', isWorking: true },
        wednesday: { start: '08:30', end: '16:30', isWorking: true },
        thursday: { start: '08:30', end: '16:30', isWorking: true },
        friday: { start: '08:30', end: '14:30', isWorking: true },
        saturday: { start: '00:00', end: '00:00', isWorking: false }
      }
    }
  ];

  const shifts: Shift[] = [
    {
      id: 'shift-1',
      name: 'משמרת בוקר - ייצור',
      startTime: '08:00',
      endTime: '16:00',
      date: '2024-12-15',
      type: 'morning',
      department: 'ייצור',
      departmentId: 'dept-1',
      location: 'אולם ייצור A',
      requiredEmployees: 4,
      assignedEmployees: ['emp-1', 'emp-3'],
      color: '#3b82f6',
      description: 'משמרת ייצור בוקר עם דגש על יעדי תפוקה',
      isRecurring: true,
      recurringDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
      breaks: [
        { start: '10:00', end: '10:15', duration: 15 },
        { start: '12:00', end: '12:30', duration: 30 },
        { start: '14:00', end: '14:15', duration: 15 }
      ],
      specialRequirements: ['רישיון מלגזה', 'הסמכת בטיחות'],
      payRate: 50,
      status: 'published'
    },
    {
      id: 'shift-2',
      name: 'משמרת ערב - אחזקה',
      startTime: '16:00',
      endTime: '00:00',
      date: '2024-12-15',
      type: 'evening',
      department: 'אחזקה',
      departmentId: 'dept-2',
      location: 'אולם מכונות',
      requiredEmployees: 2,
      assignedEmployees: ['emp-2'],
      color: '#10b981',
      description: 'משמרת אחזקה ותחזוקה מתוכננת',
      isRecurring: true,
      recurringDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
      breaks: [
        { start: '18:00', end: '18:30', duration: 30 },
        { start: '21:00', end: '21:15', duration: 15 }
      ],
      specialRequirements: ['הסמכת חשמל', 'ניסיון במכונות'],
      payRate: 55,
      status: 'published'
    }
  ];

  const absenceRequests: AbsenceRequest[] = [
    {
      id: 'abs-1',
      employeeName: 'דני כהן',
      employeeId: 'emp-1',
      type: 'vacation',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      days: 6,
      reason: 'חופשה משפחתית מתוכננת',
      status: 'pending',
      requestDate: '2024-01-01',
      isHalfDay: false
    },
    {
      id: 'abs-2',
      employeeName: 'שרה לוי',
      employeeId: 'emp-2',
      type: 'sick',
      startDate: '2024-01-08',
      endDate: '2024-01-08',
      days: 1,
      reason: 'חולה - לא מרגישה טוב',
      status: 'approved',
      requestDate: '2024-01-08',
      approver: 'מנהל משמרת',
      approverId: 'emp-1',
      responseDate: '2024-01-08',
      isHalfDay: false
    }
  ];

  return { departments, employees, shifts, absenceRequests };
};

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      // Initial state
      employees: [],
      departments: [],
      shifts: [],
      absenceRequests: [],
      notifications: [],
      loading: {
        employees: false,
        departments: false,
        shifts: false,
        absenceRequests: false
      },

      // Employees actions
      addEmployee: (employee) => {
        const newEmployee = { ...employee, id: generateId() };
        set((state) => ({
          employees: [...state.employees, newEmployee]
        }));

        // Update department employee count
        const { updateDepartment, getDepartment } = get();
        const dept = getDepartment(employee.departmentId);
        if (dept) {
          updateDepartment(dept.id, {
            employeeCount: dept.employeeCount + 1
          });
        }
      },

      updateEmployee: (id, employee) => {
        set((state) => ({
          employees: state.employees.map(emp =>
            emp.id === id ? { ...emp, ...employee } : emp
          )
        }));
      },

      deleteEmployee: (id) => {
        const { employees, updateDepartment, getDepartment } = get();
        const employee = employees.find(emp => emp.id === id);

        set((state) => ({
          employees: state.employees.filter(emp => emp.id !== id)
        }));

        // Update department employee count
        if (employee) {
          const dept = getDepartment(employee.departmentId);
          if (dept) {
            updateDepartment(dept.id, {
              employeeCount: Math.max(0, dept.employeeCount - 1)
            });
          }
        }
      },

      getEmployee: (id) => {
        return get().employees.find(emp => emp.id === id);
      },

      getEmployeesByDepartment: (departmentId) => {
        return get().employees.filter(emp => emp.departmentId === departmentId);
      },

      // Departments actions
      addDepartment: (department) => {
        const newDepartment = {
          ...department,
          id: generateId(),
          employeeCount: 0
        };
        set((state) => ({
          departments: [...state.departments, newDepartment]
        }));
      },

      updateDepartment: (id, department) => {
        set((state) => ({
          departments: state.departments.map(dept =>
            dept.id === id ? { ...dept, ...department } : dept
          )
        }));
      },

      deleteDepartment: (id) => {
        set((state) => ({
          departments: state.departments.filter(dept => dept.id !== id)
        }));
      },

      getDepartment: (id) => {
        return get().departments.find(dept => dept.id === id);
      },

      // Shifts actions
      addShift: (shift) => {
        const newShift = { ...shift, id: generateId() };
        set((state) => ({
          shifts: [...state.shifts, newShift]
        }));
      },

      updateShift: (id, shift) => {
        set((state) => ({
          shifts: state.shifts.map(s =>
            s.id === id ? { ...s, ...shift } : s
          )
        }));
      },

      deleteShift: (id) => {
        set((state) => ({
          shifts: state.shifts.filter(s => s.id !== id)
        }));
      },

      getShift: (id) => {
        return get().shifts.find(s => s.id === id);
      },

      getShiftsByDate: (date) => {
        return get().shifts.filter(s => s.date === date);
      },

      getShiftsByEmployee: (employeeId) => {
        return get().shifts.filter(s => s.assignedEmployees.includes(employeeId));
      },

      assignEmployeeToShift: (shiftId, employeeId) => {
        set((state) => ({
          shifts: state.shifts.map(shift =>
            shift.id === shiftId
              ? {
                  ...shift,
                  assignedEmployees: [...shift.assignedEmployees, employeeId]
                }
              : shift
          )
        }));
      },

      removeEmployeeFromShift: (shiftId, employeeId) => {
        set((state) => ({
          shifts: state.shifts.map(shift =>
            shift.id === shiftId
              ? {
                  ...shift,
                  assignedEmployees: shift.assignedEmployees.filter(id => id !== employeeId)
                }
              : shift
          )
        }));
      },

      // Absence requests actions
      addAbsenceRequest: (request) => {
        const newRequest = {
          ...request,
          id: generateId(),
          requestDate: new Date().toISOString().split('T')[0]
        };
        set((state) => ({
          absenceRequests: [...state.absenceRequests, newRequest]
        }));
      },

      updateAbsenceRequest: (id, request) => {
        set((state) => ({
          absenceRequests: state.absenceRequests.map(req =>
            req.id === id ? { ...req, ...request } : req
          )
        }));
      },

      deleteAbsenceRequest: (id) => {
        set((state) => ({
          absenceRequests: state.absenceRequests.filter(req => req.id !== id)
        }));
      },

      approveAbsenceRequest: (id, approverId, notes) => {
        const { updateAbsenceRequest, getEmployee } = get();
        const approver = getEmployee(approverId);
        updateAbsenceRequest(id, {
          status: 'approved',
          approverId,
          approver: approver?.name || 'Unknown',
          responseDate: new Date().toISOString().split('T')[0],
          notes
        });
      },

      rejectAbsenceRequest: (id, approverId, notes) => {
        const { updateAbsenceRequest, getEmployee } = get();
        const approver = getEmployee(approverId);
        updateAbsenceRequest(id, {
          status: 'rejected',
          approverId,
          approver: approver?.name || 'Unknown',
          responseDate: new Date().toISOString().split('T')[0],
          notes
        });
      },

      // Notifications actions
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: generateId(),
          timestamp: new Date().toISOString()
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        }));
      },

      markAllNotificationsAsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.userId === userId ? { ...notif, read: true } : notif
          )
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(notif => notif.id !== id)
        }));
      },

      // Utility actions
      initializeData: () => {
        const { departments, employees, shifts, absenceRequests } = generateSampleData();
        set({
          departments,
          employees,
          shifts,
          absenceRequests,
          notifications: []
        });
      },

      clearAllData: () => {
        set({
          employees: [],
          departments: [],
          shifts: [],
          absenceRequests: [],
          notifications: []
        });
      },

      exportData: () => {
        const state = get();
        return JSON.stringify({
          employees: state.employees,
          departments: state.departments,
          shifts: state.shifts,
          absenceRequests: state.absenceRequests,
          notifications: state.notifications
        }, null, 2);
      },

      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          set({
            employees: data.employees || [],
            departments: data.departments || [],
            shifts: data.shifts || [],
            absenceRequests: data.absenceRequests || [],
            notifications: data.notifications || []
          });
        } catch (error) {
          console.error('Error importing data:', error);
        }
      }
    }),
    {
      name: 'shift-manager-data',
      version: 1
    }
  )
);