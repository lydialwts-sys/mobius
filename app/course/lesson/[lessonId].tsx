import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Colors, Spacing, BorderRadius, Fonts, Layout } from '../../../src/constants/theme';
import { SPRING_GENTLE, SPRING_BOUNCY, staggerDelay } from '../../../src/constants/animations';
import { Button } from '../../../src/components/Button';
import { courses, type LessonStep, type LessonOption } from '../../../src/data/mockData';

const SCREEN_W = Dimensions.get('window').width;

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const lesson = courses.flatMap(c => c.lessons).find(l => l.id === lessonId);
  const parentCourse = courses.find(c => c.lessons.some(l => l.id === lessonId));
  const courseRoute = parentCourse ? `/course/${parentCourse.id}` : '/(tabs)/learn';

  if (!lesson || lesson.steps.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🔒</Text>
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonBody}>This lesson is still being created.</Text>
          <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }

  const current = lesson.steps[step];
  const totalProgress = lesson.steps.length;
  const isLast = step === lesson.steps.length - 1;

  const handleClose = () => router.replace(courseRoute as any);
  const handleBack = () => (step > 0 ? setStep(s => s - 1) : router.back());
  const handleNext = () => {
    if (isLast) {
      router.replace(courseRoute as any);
      return;
    }
    setSelectedOption(null);
    setShowFeedback(false);
    setStep(s => s + 1);
  };
  const handleOption = (i: number) => {
    setSelectedOption(i);
    setShowFeedback(true);
  };

  // ===== INTRO (Knowledge Session landing) — mirrors Ghosted Post intro =====
  if (current.type === 'intro' && current.intro) {
    const intro = current.intro;
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView style={styles.container} contentContainerStyle={styles.introContent}>
          <View style={styles.introHeader}>
            <Text style={styles.introLabel}>{intro.label}</Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </Pressable>
          </View>

          <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE }}>
            <Text style={styles.introTitle}>{intro.title}</Text>
            <Text style={styles.introTag}>{intro.tag}</Text>
            <Text style={styles.introDesc}>{intro.description}</Text>
          </MotiView>

          <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', ...SPRING_BOUNCY, delay: 50 }} style={styles.introImageContainer}>
            <View style={[styles.introImageFrame, { aspectRatio: intro.imageAspect }]}>
              <Image source={intro.image} style={styles.introImage} resizeMode="contain" />
            </View>
          </MotiView>

          <View style={styles.sourceCard}>
            <Text style={styles.sourceLabel}>Sources</Text>
            <Text style={styles.sourceText}>{intro.sources.title}</Text>
            <Text style={styles.sourceRef}>{intro.sources.ref}</Text>
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

  // ===== SUMMARY (final screen with collected insights) =====
  if (current.type === 'summary' && current.insights) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
          <View style={styles.topBar}>
            <Pressable onPress={handleBack} hitSlop={12}>
              <Ionicons name="arrow-back" size={22} color={Colors.text} />
            </Pressable>
            <View style={styles.progressRow}>
              {lesson.steps.map((_, i) => (
                <View key={i} style={[styles.progressSeg, i < step + 1 && styles.progressSegFilled]} />
              ))}
            </View>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={Colors.text} />
            </Pressable>
          </View>

          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>{current.summaryTitle}</Text>
          </View>

          {/* Fanned card stack: side cards rotated outward, center card upright on top */}
          <View style={styles.fanContainer}>
            {current.insights.map((item, index) => {
              const total = current.insights!.length;
              const middle = Math.floor(total / 2);
              const offset = index - middle;            // -1, 0, +1 for 3 cards
              const isCenter = offset === 0;
              const cardWidth = Math.min(SCREEN_W * 0.62, 280);
              const ROT_DEG = 12;
              const rad = (ROT_DEG * Math.PI) / 180;
              // Approx card height for inner-corner offset math (height grows with body length, this is good enough)
              const cardHeightApprox = 380;
              // Closest gap between rotated side card and upright center card occurs at top-inner corner.
              // Inner corner shift = (cardHeight/2) * sin(rot)  +  (cardWidth/2) * (1 - cos(rot))
              const innerCornerShift = (cardHeightApprox / 2) * Math.sin(rad) + (cardWidth / 2) * (1 - Math.cos(rad));
              const GAP = 5;
              // Distance between card centers needed for GAP px between edges:
              // (center card half-width) + (side card half-width minus rotation pull-in) + GAP
              const tx = offset === 0 ? 0 : Math.sign(offset) * (cardWidth + innerCornerShift + GAP);
              // Lift the whole fan up 25px per spec; side cards still drop 18px below center
              const ty = (isCenter ? 0 : 18) - 25;
              const rot = `${offset * ROT_DEG}deg`;
              return (
                <MotiView
                  key={`ins-${index}`}
                  from={{ opacity: 0, scale: 0.85, translateX: 0, translateY: 0, rotate: '0deg' }}
                  animate={{ opacity: 1, scale: 1, translateX: tx, translateY: ty, rotate: rot }}
                  transition={{ type: 'spring', ...SPRING_GENTLE, delay: staggerDelay(index, 100) }}
                  style={[
                    styles.fanCard,
                    { width: cardWidth, zIndex: isCenter ? 2 : 1 },
                  ]}
                >
                  <Text style={styles.summaryCardTitle}>{item.title}</Text>
                  <Text style={styles.summaryCardBody}>{item.body}</Text>
                  <View style={styles.summaryCardImageWrap}>
                    <Image source={item.image} style={styles.summaryCardImage} resizeMode="contain" />
                  </View>
                </MotiView>
              );
            })}
          </View>

          <View style={styles.footer}>
            <Button title="Complete Session" onPress={handleNext} size="lg" fullWidth />
          </View>
        </View>
      </>
    );
  }

  // ===== ALL OTHER STEP TYPES (character-intro / quiz / reveal / insight) =====
  // Common chrome: top bar + segmented progress + bottom-anchored hero illustration + footer
  const heroImage =
    current.type === 'character-intro' ? current.characterImage :
    current.image;
  const heroAspect =
    current.type === 'character-intro' ? (current.characterImageAspect ?? 1) :
    (current.imageAspect ?? 1);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Bottom-anchored hero illustration (lowest layer) */}
        {heroImage && (
          <MotiView
            key={`hero-${step}`}
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', ...SPRING_GENTLE, delay: 50 }}
            style={styles.heroContainer}
            pointerEvents="none"
          >
            <View style={[styles.heroFrame, { aspectRatio: heroAspect }]}>
              <Image source={heroImage} style={styles.heroImage} resizeMode="contain" />
            </View>
          </MotiView>
        )}

        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable onPress={handleBack} hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </Pressable>
          <View style={styles.progressRow}>
            {lesson.steps.map((_, i) => (
              <View key={i} style={[styles.progressSeg, i < step + 1 && styles.progressSegFilled]} />
            ))}
          </View>
          <Pressable onPress={handleClose} hitSlop={12}>
            <Ionicons name="close" size={22} color={Colors.text} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.stepContent}>
          {/* === character-intro === */}
          {current.type === 'character-intro' && (
            <MotiView
              from={{ opacity: 0, translateY: 6 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', ...SPRING_GENTLE, delay: 100 }}
            >
              {current.characterCaption && (
                <Text style={styles.characterCaption}>{current.characterCaption}</Text>
              )}
              {current.characterCard && (
                <View style={styles.bodyCard}>
                  <Text style={styles.bodyCardText}>{current.characterCard}</Text>
                </View>
              )}
            </MotiView>
          )}

          {/* === quiz === */}
          {current.type === 'quiz' && (
            <View>
              {current.quizSubtitle && (
                <Text style={styles.quizSubtitle}>{current.quizSubtitle}</Text>
              )}
              {current.quizContext && (
                <Text style={styles.quizContext}>{current.quizContext}</Text>
              )}
              {current.quizTitle && (
                <Text style={styles.quizTitle}>{current.quizTitle}</Text>
              )}
              <View style={styles.optionsContainer}>
                {(current.options ?? []).map((opt, i) => (
                  <MotiView
                    key={`${step}-opt-${i}`}
                    from={{ opacity: 0, translateY: 6 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', ...SPRING_GENTLE, delay: staggerDelay(i, 100) }}
                  >
                    <OptionCard
                      option={opt}
                      selected={selectedOption === i}
                      onPress={() => handleOption(i)}
                      disabled={showFeedback}
                    />
                  </MotiView>
                ))}
              </View>
            </View>
          )}

          {/* === reveal / insight (white card stack) === */}
          {(current.type === 'reveal' || current.type === 'insight') && (
            <View>
              {current.sectionTitle && (
                <Text style={styles.sectionTitle}>{current.sectionTitle}</Text>
              )}
              <View style={styles.cardsStack}>
                {(current.cards ?? []).map((card, i) => (
                  <MotiView
                    key={`${step}-card-${i}`}
                    from={{ opacity: 0, translateY: 6 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', ...SPRING_GENTLE, delay: staggerDelay(i, 120) }}
                  >
                    <View style={styles.bodyCard}>
                      <Text style={[styles.bodyCardText, card.highlight && styles.bodyCardHighlight]}>
                        {card.text}
                      </Text>
                    </View>
                  </MotiView>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={isLast ? 'Complete' : 'Continue'}
            onPress={handleNext}
            size="lg"
            fullWidth
            disabled={current.type === 'quiz' && !showFeedback}
          />
        </View>
      </View>
    </>
  );
}

// Quiz option card — renders text + optional inline doodle/emoji
function OptionCard({
  option,
  selected,
  onPress,
  disabled,
}: {
  option: LessonOption;
  selected: boolean;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      style={[styles.optionCard, selected && styles.optionCardSelected]}
      onPress={onPress}
      disabled={disabled}
    >
      {option.emoji && <Text style={styles.optionEmoji}>{option.emoji}</Text>}
      <Text style={styles.optionText}>{option.text}</Text>
      {option.image && (
        <View style={[styles.optionImageWrap, { aspectRatio: option.imageAspect ?? 1 }]}>
          <Image source={option.image} style={styles.optionImage} resizeMode="contain" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  comingSoonTitle: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.text, marginBottom: 8 },
  comingSoonBody: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },

  // ===== INTRO =====
  introContent: { paddingHorizontal: Spacing.xxl, paddingTop: Layout.statusBarOffset, paddingBottom: Spacing.xxxl },
  introHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xxl },
  introLabel: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.textSecondary },
  introTitle: { fontFamily: Fonts.heading, fontSize: 32, color: Colors.text, marginBottom: Spacing.sm, lineHeight: 40 },
  introTag: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.primary, marginBottom: Spacing.lg },
  introDesc: { fontFamily: Fonts.body, fontSize: 16, lineHeight: 26, color: Colors.text, marginBottom: 10 },
  introImageContainer: { alignItems: 'center', marginBottom: 10 },
  introImageFrame: { width: '100%' as any },
  introImage: { width: '100%' as any, height: '100%' as any },
  sourceCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg, marginBottom: Spacing.xxl },
  sourceLabel: { fontFamily: Fonts.bodySemiBold, fontSize: 12, color: Colors.primary, marginBottom: Spacing.xs },
  sourceText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.text, marginBottom: 2 },
  sourceRef: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textSecondary },
  introFooter: { gap: Spacing.lg, alignItems: 'center' },
  skipLink: { fontFamily: Fonts.body, fontSize: 15, color: Colors.textSecondary },

  // ===== STEP CHROME (top bar + progress) =====
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.xxl, paddingTop: Layout.statusBarOffset, paddingBottom: Spacing.md,
  },
  progressRow: { flex: 1, flexDirection: 'row', gap: 4 },
  progressSeg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  progressSegFilled: { backgroundColor: Colors.text },

  // ===== STEP CONTENT (shared) =====
  stepContent: { paddingHorizontal: Spacing.xxl, paddingBottom: 400 },

  // ===== character-intro =====
  characterCaption: {
    fontFamily: Fonts.body, fontSize: 16, color: Colors.text,
    textAlign: 'center', marginTop: Spacing.xxxl, marginBottom: Spacing.xxl,
  },

  // ===== quiz =====
  quizSubtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.text, marginBottom: Spacing.sm },
  quizContext: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing.sm, lineHeight: 22 },
  quizTitle: { fontFamily: Fonts.headingSemiBold, fontSize: 22, color: Colors.primary, lineHeight: 30, marginBottom: Spacing.xl },
  optionsContainer: { gap: Spacing.md, marginBottom: Spacing.lg },
  optionCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    minHeight: 64,
  },
  optionCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  optionEmoji: { fontSize: 22 },
  optionText: { flex: 1, fontFamily: Fonts.body, fontSize: 15, lineHeight: 22, color: Colors.text },
  optionImageWrap: { width: 56 },
  optionImage: { width: '100%' as any, height: '100%' as any },

  // ===== reveal / insight =====
  sectionTitle: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.text, marginBottom: Spacing.xl },
  cardsStack: { gap: Spacing.md, marginBottom: Spacing.lg },
  bodyCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.lg, marginBottom: Spacing.md,
  },
  bodyCardText: { fontFamily: Fonts.body, fontSize: 15, lineHeight: 24, color: Colors.text },
  bodyCardHighlight: { color: Colors.primary, fontFamily: Fonts.bodySemiBold },

  // ===== summary =====
  summaryHeader: { paddingHorizontal: Spacing.xxl, paddingTop: Spacing.xl, paddingBottom: Spacing.xxl, alignItems: 'center' },
  summaryTitle: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.text, lineHeight: 36, textAlign: 'center' },
  // Fanned card stack — side cards rotated outward, center card upright on top
  fanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible' as any,
  },
  fanCard: {
    position: 'absolute',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  summaryCardTitle: { fontFamily: Fonts.headingSemiBold, fontSize: 20, color: Colors.primary, marginBottom: Spacing.sm },
  summaryCardBody: { fontFamily: Fonts.body, fontSize: 14, lineHeight: 22, color: Colors.text, marginBottom: Spacing.md },
  summaryCardImageWrap: { width: '100%' as any, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  summaryCardImage: { width: '100%' as any, height: '100%' as any },

  // ===== hero illustration (bottom-anchored, lowest layer) =====
  heroContainer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    alignItems: 'center',
  },
  heroFrame: { width: '70%' as any },
  heroImage: { width: '100%' as any, height: '100%' as any },

  // ===== footer =====
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.xxxl, paddingTop: Spacing.lg,
  },
});
