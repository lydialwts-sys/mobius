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
      {/* Header */}
      <View style={styles.topBar}>
        <Ionicons name="menu" size={28} color={Colors.text} />
      </View>

      {/* Character */}
      <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', ...SPRING_BOUNCY, delay: 50 }}>
      <View style={styles.characterContainer}>
        <View style={styles.characterCircle}>
          <Image
            source={require('../../assets/emotions_png/happy.png')}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
        </View>
      </View>

      </MotiView>

      {/* Greeting */}
      <MotiView from={{ opacity: 0, translateY: 6 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', ...SPRING_GENTLE, delay: 75 }}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Good afternoon, {user.firstName}</Text>
        <Text style={styles.subtitle}>What's going on?</Text>
      </View>

      </MotiView>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

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
    paddingBottom: Spacing.lg,
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xl,
  },
  characterCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.text,
    overflow: 'hidden',
  },
  greetingContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
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
