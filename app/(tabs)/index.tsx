import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Colors, Spacing, Typography, BorderRadius, Fonts } from '../../src/constants/theme';
import { SPRING_GENTLE, SPRING_SNAPPY, staggerDelay } from '../../src/constants/animations';
import { courses } from '../../src/data/mockData';
import { useUser } from '../../src/context/UserContext';
import { EmotionAsset } from '../../src/components/EmotionAsset';
import type { EmotionKey } from '../../src/constants/assets';

const emotionLessons: { id: string; title: string; progress: number; emotion: EmotionKey }[] = [
  { id: 'calm-overwhelm', title: 'Calm\noverwhelm', progress: 0.7, emotion: 'overwhelmed' },
  { id: 'reframe-jealousy', title: 'Reframe\njealousy', progress: 0.5, emotion: 'jealous' },
  { id: 'let-go-guilt', title: 'Let go of\nguilt', progress: 0.3, emotion: 'guilty' },
  { id: 'move-past-embarrassment', title: 'Move past\nembarrass\n-ment', progress: 0.1, emotion: 'embarassed' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const continueCourse = courses[1]; // The ghosted post
  const cardScale = useRef(new Animated.Value(1)).current;

  const handleContinuePress = () => {
    Animated.sequence([
      Animated.spring(cardScale, { toValue: 1.015, useNativeDriver: true, speed: 50, bounciness: 0 }),
      Animated.spring(cardScale, { toValue: 1.0, useNativeDriver: true, speed: 30, bounciness: 0 }),
    ]).start(() => {
      router.push('/roleplay/ghosted-post');
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <MotiView from={{ opacity: 0, translateY: -10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE }}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.greetingName}>{user.fullName}</Text>
          </View>
          <View style={styles.characterCircle}>
            <EmotionAsset name="motivated" style={styles.characterImage} />
          </View>
        </View>
      </MotiView>

      {/* Continue Learning */}
      <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: 50 }}>
        <Text style={styles.sectionTitle}>Continue Learning</Text>
      </MotiView>
      <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: 75 }}>
      <Animated.View style={{ transform: [{ scale: cardScale }] }}>
      <Pressable
        style={styles.continueCard}
        onPress={handleContinuePress}
      >
        <View style={styles.continueIcon}>
          <EmotionAsset name="overwhelmed" size={81} />
        </View>
        <View style={styles.continueRight}>
          <Text style={styles.continueTitle}>{continueCourse.title}</Text>
          <View style={styles.continueMetaRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Anxiety</Text>
            </View>
            <Text style={styles.duration}>3 min</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '40%' }]} />
          </View>
        </View>
      </Pressable>
      </Animated.View>
      </MotiView>

      {/* Learn Emotions */}
      <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: 75 }}>
        <Text style={styles.sectionTitle}>Learn emotions</Text>
      </MotiView>
      <View style={styles.emotionGrid}>
        {emotionLessons.map((lesson, i) => (
          <MotiView key={lesson.id} from={{ opacity: 0, translateY: 5 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: staggerDelay(i, 400) }} style={{ width: '48%' }}>
          <Pressable
            style={styles.emotionCard}
            onPress={() => router.push(`/course/${courses[0].id}`)}
          >
            <Text style={styles.emotionTitle}>{lesson.title}</Text>
            {/* Progress bar */}
            <View style={styles.emotionProgressBar}>
              <View style={[styles.emotionProgressFill, { width: `${lesson.progress * 100}%` }]} />
            </View>
            {/* Doodle illustration */}
            <View style={styles.emotionIllustration}>
              <EmotionAsset name={lesson.emotion} size={126} />
            </View>
          </Pressable>
          </MotiView>
        ))}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xxxl,
  },
  greeting: {
    fontSize: 34,
    lineHeight: 40,
    fontFamily: Fonts.heading,
    color: Colors.text,
  },
  greetingName: {
    fontSize: 34,
    lineHeight: 40,
    fontFamily: Fonts.heading,
    color: Colors.text,
  },
  characterCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  characterImage: {
    width: 126,
    height: 126,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.bodySemiBold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  continueCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.lg,
    marginBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  continueIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  continueRight: {
    flex: 1,
    gap: Spacing.sm,
  },
  continueTitle: {
    ...Typography.bodyBold,
    fontSize: 17,
  },
  continueMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
    fontFamily: Fonts.bodyMedium,
  },
  duration: {
    ...Typography.caption,
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
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  emotionCard: {
    aspectRatio: 0.85,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  emotionTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.bodySemiBold,
    color: Colors.text,
  },
  emotionProgressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: Spacing.sm,
    width: '60%',
  },
  emotionProgressFill: {
    height: '100%',
    backgroundColor: Colors.text,
    borderRadius: 2,
  },
  emotionIllustration: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
