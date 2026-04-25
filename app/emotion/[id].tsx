import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MotiView } from 'moti';
import { Colors, Layout, Spacing, BorderRadius, Fonts } from '../../src/constants/theme';
import { SPRING_GENTLE, SPRING_BOUNCY, staggerDelay } from '../../src/constants/animations';
import { BackButton } from '../../src/components/BackButton';
import { Button } from '../../src/components/Button';
import { CustomTabBar } from '../../src/components/CustomTabBar';
import { EmotionAssets, type EmotionKey } from '../../src/constants/assets';
import { emotionIntros } from '../../src/data/mockData';

// Colored character thumbnails for Related emotion cards (match Figma + Profile page style).
// Falls back to EmotionAssets line-art for any unmapped emotion.
const RelatedThumbnails: Partial<Record<EmotionKey, any>> = {
  overwhelmed: require('../../assets/in app_thumbnail/overwhelmed_thumbnail.gif'),
  jealous: require('../../assets/in app_thumbnail/jealous_thumbnail.gif'),
  guilty: require('../../assets/in app_thumbnail/guilty_thumbnail.gif'),
  embarassed: require('../../assets/in app_thumbnail/embarassed_thumbnail_1.gif'),
};

// Hero illustrations per emotion id — animated GIFs that replace the line-art EmotionAssets.
// Falls back to EmotionAssets[imageKey] for any unmapped emotion id.
const HeroByEmotionId: Record<string, any> = {
  anxiety: require('../../assets/in app_thumbnail/anxiety_section.gif'),
};

export default function EmotionIntroScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const emotion = emotionIntros.find((e) => e.id === id);

  if (!emotion) {
    return <View style={styles.container}><Text>Emotion not found</Text></View>;
  }

  const heroImage = HeroByEmotionId[emotion.id] ?? EmotionAssets[emotion.imageKey as EmotionKey];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <BackButton fallbackRoute="/(tabs)" />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Hero illustration */}
          <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', ...SPRING_BOUNCY }}>
            <View style={styles.heroContainer}>
              <Image source={heroImage} style={styles.heroImage} resizeMode="contain" />
            </View>
          </MotiView>

          {/* Title + description */}
          <MotiView from={{ opacity: 0, translateY: 6 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: 75 }}>
            <Text style={styles.emotionName}>{emotion.name}</Text>
            <Text style={styles.emotionDesc}>{emotion.description}</Text>
          </MotiView>

          {/* Insights — horizontal scroll */}
          <MotiView from={{ opacity: 0, translateY: 6 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: 75 }}>
            <Text style={styles.sectionTitle}>Insights</Text>
          </MotiView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.insightsRow}>
            {emotion.insights.map((insight, i) => (
              <MotiView key={i} from={{ opacity: 0, translateX: 20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: staggerDelay(i, 400) }}>
                <View style={styles.insightCard}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightBody}>{insight.body}</Text>
                </View>
              </MotiView>
            ))}
          </ScrollView>

          {/* Related emotions — 2x2 grid */}
          <MotiView from={{ opacity: 0, translateY: 6 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: 250 }}>
            <Text style={styles.sectionTitle}>Related emotions</Text>
          </MotiView>
          <View style={styles.relatedGrid}>
            {emotion.relatedEmotions.map((rel, i) => {
              const key = rel.imageKey as EmotionKey;
              const relImage = RelatedThumbnails[key] ?? EmotionAssets[key];
              return (
                <MotiView key={rel.name} from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: staggerDelay(i, 600) }} style={{ width: '47%' }}>
                  <View style={styles.relatedCard}>
                    {/* Doodle fills card body, no circle background per Figma */}
                    <Image source={relImage} style={styles.relatedImage} resizeMode="contain" />
                    <Text style={styles.relatedName}>{rel.name}</Text>
                  </View>
                </MotiView>
              );
            })}
          </View>

          {/* "Start learning" CTA removed per Figma — chapter access now via the parent
              Learn home / chapter tree, not from this Anxiety detail page. */}
        </ScrollView>
        <CustomTabBar active="learn" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { paddingHorizontal: Spacing.xxl, paddingTop: Layout.statusBarOffset, paddingBottom: Spacing.sm },
  content: { paddingBottom: Spacing.xxxl },

  // Hero
  heroContainer: { alignItems: 'center', paddingVertical: Spacing.lg },
  heroImage: { width: 184, height: 184 },

  // Title
  emotionName: { fontFamily: Fonts.heading, fontSize: 32, color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm },
  emotionDesc: { fontFamily: Fonts.body, fontSize: 16, lineHeight: 24, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: Spacing.xxxl, marginBottom: Spacing.xxl },

  // Insights
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 18, color: Colors.text, paddingHorizontal: Spacing.xxl, marginBottom: Spacing.md },
  insightsRow: { paddingHorizontal: Spacing.xxl, gap: Spacing.md, paddingBottom: Spacing.xxl },
  insightCard: {
    width: 200, height: 160, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.lg, gap: Spacing.sm,
  },
  insightTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: Colors.text },
  insightBody: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 20, color: Colors.textSecondary },

  // Related emotions — Figma style: doodle fills card, no circle, name BOTTOM
  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, paddingHorizontal: Spacing.xxl, marginBottom: Spacing.xxl },
  relatedCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', paddingVertical: Spacing.lg, paddingHorizontal: Spacing.md, gap: Spacing.sm,
    aspectRatio: 0.95,
  },
  // Doodle takes the upper portion of the card (no circle behind it)
  relatedImage: { width: '100%' as any, flex: 1 },
  relatedName: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.text },

  // CTA
  ctaSection: { paddingHorizontal: Spacing.xxl, paddingTop: Spacing.md },
});
