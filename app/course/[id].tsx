import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Colors, Layout, Spacing, Typography, BorderRadius, Fonts } from '../../src/constants/theme';
import { SPRING_BOUNCY, staggerDelay } from '../../src/constants/animations';
import { courses } from '../../src/data/mockData';
import { BackButton } from '../../src/components/BackButton';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return <View style={styles.container}><Text>Course not found</Text></View>;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <BackButton fallbackRoute="/(tabs)" />
          <View style={styles.courseDropdown}>
            <Text style={styles.courseDropdownText}>{course.title}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.text} />
          </View>
        </View>

        {/* Tree path view */}
        <ScrollView contentContainerStyle={styles.treeContainer}>
          {course.lessons.map((lesson, index) => {
            const isCompleted = lesson.completed;
            const isAvailable = lesson.steps.length > 0;

            return (
              <MotiView key={lesson.id} from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', ...SPRING_BOUNCY, delay: staggerDelay(index, 100) }} style={styles.treeNode}>
                {/* Dotted line connector */}
                {index > 0 && (
                  <View style={styles.connector}>
                    <View style={styles.dottedLine} />
                  </View>
                )}

                {/* Lesson node */}
                <Pressable
                  style={styles.lessonNode}
                  onPress={() => {
                    if (isAvailable) {
                      router.push(`/course/lesson/${lesson.id}`);
                    }
                  }}
                >
                  {/* Character circle */}
                  <View style={[
                    styles.nodeCircle,
                    !isAvailable && styles.nodeLocked,
                  ]}>
                    {isCompleted ? (
                      <Text style={styles.checkmark}>✓</Text>
                    ) : isAvailable ? (
                      <Image
                        source={require('../../assets/emotions_png/motivated.png')}
                        style={{ width: 44, height: 44 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Ionicons name="lock-closed" size={24} color={Colors.textSecondary} />
                    )}
                  </View>

                  {/* Label pill */}
                  <View style={styles.nodeLabelPill}>
                    <Text style={styles.nodeLabelText}>{lesson.title}</Text>
                  </View>
                </Pressable>
              </MotiView>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Layout.statusBarOffset,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  courseDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  courseDropdownText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 16,
    color: Colors.text,
  },
  treeContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  treeNode: {
    alignItems: 'center',
  },
  connector: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dottedLine: {
    width: 2,
    height: 40,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lessonNode: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nodeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brand,
    borderWidth: 2,
    borderColor: Colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLocked: {
    backgroundColor: Colors.border,
    borderColor: Colors.border,
  },
  checkmark: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  nodeLabelPill: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  nodeLabelText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
});
