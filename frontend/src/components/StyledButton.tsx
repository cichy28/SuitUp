import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius } from '../constants/Theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

const StyledButton = ({ title, onPress, variant = 'primary', style }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, styles[variant], style]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.lightGray,
  },
  text: {
    color: Colors.white,
    fontSize: Fonts.sizes.body,
    fontWeight: Fonts.weights.bold,
  },
});

export default StyledButton;