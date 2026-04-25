import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout, Spacing, Typography, BorderRadius, Fonts } from '../../src/constants/theme';
import { SPRING_GENTLE, staggerDelay } from '../../src/constants/animations';
import { SettingsIcon } from '../../src/components/SettingsIcon';
import { useUser } from '../../src/context/UserContext';

// Mood week — picks character thumbnails per day (variety of emotion gifs from /asset/in app_thumbnail)
const weekMoods = [
  { day: 'S', image: require('../../assets/in app_thumbnail/mood journal_slay_thumbnail.gif') },
  { day: 'M', image: require('../../assets/in app_thumbnail/mood_journal_lowkey_stressed_thumbnail_1.gif') },
  { day: 'T', image: require('../../assets/in app_thumbnail/guilty_thumbnail.gif') },
  { day: 'W', image: require('../../assets/in app_thumbnail/quiet processor.gif') },
  { day: 'T', image: require('../../assets/in app_thumbnail/mood journal_literally_lowkey_thumbnail_1.gif') },
  { day: 'F', image: require('../../assets/in app_thumbnail/overwhelmed_thumbnail.gif') },
  { day: 'S', image: require('../../assets/in app_thumbnail/embarassed_thumbnail_1.gif') },
];

// Emotion cards — Figma profile layout: doodle on TOP, name centered below, then progress bar at BOTTOM.
// Note: Figma uses adjective form "Jealous" (not "Jealousy") for this card.
type EmotionCard = { id: string; name: string; progress: number; image: any; route?: string };
const emotionCards: EmotionCard[] = [
  { id: 'overwhelmed', name: 'Overwhelmed', progress: 0.7, image: require('../../assets/in app_thumbnail/overwhelmed_thumbnail.gif'), route: '/emotion/anxiety' },
  { id: 'jealous', name: 'Jealous', progress: 0.5, image: require('../../assets/in app_thumbnail/jealous_thumbnail.gif') },
  { id: 'guilty', name: 'Guilty', progress: 0.3, image: require('../../assets/in app_thumbnail/guilty_thumbnail.gif') },
  { id: 'embarrassed', name: 'Embarrassed', progress: 0.1, image: require('../../assets/in app_thumbnail/embarassed_thumbnail_1.gif') },
];

const filterTags = [
  { label: 'Low-key', active: false },
  { label: 'Meh', active: false },
  { label: 'A Lot', active: false },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const spinAnim = useRef(new Animated.Value(0)).current;

  const handleSettingsPress = () => {
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      spinAnim.setValue(0);
      router.push('/profile/settings');
    });
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{user.fullName}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Quiet observer</Text>
          </View>
        </View>
        {/* Avatar with settings icon overlapping top-right.
            Frame: solid white circle + 1px gray border (matches mood-circle / emotion-card style).
            pfp.png is the doodle inside, contained so the white background shows. */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarFrame}>
            <Image
              source={user.profileImage ? { uri: user.profileImage } : require('../../assets/in app_thumbnail/pfp.png')}
              style={styles.avatarImg}
              resizeMode="contain"
            />
          </View>
          <Pressable onPress={handleSettingsPress} style={styles.settingsBadge} hitSlop={8}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <SettingsIcon size={24} />
            </Animated.View>
          </Pressable>
        </View>
      </View>

      {/* Mood Journal */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mood journal</Text>
        <Pressable onPress={() => router.push('/journal/mood-journal')}>
          <Text style={styles.moreLink}>More {'>'}</Text>
        </Pressable>
      </View>
      <View style={styles.moodWeek}>
        {weekMoods.map((mood, i) => (
          <MotiView key={i} from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: staggerDelay(i, 200) }}>
            <View style={styles.moodDay}>
              <View style={styles.moodCircle}>
                <Image source={mood.image} style={styles.moodThumb} resizeMode="contain" />
              </View>
              <Text style={styles.moodDayLabel}>{mood.day}</Text>
            </View>
          </MotiView>
        ))}
      </View>

      {/* Learn emotions */}
      <Text style={[styles.sectionTitle, styles.learnEmotionsTitle]}>Learn emotions</Text>

      {/* Filter tags */}
      <View style={styles.filterRow}>
        <View style={[styles.filterTag, styles.filterTagActive]}>
          <Ionicons name="checkmark" size={14} color={Colors.textLight} />
        </View>
        {filterTags.map((tag) => (
          <Pressable key={tag.label} style={styles.filterTag}>
            <Text style={styles.filterTagText}>{tag.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Emotion cards grid — Figma profile layout: doodle TOP (fills upper portion), name CENTER,
          progress bar at BOTTOM. Per-card optional `route` enables navigation. */}
      <View style={styles.emotionGrid}>
        {emotionCards.map((emotion, i) => (
          <MotiView key={emotion.id} from={{ opacity: 0, translateY: 5 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: staggerDelay(i, 500) }} style={{ width: '48%' }}>
            <Pressable
              style={styles.emotionCard}
              onPress={() => emotion.route && router.push(emotion.route as any)}
            >
              <View style={styles.emotionImageWrap} pointerEvents="none">
                <Image source={emotion.image} style={styles.emotionImage} resizeMode="contain" />
              </View>
              <Text style={styles.emotionName}>{emotion.name}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${emotion.progress * 100}%` }]} />
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
    paddingTop: Layout.statusBarOffset,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xxl,
  },
  avatarContainer: {
    position: 'relative',
  },
  // White circle frame matching mood-circle / emotion-card style (1px gray border, white bg)
  avatarFrame: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 56,
    height: 56,
  },
  settingsBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 2,
  },
  headerLeft: {
    gap: Spacing.sm,
  },
  name: {
    fontSize: 28,
    fontFamily: Fonts.heading,
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.dark,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...Typography.small,
    color: Colors.textLight,
    fontFamily: Fonts.bodyMedium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bodySemiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  // 2x the gap below "Learn emotions" specifically (overrides sectionTitle marginBottom)
  learnEmotionsTitle: {
    marginBottom: Spacing.xxl,
  },
  moreLink: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    marginBottom: Spacing.md,
  },
  moodWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxxl,
  },
  moodDay: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  // Solid white circle behind each daily mood thumbnail (same style as emotion cards: 1px border)
  moodCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  moodThumb: {
    width: 36,
    height: 36,
  },
  moodDayLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  filterTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTagActive: {
    backgroundColor: Colors.dark,
    borderColor: Colors.dark,
  },
  filterTagText: {
    ...Typography.small,
    color: Colors.text,
    fontFamily: Fonts.bodyMedium,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  // Figma profile card: doodle TOP (large), name CENTER, progress bar BOTTOM
  emotionCard: {
    aspectRatio: 0.95,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    paddingVertical: Spacing.lg,
  },
  // Doodle takes the upper ~62% of the card (flex: 1 inside the padded column)
  emotionImageWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  emotionImage: {
    width: '100%' as any,
    height: '100%' as any,
  },
  emotionName: {
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  // Thicker progress bar per Figma — bottom of card
  progressBar: {
    height: 6,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.text,
    borderRadius: 3,
  },
});
