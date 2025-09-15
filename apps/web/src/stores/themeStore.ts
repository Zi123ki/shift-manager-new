import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',

      setTheme: (theme: Theme) => {
        set({ theme });

        // Apply theme to HTML element
        const html = document.documentElement;
        html.classList.remove('light', 'dark');
        html.classList.add(theme);

        // Update CSS custom properties if company theme exists
        const root = document.documentElement;
        if (theme === 'dark') {
          root.style.setProperty('--background', '222.2 84% 4.9%');
          root.style.setProperty('--foreground', '210 40% 98%');
          root.style.setProperty('--card', '222.2 84% 4.9%');
          root.style.setProperty('--card-foreground', '210 40% 98%');
        } else {
          root.style.setProperty('--background', '0 0% 100%');
          root.style.setProperty('--foreground', '222.2 84% 4.9%');
          root.style.setProperty('--card', '0 0% 100%');
          root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
        }
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      initializeTheme: () => {
        const { theme } = get();
        get().setTheme(theme);
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);