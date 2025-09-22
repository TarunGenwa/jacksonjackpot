export const EPL_COLORS = {
  valentino: {
    hex: '#360D3A',
    rgb: 'rgb(54, 13, 58)',
    hsl: 'hsl(295, 63%, 14%)',
    name: 'Valentino (Primary Dark)',
    description: 'Deep purple used for primary backgrounds and sophisticated branding elements'
  },
  razzmatazz: {
    hex: '#E90052',
    rgb: 'rgb(233, 0, 82)',
    hsl: 'hsl(339, 100%, 46%)',
    name: 'Razzmatazz (Accent Red)',
    description: 'Vibrant red used for highlights, call-to-actions, and energetic accents'
  },
  electricViolet: {
    hex: '#963CFF',
    rgb: 'rgb(150, 60, 255)',
    hsl: 'hsl(268, 100%, 62%)',
    name: 'Electric Violet (Secondary Purple)',
    description: 'Bright violet used for modern digital elements and vibrant accents'
  },
  white: {
    hex: '#FFFFFF',
    rgb: 'rgb(255, 255, 255)',
    hsl: 'hsl(0, 0%, 100%)',
    name: 'White',
    description: 'Used for text, backgrounds, and contrast elements'
  }
} as const;

export const EPL_THEME = {
  // Primary colors
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
    900: '#360D3A', // Valentino
  },

  // Accent colors (Razzmatazz)
  accent: {
    50: '#FFE0EC',
    100: '#FFB3D0',
    200: '#FF80B1',
    300: '#FF4D93',
    400: '#FF267A',
    500: '#E90052', // Razzmatazz
    600: '#CC0048',
    700: '#A6003A',
    800: '#80002D',
    900: '#590020',
  },

  // Secondary colors (Electric Violet)
  secondary: {
    50: '#F0E6FF',
    100: '#D9BFFF',
    200: '#C195FF',
    300: '#A96BFF',
    400: '#9F53FF',
    500: '#963CFF', // Electric Violet
    600: '#8636E6',
    700: '#6F2DCC',
    800: '#5924B3',
    900: '#421A99',
  },

  // Neutral colors
  neutral: {
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
  },

  // Semantic colors
  success: {
    50: '#E6F9F0',
    100: '#BFF0D8',
    200: '#99E7C1',
    300: '#4DD49B',
    400: '#00C074',
    500: '#00A863',
    600: '#009052',
    700: '#007841',
    800: '#005F30',
    900: '#00471F',
  },

  error: {
    50: '#FFE0EC',
    100: '#FFB3D0',
    200: '#FF80B1',
    300: '#FF4D93',
    400: '#FF267A',
    500: '#E90052', // Using Razzmatazz for errors
    600: '#CC0048',
    700: '#A6003A',
    800: '#80002D',
    900: '#590020',
  },

  warning: {
    50: '#FFF7E6',
    100: '#FFECBF',
    200: '#FFDF99',
    300: '#FFD24D',
    400: '#FFC500',
    500: '#E6B100',
    600: '#CC9D00',
    700: '#B38900',
    800: '#997500',
    900: '#806100',
  },

  info: {
    50: '#E6F4FF',
    100: '#BFE3FF',
    200: '#99D2FF',
    300: '#4DAFFF',
    400: '#008DFF',
    500: '#007FE6',
    600: '#0071CC',
    700: '#0062B3',
    800: '#005499',
    900: '#004580',
  },

  // Background colors
  backgrounds: {
    dark: '#360D3A', // Valentino
    light: '#FFFFFF',
    card: 'rgba(54, 13, 58, 0.05)',
    overlay: 'rgba(54, 13, 58, 0.8)',
  },

  // Text colors
  text: {
    primary: '#171717',
    secondary: '#525252',
    tertiary: '#737373',
    inverse: '#FFFFFF',
    accent: '#E90052', // Razzmatazz
    link: '#963CFF', // Electric Violet
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #360D3A 0%, #963CFF 100%)',
    secondary: 'linear-gradient(135deg, #963CFF 0%, #E90052 100%)',
    accent: 'linear-gradient(135deg, #E90052 0%, #FF4D93 100%)',
    dark: 'linear-gradient(180deg, #360D3A 0%, #1A061D 100%)',
    light: 'linear-gradient(180deg, #FFFFFF 0%, #F3E9F4 100%)',
  }
} as const;

export type EPLColor = keyof typeof EPL_COLORS;
export type EPLThemeColor = keyof typeof EPL_THEME;