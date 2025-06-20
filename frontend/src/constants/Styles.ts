import Colors from './Colors';

export const Spacing = {
  small: 8,
  medium: 16,
  large: 24,
  xLarge: 32,
};

export const Typography = {
  fontSize:
  {
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
  },
  fontWeight: {
    normal: '400',
    bold: '700',
  }
};

export const Borders = {
  radius: {
    small: 4,
    medium: 8,
    large: 12,
  },
  borderWidth: {
    thin: 1,
    medium: 2,
  },
};

export const GlobalStyles = {
  container: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: Typography.fontSize.xLarge,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.text,
    marginBottom: Spacing.large,
  },
  card: {
    backgroundColor: Colors.light.white,
    borderRadius: Borders.radius.medium,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: Spacing.medium,
    borderRadius: Borders.radius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.light.white,
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.bold,
  },
  input: {
    borderWidth: Borders.borderWidth.thin,
    borderColor: Colors.light.gray,
    padding: Spacing.medium,
    borderRadius: Borders.radius.small,
    fontSize: Typography.fontSize.medium,
    backgroundColor: Colors.light.white,
  },
};

export default GlobalStyles;