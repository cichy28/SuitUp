import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../styles/designTokens';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          checked ? styles.checkboxChecked : styles.checkboxUnchecked,
          disabled && styles.checkboxDisabled,
        ]}
      >
        {checked && (
          <Ionicons name="checkmark" size={16} color={colors.secondary} />
        )}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxUnchecked: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
  },
  checkboxDisabled: {
    opacity: 0.6,
  },
  label: {
    marginLeft: spacing.sm,
    color: colors.textPrimary,
    fontSize: 16,
  },
});

export default Checkbox;


