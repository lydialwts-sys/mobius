import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

function SettingsRow({ icon, label, hasSwitch = false }: { icon: string; label: string; hasSwitch?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon as any} size={20} color={Colors.textSecondary} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {hasSwitch ? (
        <Switch trackColor={{ true: Colors.primary }} thumbColor="#fff" value={true} />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
      )}
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.card}>
        <SettingsRow icon="notifications-outline" label="Notifications" hasSwitch />
        <SettingsRow icon="moon-outline" label="Dark Mode" hasSwitch />
        <SettingsRow icon="time-outline" label="Daily Reminder" hasSwitch />
      </View>
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.card}>
        <SettingsRow icon="person-outline" label="Edit Profile" />
        <SettingsRow icon="shield-outline" label="Privacy" />
        <SettingsRow icon="help-circle-outline" label="Help & Support" />
      </View>
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <SettingsRow icon="information-circle-outline" label="About Mobius" />
        <SettingsRow icon="document-text-outline" label="Terms of Service" />
        <SettingsRow icon="lock-closed-outline" label="Privacy Policy" />
      </View>
      <Text style={styles.version}>Mobius v1.0.0 (Prototype)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg },
  sectionTitle: { ...Typography.small, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.lg, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  rowLabel: { ...Typography.body },
  version: { ...Typography.small, textAlign: 'center', marginTop: Spacing.xxl, marginBottom: Spacing.xxxl },
});
