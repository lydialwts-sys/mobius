import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { EmotionCharacter } from '../../src/components/EmotionCharacter';
import { emotionCharacters } from '../../src/data/mockData';

export default function RoleplayResultScreen() {
  const router = useRouter();
  const unlocked = emotionCharacters.find((c) => c.id === 'loneliness');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={{ fontSize: 56, marginBottom: 16 }}>🎉</Text>
        <Text style={styles.title}>Roleplay Complete!</Text>
        <Text style={styles.subtitle}>Nice work navigating that situation.</Text>
      </View>
      <View style={styles.skillsCard}>
        <Text style={styles.skillsTitle}>Skills Practiced</Text>
        {['Pausing before reacting', 'Identifying your inner critic', 'Separating self-worth from social media'].map((s, i) => (
          <View key={i} style={styles.skill}><Text style={{ fontSize: 14 }}>{'✓'}</Text><Text style={styles.skillText}>{s}</Text></View>
        ))}
      </View>
      {unlocked && (
        <View style={styles.unlockCard}>
          <Text style={styles.unlockBadge}>NEW CHARACTER</Text>
          <EmotionCharacter character={{ ...unlocked, unlocked: true }} size="lg" />
          <Text style={styles.unlockDesc}>{unlocked.description}</Text>
        </View>
      )}
      <View style={styles.actions}>
        <Button title="Back to Home" onPress={() => router.replace('/(tabs)')} size="lg" fullWidth />
        <Button title="Try Another Roleplay" onPress={() => router.back()} variant="neutral" size="lg" fullWidth />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xxl, paddingTop: 80 },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: { ...Typography.heading, fontSize: 28, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  skillsCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.xl, marginBottom: Spacing.xxl },
  skillsTitle: { ...Typography.subheading, marginBottom: Spacing.md },
  skill: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  skillText: { ...Typography.body },
  unlockCard: { backgroundColor: Colors.brandLight, borderRadius: BorderRadius.md, padding: Spacing.xxl, alignItems: 'center', marginBottom: Spacing.xxl, borderWidth: 2, borderColor: Colors.brand, gap: Spacing.md },
  unlockBadge: { ...Typography.small, fontWeight: '700', letterSpacing: 2, color: Colors.dark },
  unlockDesc: { ...Typography.body, textAlign: 'center', color: Colors.textSecondary },
  actions: { gap: Spacing.md, alignItems: 'center' },
});
