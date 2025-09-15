import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ShiftColorPalette {
  id: string;
  name: string;
  colors: string[];
}

export interface CompanyTheme {
  id: string;
  companyId: string;
  companyName: string;
  logo?: string;
  colorPalette: ColorPalette;
  shiftColorPalette: ShiftColorPalette;
  customCss?: string;
}

interface ThemeState {
  currentTheme: CompanyTheme | null;
  availableColorPalettes: ColorPalette[];
  availableShiftPalettes: ShiftColorPalette[];
  companies: CompanyTheme[];

  // Actions
  setTheme: (theme: CompanyTheme) => void;
  updateCompanyTheme: (companyId: string, updates: Partial<CompanyTheme>) => void;
  createCompanyTheme: (companyName: string, colorPaletteId: string, shiftPaletteId: string) => CompanyTheme;
  applyTheme: (theme: CompanyTheme) => void;
  getCompanyTheme: (companyId: string) => CompanyTheme | undefined;
}

// Predefined color palettes
const defaultColorPalettes: ColorPalette[] = [
  {
    id: 'blue-modern',
    name: 'כחול מודרני',
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#06b6d4',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  {
    id: 'purple-professional',
    name: 'סגול מקצועי',
    primary: '#8b5cf6',
    secondary: '#6b7280',
    accent: '#a855f7',
    background: '#faf7ff',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
  },
  {
    id: 'green-fresh',
    name: 'ירוק רענן',
    primary: '#10b981',
    secondary: '#6b7280',
    accent: '#34d399',
    background: '#f0fdf4',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#d1fae5',
    success: '#059669',
    warning: '#f59e0b',
    error: '#dc2626',
  },
  {
    id: 'red-corporate',
    name: 'אדום ארגוני',
    primary: '#dc2626',
    secondary: '#6b7280',
    accent: '#f87171',
    background: '#fef2f2',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#fecaca',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#b91c1c',
  },
  {
    id: 'orange-energy',
    name: 'כתום אנרגטי',
    primary: '#f59e0b',
    secondary: '#6b7280',
    accent: '#fbbf24',
    background: '#fffbeb',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#fed7aa',
    success: '#10b981',
    warning: '#d97706',
    error: '#dc2626',
  },
];

// Predefined shift color palettes
const defaultShiftPalettes: ShiftColorPalette[] = [
  {
    id: 'professional',
    name: 'מקצועי',
    colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'],
  },
  {
    id: 'soft-pastels',
    name: 'פסטל רך',
    colors: ['#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#60a5fa', '#a3e635', '#f472b6', '#facc15'],
  },
  {
    id: 'vibrant',
    name: 'צבעוני',
    colors: ['#7c3aed', '#059669', '#dc2626', '#0891b2', '#ca8a04', '#9333ea', '#16a34a', '#c2410c'],
  },
  {
    id: 'earth-tones',
    name: 'גוני אדמה',
    colors: ['#92400e', '#059669', '#7c2d12', '#065f46', '#92400e', '#166534', '#a16207', '#b45309'],
  },
  {
    id: 'modern-bright',
    name: 'מודרני בהיר',
    colors: ['#2563eb', '#7c3aed', '#dc2626', '#0d9488', '#ea580c', '#9333ea', '#059669', '#0891b2'],
  },
];

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: null,
      availableColorPalettes: defaultColorPalettes,
      availableShiftPalettes: defaultShiftPalettes,
      companies: [],

      setTheme: (theme: CompanyTheme) => {
        set({ currentTheme: theme });
        get().applyTheme(theme);
      },

      updateCompanyTheme: (companyId: string, updates: Partial<CompanyTheme>) => {
        const state = get();
        const companies = state.companies.map(company =>
          company.companyId === companyId
            ? { ...company, ...updates }
            : company
        );

        let currentTheme = state.currentTheme;
        if (currentTheme?.companyId === companyId) {
          currentTheme = { ...currentTheme, ...updates };
        }

        set({ companies, currentTheme });

        if (currentTheme) {
          get().applyTheme(currentTheme);
        }
      },

      createCompanyTheme: (companyName: string, colorPaletteId: string, shiftPaletteId: string) => {
        const state = get();
        const colorPalette = state.availableColorPalettes.find(p => p.id === colorPaletteId);
        const shiftPalette = state.availableShiftPalettes.find(p => p.id === shiftPaletteId);

        if (!colorPalette || !shiftPalette) {
          throw new Error('Invalid palette IDs');
        }

        const companyId = `company-${Date.now()}`;
        const newTheme: CompanyTheme = {
          id: `theme-${Date.now()}`,
          companyId,
          companyName,
          colorPalette,
          shiftColorPalette: shiftPalette,
        };

        const companies = [...state.companies, newTheme];
        set({ companies });

        return newTheme;
      },

      getCompanyTheme: (companyId: string) => {
        return get().companies.find(company => company.companyId === companyId);
      },

      applyTheme: (theme: CompanyTheme) => {
        const root = document.documentElement;
        const { colorPalette } = theme;

        // Apply CSS variables
        root.style.setProperty('--color-primary', colorPalette.primary);
        root.style.setProperty('--color-secondary', colorPalette.secondary);
        root.style.setProperty('--color-accent', colorPalette.accent);
        root.style.setProperty('--color-background', colorPalette.background);
        root.style.setProperty('--color-surface', colorPalette.surface);
        root.style.setProperty('--color-text', colorPalette.text);
        root.style.setProperty('--color-text-secondary', colorPalette.textSecondary);
        root.style.setProperty('--color-border', colorPalette.border);
        root.style.setProperty('--color-success', colorPalette.success);
        root.style.setProperty('--color-warning', colorPalette.warning);
        root.style.setProperty('--color-error', colorPalette.error);

        // Apply shift colors
        theme.shiftColorPalette.colors.forEach((color, index) => {
          root.style.setProperty(`--shift-color-${index + 1}`, color);
        });

        // Apply custom CSS if provided
        if (theme.customCss) {
          const styleId = 'custom-theme-styles';
          let styleElement = document.getElementById(styleId) as HTMLStyleElement;

          if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
          }

          styleElement.textContent = theme.customCss;
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        companies: state.companies,
      }),
    }
  )
);