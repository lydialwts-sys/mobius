import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Colors, Spacing, BorderRadius, Fonts, Layout } from '../../src/constants/theme';
import { SPRING_BOUNCY, SPRING_GENTLE, staggerDelay } from '../../src/constants/animations';
import { scriptedDialogue, exerciseOptions, chatTopic, type ScriptedMessage } from '../../src/data/chatScript';
import { CustomTabBar } from '../../src/components/CustomTabBar';
import { EmotionAsset } from '../../src/components/EmotionAsset';

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
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="menu" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{chatTopic}</Text>
        <Ionicons name="chatbubble" size={20} color={Colors.text} />
      </View>

      {/* Messages */}
      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>

        {visibleMessages.map((msg) => (
          <MotiView key={msg.id} from={{ opacity: 0, translateY: 5 }} animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', ...SPRING_GENTLE }}>
            <View style={msg.role === 'user' ? styles.userRow : styles.aiRow}>
              {msg.role === 'ai' && (
                <View style={styles.aiAvatar}>
                  <EmotionAsset name="happy" size={24} />
                </View>
              )}
              <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.bubbleText, msg.role === 'user' ? styles.userText : styles.aiText]}>{msg.content}</Text>
              </View>
            </View>
          </MotiView>
        ))}

        {/* Fix #2: Single typing indicator — no duplicate dots */}
        {isTypingIndicator && (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 200 }}>
            <View style={styles.aiRow}>
              <View style={styles.aiAvatar}>
                <EmotionAsset name="happy" size={24} />
              </View>
              <MotiView
                from={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 600, loop: true }}
              >
                <Text style={styles.typingText}>•••</Text>
              </MotiView>
            </View>
          </MotiView>
        )}

        {/* Exercise option cards (Figma Chat 8 - Options: horizontal card row) */}
        {showOptions && (
          <View style={styles.optionsWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
              {exerciseOptions.map((option, i) => (
                <MotiView key={option.id} from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 400, delay: 50 + i * 80 }}>
                  <Pressable
                    style={[
                      styles.exerciseCard,
                      option.clickable ? styles.exerciseCardActive : styles.exerciseCardInactive,
                    ]}
                    onPress={() => { if (option.clickable && option.route) router.push(option.route as any); }}
                  >
                    {/* Top half: text */}
                    <View style={[styles.exerciseTextHalf, option.clickable ? styles.exerciseTextActive : styles.exerciseTextInactive]}>
                      <Text style={[styles.exerciseTitle, option.clickable && styles.exerciseTitleActive]}>{option.title}</Text>
                      <View style={styles.exerciseMetaRow}>
                        <Text style={[styles.exerciseTag, option.clickable && styles.exerciseTagActive]}>{option.tag}</Text>
                        <Text style={[styles.exerciseDuration, option.clickable && styles.exerciseDurationActive]}>{option.duration}</Text>
                      </View>
                    </View>
                    {/* Bottom half: image placeholder */}
                    <View style={styles.exerciseImageHalf}>
                      <EmotionAsset name={option.emotion} style={styles.exerciseImage} />
                    </View>
                  </Pressable>
                </MotiView>
              ))}
            </ScrollView>
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
    borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.background,
  },
  headerTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 18, color: Colors.text },
  messages: { flex: 1 },
  messagesContent: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg },

  userRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: Spacing.md },
  aiRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: Spacing.md, gap: Spacing.sm },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xs },

  bubble: { maxWidth: '78%', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg },
  userBubble: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderTopRightRadius: BorderRadius.sm },
  aiBubble: { backgroundColor: 'transparent' },
  bubbleText: { fontFamily: Fonts.body, fontSize: 16, lineHeight: 24 },
  userText: { color: Colors.text },
  aiText: { color: Colors.text },

  // Fix #2: Single clean typing indicator
  typingText: { fontFamily: Fonts.body, fontSize: 22, color: Colors.textSecondary, letterSpacing: 3 },

  // Exercise option cards (Figma Chat 8 - Options)
  optionsWrapper: { marginTop: Spacing.md, marginLeft: 40 },
  optionsRow: { gap: Spacing.md, paddingVertical: Spacing.sm, paddingRight: Spacing.lg },
  exerciseCard: {
    width: 160, height: 220,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  exerciseCardActive: { /* clickable — blue top */ },
  exerciseCardInactive: { /* not clickable — cream top */ },
  // Top half: text area
  exerciseTextHalf: {
    flex: 1, padding: Spacing.lg, justifyContent: 'space-between',
  },
  exerciseTextActive: { backgroundColor: Colors.primary },
  exerciseTextInactive: { backgroundColor: Colors.cardInactive },
  exerciseTitle: {
    fontFamily: Fonts.heading, fontSize: 20, lineHeight: 26,
    color: Colors.text,
  },
  exerciseTitleActive: { color: '#FFFFFF' },
  exerciseMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseTag: { fontFamily: Fonts.body, fontSize: 13, color: Colors.text },
  exerciseTagActive: { color: 'rgba(255,255,255,0.8)' },
  exerciseDuration: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },
  exerciseDurationActive: { color: 'rgba(255,255,255,0.6)' },
  // Bottom half: image
  exerciseImageHalf: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  exerciseImage: { width: 120, height: 110 },

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
