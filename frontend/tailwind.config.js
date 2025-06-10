/** @type {import('tailwindcss').Config} */
const { colors, typography, spacing, borderRadius, shadows } = require('./src/styles/designTokens');

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        textPrimary: colors.textPrimary,
        textSecondary: colors.textSecondary,
        background: colors.background,
        cardBackground: colors.cardBackground,
        border: colors.border,
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
        info: colors.info,
        brown: colors.brown,
        beige: colors.beige,
      },
      fontFamily: {
        sans: [typography.fontFamily],
      },
      fontSize: {
        h1: typography.h1.fontSize,
        h2: typography.h2.fontSize,
        h3: typography.h3.fontSize,
        body: typography.body.fontSize,
        small: typography.small.fontSize,
      },
      fontWeight: {
        h1: typography.h1.fontWeight,
        h2: typography.h2.fontWeight,
        h3: typography.h3.fontWeight,
        body: typography.body.fontWeight,
        small: typography.small.fontWeight,
      },
      spacing: spacing,
      borderRadius: borderRadius,
      boxShadow: shadows,
    },
  },
  plugins: [],
}


