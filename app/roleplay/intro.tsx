import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { roleplayScenarios } from '../../src/data/mockData';

export default function RoleplayIntroScreen() {
  const router = useRouter();
  const scenario = roleplayScenarios[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.characterCircle}><Text style={{ fontSize: 40 }}>🎭</Text></View>
        <View style={styles.badge}><Text style={styles.badgeText}>ROLEPLAY</Text></View>
      </View>
      <Text style={styles.title}>{scenario.title}</Text>
      <View style={styles.scenarioCard}>
        <Text style={styles.scenarioLabel}>THE SCENARIO</Text>
        <Text style={styles.scenarioText}>{scenario.setup}</Text>
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>What you'll practice</Text>
        {['Identifying emotions in the moment', 'Recognizing your inner critic', 'Choosing healthy responses'].map((item, i) => (
          <View key={i} style={styles.infoItem}>
            <Text style={{ fontSize: 16 }}>{'•'}</Text>
            <Text style={styles.infoText}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <Button title="Start Roleplay" onPress={() => router.push('/roleplay/scene')} size="lg" fullWidth />
        <Button title="Maybe later" onPress={() => router.back()} variant="ghost" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xxl },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  characterCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, borderWidth: 2, borderColor: Colors.text },
  badge: { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.pill },
  badgeText: { ...Typography.small, fontWeight: '700', letterSpacing: 2, color: Colors.primary },
  title: { ...Typography.heading, fontSize: 28, textAlign: 'center', marginBottom: Spacing.xxl },
  scenarioCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.xl, marginBottom: Spacing.xxl },
  scenarioLabel: { ...Typography.small, fontWeight: '700', letterSpacing: 1, color: Colors.textSecondary, marginBottom: Spacing.md },
  scenarioText: { ...Typography.body, lineHeight: 26 },
  infoSection: { marginBottom: Spacing.xxxl },
  infoTitle: { ...Typography.subheading, marginBottom: Spacing.lg },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  infoText: { ...Typography.body },
  footer: { alignItems: 'center', gap: Spacing.md },
});
