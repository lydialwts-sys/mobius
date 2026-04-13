import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { Colors, BorderRadius, Spacing, Typography } from '../constants/theme';
import { SPRING_BOUNCY, PRESS_SCALE } from '../constants/animations';
import type { EmotionCharacter as EmotionCharacterType } from '../data/mockData';

interface Props {
  character: EmotionCharacterType;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  showName?: boolean;
  index?: number;
}

export function EmotionCharacter({ character, size = 'md', onPress, showName = true, index = 0 }: Props) {
  const dimensions = { sm: 48, md: 72, lg: 100 }[size];
  const fontSize = { sm: 20, md: 32, lg: 48 }[size];
  const [pressed, setPressed] = React.useState(false);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: pressed ? PRESS_SCALE : 1 }}
      transition={{ type: 'spring', ...SPRING_BOUNCY, delay: index * 60 }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={styles.container}
      >
        <View style={[
          styles.circle,
          { width: dimensions, height: dimensions, backgroundColor: character.unlocked ? Colors.brand : Colors.border, borderColor: character.unlocked ? Colors.text : Colors.border },
        ]}>
          <Text style={{ fontSize }}>{character.unlocked ? character.emoji : '🔒'}</Text>
        </View>
        {showName && (
          <Text style={[styles.name, { color: character.unlocked ? Colors.text : Colors.textSecondary }]}>{character.name}</Text>
        )}
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: Spacing.xs },
  circle: { borderRadius: 999, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  name: { ...Typography.small, fontWeight: '600', textAlign: 'center', maxWidth: 80 },
});
