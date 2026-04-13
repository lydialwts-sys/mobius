import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Colors, Spacing, BorderRadius, Fonts, Layout } from '../../src/constants/theme';
import { SPRING_GENTLE, SPRING_BOUNCY, staggerDelay } from '../../src/constants/animations';
import { Button } from '../../src/components/Button';
import { EmotionAssets } from '../../src/constants/assets';

// Step types
type StepType = 'intro' | 'scenario' | 'critic' | 'choice' | 'insight';

interface Step {
  type: StepType;
  narration?: string;
  criticText?: string;
  image?: any;
  choices?: { text: string; feedback: string }[];
  insightTitle?: string;
  insightBody?: string;
}

const STEPS: Step[] = [
  // 0: Intro (handled separately)
  { type: 'intro' },
  // 1: Setup
  { type: 'scenario', narration: 'You spent an hour editing a photo from your weekend. You post it, feeling good.', image: EmotionAssets.happy },
  // 2: Waiting
  { type: 'scenario', narration: 'You check back 30 minutes later. 2 likes — both from family.', image: EmotionAssets.meh },
  // 3: Comparison
  { type: 'scenario', narration: 'You open Instagram and see your friend just posted. Already 47 likes. Your stomach drops.', image: EmotionAssets.jealous },
  // 4: Time passes
  { type: 'scenario', narration: 'Two hours pass.', image: EmotionAssets.tired },
  // 5: Best friend
  { type: 'scenario', narration: "Your \"Best Friend\" has liked other people's posts, but completely ignored yours.", image: EmotionAssets.disappoint },
  // 6: Inner critic
  { type: 'critic', narration: 'Your Inner Critic starts screaming...', criticText: "They're over you. You're becoming irrelevant. Everyone thinks this post is cringe." },
  // 7: Choice
  {
    type: 'choice',
    narration: "You're spiraling. What do you do?",
    choices: [
      { text: 'Delete the post and pretend it never happened', feedback: "Deleting might feel like relief, but it doesn't address the feeling underneath. The Inner Critic wins this round." },
      { text: 'Put down your phone and take a breath', feedback: "Taking a pause is a great first step. It gives you space to process instead of reacting. You're breaking the spiral." },
      { text: 'Post again hoping this one does better', feedback: "Chasing validation can become a loop. The number on screen doesn't define your worth." },
    ],
  },
  // 8: Reframe
  { type: 'scenario', narration: "You notice the tight feeling in your chest. That's your body telling you something. This feeling has a name — it's a mix of loneliness and self-doubt.", image: EmotionAssets.overwhelmed },
  // 9: Insight
  {
    type: 'insight',
    insightTitle: 'You just met Loneliness',
    insightBody: "Loneliness often shows up when we feel invisible — especially online. It disguises itself as \"nobody cares\" but really it's saying \"I want to be seen.\" And that's completely valid.",
    image: EmotionAssets.embarassed,
  },
];

const TOTAL_PROGRESS = STEPS.length - 1; // exclude intro

export default function GhostedPostRP() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentStep = STEPS[step];
  const progress = step / TOTAL_PROGRESS;

  const handleNext = () => {
    if (step >= STEPS.length - 1) {
      // Complete — go to result
      router.replace('/roleplay/result');
      return;
    }
    setSelectedChoice(null);
    setShowFeedback(false);
    setStep(s => s + 1);
  };

  const handleChoice = (index: number) => {
    setSelectedChoice(index);
    setShowFeedback(true);
  };

  const handleClose = () => {
    router.replace('/(tabs)');
  };

  // --- INTRO SCREEN ---
  if (step === 0) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView style={styles.container} contentContainerStyle={styles.introContent}>
          <View style={styles.introHeader}>
            <Text style={styles.introLabel}>Role-Play Emotional Practice</Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </Pressable>
          </View>

          <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE }}>
            <Text style={styles.introTitle}>The ghosted post</Text>
            <Text style={styles.introTag}>Anticipate 3 min</Text>
            <Text style={styles.introDesc}>
              Mastering the <Text style={{ fontFamily: Fonts.bodySemiBold }}>'everyone is judging me'</Text> feeling and silencing the fear of being watched when social media goes quiet.
            </Text>
          </MotiView>

          <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', ...SPRING_BOUNCY, delay: 200 }} style={styles.introImageContainer}>
            <Image source={EmotionAssets.worried} style={styles.introImage} resizeMode="contain" />
          </MotiView>

          <View style={styles.sourceCard}>
            <Text style={styles.sourceLabel}>Sources</Text>
            <Text style={styles.sourceText}>Exploring the Impact of Social Media on Adolescent Well-being</Text>
            <Text style={styles.sourceRef}>Psychiatry International (2023)</Text>
          </View>

          <View style={styles.introFooter}>
            <Button title="I'm Ready!" onPress={handleNext} size="lg" fullWidth />
            <Pressable onPress={handleClose}>
              <Text style={styles.skipLink}>Try another session</Text>
            </Pressable>
          </View>
        </ScrollView>
      </>
    );
  }

  // --- SCENARIO / CRITIC / CHOICE / INSIGHT SCREENS ---
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header: back + progress + close */}
        <View style={styles.topBar}>
          <Pressable onPress={() => step > 1 ? setStep(s => s - 1) : setStep(0)} hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </Pressable>
          <View style={styles.progressRow}>
            {Array.from({ length: TOTAL_PROGRESS }).map((_, i) => (
              <View key={i} style={[styles.progressSeg, i < step && styles.progressSegFilled]} />
            ))}
          </View>
          <Pressable onPress={handleClose} hitSlop={12}>
            <Ionicons name="close" size={22} color={Colors.text} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.stepContent}>
          {/* Section label */}
          <MotiView key={`label-${step}`} from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 300 }}>
            <Text style={styles.sectionLabel}>
              {currentStep.type === 'insight' ? 'Insight' : 'Scenario'}
            </Text>
          </MotiView>

          {/* Narrative card */}
          {currentStep.narration && (
            <MotiView key={`narr-${step}`} from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE }}>
              <View style={styles.narrativeCard}>
                <Text style={styles.narrativeText}>{currentStep.narration}</Text>
              </View>
            </MotiView>
          )}

          {/* Inner critic thought bubble */}
          {currentStep.type === 'critic' && currentStep.criticText && (
            <MotiView key={`critic-${step}`} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', ...SPRING_BOUNCY, delay: 300 }}>
              <View style={styles.criticBubble}>
                <Text style={styles.criticText}>{currentStep.criticText}</Text>
              </View>
            </MotiView>
          )}

          {/* Choice options */}
          {currentStep.type === 'choice' && currentStep.choices && (
            <View style={styles.choiceContainer}>
              {currentStep.choices.map((choice, i) => (
                <MotiView key={i} from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: staggerDelay(i, 200) }}>
                  <Pressable
                    style={[styles.choiceCard, selectedChoice === i && styles.choiceSelected]}
                    onPress={() => handleChoice(i)}
                    disabled={showFeedback}
                  >
                    <Text style={styles.choiceText}>{choice.text}</Text>
                  </Pressable>
                </MotiView>
              ))}
              {showFeedback && selectedChoice !== null && (
                <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE }}>
                  <View style={styles.feedbackCard}>
                    <Text style={styles.feedbackText}>{currentStep.choices[selectedChoice].feedback}</Text>
                  </View>
                </MotiView>
              )}
            </View>
          )}

          {/* Insight content */}
          {currentStep.type === 'insight' && (
            <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', ...SPRING_BOUNCY, delay: 200 }}>
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>{currentStep.insightTitle}</Text>
                <Text style={styles.insightBody}>{currentStep.insightBody}</Text>
              </View>
            </MotiView>
          )}

          {/* Illustration */}
          {currentStep.image && (
            <MotiView key={`img-${step}`} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: 200 }}>
              <View style={styles.illustrationContainer}>
                <Image source={currentStep.image} style={styles.illustration} resizeMode="contain" />
              </View>
            </MotiView>
          )}
        </ScrollView>

        {/* Footer button */}
        <View style={styles.footer}>
          {currentStep.type === 'choice' ? (
            <Button title="Continue" onPress={handleNext} size="lg" fullWidth disabled={!showFeedback} />
          ) : (
            <Button
              title={step >= STEPS.length - 1 ? 'Complete' : 'Continue'}
              onPress={handleNext}
              size="lg"
              fullWidth
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },

  // Intro
  introContent: { paddingHorizontal: Spacing.xxl, paddingTop: Layout.statusBarOffset, paddingBottom: Spacing.xxxl },
  introHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xxl },
  introLabel: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.textSecondary },
  introTitle: { fontFamily: Fonts.heading, fontSize: 32, color: Colors.text, marginBottom: Spacing.sm, lineHeight: 40 },
  introTag: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.primary, marginBottom: Spacing.lg },
  introDesc: { fontFamily: Fonts.body, fontSize: 16, lineHeight: 26, color: Colors.text, marginBottom: Spacing.xxl },
  introImageContainer: { alignItems: 'center', marginBottom: Spacing.xxl },
  introImage: { width: 200, height: 200 },
  sourceCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg, marginBottom: Spacing.xxl },
  sourceLabel: { fontFamily: Fonts.bodySemiBold, fontSize: 12, color: Colors.primary, marginBottom: Spacing.xs },
  sourceText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.text, marginBottom: 2 },
  sourceRef: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textSecondary },
  introFooter: { gap: Spacing.lg, alignItems: 'center' },
  skipLink: { fontFamily: Fonts.body, fontSize: 15, color: Colors.textSecondary },

  // Step screens
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.xxl, paddingTop: Layout.statusBarOffset, paddingBottom: Spacing.md,
  },
  progressRow: { flex: 1, flexDirection: 'row', gap: 4 },
  progressSeg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  progressSegFilled: { backgroundColor: Colors.text },

  stepContent: { paddingHorizontal: Spacing.xxl, paddingBottom: 120 },
  sectionLabel: { fontFamily: Fonts.bodySemiBold, fontSize: 20, color: Colors.text, marginBottom: Spacing.lg },
  narrativeCard: { backgroundColor: Colors.borderLight, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  narrativeText: { fontFamily: Fonts.body, fontSize: 16, lineHeight: 26, color: Colors.text },

  // Inner critic
  criticBubble: {
    backgroundColor: Colors.text, borderRadius: BorderRadius.xl, padding: Spacing.xl, marginBottom: Spacing.lg,
  },
  criticText: { fontFamily: Fonts.body, fontSize: 16, lineHeight: 26, color: Colors.textLight, fontStyle: 'italic' },

  // Choices
  choiceContainer: { gap: Spacing.md, marginBottom: Spacing.lg },
  choiceCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg },
  choiceSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  choiceText: { fontFamily: Fonts.body, fontSize: 15, lineHeight: 22, color: Colors.text },
  feedbackCard: { backgroundColor: Colors.brandLight, borderRadius: BorderRadius.md, padding: Spacing.lg },
  feedbackText: { fontFamily: Fonts.body, fontSize: 15, lineHeight: 24, color: Colors.text },

  // Insight
  insightCard: { backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, padding: Spacing.xxl, marginBottom: Spacing.lg },
  insightTitle: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.textLight, marginBottom: Spacing.md },
  insightBody: { fontFamily: Fonts.body, fontSize: 16, lineHeight: 26, color: 'rgba(255,255,255,0.85)' },

  // Illustration
  illustrationContainer: { alignItems: 'center', paddingVertical: Spacing.lg },
  illustration: { width: 180, height: 180 },

  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.xxxl, paddingTop: Spacing.lg, backgroundColor: '#F9F9F9' },
});
