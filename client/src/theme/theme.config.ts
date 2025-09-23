// EPL Brand Theme Configuration
// This file centralizes all theme values including colors, typography, spacing, etc.

export const themeConfig = {
  // ========================================
  // CORE COLORS - 5 Main Colors
  // ========================================
  colors: {
    // 5 Core Colors
    primary: '#963CFF',     // Electric Violet - Main brand color
    secondary: '#68348F',   // Medium Purple - Secondary actions
    accent: '#E90052',      // Razzmatazz - CTAs and highlights
    dark: '#360D3A',        // Valentino - Dark backgrounds
    light: '#F3E9F4',       // Light Purple - Light backgrounds

    // Color Variants (generated from core colors)
    primaryDark: '#6F2DCC',    // Darker primary
    primaryLight: '#C195FF',   // Lighter primary
    secondaryDark: '#4E2A7F',  // Darker secondary
    secondaryLight: '#803D9B', // Lighter secondary
    accentDark: '#CC0048',     // Darker accent
    accentLight: '#FF80B1',    // Lighter accent

    // Status Colors (semantic)
    success: '#48bb78',
    warning: '#ed8936',
    error: '#E90052',    // Using accent for errors
    info: '#4299e1',

    // Neutral Colors (grays)
    white: '#FFFFFF',
    gray100: '#F5F5F5',
    gray300: '#D4D4D4',
    gray500: '#737373',
    gray700: '#404040',
    gray900: '#171717',
    black: '#000000',


    // Opacity utilities
    opacity10: 0.1,
    opacity20: 0.2,
    opacity30: 0.3,
    opacity50: 0.5,
    opacity70: 0.7,
    opacity90: 0.9,
  },

  // ========================================
  // TYPOGRAPHY
  // ========================================
  typography: {
    // Font families
    fonts: {
      heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    },

    // Font sizes
    fontSizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      md: '1rem',         // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
    },

    // Font weights
    fontWeights: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },

    // Line heights
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },

    // Letter spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // ========================================
  // SPACING
  // ========================================
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },

  // ========================================
  // BORDERS & RADIUS
  // ========================================
  borders: {
    widths: {
      none: '0',
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
    radius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
  },

  // ========================================
  // SHADOWS
  // ========================================
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

    // Brand colored shadows
    brand: {
      purple: '0 10px 20px rgba(150, 60, 255, 0.3)',
      red: '0 10px 20px rgba(233, 0, 82, 0.3)',
      valentino: '0 10px 20px rgba(54, 13, 58, 0.3)',
    },
  },

  // ========================================
  // TRANSITIONS
  // ========================================
  transitions: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    timing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // ========================================
  // Z-INDEX SCALE
  // ========================================
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // ========================================
  // BREAKPOINTS
  // ========================================
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type ThemeConfig = typeof themeConfig;