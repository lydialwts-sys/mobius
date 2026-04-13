import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { MoodSelector } from '../../src/components/MoodSelector';

export default function NewJournalEntryScreen() {
  const router = useRouter();
  const [mood, setMood] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>How are you feeling?</Text>
      <Text style={styles.subtext}>Pick the mood that fits right now</Text>
      <MoodSelector selected={mood} onSelect={setMood} />
      <View style={styles.divider} />
      <Text style={styles.label}>Give it a title</Text>
      <TextInput style={styles.input} placeholder="e.g., rough day at school" placeholderTextColor={Colors.textTertiary} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>What's on your mind?</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Write whatever you want. This is just for you." placeholderTextColor={Colors.textTertiary} value={content} onChangeText={setContent} multiline textAlignVertical="top" />
      <View style={styles.footer}>
        <Button title="Save Entry" onPress={() => router.back()} size="lg" fullWidth disabled={!mood || !title} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xxl },
  heading: { ...Typography.heading, marginBottom: Spacing.xs },
  subtext: { ...Typography.caption, marginBottom: Spacing.xl },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.xxl },
  label: { ...Typography.bodyBold, fontSize: 16, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg, ...Typography.body, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl },
  textArea: { minHeight: 150 },
  footer: { marginTop: Spacing.lg, paddingBottom: Spacing.xxxl },
});
