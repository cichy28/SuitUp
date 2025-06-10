import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle, KeyboardTypeOptions } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../styles/designTokens';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  error?: string | false | undefined;
  required?: boolean;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  formik?: {
    values: any;
    errors: any;
    touched: any;
    handleChange: (field: string) => (text: string) => void;
    handleBlur: (field: string) => () => void;
  };
  name?: string;
}

/**
 * FormField component for input fields with labels and validation
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  keyboardType = 'default',
  secureTextEntry = false,
  style,
  formik,
  name,
  ...props
}) => {
  // If formik and name are provided, use formik values
  const fieldValue = formik && name ? formik.values[name] : value;
  const fieldError = formik && name ? (formik.touched[name] && formik.errors[name]) : error;
  const handleChange = formik && name ? formik.handleChange(name) : onChangeText;
  const handleBlur = formik && name ? formik.handleBlur(name) : undefined;
  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      
      <TextInput
        style={[
          styles.input,
          fieldError && styles.inputError
        ]}
        value={fieldValue}
        onChangeText={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        {...props}
      />
      
      {fieldError && <Text style={styles.errorText}>{fieldError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textPrimary,
  },
  required: {
    color: colors.error,
    marginLeft: spacing.xs,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    width: '100%',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.small.fontSize,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily,
  },
});

export default FormField;


