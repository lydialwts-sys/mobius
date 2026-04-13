import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout, Spacing, Typography, BorderRadius, Fonts } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { useUser } from '../../src/context/UserContext';

// Step 0: Landing
// Step 1: Goal Setting
// Step 2: Scenarios
// Step 3: Vibe Check
// Step 4: Vibe
// Step 5: Profile Creator

const goalOptions = [
  { emoji: '🥺', text: 'I feel a lot but can\'t explain it' },
  { emoji: '💬', text: 'I replay conversations in my head' },
  { emoji: '🔴', text: 'I shut down when things get messy' },
  { emoji: '🪞', text: 'I want to know myself better' },
];

const scenarioOptions = [
  { id: 'school', label: 'At school', image: require('../../assets/emotions_png/stress.png') },
  { id: 'family', label: 'With family', image: require('../../assets/emotions_png/worried.png') },
  { id: 'friends', label: 'With friends', image: require('../../assets/emotions_png/happy.png') },
  { id: 'scrolling', label: 'Scrolling', image: require('../../assets/emotions_png/bored.png') },
];

const vibeOptions = [
  { emoji: '😊', label: 'Good vibes' },
  { emoji: '😐', label: 'Meh' },
  { emoji: '😰', label: 'Low-key stressed' },
  { emoji: '😢', label: 'Not great' },
  { emoji: '🤬', label: 'A lot rn' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setFullName, setProfileImage } = useUser();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');

  const finish = () => {
    if (nameInput.trim()) {
      setFullName(nameInput.trim());
    }
    router.replace('/(tabs)');
  };

  // --- STEP 0: Landing Screen ---
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
          <Button title="Get Started" onPress={() => setStep(1)} variant="primary" size="lg" fullWidth style={{ backgroundColor: Colors.brand }} />
          <Pressable onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.landingLogin}>Log In</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // --- STEP 1: Goal Setting ---
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
            <Pressable key={i}
              style={[styles.optionCard, selectedGoals.includes(i) && styles.optionSelected]}
              onPress={() => setSelectedGoals(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={styles.optionText}>{option.text}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.footer}>
          <Button title="Continue" onPress={() => setStep(2)} variant="primary" size="lg" fullWidth />
          <Pressable onPress={() => setStep(2)}><Text style={styles.skipText}>Skip</Text></Pressable>
        </View>
      </View>
    );
  }

  // --- STEP 2: Scenarios ---
  if (step === 2) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => setStep(1)}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.questionTitle}>When do things feel hardest for you?</Text>
        <Text style={styles.questionSubtitle}>Pick any that resonate.</Text>
        <View style={styles.scenarioGrid}>
          {scenarioOptions.map((s) => (
            <Pressable key={s.id}
              style={[styles.scenarioCard, selectedScenarios.includes(s.id) && styles.scenarioSelected]}
              onPress={() => setSelectedScenarios(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])}
            >
              <View style={styles.scenarioIllustration}>
                <Image source={s.image} style={{ width: 48, height: 48 }} resizeMode="contain" />
              </View>
              <Text style={styles.scenarioLabel}>{s.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.footer}>
          <Button title="Continue" onPress={() => setStep(3)} variant="primary" size="lg" fullWidth />
          <Pressable onPress={() => setStep(3)}><Text style={styles.skipText}>Skip</Text></Pressable>
        </View>
      </View>
    );
  }

  // --- STEP 3: Vibe Check ---
  if (step === 3) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => setStep(2)}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.questionTitle}>Vibe check — how are you feeling right now?</Text>
        <Text style={styles.questionSubtitle}>No wrong answers.</Text>
        <View style={styles.vibeList}>
          {vibeOptions.map((v) => (
            <Pressable key={v.label}
              style={[styles.vibeCard, selectedVibe === v.label && styles.vibeSelected]}
              onPress={() => setSelectedVibe(v.label)}
            >
              <Text style={styles.vibeEmoji}>{v.emoji}</Text>
              <Text style={styles.vibeLabel}>{v.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.footer}>
          <Button title="Continue" onPress={() => setStep(4)} variant="primary" size="lg" fullWidth disabled={!selectedVibe} />
          <Pressable onPress={() => setStep(4)}><Text style={styles.skipText}>Skip</Text></Pressable>
        </View>
      </View>
    );
  }

  // --- STEP 4: Vibe (result/affirmation) ---
  if (step === 4) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => setStep(3)}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.vibeResultContent}>
          <View style={styles.vibeResultCircle}>
            <Image source={require('../../assets/emotions_png/motivated.png')} style={{ width: 80, height: 80 }} resizeMode="contain" />
          </View>
          <Text style={styles.vibeResultTitle}>
            {selectedVibe === 'Good vibes' ? "Love that energy! 🌟" :
             selectedVibe === 'Meh' ? "Meh days are valid." :
             selectedVibe === 'Low-key stressed' ? "We see you. That's okay." :
             selectedVibe === 'Not great' ? "Thanks for being honest. 💛" :
             "It's a lot — and you showed up anyway."}
          </Text>
          <Text style={styles.vibeResultSubtitle}>
            Möbius is here to help you make sense of all of it. Let's set up your space.
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.footer}>
          <Button title="Continue" onPress={() => setStep(5)} variant="primary" size="lg" fullWidth />
        </View>
      </View>
    );
  }

  // --- STEP 5: Profile Creator ---
  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => setStep(4)}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </Pressable>
      <Text style={styles.questionTitle}>Let's create your profile</Text>
      <Text style={styles.questionSubtitle}>What should we call you?</Text>

      <View style={styles.profileCreator}>
        {/* Avatar */}
        <View style={styles.profileAvatar}>
          <Image source={require('../../assets/emotions_png/motivated.png')} style={{ width: 56, height: 56 }} resizeMode="contain" />
        </View>

        {/* Name input */}
        <TextInput
          style={styles.profileNameInput}
          placeholder="Your name"
          placeholderTextColor={Colors.textTertiary}
          value={nameInput}
          onChangeText={setNameInput}
          autoFocus
        />
      </View>

      <View style={{ flex: 1 }} />
      <View style={styles.footer}>
        <Button title="Let's go!" onPress={finish} variant="primary" size="lg" fullWidth disabled={!nameInput.trim()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Spacing.xxl, paddingTop: Layout.statusBarOffset, paddingBottom: Spacing.xxxl },
  backButton: { marginBottom: Spacing.xxl },

  // Landing
  landingContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  landingCharacter: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxxl },
  wordmarkImage: { width: 200, height: 60, tintColor: Colors.textLight, marginBottom: Spacing.lg },
  landingSubtitle: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textLight, textAlign: 'center', opacity: 0.8, lineHeight: 24 },
  landingLogin: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textLight, textAlign: 'center', opacity: 0.7 },

  // Shared
  questionTitle: { fontSize: 26, lineHeight: 34, fontFamily: Fonts.heading, color: Colors.text, marginBottom: Spacing.sm },
  questionSubtitle: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textSecondary, marginBottom: Spacing.xxl },
  footer: { alignItems: 'center', gap: Spacing.lg },
  skipText: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textSecondary },

  // Goal Setting
  optionsList: { gap: Spacing.md },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.lg },
  optionSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  optionEmoji: { fontSize: 24 },
  optionText: { fontFamily: Fonts.body, fontSize: 16, color: Colors.text, flex: 1 },

  // Scenarios
  scenarioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  scenarioCard: { width: '47%' as any, aspectRatio: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  scenarioSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  scenarioIllustration: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.brandLight, alignItems: 'center', justifyContent: 'center' },
  scenarioLabel: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.text },

  // Vibe Check
  vibeList: { gap: Spacing.md },
  vibeCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.pill, borderWidth: 1, borderColor: Colors.border, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  vibeSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  vibeEmoji: { fontSize: 24 },
  vibeLabel: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.text },

  // Vibe Result
  vibeResultContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg },
  vibeResultCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.brand, borderWidth: 2, borderColor: Colors.text, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl },
  vibeResultTitle: { fontFamily: Fonts.heading, fontSize: 26, color: Colors.text, textAlign: 'center', marginBottom: Spacing.lg, lineHeight: 34 },
  vibeResultSubtitle: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },

  // Profile Creator
  profileCreator: { alignItems: 'center', gap: Spacing.xxl, paddingTop: Spacing.xxxl },
  profileAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.brand, borderWidth: 2, borderColor: Colors.text, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  profileNameInput: {
    fontFamily: Fonts.body, fontSize: 20, color: Colors.text, textAlign: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.pill,
    borderWidth: 2, borderColor: Colors.primary,
    paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg,
    width: 280,
  },
});
