import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/designTokens';

const StyledView = styled(View);
const StyledText = styled(Text);

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = '',
  titleClassName = '',
  contentClassName = '',
}) => {
  // Base classes
  let containerClasses = `mb-${spacing.lg}`;
  let titleClasses = `text-h3 font-h3 text-textPrimary mb-${spacing.sm}`;
  let contentClasses = `bg-cardBackground rounded-lg shadow-md border border-border`;
  
  // Add custom classes
  containerClasses += ` ${className}`;
  titleClasses += ` ${titleClassName}`;
  contentClasses += ` ${contentClassName}`;
  
  return (
    <StyledView className={containerClasses}>
      {title && <StyledText className={titleClasses}>{title}</StyledText>}
      <StyledView className={contentClasses}>
        {children}
      </StyledView>
    </StyledView>
  );
};

export default Section;


