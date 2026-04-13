import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { PRESS_SCALE, SPRING_SNAPPY } from '../constants/animations';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'subtle' | 'neutral' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', style, disabled, fullWidth }: Props) {
  const paddingV = { sm: 10, md: 16, lg: 18 }[size];
  const paddingH = { sm: 16, md: 24, lg: 32 }[size];
  const fontSize = { sm: 14, md: 16, lg: 16 }[size];
  const [pressed, setPressed] = React.useState(false);

  return (
    <MotiView
      animate={{ scale: pressed && !disabled ? PRESS_SCALE : 1 }}
      transition={{ type: 'spring', ...SPRING_SNAPPY }}
      style={fullWidth ? { width: '100%' } : undefined}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[
          styles.base,
          styles[variant],
          {
            paddingVertical: paddingV,
            paddingHorizontal: paddingH,
            opacity: disabled ? 0.4 : 1,
          },
          fullWidth && { width: '100%' as any },
          style,
        ]}
      >
        <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles], { fontSize }]}>
          {title}
        </Text>
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: BorderRadius.pill, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: Colors.primary },
  subtle: { backgroundColor: Colors.border },
  neutral: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border },
  ghost: { backgroundColor: 'transparent' },
  text: { fontWeight: '600' },
  primaryText: { color: Colors.textLight },
  subtleText: { color: Colors.text },
  neutralText: { color: Colors.text },
  ghostText: { color: Colors.textSecondary },
});
