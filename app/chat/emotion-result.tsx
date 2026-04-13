import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { EmotionCharacter } from '../../src/components/EmotionCharacter';
import { emotionCharacters } from '../../src/data/mockData';

export default function EmotionResultScreen() {
  const router = useRouter();
  const detected = [emotionCharacters[0], emotionCharacters[1], emotionCharacters[3]];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Here's what I'm picking up</Text>
      <Text style={styles.subtext}>Based on our conversation, it seems like you're experiencing a mix of emotions. That's totally normal!</Text>
      <View style={styles.emotionList}>
        {detected.map((char) => (
          <View key={char.id} style={styles.emotionCard}>
            <EmotionCharacter character={{ ...char, unlocked: true }} size="md" showName={false} />
            <View style={{ flex: 1 }}>
              <Text style={styles.emotionName}>{char.name}</Text>
              <Text style={styles.emotionDesc}>{char.description}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Insight</Text>
        <Text style={styles.insightText}>Feeling anticipation and self-doubt at the same time often happens before big events. It's your brain's way of preparing.</Text>
      </View>
      <View style={styles.actions}>
        <Button title="Explore a coping strategy" onPress={() => router.back()} size="lg" fullWidth />
        <Button title="Back to chat" onPress={() => router.back()} variant="ghost" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xxl },
  heading: { ...Typography.heading, marginBottom: Spacing.sm },
  subtext: { ...Typography.body, color: Colors.textSecondary, lineHeight: 24, marginBottom: Spacing.xxl },
  emotionList: { gap: Spacing.md, marginBottom: Spacing.xxl },
  emotionCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  emotionName: { ...Typography.subheading, marginBottom: Spacing.xs },
  emotionDesc: { ...Typography.caption, lineHeight: 20 },
  insightCard: { backgroundColor: Colors.brandLight, borderRadius: BorderRadius.md, padding: Spacing.lg, marginBottom: Spacing.xxl },
  insightTitle: { ...Typography.subheading, marginBottom: Spacing.sm },
  insightText: { ...Typography.body, lineHeight: 24 },
  actions: { gap: Spacing.md },
});
