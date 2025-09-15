import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  Building2,
  UserMinus,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@shift-manager/ui';

const navigationItems = [
  {
    name: 'navigation.dashboard',
    path: '/',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: 'navigation.calendar',
    path: '/calendar',
    icon: Calendar,
  },
  {
    name: 'navigation.shifts',
    path: '/shifts',
    icon: Clock,
  },
  {
    name: 'navigation.employees',
    path: '/employees',
    icon: Users,
  },
  {
    name: 'navigation.departments',
    path: '/departments',
    icon: Building2,
  },
  {
    name: 'navigation.absences',
    path: '/absences',
    icon: UserMinus,
  },
  {
    name: 'navigation.settings',
    path: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, company, logout } = useAuthStore();

  const isActiveRoute = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = () => {
    // Close mobile sidebar when navigating
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-full h-full bg-card border-r border-border flex flex-col">
      {/* Mobile close button */}
      <div className="md:hidden p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="w-full justify-center"
        >
          <span>✕</span>
        </Button>
      </div>

      {/* Company Header */}
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-foreground truncate">
              {company?.name}
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              {user?.role} - {user?.username}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path, item.exact);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 md:py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{t(item.name)}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
          {t('auth.logout')}
        </Button>
      </div>
    </div>
  );
}