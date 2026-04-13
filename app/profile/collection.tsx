import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { SPRING_GENTLE, staggerDelay } from '../../src/constants/animations';
import { EmotionCharacter } from '../../src/components/EmotionCharacter';
import { emotionCharacters } from '../../src/data/mockData';

export default function CollectionScreen() {
  const unlocked = emotionCharacters.filter((c) => c.unlocked);
  const locked = emotionCharacters.filter((c) => !c.unlocked);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statsCard}>
        <Text style={styles.statsText}>{unlocked.length}/{emotionCharacters.length} emotions discovered</Text>
        <View style={styles.statsBar}>
          <View style={[styles.statsFill, { width: `${(unlocked.length / emotionCharacters.length) * 100}%` }]} />
        </View>
      </View>
      <Text style={styles.sectionTitle}>Discovered</Text>
      <View style={styles.grid}>
        {unlocked.map((char, i) => (
          <MotiView key={char.id} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: staggerDelay(i, 100) }}>
          <View style={styles.charCard}>
            <EmotionCharacter character={char} size="lg" />
            <Text style={styles.charDesc}>{char.description}</Text>
          </View>
          </MotiView>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Undiscovered</Text>
      <View style={styles.grid}>
        {locked.map((char) => (
          <View key={char.id} style={[styles.charCard, { opacity: 0.5 }]}>
            <EmotionCharacter character={char} size="lg" />
            <Text style={styles.lockedText}>Complete more lessons to unlock</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg },
  statsCard: { backgroundColor: Colors.brandLight, borderRadius: BorderRadius.md, padding: Spacing.lg, marginBottom: Spacing.xxl },
  statsText: { ...Typography.subheading, marginBottom: Spacing.sm, textAlign: 'center' },
  statsBar: { height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden' },
  statsFill: { height: '100%', backgroundColor: Colors.brand, borderRadius: 3 },
  sectionTitle: { ...Typography.subheading, marginBottom: Spacing.md },
  grid: { gap: Spacing.md, marginBottom: Spacing.xxl },
  charCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm },
  charDesc: { ...Typography.caption, textAlign: 'center', lineHeight: 20 },
  lockedText: { ...Typography.small, textAlign: 'center', fontStyle: 'italic' },
});
