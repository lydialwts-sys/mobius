import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Fonts } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';

const goalOptions = [
  { emoji: '🥺', text: 'I feel a lot but can\'t explain it' },
  { emoji: '💬', text: 'I replay conversations in my head' },
  { emoji: '🔴', text: 'I shut down when things get messy' },
  { emoji: '🪞', text: 'I want to know myself better' },
];

const scenarioOptions = [
  { id: 'school', label: 'At school', emoji: '📚' },
  { id: 'family', label: 'With family', emoji: '🏠' },
  { id: 'friends', label: 'With friends', emoji: '👋' },
  { id: 'scrolling', label: 'Scrolling', emoji: '📱' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

  // Landing Screen
  if (step === 0) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.text }]}>
        <View style={styles.landingContent}>
          <View style={styles.landingCharacter}>
            <Image source={require('../../assets/emotions_png/motivated.png')} style={{ width: 80, height: 80 }} resizeMode="contain" />
          </View>
          <Image source={require('../../assets/icon_wordmark.png')} style={styles.wordmarkImage} resizeMode="contain" />
          <Text style={styles.landingSubtitle}>Unlock your emotion learning{'\n'}journey today.</Text>
        </View>
        <View style={styles.footer}>
          <Button title="Get Started" onPress={() => setStep(1)} variant="primary" size="lg" fullWidth
            style={{ backgroundColor: Colors.brand }}
          />
          <Pressable onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.landingLogin}>Log In</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Goal Setting
  if (step === 1) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => setStep(0)}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.questionTitle}>Which ones hit a little too close?</Text>
        <Text style={styles.questionSubtitle}>Pick any. Or skip.</Text>
        <View style={styles.optionsList}>
          {goalOptions.map((option, i) => (
            <Pressable
              key={i}
              style={[styles.optionCard, selectedGoals.includes(i) && styles.optionSelected]}
              onPress={() => {
                setSelectedGoals(prev =>
                  prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
                );
              }}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={styles.optionText}>{option.text}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.footer}>
          <Button title="Continue" onPress={() => setStep(2)} variant="primary" size="lg" fullWidth />
          <Pressable onPress={() => setStep(2)}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Scenarios
  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => setStep(1)}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </Pressable>
      <Text style={styles.questionTitle}>When do things feel hardest for you?</Text>
      <Text style={styles.questionSubtitle}>Pick any that resonate.</Text>
      <View style={styles.scenarioGrid}>
        {scenarioOptions.map((s) => (
          <Pressable
            key={s.id}
            style={[styles.scenarioCard, selectedScenarios.includes(s.id) && styles.scenarioSelected]}
            onPress={() => {
              setSelectedScenarios(prev =>
                prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id]
              );
            }}
          >
            <View style={styles.scenarioIllustration}>
              <Text style={{ fontSize: 36 }}>{s.emoji}</Text>
            </View>
            <Text style={styles.scenarioLabel}>{s.label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <View style={styles.footer}>
        <Button title="Continue" onPress={() => router.replace('/(tabs)')} variant="primary" size="lg" fullWidth />
        <Pressable onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xxl,
    paddingTop: 56,
    paddingBottom: Spacing.xxxl,
  },
  backButton: {
    marginBottom: Spacing.xxl,
  },
  landingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landingCharacter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
  },
  wordmarkImage: {
    width: 200,
    height: 60,
    tintColor: Colors.textLight,
    marginBottom: Spacing.lg,
  },
  landingSubtitle: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  landingLogin: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: 'center',
    opacity: 0.7,
  },
  questionTitle: {
    fontSize: 26,
    lineHeight: 34,
    fontFamily: Fonts.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  questionSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
  },
  optionsList: {
    gap: Spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionText: {
    ...Typography.body,
    flex: 1,
  },
  scenarioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  scenarioCard: {
    width: '47%' as any,
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  scenarioSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  scenarioIllustration: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioLabel: {
    ...Typography.body,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  skipText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
