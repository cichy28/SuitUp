import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { colors, typography, spacing, borderRadius } from '../styles/designTokens';

const StyledView = styled(View);
const StyledText = styled(Text);

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  actionClassName = '',
}) => {
  // Base classes
  let containerClasses = `items-center justify-center py-${spacing.xl} px-${spacing.md}`;
  let titleClasses = `text-lg font-bold text-textPrimary mt-${spacing.md} text-center`;
  let descriptionClasses = `text-textSecondary text-center mt-${spacing.sm}`;
  let actionClasses = `mt-${spacing.lg} bg-primary py-${spacing.sm} px-${spacing.lg} rounded-full`;
  
  // Add custom classes
  containerClasses += ` ${className}`;
  titleClasses += ` ${titleClassName}`;
  descriptionClasses += ` ${descriptionClassName}`;
  actionClasses += ` ${actionClassName}`;
  
  return (
    <StyledView className={containerClasses}>
      {icon}
      <StyledText className={titleClasses}>{title}</StyledText>
      {description && (
        <StyledText className={descriptionClasses}>{description}</StyledText>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} className={actionClasses}>
          <StyledText className="text-secondary font-medium">{actionLabel}</StyledText>
        </TouchableOpacity>
      )}
    </StyledView>
  );
};

export default EmptyState;


