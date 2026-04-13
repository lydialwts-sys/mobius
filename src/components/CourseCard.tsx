import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { Colors, BorderRadius, Spacing, Typography } from '../constants/theme';
import { SPRING_SNAPPY, PRESS_SCALE } from '../constants/animations';
import type { Course } from '../data/mockData';

interface Props {
  course: Course;
  onPress: () => void;
}

export function CourseCard({ course, onPress }: Props) {
  const [pressed, setPressed] = React.useState(false);

  return (
    <MotiView animate={{ scale: pressed ? PRESS_SCALE : 1 }} transition={{ type: 'spring', ...SPRING_SNAPPY }}>
      <Pressable onPress={onPress} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)} style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{course.emoji}</Text>
          <View style={styles.headerText}>
            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.description} numberOfLines={2}>{course.description}</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.tag}><Text style={styles.tagText}>{course.totalLessons} lessons</Text></View>
        </View>
        <View style={styles.progressBar}>
          <MotiView
            from={{ width: '0%' as any }}
            animate={{ width: `${course.progress * 100}%` as any }}
            transition={{ type: 'timing', duration: 800, delay: 300 }}
            style={styles.progressFill}
          />
        </View>
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg, gap: Spacing.md },
  header: { flexDirection: 'row', gap: Spacing.md },
  emoji: { fontSize: 32 },
  headerText: { flex: 1 },
  title: { ...Typography.bodyBold, marginBottom: Spacing.xs },
  description: { ...Typography.caption, lineHeight: 20 },
  metaRow: { flexDirection: 'row' },
  tag: { backgroundColor: Colors.borderLight, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.pill },
  tagText: { ...Typography.small, color: Colors.text, fontWeight: '500' },
  progressBar: { height: 4, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.text, borderRadius: 2 },
});
