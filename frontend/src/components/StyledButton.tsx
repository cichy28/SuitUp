import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

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
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#82D4D4', // Teal color
  },
  secondary: {
    backgroundColor: '#E0E0E0', // Grey color
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StyledButton;