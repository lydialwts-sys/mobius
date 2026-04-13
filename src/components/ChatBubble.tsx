import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../constants/theme';
import type { ChatMessage } from '../data/mockData';

interface Props {
  message: ChatMessage;
}

export function ChatBubble({ message }: Props) {
  const isAI = message.role === 'ai';
  return (
    <View style={[styles.container, isAI ? styles.aiContainer : styles.userContainer]}>
      <View style={[styles.bubble, isAI ? styles.aiBubble : styles.userBubble]}>
        <Text style={[styles.text, isAI ? styles.aiText : styles.userText]}>{message.content}</Text>
        <Text style={[styles.time, isAI ? styles.aiTime : styles.userTime]}>{message.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  aiBubble: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: 4,
  },
  text: {
    ...Typography.body,
    lineHeight: 22,
  },
  aiText: {
    color: Colors.text,
  },
  userText: {
    color: Colors.textLight,
  },
  time: {
    ...Typography.small,
    marginTop: Spacing.xs,
  },
  aiTime: {
    color: Colors.textSecondary,
  },
  userTime: {
    color: '#FFFFFF80',
  },
});
