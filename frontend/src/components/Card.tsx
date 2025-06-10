import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius, spacing, shadows } from '../styles/designTokens';

/**
 * Card component for displaying content in a card format
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {string} props.imageSource - Image source
 * @param {boolean} props.selected - Whether card is selected
 * @param {Function} props.onPress - Function to call when card is pressed
 * @param {Object} props.style - Additional styles to apply
 */
const Card = ({
  children,
  title,
  subtitle,
  imageSource,
  selected = false,
  onPress,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
        style
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      {...props}
    >
      {imageSource && (
        <Image 
          source={imageSource} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.textPrimary,
    shadowOffset: shadows.md.shadowOffset,
    shadowOpacity: shadows.md.shadowOpacity,
    shadowRadius: shadows.md.shadowRadius,
    elevation: 2,
    overflow: 'hidden',
  },
  selected: {
    backgroundColor: colors.beige,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  titleContainer: {
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  },
});

export default Card;


