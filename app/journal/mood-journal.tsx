import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors, Layout, Spacing, Typography, BorderRadius, Fonts } from '../../src/constants/theme';
import { BackButton } from '../../src/components/BackButton';

const journalEntries = [
  {
    month: 'December',
    entries: [
      { id: '1', date: 'Dec 16, 2025', vibe: 'Low-key stressed', image: require('../../assets/emotions_png/stress.png') },
      { id: '2', date: 'Dec 12, 2025', vibe: 'Mid', image: require('../../assets/emotions_png/meh.png') },
      { id: '3', date: 'Dec 10, 2025', vibe: 'Slayyyyyy', image: require('../../assets/emotions_png/motivated.png') },
    ],
  },
  {
    month: 'November',
    entries: [
      { id: '4', date: 'Dec 01, 2025', vibe: 'Literally low-key', image: require('../../assets/emotions_png/tired.png') },
    ],
  },
];

export default function MoodJournalScreen() {
  const router = useRouter();
  const scaleAnims = useRef(journalEntries.flatMap(g => g.entries).map(() => new Animated.Value(1))).current;

  const handleEntryPress = (entryId: string, index: number) => {
    // Card press animation: scale down slightly then navigate
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1.02,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(`/journal/${entryId}`);
    });
  };

  let globalIndex = 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <BackButton fallbackRoute="/(tabs)/profile" />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Mood Journal</Text>

          {journalEntries.map((group) => (
            <View key={group.month} style={styles.monthGroup}>
              <Text style={styles.monthTitle}>{group.month}</Text>
              {group.entries.map((entry) => {
                const idx = globalIndex++;
                return (
                  <Animated.View key={entry.id} style={{ transform: [{ scale: scaleAnims[idx] }] }}>
                    <Pressable
                      style={styles.entryCard}
                      onPress={() => handleEntryPress(entry.id, idx)}
                    >
                      <View style={styles.entryContent}>
                        <Text style={styles.entryDate}>{entry.date}</Text>
                        <Text style={styles.entryVibeLabel}>Vibe of the day:</Text>
                        <Text style={styles.entryVibe}>{entry.vibe}</Text>
                      </View>
                      <View style={styles.entryImage}>
                        <Image source={entry.image} style={{ width: 44, height: 44 }} resizeMode="contain" />
                      </View>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
          ))}
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
    paddingHorizontal: Spacing.xxl,
    paddingTop: Layout.statusBarOffset,
    paddingBottom: Spacing.md,
  },
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.heading,
    color: Colors.text,
    marginBottom: Spacing.xxl,
  },
  monthGroup: {
    marginBottom: Spacing.xxl,
  },
  monthTitle: {
    fontSize: 16,
    fontFamily: Fonts.bodySemiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  entryContent: {
    flex: 1,
  },
  entryDate: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  entryVibeLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  entryVibe: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: Colors.text,
    marginTop: 2,
  },
  entryImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
