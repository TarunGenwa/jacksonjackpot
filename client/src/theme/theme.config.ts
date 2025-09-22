// EPL Brand Theme Configuration
// This file centralizes all theme values including colors, typography, spacing, etc.

export const themeConfig = {
  // ========================================
  // BRAND COLORS - EPL Palette
  // ========================================
  colors: {
    // Core Brand Colors
    brand: {
      valentino: '#360D3A',        // Primary Dark Purple
      razzmatazz: '#E90052',       // Accent Red
      electricViolet: '#963CFF',   // Secondary Purple
      white: '#FFFFFF',            // Pure White
    },

    // Extended Valentino Palette
    valentino: {
      50: '#F3E9F4',
      100: '#E1C8E3',
      200: '#CDA3D1',
      300: '#B87EBF',
      400: '#A862B1',
      500: '#9846A3',
      600: '#803D9B',
      700: '#68348F',
      800: '#4E2A7F',
      900: '#360D3A', // Brand Valentino
      950: '#1A061D', // Darker variant
    },

    // Extended Razzmatazz Palette
    razzmatazz: {
      50: '#FFE0EC',
      100: '#FFB3D0',
      200: '#FF80B1',
      300: '#FF4D93',
      400: '#FF267A',
      500: '#E90052', // Brand Razzmatazz
      600: '#CC0048',
      700: '#A6003A',
      800: '#80002D',
      900: '#590020',
    },

    // Extended Electric Violet Palette
    electricViolet: {
      50: '#F0E6FF',
      100: '#D9BFFF',
      200: '#C195FF',
      300: '#A96BFF',
      400: '#9F53FF',
      500: '#963CFF', // Brand Electric Violet
      600: '#8636E6',
      700: '#6F2DCC',
      800: '#5924B3',
      900: '#421A99',
    },

    // Semantic Colors
    semantic: {
      // UI States
      primary: '#963CFF',        // Electric Violet
      secondary: '#360D3A',      // Valentino
      accent: '#E90052',         // Razzmatazz

      // Status Colors
      success: {
        light: '#48bb78',
        DEFAULT: '#38a169',
        dark: '#2f855a',
      },
      warning: {
        light: '#f6ad55',
        DEFAULT: '#ed8936',
        dark: '#c05621',
      },
      error: {
        light: '#FC8181',
        DEFAULT: '#E90052',      // Using Razzmatazz for errors
        dark: '#CC0048',
      },
      info: {
        light: '#90CDF4',
        DEFAULT: '#3182ce',
        dark: '#2C5282',
      },
    },

    // Neutral Colors
    neutral: {
      white: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      black: '#000000',
    },

    // Background Colors
    backgrounds: {
      // Page backgrounds
      page: {
        light: '#FFFFFF',
        dark: '#360D3A',          // Valentino
        darker: '#1A061D',
      },

      // Card backgrounds
      card: {
        primary: '#360D3A',       // Valentino
        secondary: '#4E2A7F',     // Lighter Valentino
        elevated: '#68348F',      // Even lighter
        overlay: 'rgba(54, 13, 58, 0.95)',
        glass: 'rgba(54, 13, 58, 0.3)',
      },

      // Specific UI elements
      modal: 'rgba(54, 13, 58, 0.95)',
      dropdown: '#360D3A',
      tooltip: '#1A061D',
      sidebar: '#360D3A',
      header: '#360D3A',
    },

    // Text Colors
    text: {
      // Primary text
      primary: {
        light: '#171717',
        dark: '#FFFFFF',
      },
      secondary: {
        light: '#525252',
        dark: '#D9BFFF',         // Light Electric Violet
      },
      muted: {
        light: '#737373',
        dark: '#A96BFF',         // Medium Electric Violet
      },
      disabled: {
        light: '#A3A3A3',
        dark: '#525252',
      },

      // Semantic text
      accent: '#E90052',         // Razzmatazz
      link: '#963CFF',           // Electric Violet
      linkHover: '#8636E6',
      success: '#38a169',
      error: '#E90052',
      warning: '#ed8936',
      info: '#3182ce',
    },

    // Border Colors
    borders: {
      default: {
        light: '#E5E5E5',
        dark: '#963CFF',         // Electric Violet
      },
      subtle: {
        light: '#F5F5F5',
        dark: 'rgba(150, 60, 255, 0.3)',
      },
      focus: '#E90052',          // Razzmatazz
      error: '#E90052',
      success: '#38a169',
    },

    // Special UI Elements
    ui: {
      // Buttons
      button: {
        primary: {
          bg: '#963CFF',         // Electric Violet
          hover: '#8636E6',
          active: '#6F2DCC',
          text: '#FFFFFF',
        },
        secondary: {
          bg: '#360D3A',         // Valentino
          hover: '#4E2A7F',
          active: '#68348F',
          text: '#FFFFFF',
        },
        accent: {
          bg: '#E90052',         // Razzmatazz
          hover: '#CC0048',
          active: '#A6003A',
          text: '#FFFFFF',
        },
        ghost: {
          bg: 'transparent',
          hover: 'rgba(150, 60, 255, 0.1)',
          active: 'rgba(150, 60, 255, 0.2)',
          text: '#963CFF',
        },
      },

      // Progress bars
      progress: {
        bg: 'rgba(150, 60, 255, 0.2)',
        fill: '#963CFF',
      },

      // Badges
      badge: {
        primary: '#963CFF',
        secondary: '#360D3A',
        accent: '#E90052',
        success: '#38a169',
        warning: '#ed8936',
        error: '#E90052',
        info: '#3182ce',
      },

      // Form elements
      input: {
        bg: {
          light: '#FFFFFF',
          dark: 'rgba(54, 13, 58, 0.3)',
        },
        border: {
          default: '#963CFF',
          focus: '#E90052',
          error: '#E90052',
        },
      },
    },

    // Component specific colors
    components: {
      header: {
        bg: '#360D3A',
        border: '#963CFF',
        text: '#FFFFFF',
        logo: '#E90052',
      },

      competitionCard: {
        bg: '#360D3A',
        border: '#963CFF',
        hoverBorder: '#E90052',
        imagePlaceholder: '#4E2A7F',
        statusBadge: {
          active: '#38a169',
          upcoming: '#3182ce',
          soldOut: '#E90052',
          completed: '#737373',
        },
      },

      prizeSection: {
        drawPrize: {
          border: '#963CFF',
          icon: '#963CFF',
          value: '#E90052',
        },
        instantWin: {
          border: '#E90052',
          icon: '#E90052',
          value: '#E90052',
        },
      },

      wallet: {
        balance: '#E90052',
        currency: '#963CFF',
      },

      tickets: {
        number: '#E90052',
        price: '#E90052',
        available: '#38a169',
        soldOut: '#E90052',
      },
    },

    // Transparency/Opacity variants
    alpha: {
      black: {
        100: 'rgba(0, 0, 0, 0.1)',
        200: 'rgba(0, 0, 0, 0.2)',
        300: 'rgba(0, 0, 0, 0.3)',
        400: 'rgba(0, 0, 0, 0.4)',
        500: 'rgba(0, 0, 0, 0.5)',
        600: 'rgba(0, 0, 0, 0.6)',
        700: 'rgba(0, 0, 0, 0.7)',
        800: 'rgba(0, 0, 0, 0.8)',
        900: 'rgba(0, 0, 0, 0.9)',
      },
      white: {
        100: 'rgba(255, 255, 255, 0.1)',
        200: 'rgba(255, 255, 255, 0.2)',
        300: 'rgba(255, 255, 255, 0.3)',
        400: 'rgba(255, 255, 255, 0.4)',
        500: 'rgba(255, 255, 255, 0.5)',
        600: 'rgba(255, 255, 255, 0.6)',
        700: 'rgba(255, 255, 255, 0.7)',
        800: 'rgba(255, 255, 255, 0.8)',
        900: 'rgba(255, 255, 255, 0.9)',
      },
    },
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