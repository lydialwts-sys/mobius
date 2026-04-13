import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Colors, BorderRadius } from '../constants/theme';

interface Props {
  progress: number; // 0 to 1
  height?: number;
  animated?: boolean;
  color?: string;
}

export function ProgressBar({ progress, height = 4, animated = true, color = Colors.text }: Props) {
  const widthPercent = `${Math.min(Math.max(progress, 0), 1) * 100}%`;

  return (
    <View style={[styles.track, { height }]}>
      {animated ? (
        <MotiView
          from={{ width: '0%' as any }}
          animate={{ width: widthPercent as any }}
          transition={{ type: 'timing', duration: 800, delay: 300 }}
          style={[styles.fill, { backgroundColor: color }]}
        />
      ) : (
        <View style={[styles.fill, { width: widthPercent as any, backgroundColor: color }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
