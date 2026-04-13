import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Fonts } from '../../src/constants/theme';
import { scriptedDialogue, chatOptions, chatTopic, type ScriptedMessage } from '../../src/data/chatScript';

export default function ConversationScreen() {
  const router = useRouter();
  const [visibleMessages, setVisibleMessages] = useState<ScriptedMessage[]>([]);
  const [scriptIndex, setScriptIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTypingIndicator, setIsTypingIndicator] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const typingDots = useRef(new Animated.Value(0)).current;

  // Auto-advance the scripted dialogue
  const advanceScript = useCallback(() => {
    if (scriptIndex >= scriptedDialogue.length) {
      setShowOptions(true);
      return;
    }

    const nextMsg = scriptedDialogue[scriptIndex];

    if (nextMsg.role === 'ai') {
      // Show typing indicator first
      setIsTypingIndicator(true);
      setTimeout(() => {
        setIsTypingIndicator(false);
        setVisibleMessages(prev => [...prev, nextMsg]);
        setScriptIndex(prev => prev + 1);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      }, nextMsg.delay);
    } else {
      // User messages appear instantly (they're "sent" by the user)
      setVisibleMessages(prev => [...prev, nextMsg]);
      setScriptIndex(prev => prev + 1);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [scriptIndex]);

  // Start the dialogue
  useEffect(() => {
    // Show first user message after a short delay
    const timer = setTimeout(() => advanceScript(), 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance after each message
  useEffect(() => {
    if (scriptIndex > 0 && scriptIndex < scriptedDialogue.length) {
      const timer = setTimeout(() => advanceScript(), 1500);
      return () => clearTimeout(timer);
    } else if (scriptIndex >= scriptedDialogue.length) {
      setTimeout(() => setShowOptions(true), 1000);
    }
  }, [scriptIndex]);

  // Typing animation
  useEffect(() => {
    if (isTypingIndicator) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingDots, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(typingDots, { toValue: 0, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      typingDots.setValue(0);
    }
  }, [isTypingIndicator]);

  const handleSend = () => {
    if (!input.trim()) return;
    // Input works but doesn't change the script - just clear it
    setInput('');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Stop recording - simulate transcription
      setTimeout(() => setIsRecording(false), 500);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="menu" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{chatTopic}</Text>
        <Ionicons name="chatbubble" size={20} color={Colors.text} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {visibleMessages.map((msg) => (
          <View key={msg.id} style={msg.role === 'user' ? styles.userRow : styles.aiRow}>
            {msg.role === 'ai' && (
              <View style={styles.aiAvatar}>
                <Image source={require('../../assets/emotions_png/motivated.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
              </View>
            )}
            <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.bubbleText, msg.role === 'user' ? styles.userText : styles.aiText]}>
                {msg.content}
              </Text>
            </View>
          </View>
        ))}

        {/* Typing indicator */}
        {isTypingIndicator && (
          <View style={styles.aiRow}>
            <View style={styles.aiAvatar}>
              <Image source={require('../../assets/emotions_png/motivated.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
            </View>
            <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
              <Animated.Text style={[styles.typingDots, { opacity: typingDots }]}>...</Animated.Text>
              <Text style={styles.typingDotsStatic}>•••</Text>
            </View>
          </View>
        )}

        {/* Options */}
        {showOptions && (
          <View style={styles.optionsContainer}>
            {chatOptions.map((option) => (
              <Pressable key={option.id} style={styles.optionButton}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input bar */}
      {isRecording ? (
        <View style={styles.recordingBar}>
          <Text style={styles.transcribingText}>Transcribing...</Text>
          <View style={styles.waveformContainer}>
            <View style={styles.waveform}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.waveBar, { height: 8 + Math.random() * 20 }]}
                />
              ))}
            </View>
            <Pressable onPress={toggleRecording} style={styles.closeRecording}>
              <Ionicons name="close" size={20} color={Colors.textLight} />
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.inputBar}>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={22} color={Colors.text} />
          </Pressable>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textTertiary}
            value={input}
            onChangeText={setInput}
            multiline
            onSubmitEditing={handleSend}
          />
          <Pressable style={styles.micButton} onPress={toggleRecording}>
            <Ionicons name="mic" size={18} color={Colors.textLight} />
          </Pressable>
        </View>
      )}

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <Pressable style={styles.tabItem} onPress={() => router.replace('/(tabs)')}>
          <Ionicons name="book-outline" size={22} color={Colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: Colors.textSecondary }]}>Learn</Text>
        </Pressable>
        <View style={styles.tabItem}>
          <View style={styles.chatTabIcon}>
            <Ionicons name="chatbubble" size={18} color={Colors.text} />
          </View>
          <Text style={styles.tabLabel}>Chat</Text>
        </View>
        <Pressable style={styles.tabItem} onPress={() => router.replace('/(tabs)/profile')}>
          <Ionicons name="person-outline" size={22} color={Colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: Colors.textSecondary }]}>Profile</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 18,
    color: Colors.text,
  },
  messages: { flex: 1 },
  messagesContent: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg },

  // Message rows
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.md,
  },
  aiRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },

  // Bubbles
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  userBubble: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopRightRadius: BorderRadius.sm,
  },
  aiBubble: {
    backgroundColor: 'transparent',
  },
  bubbleText: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  userText: { color: Colors.text },
  aiText: { color: Colors.text },

  // Typing indicator
  typingBubble: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  typingDots: {
    fontSize: 24,
    color: Colors.textSecondary,
    position: 'absolute',
  },
  typingDotsStatic: {
    fontSize: 18,
    color: Colors.textSecondary,
    letterSpacing: 4,
  },

  // Options
  optionsContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  optionIcon: { fontSize: 18 },
  optionLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    color: Colors.text,
  },

  // Recording bar
  recordingBar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  transcribingText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.text,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    width: '100%',
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 32,
  },
  waveBar: {
    width: 3,
    backgroundColor: Colors.textLight,
    borderRadius: 2,
  },
  closeRecording: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  tabItem: { alignItems: 'center', gap: Spacing.xs },
  chatTabIcon: {
    backgroundColor: Colors.brand,
    borderRadius: 6,
    padding: 4,
  },
  tabLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    color: Colors.text,
  },
});
