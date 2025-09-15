import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { Button } from '../components/ui/button';
import { User, Menu } from 'lucide-react';
import LanguageSwitch from './LanguageSwitch';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { currentTheme } = useThemeStore();

  return (
    <header className="bg-card border-b border-border px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button and Page Title */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Mobile hamburger menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Page Title */}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
              {t('navigation.dashboard')} {/* This should be dynamic based on route */}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
              {new Date().toLocaleDateString('he-IL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse">
          {/* Language Switch - Hidden on very small screens */}
          <div className="hidden sm:block">
            <LanguageSwitch />
          </div>

          {/* Company Theme Indicator */}
          {currentTheme && (
            <div
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                backgroundColor: currentTheme.colorPalette.primary,
                color: 'white',
                fontSize: '12px',
                fontWeight: '600'
              }}
              title={`נושא: ${currentTheme.colorPalette.name}`}
            >
              {currentTheme.companyName}
            </div>
          )}

          {/* User Profile */}
          <div className="flex items-center space-x-2 md:space-x-3 rtl:space-x-reverse">
            <div className="text-right rtl:text-left hidden md:block">
              <p className="text-sm font-medium text-foreground">
                {user?.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.role}
              </p>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}