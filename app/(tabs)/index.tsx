import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Colors, Spacing, Typography, BorderRadius, Fonts } from '../../src/constants/theme';
import { SPRING_GENTLE, SPRING_SNAPPY, staggerDelay } from '../../src/constants/animations';
import { courses } from '../../src/data/mockData';
import { useUser } from '../../src/context/UserContext';

const emotionLessons = [
  { id: 'calm-overwhelm', title: 'Calm\noverwhelm', progress: 0.7, image: require('../../assets/in app_thumbnail/overwhelmed_thumbnail.gif') },
  { id: 'reframe-jealousy', title: 'Reframe\njealousy', progress: 0.5, image: require('../../assets/in app_thumbnail/jealous_thumbnail.gif') },
  { id: 'let-go-guilt', title: 'Let go of\nguilt', progress: 0.3, image: require('../../assets/in app_thumbnail/guilty_thumbnail.gif') },
  { id: 'move-past-embarrassment', title: 'Move past\nembarrass\n-ment', progress: 0.1, image: require('../../assets/in app_thumbnail/embarassed_thumbnail_1.gif') },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, onboarded } = useUser();

  if (!onboarded) {
    return <Redirect href="/onboarding" />;
  }

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
            <Image
              source={user.profileImage ? { uri: user.profileImage } : require('../../assets/in app_thumbnail/pfp.png')}
              style={styles.characterImage}
              resizeMode="contain"
            />
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
        <Image
          source={require('../../assets/in app_thumbnail/the ghosted post_thumbnail.png')}
          style={styles.continueThumbnail}
          resizeMode="contain"
        />
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
            <View style={styles.emotionImageWrap}>
              <Image source={lesson.image} style={styles.emotionImage} resizeMode="contain" />
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
  // White circle frame matching emotion-card / mood-circle style (1px gray border, white bg)
  characterCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  characterImage: {
    width: 64,
    height: 64,
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
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
    marginBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  continueThumbnail: {
    width: 80,
    height: 80,
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
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  emotionTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: Fonts.bodySemiBold,
    color: Colors.text,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    width: '100%' as any,
  },
  emotionImageWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 110,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  emotionImage: {
    width: '100%' as any,
    height: '100%' as any,
  },
});
