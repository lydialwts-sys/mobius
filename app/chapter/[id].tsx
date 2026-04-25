import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout, Spacing, BorderRadius, Fonts } from '../../src/constants/theme';
import { SPRING_BOUNCY, staggerDelay } from '../../src/constants/animations';
import { BackButton } from '../../src/components/BackButton';
import { CustomTabBar } from '../../src/components/CustomTabBar';
import { chapters } from '../../src/data/mockData';

const SCREEN_W = Dimensions.get('window').width;
const TREE_W = Math.min(SCREEN_W, 390);   // iPhone-width canvas for the tree
const NODE_SIZE = 96;                      // bounding box for layout / locked placeholder circle
const DOODLE_SCALE = 1.5;                  // doodle size as multiplier of NODE_SIZE (was 1.3 — +15%)
const ZIG_OFFSET = 56;                     // px from screen-center to node-center (alternates)
const NODE_SPACING = 196;                  // vertical gap between node centers (was 140 — +40%)

export default function ChapterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const chapter = chapters.find((c) => c.id === id);

  if (!chapter) {
    return <View style={styles.container}><Text>Chapter not found</Text></View>;
  }

  // Compute node center positions inside a virtual TREE_W-wide canvas.
  // index 0 → left, 1 → right, 2 → left, 3 → right …
  const nodes = chapter.sessions.map((s, i) => {
    const dir = i % 2 === 0 ? -1 : 1;          // -1 = left, +1 = right
    const cx = TREE_W / 2 + dir * ZIG_OFFSET;
    const cy = NODE_SIZE / 2 + i * NODE_SPACING;
    return { session: s, cx, cy, dir };
  });

  const lastNode = nodes[nodes.length - 1];
  const treeHeight = lastNode.cy + NODE_SIZE / 2 + 60; // +60 for label pill below the last node

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Top bar: back + chapter dropdown */}
        <View style={styles.topBar}>
          <BackButton fallbackRoute={`/emotion/${chapter.emotionId}`} />
          <View style={styles.chapterDropdownWrap}>
            <View style={styles.chapterDropdown}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.text} />
            </View>
          </View>
        </View>

        {/* Tree */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.tree, { width: TREE_W, height: treeHeight }]}>
            {/* SVG curved connectors — drawn first so they sit BEHIND the nodes */}
            <Svg
              width={TREE_W}
              height={treeHeight}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            >
              {nodes.slice(0, -1).map((n, i) => {
                const next = nodes[i + 1];
                const startX = n.cx;
                const startY = n.cy + NODE_SIZE / 2 + 28;        // bottom of label pill
                const endX = next.cx;
                const endY = next.cy - NODE_SIZE / 2;            // top of next doodle
                // Cubic Bezier S-curve: control points stay on each node's vertical axis,
                // pulled toward the opposite end for a pronounced S sweep
                const cp1x = startX;
                const cp1y = startY + (endY - startY) * 0.7;
                const cp2x = endX;
                const cp2y = startY + (endY - startY) * 0.3;
                const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
                return (
                  <Path
                    key={`conn-${i}`}
                    d={d}
                    stroke={Colors.text}             // pure black per Figma
                    strokeWidth={3}                  // thicker per Figma
                    strokeDasharray="12 8"           // long dashes / big gaps per Figma
                    strokeLinecap="round"
                    fill="none"
                  />
                );
              })}
            </Svg>

            {/* Nodes positioned absolutely inside the tree canvas */}
            {nodes.map(({ session, cx, cy }, index) => (
              <MotiView
                key={session.id}
                from={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', ...SPRING_BOUNCY, delay: staggerDelay(index, 100) }}
                style={[
                  styles.nodeWrap,
                  {
                    left: cx - NODE_SIZE / 2,
                    top: cy - NODE_SIZE / 2,
                  },
                ]}
              >
                <Pressable
                  onPress={() => {
                    if (!session.locked && session.route) {
                      router.push(session.route as any);
                    }
                  }}
                  style={styles.nodePressable}
                  hitSlop={8}
                >
                  <View style={styles.nodeArtFrame}>
                    {session.locked ? (
                      // Locked: gray circle w/ lock icon (Figma has no locked state — bespoke)
                      <View style={styles.lockedCircle}>
                        <Ionicons name="lock-closed" size={28} color={Colors.textSecondary} />
                      </View>
                    ) : session.completed ? (
                      <View style={styles.lockedCircle}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    ) : session.thumbnail ? (
                      // Doodle floats directly on page background (no border / no UI circle)
                      <Image
                        source={session.thumbnail}
                        style={styles.nodeDoodle}
                        resizeMode="contain"
                      />
                    ) : null}
                  </View>
                  <View style={styles.nodeLabelPill}>
                    <Text style={styles.nodeLabelText} numberOfLines={1}>{session.title}</Text>
                  </View>
                </Pressable>
              </MotiView>
            ))}
          </View>
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
  chapterDropdownWrap: { flex: 1, alignItems: 'center', paddingRight: Layout.backButtonSize + Spacing.lg },
  chapterDropdown: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.pill,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  chapterTitle: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.text },

  scrollContent: { alignItems: 'center', paddingTop: Spacing.xl + 15, paddingBottom: Spacing.xxxl },
  tree: { position: 'relative' },

  nodeWrap: {
    position: 'absolute',
    width: NODE_SIZE,
    alignItems: 'center',
  },
  nodePressable: { alignItems: 'center' },
  // Frame for either a doodle (no border) or a placeholder circle (locked / completed)
  nodeArtFrame: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible' as any,   // doodles can extend beyond the NODE_SIZE box
  },
  // Doodle is rendered as the node — no UI circle behind it (Figma has no border circle)
  nodeDoodle: { width: NODE_SIZE * DOODLE_SCALE, height: NODE_SIZE * DOODLE_SCALE },
  // Placeholder circle for locked / completed states only (no doodle to render)
  lockedCircle: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: Colors.cardInactive,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: { fontSize: 32, fontWeight: '700', color: Colors.text },

  nodeLabelPill: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    maxWidth: 200,
  },
  nodeLabelText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.text, textAlign: 'center' },
});
