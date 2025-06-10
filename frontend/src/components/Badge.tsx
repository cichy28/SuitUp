import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../styles/designTokens';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: string;
  onPress?: () => void;
  className?: string;
  textClassName?: string;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'md',
  icon,
  onPress,
  className = '',
  textClassName = '',
}) => {
  // Base classes
  let containerClasses = 'rounded-full flex-row items-center';
  let textClasses = 'font-body text-body';
  
  // Size classes
  switch (size) {
    case 'sm':
      containerClasses += ` px-${spacing.xs} py-${spacing.xs}`;
      textClasses += ' text-small';
      break;
    case 'lg':
      containerClasses += ` px-${spacing.md} py-${spacing.sm}`;
      textClasses += ' text-h3';
      break;
    default: // md
      containerClasses += ` px-${spacing.sm} py-${spacing.xs}`;
      textClasses += ' text-body';
  }
  
  // Variant classes
  switch (variant) {
    case 'secondary':
      containerClasses += ` bg-secondary`;
      textClasses += ` text-textPrimary`;
      break;
    case 'success':
      containerClasses += ` bg-success`;
      textClasses += ` text-secondary`;
      break;
    case 'danger':
      containerClasses += ` bg-error`;
      textClasses += ` text-secondary`;
      break;
    case 'neutral':
      containerClasses += ` bg-border`;
      textClasses += ` text-textPrimary`;
      break;
    default: // primary
      containerClasses += ` bg-primary`;
      textClasses += ` text-secondary`;
  }
  
  // Add custom classes
  containerClasses += ` ${className}`;
  textClasses += ` ${textClassName}`;
  
  const BadgeContainer = onPress ? StyledTouchableOpacity : StyledView;
  
  return (
    <BadgeContainer
      className={containerClasses}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={size === 'sm' ? typography.small.fontSize : size === 'lg' ? typography.h3.fontSize : typography.body.fontSize} 
          color={colors.secondary} 
          style={{ marginRight: spacing.xs }} 
        />
      )}
      <StyledText className={textClasses}>{text}</StyledText>
    </BadgeContainer>
  );
};

export default Badge;


