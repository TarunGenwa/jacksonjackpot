# Theme Switching Guide

## Overview
The application supports three color themes that can be switched via environment variable:

### Available Themes

#### 1. Purple Theme (Default)
- **Theme ID**: `purple`
- **Primary Color**: Electric Violet (#963CFF)
- **Secondary Color**: Medium Purple (#68348F)
- **Accent Color**: Razzmatazz (#E90052)
- **Dark Background**: Valentino (#360D3A)
- **Light Background**: Light Purple (#F3E9F4)

#### 2. Pastel Theme
- **Theme ID**: `pastel`
- **Primary Color**: Thistle (#cdb4db)
- **Secondary Color**: Light Sky Blue (#a2d2ff)
- **Accent Color**: Carnation Pink (#ffafcc)
- **Dark Background**: Dark Thistle (#2b1a36)
- **Light Background**: Very Light Thistle (#f5f0f8)

#### 3. Black-Gold Theme
- **Theme ID**: `blackgold`
- **Primary Color**: Gold (#fca311)
- **Secondary Color**: Dark Blue (#14213d)
- **Accent Color**: Black (#000000)
- **Dark Background**: Black (#000000)
- **Light Background**: White (#ffffff)

## How to Switch Themes

### Method 1: Environment Variable (Recommended)
1. Open your `.env.local` file in the client directory
2. Set the theme mode:
   ```bash
   # For Purple Theme (default)
   NEXT_PUBLIC_THEME_MODE=purple

   # For Pastel Theme
   NEXT_PUBLIC_THEME_MODE=pastel

   # For Black-Gold Theme
   NEXT_PUBLIC_THEME_MODE=blackgold
   ```
3. Restart your development server:
   ```bash
   npm run dev
   ```

### Method 2: Build Time Configuration
For production builds, set the environment variable:
```bash
# For Pastel Theme
NEXT_PUBLIC_THEME_MODE=pastel npm run build

# For Black-Gold Theme
NEXT_PUBLIC_THEME_MODE=blackgold npm run build
```

## Color Mapping
All themes use the same color structure with these keys:
- `primary` - Main brand color
- `secondary` - Secondary actions and elements
- `accent` - Call-to-action buttons and highlights
- `dark` - Dark backgrounds and cards
- `light` - Light backgrounds and inner sections
- `primaryDark`/`primaryLight` - Color variants
- `secondaryDark`/`secondaryLight` - Color variants
- `accentDark`/`accentLight` - Color variants
- `success`, `warning`, `error`, `info` - Status colors
- `white`, `gray100`-`gray900`, `black` - Neutral colors

## Usage in Components
Components use the theme colors via the theme context:
```tsx
import { useTheme } from '@/contexts/ThemeContext';

const { getThemeColor, colorTheme } = useTheme();

// Get current theme colors
const primaryColor = getThemeColor('primary');
const backgroundColor = getThemeColor('dark');

// Check current theme
if (colorTheme === 'pastel') {
  // Pastel-specific logic
} else if (colorTheme === 'blackgold') {
  // Black-Gold-specific logic
}
```

## Notes
- Theme switching requires a server restart as it uses build-time environment variables
- All existing components automatically adapt to the new theme
- The theme structure remains consistent across all themes for easy switching