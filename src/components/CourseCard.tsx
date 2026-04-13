import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../constants/theme';
import type { Course } from '../data/mockData';

interface Props {
  course: Course;
  onPress: () => void;
}

export function CourseCard({ course, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{course.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{course.description}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{course.totalLessons} lessons</Text>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${course.progress * 100}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.bodyBold,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.caption,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
  },
  tagText: {
    ...Typography.small,
    color: Colors.text,
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.text,
    borderRadius: 2,
  },
});
