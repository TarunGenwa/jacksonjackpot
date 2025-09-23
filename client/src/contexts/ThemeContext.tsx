'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { theme, ThemeColors, SemanticColors } from '@/theme';
import { themeConfig, ThemeConfig, getCurrentThemeMode, themes } from '@/theme/theme.config';

export type ThemeMode = 'light' | 'dark';
export type ColorTheme = 'purple' | 'pastel';

interface ThemeContextType {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  colors: ThemeColors;
  semantic: SemanticColors;
  config: ThemeConfig;
  getColor: (path: string, fallback?: string) => string;
  getSemanticColor: (category: string, variant: string, fallback?: string) => string;
  getThemeColor: (path: string, fallback?: string) => string;
  getFont: (type: 'heading' | 'body' | 'mono') => string;
  getFontSize: (size: keyof ThemeConfig['typography']['fontSizes']) => string;
  getSpacing: (size: keyof ThemeConfig['spacing']) => string;
  getBorderRadius: (size: keyof ThemeConfig['borders']['radius']) => string;
  getShadow: (size: keyof ThemeConfig['shadows']) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({ children, defaultMode = 'dark' }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const colorTheme = getCurrentThemeMode() as ColorTheme;

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setMode(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', mode);

    // Update CSS custom properties for theme-aware styling
    const root = document.documentElement;

    if (mode === 'dark') {
      root.style.setProperty('--bg-primary', theme.colors.background.dark);
      root.style.setProperty('--bg-secondary', theme.colors.background.card.dark);
      root.style.setProperty('--text-primary', theme.colors.text.primary.dark);
      root.style.setProperty('--text-secondary', theme.colors.text.secondary.dark);
      root.style.setProperty('--border-color', theme.colors.border.dark);
    } else {
      root.style.setProperty('--bg-primary', theme.colors.background.light);
      root.style.setProperty('--bg-secondary', theme.colors.background.card.light);
      root.style.setProperty('--text-primary', theme.colors.text.primary.light);
      root.style.setProperty('--text-secondary', theme.colors.text.secondary.light);
      root.style.setProperty('--border-color', theme.colors.border.light);
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const getColor = (path: string, fallback = '#000000'): string => {
    const keys = path.split('.');
    let value: unknown = theme.colors;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        console.warn(`Color path "${path}" not found in theme`);
        return fallback;
      }
    }

    // Handle mode-specific colors
    if (typeof value === 'object' && value !== null && mode in value) {
      return (value as Record<string, string>)[mode];
    }

    return typeof value === 'string' ? value : fallback;
  };

  const getSemanticColor = (category: string, variant: string, fallback = '#000000'): string => {
    const categoryColors = (theme.semantic as Record<string, unknown>)[category] as Record<string, string>;
    if (categoryColors && variant in categoryColors) {
      const color = categoryColors[variant];

      // Handle mode-specific semantic colors
      if (typeof color === 'object' && mode in color) {
        return color[mode];
      }

      return typeof color === 'string' ? color : fallback;
    }
    console.warn(`Semantic color "${category}.${variant}" not found`);
    return fallback;
  };

  // New theme config accessor
  const getThemeColor = (path: string, fallback = '#000000'): string => {
    const keys = path.split('.');
    let value: unknown = themeConfig.colors;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        console.warn(`Theme color path "${path}" not found`);
        return fallback;
      }
    }

    // Handle mode-specific colors
    if (typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>;
      if (mode in obj) {
        return obj[mode] as string;
      }
      if ('DEFAULT' in obj) {
        return obj.DEFAULT as string;
      }
    }

    return typeof value === 'string' ? value : fallback;
  };

  // Typography helpers
  const getFont = (type: 'heading' | 'body' | 'mono'): string => {
    return themeConfig.typography.fonts[type];
  };

  const getFontSize = (size: keyof ThemeConfig['typography']['fontSizes']): string => {
    return themeConfig.typography.fontSizes[size];
  };

  // Spacing helper
  const getSpacing = (size: keyof ThemeConfig['spacing']): string => {
    return themeConfig.spacing[size];
  };

  // Border radius helper
  const getBorderRadius = (size: keyof ThemeConfig['borders']['radius']): string => {
    return themeConfig.borders.radius[size];
  };

  // Shadow helper
  const getShadow = (size: keyof ThemeConfig['shadows']): string => {
    const shadow = themeConfig.shadows[size];
    return typeof shadow === 'string' ? shadow : String(shadow);
  };

  const value: ThemeContextType = {
    mode,
    colorTheme,
    toggleTheme,
    setTheme,
    colors: theme.colors,
    semantic: theme.semantic,
    config: themeConfig,
    getColor,
    getSemanticColor,
    getThemeColor,
    getFont,
    getFontSize,
    getSpacing,
    getBorderRadius,
    getShadow,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper hook for getting colors with current theme mode
export function useThemeColors() {
  const { getColor, getSemanticColor, mode } = useTheme();

  return {
    getColor,
    getSemanticColor,
    mode,
    // Commonly used colors
    bg: {
      primary: getColor('background.primary'),
      secondary: getColor('background.card'),
      modal: getColor('background.modal'),
    },
    text: {
      primary: getColor('text.primary'),
      secondary: getColor('text.secondary'),
      muted: getColor('text.muted'),
    },
    border: {
      default: getColor('border.light'),
      focus: getColor('border.focus'),
    },
    status: {
      success: getColor('status.active'),
      error: getColor('status.soldOut'),
      warning: getColor('status.pending'),
      info: getColor('status.upcoming'),
    },
  };
}