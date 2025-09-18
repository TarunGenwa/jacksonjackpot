export const theme = {
  colors: {
    // Primary brand colors
    primary: {
      50: '#f0e6ff',
      100: '#d4bfff',
      200: '#b899ff',
      300: '#9c72ff',
      400: '#804cff',
      500: '#6b46c1', // Main purple
      600: '#553c9a',
      700: '#3f2f72',
      800: '#2a224a',
      900: '#1a1a2e', // Dark purple
    },

    // Secondary brand colors
    secondary: {
      50: '#e6f7ff',
      100: '#bae7ff',
      200: '#91d5ff',
      300: '#69c0ff',
      400: '#40a9ff',
      500: '#1890ff', // Main blue
      600: '#096dd9',
      700: '#0050b3',
      800: '#003a8c',
      900: '#1e3a8a', // Dark blue
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

    // Error colors (red)
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
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
      light: '#ffffff',
      dark: '#1a1a2e',
      darker: '#16213e',
      card: {
        light: '#ffffff',
        dark: '#2d3748',
      },
      modal: {
        light: 'rgba(255, 255, 255, 0.95)',
        dark: 'rgba(26, 26, 46, 0.95)',
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
      dark: '#4a5568',
      focus: '#6b46c1',
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

    // Gradient colors
    gradients: {
      primary: 'linear(to-r, purple.900, blue.900, purple.900)',
      secondary: 'linear(to-br, purple.900, blue.900)',
      header: 'linear(to-r, purple.900, blue.900, purple.900)',
      card: 'linear(to-br, purple.700, blue.700)',
      button: {
        primary: 'linear(to-r, purple.500, blue.500)',
        success: 'linear(to-r, green.500, green.400)',
      },
      text: {
        brand: 'linear(to-r, cyan.400, blue.400, purple.400)',
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
  let value: any = theme;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
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
    return (categoryColors as any)[variant];
  }
  console.warn(`Semantic color "${category}.${variant}" not found`);
  return '#000000';
};