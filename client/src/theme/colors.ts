export const theme = {
  colors: {
    // Primary brand colors - EPL Valentino Purple
    primary: {
      50: '#F3E9F4',
      100: '#E1C8E3',
      200: '#CDA3D1',
      300: '#B87EBF',
      400: '#A862B1',
      500: '#9846A3',
      600: '#803D9B',
      700: '#68348F',
      800: '#4E2A7F',
      900: '#360D3A', // EPL Valentino
    },

    // Secondary brand colors - EPL Electric Violet
    secondary: {
      50: '#F0E6FF',
      100: '#D9BFFF',
      200: '#C195FF',
      300: '#A96BFF',
      400: '#9F53FF',
      500: '#963CFF', // EPL Electric Violet
      600: '#8636E6',
      700: '#6F2DCC',
      800: '#5924B3',
      900: '#421A99',
    },

    // Success colors (green)
    success: {
      50: '#f0fff4',
      100: '#c6f6d5',
      200: '#9ae6b4',
      300: '#68d391',
      400: '#48bb78', // Main green
      500: '#38a169',
      600: '#2f855a',
      700: '#276749',
      800: '#22543d',
      900: '#1a202c',
    },

    // Warning colors (yellow/orange)
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#f59e0b', // Main yellow
      500: '#d97706',
      600: '#b45309',
      700: '#92400e',
      800: '#78350f',
      900: '#451a03',
    },

    // Error/Accent colors - EPL Razzmatazz Red
    error: {
      50: '#FFE0EC',
      100: '#FFB3D0',
      200: '#FF80B1',
      300: '#FF4D93',
      400: '#FF267A',
      500: '#E90052', // EPL Razzmatazz
      600: '#CC0048',
      700: '#A6003A',
      800: '#80002D',
      900: '#590020',
    },

    // Neutral colors (gray)
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db', // Light gray text
      400: '#9ca3af', // Medium gray text
      500: '#6b7280',
      600: '#4b5563', // Dark gray text
      700: '#374151',
      800: '#1f2937', // Dark background
      900: '#111827', // Darker background
    },

    // Background colors
    background: {
      light: '#FFFFFF', // EPL White
      dark: '#360D3A', // EPL Valentino
      darker: '#1A061D', // Darker Valentino variant
      card: {
        light: '#FFFFFF',
        dark: 'rgba(54, 13, 58, 0.3)', // Valentino with opacity
      },
      modal: {
        light: 'rgba(255, 255, 255, 0.95)',
        dark: 'rgba(54, 13, 58, 0.95)', // Valentino with opacity
      },
    },

    // Text colors
    text: {
      primary: {
        light: '#1a202c',
        dark: '#ffffff',
      },
      secondary: {
        light: '#4a5568',
        dark: '#a0aec0',
      },
      muted: {
        light: '#718096',
        dark: '#6b7280',
      },
    },

    // Border colors
    border: {
      light: '#e2e8f0',
      dark: '#963CFF', // EPL Electric Violet
      focus: '#E90052', // EPL Razzmatazz
    },

    // Status colors
    status: {
      active: '#48bb78',
      upcoming: '#3182ce',
      soldOut: '#e53e3e',
      completed: '#718096',
      pending: '#ed8936',
    },

    // Badge colors
    badge: {
      verified: '#48bb78',
      admin: '#3182ce',
      user: '#9f7aea',
      moderator: '#ed8936',
    },

    // Solid colors for backgrounds (no gradients)
    solidColors: {
      primary: '#360D3A', // EPL Valentino
      secondary: '#963CFF', // EPL Electric Violet
      accent: '#E90052', // EPL Razzmatazz
      header: '#360D3A', // Solid Valentino for headers
      card: '#360D3A', // Solid Valentino for cards
      cardHover: '#4E2A7F', // Lighter Valentino for hover
      button: {
        primary: '#963CFF', // Electric Violet
        primaryHover: '#8636E6',
        accent: '#E90052', // Razzmatazz
        accentHover: '#CC0048',
        success: '#48bb78',
        successHover: '#38a169',
      },
      surface: {
        dark: '#360D3A', // Valentino
        darker: '#1A061D', // Darker variant
        light: '#FFFFFF', // White
        elevated: '#4E2A7F', // Elevated surface
      },
    },
  },

  // Semantic color tokens
  semantic: {
    wallet: {
      balance: '#48bb78', // Green for balance
      currency: '#1a202c', // Dark text on green background
    },
    ticket: {
      price: '#48bb78', // Green for price
      available: '#48bb78', // Green for available
      soldOut: '#e53e3e', // Red for sold out
    },
    competition: {
      progress: '#9f7aea', // Purple for progress
      prize: '#48bb78', // Green for prize
      category: {
        mystery: '#9f7aea', // Purple
        instant: '#ed8936', // Orange
        daily: '#48bb78', // Green
        spin: '#3182ce', // Blue
      },
    },
    alerts: {
      success: {
        bg: '#f0fff4',
        bgDark: '#1a2e1a',
        border: '#48bb78',
        text: '#22543d',
        textDark: '#68d391',
        icon: '#48bb78',
      },
      error: {
        bg: '#fef2f2',
        bgDark: '#2d1b1b',
        border: '#e53e3e',
        text: '#7f1d1d',
        textDark: '#fca5a5',
        icon: '#e53e3e',
      },
      warning: {
        bg: '#fffbeb',
        bgDark: '#2d2416',
        border: '#ed8936',
        text: '#92400e',
        textDark: '#fcd34d',
        icon: '#ed8936',
      },
      info: {
        bg: '#e6f7ff',
        bgDark: '#1a2332',
        border: '#3182ce',
        text: '#003a8c',
        textDark: '#69c0ff',
        icon: '#3182ce',
      },
    },
  },
} as const;

// Type for theme colors
export type ThemeColors = typeof theme.colors;
export type SemanticColors = typeof theme.semantic;

// Helper function to get color value by path
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let value: unknown = theme;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      console.warn(`Color path "${path}" not found in theme`);
      return '#000000'; // fallback color
    }
  }

  return typeof value === 'string' ? value : '#000000';
};

// Helper function to get semantic color
export const getSemanticColor = (category: keyof SemanticColors, variant: string): string => {
  const categoryColors = theme.semantic[category];
  if (categoryColors && variant in categoryColors) {
    return (categoryColors as Record<string, string>)[variant];
  }
  console.warn(`Semantic color "${category}.${variant}" not found`);
  return '#000000';
};