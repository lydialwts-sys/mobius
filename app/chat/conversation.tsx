import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Colors, Spacing, BorderRadius, Fonts, Layout } from '../../src/constants/theme';
import { SPRING_BOUNCY, SPRING_GENTLE, staggerDelay } from '../../src/constants/animations';
import { scriptedDialogue, exerciseOptions, chatTopic, type ScriptedMessage } from '../../src/data/chatScript';
import { CustomTabBar } from '../../src/components/CustomTabBar';

export default function ConversationScreen() {
  const router = useRouter();
  const [visibleMessages, setVisibleMessages] = useState<ScriptedMessage[]>([]);
  const [scriptIndex, setScriptIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTypingIndicator, setIsTypingIndicator] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const advanceScript = useCallback(() => {
    if (scriptIndex >= scriptedDialogue.length) {
      setShowOptions(true);
      return;
    }
    const nextMsg = scriptedDialogue[scriptIndex];
    if (nextMsg.role === 'ai') {
      setIsTypingIndicator(true);
      setTimeout(() => {
        setIsTypingIndicator(false);
        setVisibleMessages(prev => [...prev, nextMsg]);
        setScriptIndex(prev => prev + 1);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      }, nextMsg.delay);
    } else {
      setVisibleMessages(prev => [...prev, nextMsg]);
      setScriptIndex(prev => prev + 1);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [scriptIndex]);

  useEffect(() => {
    const timer = setTimeout(() => advanceScript(), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scriptIndex > 0 && scriptIndex < scriptedDialogue.length) {
      const timer = setTimeout(() => advanceScript(), 1500);
      return () => clearTimeout(timer);
    } else if (scriptIndex >= scriptedDialogue.length) {
      setTimeout(() => setShowOptions(true), 1000);
    }
  }, [scriptIndex]);

  const handleSend = () => { if (!input.trim()) return; setInput(''); };
  const toggleRecording = () => { setIsRecording(!isRecording); if (isRecording) setTimeout(() => setIsRecording(false), 500); };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      {/* Header — no bottom border, image icon on right per Figma */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="menu" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{chatTopic}</Text>
        <Ionicons name="image-outline" size={22} color={Colors.text} />
      </View>

      {/* Messages */}
      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>

        {visibleMessages.map((msg) => (
          <MotiView key={msg.id} from={{ opacity: 0, translateY: 5 }} animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', ...SPRING_GENTLE }}>
            <View style={msg.role === 'user' ? styles.userRow : styles.aiRow}>
              {msg.role === 'ai' && (
                <Image source={require('../../assets/in app_thumbnail/AI chat bubble_icon.png')} style={styles.aiAvatar} resizeMode="contain" />
              )}
              <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.bubbleText, msg.role === 'user' ? styles.userText : styles.aiText]}>{msg.content}</Text>
              </View>
            </View>
          </MotiView>
        ))}

        {/* Typing indicator — bouncing avatar + "Thinking..." italic per Figma */}
        {isTypingIndicator && (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 200 }}>
            <View style={styles.aiRow}>
              {/* Subtle ball-bounce on the avatar while loading */}
              <MotiView
                from={{ translateY: 0 }}
                animate={{ translateY: -4 }}
                transition={{ type: 'timing', duration: 500, loop: true, repeatReverse: true }}
              >
                <Image source={require('../../assets/in app_thumbnail/AI chat bubble_icon.png')} style={styles.aiAvatar} resizeMode="contain" />
              </MotiView>
              <MotiView
                from={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 800, loop: true }}
              >
                <Text style={styles.thinkingText}>Thinking...</Text>
              </MotiView>
            </View>
          </MotiView>
        )}

        {/* Exercise option cards (Figma Chat 8 - Options: full-color card with integrated doodle) */}
        {showOptions && (
          <View style={styles.optionsWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
              {exerciseOptions.map((option, i) => {
                const isNavy = option.variant === 'navy';
                return (
                  <MotiView key={option.id} from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: 50 + i * 80 }}>
                    <Pressable
                      style={[styles.exerciseCard, isNavy ? styles.exerciseCardNavy : styles.exerciseCardCream]}
                      onPress={() => { if (option.clickable && option.route) router.push(option.route as any); }}
                    >
                      <Text style={[styles.exerciseTitle, isNavy && styles.exerciseTitleOnNavy]}>{option.title}</Text>
                      <View style={styles.exerciseMetaRow}>
                        <Text style={[styles.exerciseTag, isNavy && styles.exerciseTagOnNavy]}>{option.tag}</Text>
                        <Text style={[styles.exerciseDuration, isNavy && styles.exerciseDurationOnNavy]}>{option.duration}</Text>
                      </View>
                      <View style={styles.exerciseImageWrap} pointerEvents="none">
                        <View style={styles.exerciseImageBg}>
                          <Image source={option.image} style={styles.exerciseImage} resizeMode="contain" />
                        </View>
                      </View>
                    </Pressable>
                  </MotiView>
                );
              })}
            </ScrollView>
            {/* Retry link below cards */}
            <Pressable style={styles.retryRow} onPress={() => { setShowOptions(false); }}>
              <Ionicons name="refresh" size={16} color={Colors.textSecondary} />
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
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
                <View key={i} style={[styles.waveBar, { height: 8 + Math.random() * 20 }]} />
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
          <TextInput style={styles.textInput} placeholder="Type a message..." placeholderTextColor={Colors.textTertiary}
            value={input} onChangeText={setInput} multiline onSubmitEditing={handleSend} />
          <Pressable style={styles.micButton} onPress={toggleRecording}>
            <Ionicons name="mic" size={18} color={Colors.textLight} />
          </Pressable>
        </View>
      )}

      <CustomTabBar active="chat" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl, paddingTop: Layout.statusBarOffset, paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  headerTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 18, color: Colors.text },
  messages: { flex: 1 },
  messagesContent: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg },

  userRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: Spacing.md },
  aiRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: Spacing.md, gap: Spacing.sm, alignItems: 'flex-start' },
  // AI avatar: yellow sun-with-face icon (per Figma — same on every AI message)
  aiAvatar: { width: 32, height: 32, marginTop: 2 },

  bubble: { maxWidth: '78%', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg },
  // User bubble: white fill with subtle border for visibility on cream bg
  userBubble: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  aiBubble: { backgroundColor: 'transparent', paddingHorizontal: 0, paddingVertical: 4 },
  bubbleText: { fontFamily: Fonts.body, fontSize: 16, lineHeight: 24 },
  userText: { color: Colors.text },
  aiText: { color: Colors.text },

  // "Thinking..." italic text indicator
  thinkingText: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textSecondary, fontStyle: 'italic', marginTop: 6 },

  // Exercise option cards (Figma Chat 8 - Options) — full-color card with integrated doodle at bottom
  optionsWrapper: { marginTop: Spacing.md, marginLeft: 40 },
  optionsRow: { gap: Spacing.md, paddingVertical: Spacing.sm, paddingRight: Spacing.lg },
  exerciseCard: {
    width: 160, height: 210,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  exerciseCardCream: { backgroundColor: Colors.cardInactive },
  exerciseCardNavy: { backgroundColor: Colors.primary },
  exerciseTitle: {
    fontFamily: Fonts.heading, fontSize: 20, lineHeight: 26,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  exerciseTitleOnNavy: { color: '#FFFFFF' },
  exerciseMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseTag: { fontFamily: Fonts.body, fontSize: 13, color: Colors.text },
  exerciseTagOnNavy: { color: 'rgba(255,255,255,0.85)' },
  exerciseDuration: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },
  exerciseDurationOnNavy: { color: 'rgba(255,255,255,0.6)' },
  // Doodle sits on a full-width white pad anchored to the bottom edge of the card.
  // Pad has a fixed height; image fills the pad completely (full width + full height).
  exerciseImageWrap: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 90,
  },
  exerciseImageBg: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  exerciseImage: { width: '100%' as any, height: '100%' as any },
  // Retry below the card row
  retryRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    alignSelf: 'flex-end', paddingTop: Spacing.sm, paddingRight: Spacing.lg,
  },
  retryText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.textSecondary },

  // Recording
  recordingBar: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, alignItems: 'center', gap: Spacing.sm },
  transcribingText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary },
  waveformContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.text, borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.md, width: '100%' },
  waveform: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 3, height: 32 },
  waveBar: { width: 3, backgroundColor: Colors.textLight, borderRadius: 2 },
  closeRecording: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  // Input
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.sm },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  textInput: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, fontFamily: Fonts.body, fontSize: 16, color: Colors.text, maxHeight: 100, borderWidth: 1, borderColor: Colors.border },
  micButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.text, alignItems: 'center', justifyContent: 'center' },

  // Tab bar handled by CustomTabBar component
});
