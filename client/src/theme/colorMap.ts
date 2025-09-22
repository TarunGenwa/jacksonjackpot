// Color mapping for easy migration from hardcoded colors to theme
// This provides a simple mapping for commonly used hardcoded colors

export const colorMap = {
  // EPL Brand Colors (direct)
  '#360D3A': 'brand.valentino',
  '#E90052': 'brand.razzmatazz',
  '#963CFF': 'brand.electricViolet',
  '#FFFFFF': 'brand.white',

  // Extended palette mappings
  '#4E2A7F': 'valentino.800',
  '#1A061D': 'valentino.950',
  '#CC0048': 'razzmatazz.600',
  '#A6003A': 'razzmatazz.700',
  '#8636E6': 'electricViolet.600',
  '#6F2DCC': 'electricViolet.700',

  // Common UI colors
  '#48bb78': 'semantic.success.DEFAULT',
  '#38a169': 'semantic.success.dark',
  '#2f855a': 'semantic.success.dark',
  '#ed8936': 'semantic.warning.DEFAULT',
  '#3182ce': 'semantic.info.DEFAULT',

  // Neutral colors
  '#171717': 'neutral.900',
  '#525252': 'neutral.600',
  '#737373': 'neutral.500',
  '#A3A3A3': 'neutral.400',
  '#D4D4D4': 'neutral.300',
  '#E5E5E5': 'neutral.200',
  '#F5F5F5': 'neutral.100',
  '#FAFAFA': 'neutral.50',

  // Common Chakra UI colors that should be replaced
  'purple.900': 'backgrounds.card.primary',
  'purple.800': 'valentino.800',
  'purple.700': 'valentino.700',
  'purple.600': 'valentino.600',
  'purple.500': 'valentino.500',
  'purple.400': 'valentino.400',
  'purple.300': 'valentino.300',

  'blue.900': 'backgrounds.card.primary',
  'blue.800': 'electricViolet.800',
  'blue.700': 'electricViolet.700',
  'blue.600': 'electricViolet.600',
  'blue.500': 'electricViolet.500',
  'blue.400': 'electricViolet.400',

  'green.400': 'semantic.success.DEFAULT',
  'green.300': 'semantic.success.light',
  'green.500': 'semantic.success.DEFAULT',

  'red.400': 'semantic.error.DEFAULT',
  'red.500': 'semantic.error.DEFAULT',

  'yellow.400': 'semantic.warning.DEFAULT',
  'orange.400': 'semantic.warning.DEFAULT',

  'gray.900': 'neutral.900',
  'gray.800': 'neutral.800',
  'gray.700': 'neutral.700',
  'gray.600': 'neutral.600',
  'gray.500': 'neutral.500',
  'gray.400': 'neutral.400',
  'gray.300': 'neutral.300',
  'gray.200': 'neutral.200',
  'gray.100': 'neutral.100',
  'gray.50': 'neutral.50',

  'white': 'brand.white',
  'black': 'neutral.black',

  // Alpha/transparency colors
  'blackAlpha.900': 'alpha.black.900',
  'blackAlpha.800': 'alpha.black.800',
  'blackAlpha.700': 'alpha.black.700',
  'blackAlpha.600': 'alpha.black.600',
  'blackAlpha.500': 'alpha.black.500',
  'blackAlpha.400': 'alpha.black.400',
  'blackAlpha.300': 'alpha.black.300',
  'blackAlpha.200': 'alpha.black.200',
  'blackAlpha.100': 'alpha.black.100',

  'whiteAlpha.900': 'alpha.white.900',
  'whiteAlpha.800': 'alpha.white.800',
  'whiteAlpha.700': 'alpha.white.700',
  'whiteAlpha.600': 'alpha.white.600',
  'whiteAlpha.500': 'alpha.white.500',
  'whiteAlpha.400': 'alpha.white.400',
  'whiteAlpha.300': 'alpha.white.300',
  'whiteAlpha.200': 'alpha.white.200',
  'whiteAlpha.100': 'alpha.white.100',
} as const;

// Component-specific color mappings
export const componentColorMap = {
  // Header
  header: {
    bg: 'components.header.bg',
    border: 'components.header.border',
    text: 'components.header.text',
    logo: 'components.header.logo',
  },

  // Competition Cards
  competitionCard: {
    bg: 'components.competitionCard.bg',
    border: 'components.competitionCard.border',
    hoverBorder: 'components.competitionCard.hoverBorder',
    imagePlaceholder: 'components.competitionCard.imagePlaceholder',
  },

  // Buttons
  button: {
    primary: {
      bg: 'ui.button.primary.bg',
      hover: 'ui.button.primary.hover',
      active: 'ui.button.primary.active',
      text: 'ui.button.primary.text',
    },
    secondary: {
      bg: 'ui.button.secondary.bg',
      hover: 'ui.button.secondary.hover',
      active: 'ui.button.secondary.active',
      text: 'ui.button.secondary.text',
    },
    accent: {
      bg: 'ui.button.accent.bg',
      hover: 'ui.button.accent.hover',
      active: 'ui.button.accent.active',
      text: 'ui.button.accent.text',
    },
  },

  // Text colors
  text: {
    primary: 'text.primary',
    secondary: 'text.secondary',
    muted: 'text.muted',
    accent: 'text.accent',
    link: 'text.link',
    success: 'text.success',
    error: 'text.error',
    warning: 'text.warning',
  },

  // Backgrounds
  background: {
    page: 'backgrounds.page',
    card: 'backgrounds.card.primary',
    cardSecondary: 'backgrounds.card.secondary',
    modal: 'backgrounds.modal',
    overlay: 'backgrounds.card.overlay',
  },

  // Borders
  border: {
    default: 'borders.default',
    focus: 'borders.focus',
    error: 'borders.error',
    success: 'borders.success',
  },
} as const;

export type ColorMapKey = keyof typeof colorMap;
export type ComponentColorMapKey = keyof typeof componentColorMap;