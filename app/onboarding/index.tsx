import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Layout, Spacing, Typography, BorderRadius, Fonts } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { useUser } from '../../src/context/UserContext';

// Step 0: Landing
// Step 1: Goal Setting
// Step 2: Scenarios
// Step 3: Vibe Check (slider)
// Step 4: Vibe archetype result
// Step 5: Username input
// Step 6: Profile picture upload

const goalOptions = [
  { emoji: '🤔', text: 'I feel a lot but can\'t explain it' },
  { emoji: '⏯️', text: 'I replay conversations in my head' },
  { emoji: '🛑', text: 'I shut down when things get messy' },
  { emoji: '🪞', text: 'I want to know myself better' },
];

const scenarioOptions = [
  { id: 'school', label: 'At school', image: require('../../assets/in app_thumbnail/mood_journal_lowkey_stressed_thumbnail_1.gif') },
  { id: 'family', label: 'With family', image: require('../../assets/in app_thumbnail/guilty_thumbnail.gif') },
  { id: 'friends', label: 'With friends', image: require('../../assets/in app_thumbnail/wait and see_doodle.gif') },
  { id: 'scrolling', label: 'Scrolling', image: require('../../assets/in app_thumbnail/onboard_scrolling.gif') },
];

const VIBE_BAR_COUNT = 15;
const VIBE_BAR_HEIGHTS = [70, 52, 38, 60, 80, 44, 62, 48, 72, 40, 58, 45, 66, 42, 76];

const archetypes = [
  {
    threshold: 1 / 3,
    name: 'Quiet processor',
    image: require('../../assets/in app_thumbnail/quiet processor.gif'),
    superPower: 'You are observant and learn things quickly from watching others.',
    growthArea: 'You grow from holding space for yourself.',
  },
  {
    threshold: 2 / 3,
    name: 'Thoughtful communicator',
    image: require('../../assets/emotions_png/motivated.png'),
    superPower: 'You weigh feelings carefully before sharing them.',
    growthArea: 'You grow by voicing what you feel in the moment.',
  },
  {
    threshold: 1.01,
    name: 'Open sharer',
    image: require('../../assets/emotions_png/motivated.png'),
    superPower: 'You talk things through so others feel heard.',
    growthArea: 'You grow by sitting with feelings before letting them out.',
  },
];

const getArchetype = (value: number) => archetypes.find(a => value < a.threshold) || archetypes[0];

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, setFullName, setProfileImage, setOnboarded } = useUser();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [vibeValue, setVibeValue] = useState(0.3);
  const [trackWidth, setTrackWidth] = useState(0);
  const [nameInput, setNameInput] = useState('Alex Wu');

  const activeBarIndex = Math.min(Math.floor(vibeValue * VIBE_BAR_COUNT), VIBE_BAR_COUNT - 1);
  const archetype = getArchetype(vibeValue);

  const finish = () => {
    if (nameInput.trim()) {
      setFullName(nameInput.trim());
    }
    setOnboarded(true);
    router.replace('/(tabs)/');
  };

  // --- STEP 0: Landing Screen ---
  if (step === 0) {
    return (
      <View style={styles.landingRoot}>
        <View style={styles.landingCard}>
          <Image
            source={require('../../assets/in app_thumbnail/landing page.gif')}
            style={styles.landingHero}
            resizeMode="contain"
          />
          <Text style={styles.landingSubtitle}>Unlock your emotion learning{'\n'}journey today.</Text>
        </View>
        <View style={styles.landingFooter}>
          <Button
            title="Get Started"
            onPress={() => setStep(1)}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.landingCta}
          />
          <Pressable onPress={() => { setOnboarded(true); router.replace('/(tabs)'); }}>
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
          {scenarioOptions.map((s) => {
            const scaleBottom = s.id === 'family' || s.id === 'scrolling';
            return (
              <Pressable key={s.id}
                style={[styles.scenarioCard, selectedScenarios.includes(s.id) && styles.scenarioSelected]}
                onPress={() => setSelectedScenarios(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])}
              >
                <Image
                  source={s.image}
                  style={[styles.scenarioImage, scaleBottom && styles.scenarioImageBottom]}
                  resizeMode="contain"
                />
                <Text style={styles.scenarioLabel}>{s.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.footer}>
          <Button title="Continue" onPress={() => setStep(3)} variant="primary" size="lg" fullWidth />
          <Pressable onPress={() => setStep(3)}><Text style={styles.skipText}>Skip</Text></Pressable>
        </View>
      </View>
    );
  }

  // --- STEP 3: Vibe Check (slider) ---
  if (step === 3) {
    const updateFromX = (x: number) => {
      if (!trackWidth) return;
      const clamped = Math.max(0, Math.min(x, trackWidth));
      setVibeValue(clamped / trackWidth);
    };
    return (
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => setStep(2)}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.questionTitle}>Quick vibe check.</Text>
        <Text style={styles.questionSubtitle}>When something emotional happens, I usually…</Text>

        <View style={styles.sliderWrapper}>
          <View style={styles.barsRow}>
            {VIBE_BAR_HEIGHTS.map((h, i) => {
              let color: string = Colors.border;
              if (i === activeBarIndex) {
                color = Colors.text;
              } else if (i < activeBarIndex) {
                const t = activeBarIndex > 1 ? i / (activeBarIndex - 1) : 0;
                const r = Math.round(229 + (30 - 229) * t);
                const g = Math.round(229 + (30 - 229) * t);
                const b = Math.round(229 + (30 - 229) * t);
                color = `rgb(${r}, ${g}, ${b})`;
              }
              return (
                <View
                  key={i}
                  style={[styles.bar, { height: h, backgroundColor: color }]}
                />
              );
            })}
          </View>

          <View
            style={styles.sliderTrack}
            onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => updateFromX(e.nativeEvent.locationX)}
            onResponderMove={(e) => updateFromX(e.nativeEvent.locationX)}
          >
            <View style={[styles.sliderFill, { width: `${vibeValue * 100}%` as any }]} />
            <View
              pointerEvents="none"
              style={[
                styles.sliderHandle,
                { transform: [{ translateX: vibeValue * trackWidth - 28 }] },
              ]}
            >
              <Ionicons name="chevron-back" size={16} color={Colors.text} />
              <Ionicons name="chevron-forward" size={16} color={Colors.text} />
            </View>
          </View>

          <View style={styles.sliderLabelsRow}>
            <Text style={styles.sliderLabel}>Keep it to myself</Text>
            <Text style={styles.sliderLabel}>Talk it out</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />
        <View style={styles.footer}>
          <Button title="Continue" onPress={() => setStep(4)} variant="primary" size="lg" fullWidth />
          <Pressable onPress={() => setStep(4)}><Text style={styles.skipText}>Skip</Text></Pressable>
        </View>
      </View>
    );
  }

  // --- STEP 4: Vibe archetype result ---
  if (step === 4) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => setStep(3)}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.archetypeContent}>
          <Image source={archetype.image} style={styles.archetypeImage} resizeMode="contain" />
          <Text style={styles.archetypeTitle}>{archetype.name}</Text>
          <View style={styles.archetypeCard}>
            <Text style={styles.archetypeCardHeading}>💫  Your super power</Text>
            <Text style={styles.archetypeCardBody}>{archetype.superPower}</Text>
          </View>
          <View style={styles.archetypeCard}>
            <Text style={styles.archetypeCardHeading}>🔮  Growth area</Text>
            <Text style={styles.archetypeCardBody}>{archetype.growthArea}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.footer}>
          <Button title="Let's go!" onPress={() => setStep(5)} variant="primary" size="lg" fullWidth />
        </View>
      </View>
    );
  }

  // --- STEP 5: Username input ---
  if (step === 5) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => setStep(4)}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.questionTitle}>Let's create your profile</Text>
        <Text style={styles.questionSubtitle}>What should we call you?</Text>

        <View style={styles.profileCreator}>
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
          <Button
            title="Continue"
            onPress={() => {
              if (nameInput.trim()) setFullName(nameInput.trim());
              setStep(6);
            }}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!nameInput.trim()}
          />
        </View>
      </View>
    );
  }

  // --- STEP 6: Profile picture upload ---
  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => setStep(5)}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </Pressable>
      <Text style={styles.questionTitle}>Add a profile picture</Text>
      <Text style={styles.questionSubtitle}>You can always change it later.</Text>

      <View style={styles.pfpCreator}>
        <Pressable onPress={pickProfileImage} style={styles.pfpAvatarWrap}>
          <Image
            source={
              user.profileImage
                ? { uri: user.profileImage }
                : require('../../assets/in app_thumbnail/pfp.png')
            }
            style={styles.pfpAvatar}
            resizeMode="cover"
          />
          <View style={styles.pfpEditBadge}>
            <Ionicons name="camera" size={18} color={Colors.textLight} />
          </View>
        </Pressable>
        <Pressable onPress={pickProfileImage}>
          <Text style={styles.pfpUploadLink}>Upload a photo</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }} />
      <View style={styles.footer}>
        <Button title="Let's go!" onPress={finish} variant="primary" size="lg" fullWidth />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Spacing.xxl, paddingTop: Layout.statusBarOffset, paddingBottom: Spacing.xxxl },
  backButton: { marginBottom: Spacing.xxl },

  // Landing
  landingRoot: { flex: 1, backgroundColor: '#F7D917' },
  landingCard: {
    height: '81%' as any,
    width: '100%' as any,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Layout.statusBarOffset,
  },
  landingHero: {
    width: '103%' as any,
    aspectRatio: 400 / 407,
    marginTop: 100,
    marginBottom: -56,
  },
  landingSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 25,
  },
  landingFooter: {
    flex: 1,
    backgroundColor: '#F7D917',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  landingCta: {
    backgroundColor: Colors.text,
    width: '100%' as any,
    transform: [{ translateY: -28 }],
  },
  landingLogin: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.text, textAlign: 'center', marginTop: -5 },

  // Shared
  questionTitle: { fontSize: 32, lineHeight: 40, fontFamily: Fonts.headingSemiBold, color: Colors.text, marginBottom: Spacing.sm },
  questionSubtitle: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textSecondary, marginBottom: Spacing.xxl },
  footer: { alignItems: 'center', gap: Spacing.lg },
  skipText: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textSecondary },

  // Goal Setting
  optionsList: { gap: Spacing.md },
  optionCard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  optionSelected: { borderColor: Colors.text, borderWidth: 2 },
  optionEmoji: { fontSize: 24 },
  optionText: { fontFamily: Fonts.body, fontSize: 16, color: Colors.text },

  // Scenarios
  scenarioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  scenarioCard: {
    width: '47%' as any,
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  scenarioSelected: { borderColor: Colors.text, borderWidth: 2 },
  scenarioImage: { width: '85%' as any, aspectRatio: 1, flex: 1 },
  scenarioImageBottom: { transform: [{ scale: 1.15 }, { translateY: 5 }] },
  scenarioLabel: { fontFamily: Fonts.body, fontSize: 16, color: Colors.text, textAlign: 'center' },

  // Vibe Check (slider)
  sliderWrapper: { paddingTop: Spacing.xxl, paddingHorizontal: Spacing.sm },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 90,
    marginBottom: Spacing.xxl,
  },
  bar: {
    width: 9,
    backgroundColor: Colors.border,
    borderRadius: 4.5,
  },
  barActive: { backgroundColor: Colors.text },
  sliderTrack: {
    height: 32,
    justifyContent: 'center',
    backgroundColor: Colors.border,
    borderRadius: 16,
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.text,
    borderRadius: 16,
  },
  sliderHandle: {
    position: 'absolute',
    width: 56,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    top: -2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  sliderLabel: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary },

  // Archetype Result (step 4)
  archetypeContent: { alignItems: 'center', paddingHorizontal: Spacing.sm },
  archetypeImage: { width: 300, height: 300, marginTop: -24, marginBottom: 0 },
  archetypeTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 32,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  archetypeCard: {
    width: '100%' as any,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  archetypeCardHeading: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  archetypeCardBody: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Profile Creator (username)
  profileCreator: { alignItems: 'center', gap: Spacing.xxl, paddingTop: Spacing.xxxl },
  profileAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.brand, borderWidth: 2, borderColor: Colors.text, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  profileNameInput: {
    fontFamily: Fonts.body, fontSize: 20, color: Colors.text, textAlign: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.pill,
    borderWidth: 2, borderColor: Colors.primary,
    paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg,
    width: 280,
  },

  // Profile picture upload
  pfpCreator: { alignItems: 'center', gap: Spacing.lg, paddingTop: Spacing.xxxl },
  pfpAvatarWrap: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'visible',
  },
  pfpAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  pfpEditBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  pfpUploadLink: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
