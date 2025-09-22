#!/bin/bash

# Script to replace hardcoded colors with theme references across the app
# This script will systematically replace all hardcoded EPL colors with getThemeColor() calls

echo "🎨 Starting color replacement process..."

# Define the source directory
SRC_DIR="/Users/tarungenwa/Documents/dev/networkgaming/jj-plus/client/src"

# Find all TSX and TS files (excluding theme files)
FILES=$(find "$SRC_DIR" -name "*.tsx" -o -name "*.ts" | grep -v "theme" | grep -v "scripts")

echo "📁 Found $(echo "$FILES" | wc -l) files to process..."

# Function to replace colors in a file
replace_colors_in_file() {
    local file="$1"
    echo "🔄 Processing: $file"

    # Check if file uses theme context
    if ! grep -q "useTheme\|getThemeColor" "$file"; then
        # Add useTheme import if it doesn't exist and file has other React imports
        if grep -q "from 'react'" "$file" && ! grep -q "useTheme" "$file"; then
            # Check if it already imports from @/contexts/ThemeContext
            if grep -q "from '@/contexts/ThemeContext'" "$file"; then
                # Add getThemeColor to existing import
                sed -i '' 's/} from '\''@\/contexts\/ThemeContext'\'';/, getThemeColor } from '\''@\/contexts\/ThemeContext'\'';/' "$file"
            else
                # Add new import line after other context imports or react imports
                if grep -q "from '@/contexts/" "$file"; then
                    sed -i '' '/from '\''@\/contexts\//a\
import { useTheme } from '\''@/contexts/ThemeContext'\'';' "$file"
                else
                    sed -i '' '/from '\''react'\''/a\
import { useTheme } from '\''@/contexts/ThemeContext'\'';' "$file"
                fi
            fi

            # Add getThemeColor hook in component
            if grep -q "export default function\|export function\|const.*=.*=>" "$file"; then
                # Find the first hook or variable declaration and add getThemeColor after it
                sed -i '' '/const \|useState\|useEffect/ {
                    /getThemeColor/!{
                        a\
  const { getThemeColor } = useTheme();
                        n
                    }
                }' "$file"
            fi
        fi
    fi

    # Replace hardcoded EPL brand colors
    sed -i '' '
        # Replace hex colors with theme references
        s/"#360D3A"/{getThemeColor("brand.valentino")}/g
        s/'\''#360D3A'\''/{getThemeColor("brand.valentino")}/g
        s/"#E90052"/{getThemeColor("brand.razzmatazz")}/g
        s/'\''#E90052'\''/{getThemeColor("brand.razzmatazz")}/g
        s/"#963CFF"/{getThemeColor("brand.electricViolet")}/g
        s/'\''#963CFF'\''/{getThemeColor("brand.electricViolet")}/g
        s/"#FFFFFF"/{getThemeColor("brand.white")}/g
        s/'\''#FFFFFF'\''/{getThemeColor("brand.white")}/g

        # Replace extended palette colors
        s/"#4E2A7F"/{getThemeColor("valentino.800")}/g
        s/'\''#4E2A7F'\''/{getThemeColor("valentino.800")}/g
        s/"#1A061D"/{getThemeColor("valentino.950")}/g
        s/'\''#1A061D'\''/{getThemeColor("valentino.950")}/g
        s/"#CC0048"/{getThemeColor("razzmatazz.600")}/g
        s/'\''#CC0048'\''/{getThemeColor("razzmatazz.600")}/g
        s/"#A6003A"/{getThemeColor("razzmatazz.700")}/g
        s/'\''#A6003A'\''/{getThemeColor("razzmatazz.700")}/g
        s/"#8636E6"/{getThemeColor("electricViolet.600")}/g
        s/'\''#8636E6'\''/{getThemeColor("electricViolet.600")}/g
        s/"#6F2DCC"/{getThemeColor("electricViolet.700")}/g
        s/'\''#6F2DCC'\''/{getThemeColor("electricViolet.700")}/g

        # Replace object property assignments
        s/bg: "#360D3A"/bg: getThemeColor("brand.valentino")/g
        s/color: "#E90052"/color: getThemeColor("brand.razzmatazz")/g
        s/color: "#963CFF"/color: getThemeColor("brand.electricViolet")/g
        s/bg: "#4E2A7F"/bg: getThemeColor("valentino.800")/g
        s/bg: "#CC0048"/bg: getThemeColor("razzmatazz.600")/g
        s/bg: "#8636E6"/bg: getThemeColor("electricViolet.600")/g

        # Replace commonly used color names
        s/color="white"/color={getThemeColor("brand.white")}/g
        s/color='\''white'\''/color={getThemeColor("brand.white")}/g
        s/bg="white"/bg={getThemeColor("brand.white")}/g
        s/bg='\''white'\''/bg={getThemeColor("brand.white")}/g
    ' "$file"
}

# Process each file
for file in $FILES; do
    # Skip if file doesn't contain any hardcoded colors we care about
    if grep -q "#360D3A\|#E90052\|#963CFF\|#4E2A7F\|#CC0048\|#8636E6" "$file"; then
        replace_colors_in_file "$file"
    fi
done

echo "✅ Color replacement completed!"
echo "📝 Next steps:"
echo "   1. Review the changes in your components"
echo "   2. Test the app to ensure colors are working correctly"
echo "   3. Run the lint command to check for any syntax issues"