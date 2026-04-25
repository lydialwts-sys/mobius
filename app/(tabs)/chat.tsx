import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Colors, Spacing, Typography, BorderRadius, Fonts, Layout } from '../../src/constants/theme';
import { SPRING_BOUNCY, SPRING_GENTLE } from '../../src/constants/animations';
import { useUser } from '../../src/context/UserContext';

export default function ChatHomeScreen() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <View style={styles.container}>
      {/* Hamburger top bar */}
      <View style={styles.topBar}>
        <Ionicons name="menu" size={28} color={Colors.text} />
      </View>

      {/* AI character — full sun. On mount: subtle upward motion (10% of sun height = ~90px) + fade in. */}
      <MotiView
        from={{ opacity: 0, translateY: 180 }}
        animate={{ opacity: 1, translateY: 90 }}
        transition={{
          opacity: { type: 'timing', duration: 600 },
          translateY: { type: 'spring', ...SPRING_GENTLE, delay: 50 },
        }}
        style={styles.characterContainer}
        pointerEvents="none"
      >
        <Image
          source={require('../../assets/in app_thumbnail/AI Agent_wake up.gif')}
          style={styles.aiCharacter}
          resizeMode="contain"
        />
      </MotiView>

      {/* Greeting — very subtle: fade in + ~5% upward motion (small offset) */}
      <MotiView
        from={{ opacity: 0, translateY: 18 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          opacity: { type: 'timing', duration: 700, delay: 250 },
          translateY: { type: 'timing', duration: 700, delay: 250 },
        }}
        style={styles.greetingWrap}
      >
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Good afternoon, {user.firstName}</Text>
          <Text style={styles.subtitle}>What's going on?</Text>
        </View>
      </MotiView>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={24} color={Colors.text} />
        </Pressable>
        <Pressable
          style={styles.textInputContainer}
          onPress={() => router.push('/chat/conversation')}
        >
          <Text style={styles.placeholder}>Type a message...</Text>
        </Pressable>
        <Pressable
          style={styles.micButton}
          onPress={() => router.push('/chat/conversation')}
        >
          <Ionicons name="mic" size={20} color={Colors.textLight} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: 24,
  },
  topBar: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Layout.statusBarOffset,
    paddingBottom: Spacing.sm,
  },
  // Sun centered on the screen — translateY (1300px down) is applied via Moti's animate prop
  // so it doesn't get overridden by Moti's auto-generated transform
  characterContainer: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Sun scaled to 907 (756 + 20%)
  aiCharacter: {
    width: 907,
    height: 907,
  },
  // Greeting wrapper sits above the centered sun (foreground)
  // marginTop:auto pushes it to the bottom; marginBottom adds 100px of space above the input bar
  greetingWrap: {
    marginTop: 'auto' as any,
    marginBottom: 100,
  },
  greetingContainer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  greeting: {
    fontSize: 28,
    fontFamily: Fonts.heading,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  placeholder: {
    ...Typography.body,
    color: Colors.textTertiary,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
