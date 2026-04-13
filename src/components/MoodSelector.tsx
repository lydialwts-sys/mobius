import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../constants/theme';
import { moodOptions } from '../data/mockData';

interface Props {
  selected: string | null;
  onSelect: (mood: string) => void;
}

export function MoodSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {moodOptions.map((mood) => (
        <Pressable
          key={mood.label}
          onPress={() => onSelect(mood.label.toLowerCase())}
          style={[
            styles.option,
            selected === mood.label.toLowerCase() && { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
          ]}
        >
          <Text style={styles.emoji}>{mood.emoji}</Text>
          <Text style={[styles.label, selected === mood.label.toLowerCase() && { fontWeight: '600' }]}>
            {mood.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  option: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    minWidth: 72,
  },
  emoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.small,
  },
});
