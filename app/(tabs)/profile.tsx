import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout, Spacing, Typography, BorderRadius, Fonts } from '../../src/constants/theme';
import { SPRING_GENTLE, staggerDelay } from '../../src/constants/animations';
import { SettingsIcon } from '../../src/components/SettingsIcon';
import { useUser } from '../../src/context/UserContext';

const weekMoods = [
  { day: 'S', emoji: '😊' },
  { day: 'M', emoji: '😰' },
  { day: 'T', emoji: '😢' },
  { day: 'W', emoji: '😌' },
  { day: 'T', emoji: '😊' },
  { day: 'F', emoji: '😤' },
  { day: 'S', emoji: '😊' },
];

const emotionCards = [
  { id: 'overwhelmed', name: 'Overwhelmed', progress: 0.7, image: require('../../assets/emotions_png/overwhelmed.png') },
  { id: 'jealousy', name: 'Jealousy', progress: 0.5, image: require('../../assets/emotions_png/jealous.png') },
  { id: 'guilty', name: 'Guilty', progress: 0.3, image: require('../../assets/emotions_png/guilty.png') },
  { id: 'embarrassed', name: 'Embarrassed', progress: 0.1, image: require('../../assets/emotions_png/embarassed.png') },
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
        {/* Avatar with settings icon overlapping top-right */}
        <View style={styles.avatarContainer}>
          <Image
            source={user.profileImage ? { uri: user.profileImage } : require('../../assets/in app_thumbnail/pfp.png')}
            style={styles.avatarImg}
            resizeMode="cover"
          />
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
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodDayLabel}>{mood.day}</Text>
            </View>
          </MotiView>
        ))}
      </View>

      {/* Learn emotions */}
      <Text style={styles.sectionTitle}>Learn emotions</Text>

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

      {/* Emotion cards grid */}
      <View style={styles.emotionGrid}>
        {emotionCards.map((emotion, i) => (
          <MotiView key={emotion.id} from={{ opacity: 0, translateY: 5 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: staggerDelay(i, 500) }} style={{ width: '47%' }}>
          <Pressable style={styles.emotionCard}>
            <View style={styles.emotionIllustration}>
              <Image source={emotion.image} style={{ width: 56, height: 56 }} resizeMode="contain" />
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
  avatarImg: {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 2, borderColor: Colors.text,
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
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...Typography.small,
    color: Colors.textLight,
    fontFamily: Fonts.bodyMedium,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.brand,
    borderWidth: 2,
    borderColor: Colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
  moodEmoji: {
    fontSize: 22,
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
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
  emotionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emotionIllustration: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emotionName: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.text,
  },
  progressBar: {
    width: '100%',
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
