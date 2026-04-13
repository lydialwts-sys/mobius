export const Fonts = {
  heading: 'Fraunces-Bold',
  headingSemiBold: 'Fraunces-SemiBold',
  headingRegular: 'Fraunces-Regular',
  body: 'GoogleSans-Regular',
  bodyMedium: 'GoogleSans-Medium',
  bodySemiBold: 'GoogleSans-SemiBold',
  bodyBold: 'GoogleSans-Bold',
};

export const Colors = {
  primary: '#002FA7',
  primaryLight: '#002FA710',
  brand: '#EAB308',
  brandLight: '#EAB30820',
  background: '#F6F5F2',
  surface: '#FFFFFF',
  text: '#1E1E1E',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  textLight: '#F6F5F2',
  border: '#E5E5E5',
  borderLight: '#F0F0F0',
  cardInactive: '#EBE8DD',
  cardBorder: '#DBD9D4',
  success: '#16A34A',
  warning: '#EAB308',
  error: '#DC2626',
  dark: '#2F2C27',
  black: '#000000',
  mood: {
    happy: '#EAB308',
    sad: '#64B5F6',
    anxious: '#FF8A65',
    angry: '#EF5350',
    calm: '#81C784',
    confused: '#CE93D8',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  pill: 9999,
};

export const Typography = {
  displayLarge: {
    fontSize: 32,
    fontWeight: '700' as const,
    fontFamily: Fonts.heading,
    color: Colors.text,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
    fontFamily: Fonts.heading,
    color: Colors.text,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600' as const,
    fontFamily: Fonts.bodySemiBold,
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: Fonts.body,
    color: Colors.text,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: Fonts.bodySemiBold,
    color: Colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: Fonts.body,
    color: Colors.textSecondary,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: Fonts.body,
    color: Colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: Fonts.bodySemiBold,
    color: Colors.textLight,
  },
};

// Layout constants — avoid hardcoded magic numbers
export const Layout = {
  statusBarOffset: 52,
  screenPaddingH: Spacing.xxl,
  tabBarHeight: 80,
  iconSize: 24,
  backButtonSize: 24,
};
