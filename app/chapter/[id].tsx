import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Colors, Layout, Spacing, BorderRadius, Fonts } from '../../src/constants/theme';
import { SPRING_BOUNCY, staggerDelay } from '../../src/constants/animations';
import { BackButton } from '../../src/components/BackButton';
import { CustomTabBar } from '../../src/components/CustomTabBar';
import { EmotionAssets } from '../../src/constants/assets';
import { chapters } from '../../src/data/mockData';

export default function ChapterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const chapter = chapters.find((c) => c.id === id);

  if (!chapter) {
    return <View style={styles.container}><Text>Chapter not found</Text></View>;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Top bar: back → emotion intro, chapter dropdown */}
        <View style={styles.topBar}>
          <BackButton fallbackRoute={`/emotion/${chapter.emotionId}`} />
          <View style={styles.chapterDropdown}>
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.text} />
          </View>
        </View>

        {/* Tree path */}
        <ScrollView contentContainerStyle={styles.treeContainer}>
          {chapter.sessions.map((session, index) => (
            <MotiView
              key={session.id}
              from={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', ...SPRING_BOUNCY, delay: staggerDelay(index, 100) }}
              style={styles.treeNode}
            >
              {/* Dotted connector */}
              {index > 0 && (
                <View style={styles.connector}>
                  <View style={styles.dottedLine} />
                </View>
              )}

              {/* Node */}
              <Pressable
                style={styles.lessonNode}
                onPress={() => {
                  if (!session.locked && session.route) {
                    router.push(session.route as any);
                  }
                }}
              >
                <View style={[styles.nodeCircle, session.locked && styles.nodeLocked, session.completed && styles.nodeCompleted]}>
                  {session.completed ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : session.locked ? (
                    <Ionicons name="lock-closed" size={24} color={Colors.textSecondary} />
                  ) : (
                    <Image source={EmotionAssets.motivated} style={{ width: 44, height: 44 }} resizeMode="contain" />
                  )}
                </View>
                <View style={styles.nodeLabelPill}>
                  <Text style={styles.nodeLabelText}>{session.title}</Text>
                </View>
              </Pressable>
            </MotiView>
          ))}
        </ScrollView>

        {/* Tab bar */}
        <CustomTabBar active="learn" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    paddingHorizontal: Spacing.xxl, paddingTop: Layout.statusBarOffset, paddingBottom: Spacing.lg,
  },
  chapterDropdown: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.pill,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  chapterTitle: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.text },

  treeContainer: { paddingVertical: Spacing.xxl, alignItems: 'center' },
  treeNode: { alignItems: 'center' },
  connector: { height: 40, justifyContent: 'center', alignItems: 'center' },
  dottedLine: { width: 2, height: 40, borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.border },

  lessonNode: { alignItems: 'center', gap: Spacing.sm },
  nodeCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.brand, borderWidth: 2, borderColor: Colors.text,
    alignItems: 'center', justifyContent: 'center',
  },
  nodeLocked: { backgroundColor: Colors.border, borderColor: Colors.border },
  nodeCompleted: { backgroundColor: Colors.brand },
  checkmark: { fontSize: 28, fontWeight: '700', color: Colors.text },
  nodeLabelPill: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.pill,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  nodeLabelText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.text, textAlign: 'center' },
});
