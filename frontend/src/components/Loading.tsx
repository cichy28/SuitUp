import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { colors, typography, spacing } from '../styles/designTokens';

const StyledView = styled(View);
const StyledText = styled(Text);

interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
  className?: string;
  textClassName?: string;
}

const Loading: React.FC<LoadingProps> = ({
  text = 'Ładowanie...',
  size = 'large',
  fullScreen = false,
  className = '',
  textClassName = '',
}) => {
  // Base classes
  let containerClasses = 'items-center justify-center';
  let textClasses = `text-textSecondary mt-${spacing.sm}`;
  
  // Full screen
  if (fullScreen) {
    containerClasses += ' flex-1 bg-background';
  } else {
    containerClasses += ` py-${spacing.lg}`;
  }
  
  // Add custom classes
  containerClasses += ` ${className}`;
  textClasses += ` ${textClassName}`;
  
  return (
    <StyledView className={containerClasses}>
      <ActivityIndicator size={size} color={colors.primary} />
      {text && <StyledText className={textClasses}>{text}</StyledText>}
    </StyledView>
  );
};

export default Loading;


