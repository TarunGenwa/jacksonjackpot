// Theme Configuration
// This file centralizes all theme values including colors, typography, spacing, etc.

// Original Purple Theme
const purpleTheme = {
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
};

// New Pastel Theme
const pastelTheme = {
  // 5 Core Colors
  primary: '#cdb4db',     // Thistle - Main brand color
  secondary: '#a2d2ff',   // Light Sky Blue - Secondary actions
  accent: '#221b1eff',      // Carnation Pink - CTAs and highlights
  dark: '#cdb4db',        // Dark Thistle - Dark backgrounds
  light: '#f5f0f8',       // Very Light Thistle - Light backgrounds

  // Color Variants - Using actual pastel palette colors
  primaryDark: '#57346b',    // Thistle 200 - Darker primary
  primaryLight: '#e0d2e9',   // Thistle 700 - Lighter primary
  secondaryDark: '#0056a7',  // Light Sky Blue 200 - Darker secondary
  secondaryLight: '#c8e4ff', // Light Sky Blue 700 - Lighter secondary
  accentDark: '#ab003f',     // Carnation Pink 200 - Darker accent
  accentLight: '#ffcee0',    // Carnation Pink 700 - Lighter accent

  // Status Colors (semantic)
  success: '#66b6fd',     // Uranian blue variant
  warning: '#ff6ca4',     // Fairy tale variant
  error: '#ff025f',       // Strong carnation pink
  info: '#0f8dfb',        // Strong uranian blue

  // Neutral Colors (grays)
  white: '#FFFFFF',
  gray100: '#f2f9ff',     // Very light blue
  gray300: '#cbe6fe',     // Light blue
  gray500: '#66b6fd',     // Medium blue
  gray700: '#035eaf',     // Dark blue
  gray900: '#012f57',     // Very dark blue
  black: '#000000',

  // Opacity utilities
  opacity10: 0.1,
  opacity20: 0.2,
  opacity30: 0.3,
  opacity50: 0.5,
  opacity70: 0.7,
  opacity90: 0.9,
};

// Black-Gold Theme
const blackGoldTheme = {
  // 5 Core Colors - Based on provided palette
  primary: '#fca311',     // Gold - Main brand color
  secondary: '#14213d',   // Dark Blue - Secondary actions
  accent: '#000000',      // Black - CTAs and highlights
  dark: '#000000',        // Black - Dark backgrounds
  light: '#ffffff',       // White - Light backgrounds

  // Color Variants (generated from core colors)
  primaryDark: '#e5940e',    // Darker gold
  primaryLight: '#fdb64a',   // Lighter gold
  secondaryDark: '#0f1a2e',  // Darker blue
  secondaryLight: '#1f2d4a', // Lighter blue
  accentDark: '#000000',     // Black (same)
  accentLight: '#333333',    // Dark gray

  // Status Colors (semantic)
  success: '#48bb78',
  warning: '#fca311',     // Using primary gold for warnings
  error: '#dc3545',       // Red for errors
  info: '#14213d',        // Using secondary blue for info

  // Neutral Colors (grays)
  white: '#ffffff',
  gray100: '#f8f9fa',
  gray300: '#dee2e6',
  gray500: '#6c757d',
  gray700: '#495057',
  gray900: '#212529',
  black: '#000000',

  // Opacity utilities
  opacity10: 0.1,
  opacity20: 0.2,
  opacity30: 0.3,
  opacity50: 0.5,
  opacity70: 0.7,
  opacity90: 0.9,
};

// Bright Bold Theme
const brightBoldTheme = {
  // 5 Core Colors from provided palette
  primary: '#2cccc3',     // Robin Egg Blue - Main brand color
  secondary: '#5626c4',   // Chrysler Blue - Secondary actions
  accent: '#facd3d',      // Sunglow - CTAs and highlights
  dark: '#1f3044',        // Prussian Blue - Dark backgrounds
  light: '#ffffff',       // Alice Blue - Light backgrounds

  // Color Variants (generated from core colors)
  primaryDark: '#1a9d96',    // Darker robin egg blue
  primaryLight: '#53dbd4',   // Lighter robin egg blue (from palette)
  secondaryDark: '#441e9e',  // Darker chrysler blue (from palette)
  secondaryLight: '#7346dc', // Lighter chrysler blue (from palette)
  accentDark: '#e5b406',     // Darker sunglow
  accentLight: '#fbd864',    // Lighter sunglow (from palette)

  // Status Colors (semantic using Mexican Pink)
  success: '#2cccc3',     // Using primary robin egg blue
  warning: '#facd3d',     // Using accent sunglow
  error: '#e60576',       // Mexican Pink for errors
  info: '#5626c4',        // Using secondary chrysler blue

  // Neutral Colors (derived from Prussian Blue)
  white: '#ffffff',
  gray100: '#c6d5e5',     // Light prussian blue (from palette)
  gray300: '#8eaacb',     // Medium-light prussian blue (from palette)
  gray500: '#5580b1',     // Medium prussian blue (from palette)
  gray700: '#39587b',     // Medium-dark prussian blue (from palette)
  gray900: '#1f3044',     // Prussian blue base
  black: '#0c131b',       // Darkest prussian blue (from palette)

  // Opacity utilities
  opacity10: 0.1,
  opacity20: 0.2,
  opacity30: 0.3,
  opacity50: 0.5,
  opacity70: 0.7,
  opacity90: 0.9,
};

// Theme selection based on environment variable
const getActiveTheme = () => {
  const themeMode = process.env.NEXT_PUBLIC_THEME_MODE || 'purple';

  switch (themeMode) {
    case 'pastel':
      return pastelTheme;
    case 'blackgold':
      return blackGoldTheme;
    case 'brightbold':
      return brightBoldTheme;
    default:
      return purpleTheme;
  }
};

// Export individual themes for potential runtime switching
export const themes = {
  purple: purpleTheme,
  pastel: pastelTheme,
  blackgold: blackGoldTheme,
  brightbold: brightBoldTheme,
};

// Helper function to get current theme mode
export const getCurrentThemeMode = () => {
  return process.env.NEXT_PUBLIC_THEME_MODE || 'purple';
};

export const themeConfig = {
  // ========================================
  // CORE COLORS - Active Theme
  // ========================================
  colors: getActiveTheme(),

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