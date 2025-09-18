export { theme, getColor, getSemanticColor } from './colors';
export type { ThemeColors, SemanticColors } from './colors';

// Export commonly used color combinations
export const commonColors = {
  // Button variants
  buttons: {
    primary: {
      bg: '#6b46c1',
      color: '#ffffff',
      hover: '#553c9a',
      active: '#3f2f72',
    },
    success: {
      bg: '#48bb78',
      color: '#1a202c',
      hover: '#38a169',
      active: '#2f855a',
    },
    ghost: {
      bg: 'transparent',
      color: '#ffffff',
      hover: 'rgba(255, 255, 255, 0.2)',
    },
  },

  // Card variants
  cards: {
    primary: {
      bg: 'linear(to-br, purple.900, blue.900)',
      border: '#553c9a',
      hoverBorder: '#9f7aea',
    },
    secondary: {
      bg: '#2d3748',
      border: '#4a5568',
      hoverBorder: '#6b7280',
    },
  },

  // Text variants
  text: {
    primary: '#ffffff',
    secondary: '#a0aec0',
    muted: '#6b7280',
    accent: '#48bb78',
  },

  // Status variants
  status: {
    success: '#48bb78',
    error: '#e53e3e',
    warning: '#ed8936',
    info: '#3182ce',
  },
} as const;