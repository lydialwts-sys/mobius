import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../../src/constants/theme';
import { Button } from '../../../src/components/Button';
import { EmotionCharacter } from '../../../src/components/EmotionCharacter';
import { courses, emotionCharacters } from '../../../src/data/mockData';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const lesson = courses.flatMap((c) => c.lessons).find((l) => l.id === lessonId);

  if (!lesson || lesson.steps.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🔒</Text>
          <Text style={Typography.heading}>Coming Soon</Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8 }]}>This lesson is still being created.</Text>
          <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }

  const step = lesson.steps[currentStep];
  const isLast = currentStep === lesson.steps.length - 1;
  const character = step.characterId ? emotionCharacters.find((c) => c.id === step.characterId) : null;

  const handleNext = () => {
    if (isLast) { router.back(); } else {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleQuizAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
  };

  return (
    <>
      <Stack.Screen options={{ title: lesson.title }} />
      <View style={styles.container}>
        {/* Bottom-anchored step illustration (lowest layer) */}
        {step.image && (
          <View style={styles.stepImageContainer} pointerEvents="none">
            <View style={[styles.stepImageFrame, { aspectRatio: step.imageAspect ?? 1 }]}>
              <Image source={step.image} style={styles.stepImage} resizeMode="contain" />
            </View>
          </View>
        )}

        {/* Progress */}
        <View style={styles.progressRow}>
          {lesson.steps.map((_, i) => (
            <View key={i} style={[styles.progressDot, i <= currentStep && styles.progressDotActive]} />
          ))}
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.content}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepContent}>{step.content}</Text>

          {step.type === 'quiz' && step.options && (
            <View style={styles.optionsContainer}>
              {step.options.map((option, i) => (
                <Pressable
                  key={i}
                  style={[
                    styles.option,
                    selectedAnswer === i && i === step.correctAnswer && styles.optionCorrect,
                    selectedAnswer === i && i !== step.correctAnswer && styles.optionWrong,
                    showFeedback && i === step.correctAnswer && styles.optionCorrect,
                  ]}
                  onPress={() => handleQuizAnswer(i)}
                  disabled={showFeedback}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </Pressable>
              ))}
              {showFeedback && (
                <View style={styles.feedbackCard}>
                  <Text style={styles.feedbackText}>
                    {selectedAnswer === step.correctAnswer ? 'Nice one!' : 'Not quite, but that\'s okay!'}
                  </Text>
                </View>
              )}
            </View>
          )}

          {step.type === 'reflection' && (
            <View style={styles.reflectionBox}>
              <Text style={styles.reflectionHint}>Take a moment to think about this...</Text>
              <View style={styles.reflectionInput}>
                <Text style={{ ...Typography.body, color: Colors.textTertiary }}>Tap to write your thoughts</Text>
              </View>
            </View>
          )}

          {step.type === 'character-reveal' && character && (
            <View style={styles.characterReveal}>
              <EmotionCharacter character={{ ...character, unlocked: true }} size="lg" />
              <Text style={styles.characterDescription}>{character.description}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isLast ? 'Complete Lesson' : 'Continue'}
            onPress={handleNext}
            size="lg"
            fullWidth
            disabled={step.type === 'quiz' && !showFeedback}
          />
          <Text style={styles.stepCounter}>{currentStep + 1} of {lesson.steps.length}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  progressRow: { flexDirection: 'row', gap: Spacing.xs, padding: Spacing.lg, paddingBottom: 0 },
  progressDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  progressDotActive: { backgroundColor: Colors.primary },
  scrollContent: { flex: 1 },
  content: { padding: Spacing.xxl, paddingTop: Spacing.lg },
  stepTitle: { ...Typography.heading, marginBottom: Spacing.lg },
  stepContent: { ...Typography.body, lineHeight: 26, marginBottom: Spacing.xl },
  optionsContainer: { gap: Spacing.sm },
  option: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  optionCorrect: { borderColor: Colors.success, backgroundColor: Colors.success + '10' },
  optionWrong: { borderColor: Colors.error, backgroundColor: Colors.error + '10' },
  optionText: { ...Typography.body },
  feedbackCard: { backgroundColor: Colors.brandLight, borderRadius: BorderRadius.md, padding: Spacing.lg, marginTop: Spacing.sm },
  feedbackText: { ...Typography.body, textAlign: 'center' },
  reflectionBox: { gap: Spacing.md },
  reflectionHint: { ...Typography.caption, fontStyle: 'italic' },
  reflectionInput: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg, minHeight: 120, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  characterReveal: { alignItems: 'center', backgroundColor: Colors.brandLight, borderRadius: BorderRadius.lg, padding: Spacing.xxl, gap: Spacing.lg },
  characterDescription: { ...Typography.body, textAlign: 'center', color: Colors.textSecondary, lineHeight: 24 },
  footer: { padding: Spacing.lg, paddingBottom: Spacing.xxxl, alignItems: 'center', gap: Spacing.sm },
  stepCounter: { ...Typography.small },

  // Step illustration (bottom-anchored, lowest layer — playbook pattern)
  stepImageContainer: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    alignItems: 'center',
  },
  stepImageFrame: { width: '70%' as any },
  stepImage: { width: '100%' as any, height: '100%' as any },
});
