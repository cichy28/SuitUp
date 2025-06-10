import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../styles/designTokens';

/**
 * Button component with different variants based on the design system
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'outline', 'text')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {Function} props.onPress - Function to call when button is pressed
 * @param {React.ReactNode} props.children - Button content
 * @param {Object} props.style - Additional styles to apply
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onPress,
  children,
  style,
  ...props
}) => {
  // Determine styles based on variant and size
  const getButtonStyles = () => {
    // Base styles
    const baseStyles = {
      borderRadius: borderRadius.full, // Full rounded
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Size styles
    const sizeStyles = {
      sm: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
      },
      md: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      },
      lg: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: colors.primary,
      },
      secondary: {
        backgroundColor: colors.secondary,
        borderWidth: 1,
        borderColor: colors.border,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
      },
      text: {
        backgroundColor: 'transparent',
      },
    };

    // Disabled styles
    const disabledStyles = {
      backgroundColor: colors.textSecondary,
      borderColor: colors.textSecondary,
    };

    // Width styles
    const widthStyles = fullWidth ? { width: '100%' } : {};

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(disabled ? disabledStyles : {}),
      ...widthStyles,
    };
  };

  // Determine text styles based on variant and disabled state
  const getTextStyles = () => {
    const baseStyles = {
      fontFamily: typography.fontFamily,
      fontWeight: typography.body.fontWeight,
      textAlign: 'center',
    };

    const sizeStyles = {
      sm: { fontSize: typography.small.fontSize },
      md: { fontSize: typography.body.fontSize },
      lg: { fontSize: typography.h3.fontSize },
    };

    const variantStyles = {
      primary: { color: colors.secondary },
      secondary: { color: colors.textPrimary },
      outline: { color: colors.primary },
      text: { color: colors.primary },
    };

    const disabledStyles = {
      color: colors.textPrimary,
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(disabled ? disabledStyles : {}),
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={getTextStyles()}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;


