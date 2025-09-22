export { theme, getColor, getSemanticColor } from './colors';
export type { ThemeColors, SemanticColors } from './colors';

// Export commonly used color combinations with EPL branding
export const commonColors = {
  // Button variants
  buttons: {
    primary: {
      bg: '#963CFF', // EPL Electric Violet
      color: '#FFFFFF',
      hover: '#8636E6',
      active: '#6F2DCC',
    },
    accent: {
      bg: '#E90052', // EPL Razzmatazz
      color: '#FFFFFF',
      hover: '#CC0048',
      active: '#A6003A',
    },
    success: {
      bg: '#48bb78',
      color: '#1a202c',
      hover: '#38a169',
      active: '#2f855a',
    },
    ghost: {
      bg: 'transparent',
      color: '#FFFFFF',
      hover: 'rgba(150, 60, 255, 0.2)', // Electric Violet with opacity
    },
  },

  // Card variants
  cards: {
    primary: {
      bg: '#360D3A', // Solid EPL Valentino
      border: '#963CFF', // Electric Violet
      hoverBorder: '#E90052', // Razzmatazz on hover
    },
    secondary: {
      bg: '#4E2A7F', // Lighter Valentino variant
      border: '#963CFF',
      hoverBorder: '#E90052',
    },
  },

  // Text variants
  text: {
    primary: '#FFFFFF',
    secondary: '#D9BFFF', // Light Electric Violet
    muted: '#A96BFF', // Medium Electric Violet
    accent: '#E90052', // EPL Razzmatazz
  },

  // Status variants
  status: {
    success: '#48bb78',
    error: '#E90052', // EPL Razzmatazz
    warning: '#ed8936',
    info: '#963CFF', // EPL Electric Violet
  },
} as const;