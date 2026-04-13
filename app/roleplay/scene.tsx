import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { roleplayScenarios } from '../../src/data/mockData';

export default function RoleplaySceneScreen() {
  const router = useRouter();
  const scenario = roleplayScenarios[0];
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const scene = scenario.scenes[sceneIndex];
  const isLast = sceneIndex === scenario.scenes.length - 1;

  const handleChoice = (index: number) => { setSelectedChoice(index); setShowFeedback(true); };
  const handleNext = () => { if (isLast) { router.replace('/roleplay/result'); } else { setSceneIndex(sceneIndex + 1); setSelectedChoice(null); setShowFeedback(false); } };

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        {scenario.scenes.map((_, i) => (<View key={i} style={[styles.progressDot, i <= sceneIndex && styles.progressDotActive]} />))}
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.narrationCard}><Text style={styles.narration}>{scene.narration}</Text></View>
        <Text style={styles.prompt}>{scene.prompt}</Text>
        <View style={styles.choices}>
          {scene.choices.map((choice, i) => (
            <Pressable key={i} style={[styles.choiceCard, selectedChoice === i && styles.choiceSelected]} onPress={() => handleChoice(i)} disabled={showFeedback}>
              <Text style={styles.choiceText}>{choice.text}</Text>
            </Pressable>
          ))}
        </View>
        {showFeedback && selectedChoice !== null && (
          <View style={styles.feedbackCard}><Text style={styles.feedbackText}>{scene.choices[selectedChoice].feedback}</Text></View>
        )}
      </ScrollView>
      {showFeedback && (
        <View style={styles.footer}><Button title={isLast ? 'See Results' : 'Next Scene'} onPress={handleNext} size="lg" fullWidth /></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 60 },
  progressRow: { flexDirection: 'row', gap: Spacing.xs, paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  progressDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  progressDotActive: { backgroundColor: Colors.primary },
  content: { padding: Spacing.xxl },
  narrationCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.xl, marginBottom: Spacing.xxl, borderLeftWidth: 3, borderLeftColor: Colors.primary, borderWidth: 1, borderColor: Colors.border },
  narration: { ...Typography.body, lineHeight: 26, fontStyle: 'italic' },
  prompt: { ...Typography.subheading, marginBottom: Spacing.lg },
  choices: { gap: Spacing.md, marginBottom: Spacing.lg },
  choiceCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  choiceSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  choiceText: { ...Typography.body },
  feedbackCard: { backgroundColor: Colors.brandLight, borderRadius: BorderRadius.md, padding: Spacing.lg },
  feedbackText: { ...Typography.body, lineHeight: 24 },
  footer: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
});
