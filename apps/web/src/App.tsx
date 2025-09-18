import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import { useDataStore } from './stores/dataStore';
import { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import ShiftCalendarPage from './pages/ShiftCalendarPage';
import ShiftsPage from './pages/ShiftsPage';
import EmployeesPage from './pages/EmployeesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import AbsencesPage from './pages/AbsencesPage';
import SettingsPage from './pages/SettingsPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CompanyRegistration from './pages/CompanyRegistration';
import ThemeSettings from './components/ThemeSettings';

// Layout
import Layout from './components/Layout';

// Types
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { i18n } = useTranslation();
  const { user, loading, checkAuth } = useAuthStore();
  const { currentTheme } = useThemeStore();
  const { employees, departments, initializeData } = useDataStore();

  useEffect(() => {
    // Initialize auth on app start
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Initialize data if empty
    if (employees.length === 0 && departments.length === 0) {
      initializeData();
    }
  }, [employees.length, departments.length, initializeData]);

  useEffect(() => {
    // Update HTML attributes based on language
    const html = document.documentElement;
    html.setAttribute('lang', i18n.language);
    html.setAttribute('dir', i18n.language === 'he' ? 'rtl' : 'ltr');
  }, [i18n.language]);

  useEffect(() => {
    // Apply current theme if available
    if (currentTheme) {
      // Theme will be applied by the theme store
    }
  }, [currentTheme]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={<CompanyRegistration />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Super Admin Route */}
            <Route path="super-admin" element={<SuperAdminDashboard />} />
            <Route index element={user?.role === 'SUPER_ADMIN' ? <SuperAdminDashboard /> : <DashboardPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="shift-calendar" element={<ShiftCalendarPage />} />
            <Route path="shifts" element={<ShiftsPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="absences" element={<AbsencesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="theme-settings" element={<ThemeSettings />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;