import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Image, Alert, Platform, Modal, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Layout, Spacing, BorderRadius, Fonts } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { BackButton } from '../../src/components/BackButton';
import { useUser } from '../../src/context/UserContext';
import { EmotionAsset } from '../../src/components/EmotionAsset';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, setFullName, setProfileImage, logout } = useUser();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.fullName);
  const [showPopup, setShowPopup] = useState(false);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setFullName(nameInput.trim());
    }
    setEditingName(false);
  };

  const handlePickImage = async () => {
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

  const handleLogoff = () => {
    logout();
    router.replace('/onboarding');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topBar}>
          <BackButton fallbackRoute="/(tabs)/profile" />
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile picture */}
        <View style={styles.avatarSection}>
          <Pressable onPress={handlePickImage} style={styles.avatarWrapper}>
            {user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <EmotionAsset name="motivated" size={48} />
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color={Colors.textLight} />
            </View>
          </Pressable>
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        {/* Settings rows */}
        <View style={styles.menuSection}>
          {/* Change username */}
          <Pressable style={styles.menuRow} onPress={() => setEditingName(true)}>
            <Ionicons name="person-outline" size={22} color={Colors.text} />
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Username</Text>
              {editingName ? (
                <View style={styles.nameEditRow}>
                  <TextInput
                    style={styles.nameInput}
                    value={nameInput}
                    onChangeText={setNameInput}
                    autoFocus
                    onBlur={handleSaveName}
                    onSubmitEditing={handleSaveName}
                    returnKeyType="done"
                  />
                  <Pressable onPress={handleSaveName} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>Save</Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.menuValue}>{user.fullName}</Text>
              )}
            </View>
            {!editingName && <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />}
          </Pressable>

          {/* Follow the team */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setShowPopup(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="people-outline" size={22} color={Colors.text} />
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Follow the team!</Text>
              <Text style={styles.menuValue}>Stay connected</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Log off */}
        <View style={{ flex: 1 }} />
        <View style={styles.logoffSection}>
          <Button
            title="Log off"
            onPress={handleLogoff}
            variant="neutral"
            size="lg"
            fullWidth
          />
        </View>

        {/* Popup modal */}
        <Modal visible={showPopup} transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setShowPopup(false)}>
            <View style={styles.modalCard}>
              <Text style={styles.modalEmoji}>👨‍🍳</Text>
              <Text style={styles.modalTitle}>uh-oh</Text>
              <Text style={styles.modalBody}>the chefs are still cooking...</Text>
              <Pressable style={styles.modalButton} onPress={() => setShowPopup(false)}>
                <Text style={styles.modalButtonText}>Got it</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl, paddingTop: Layout.statusBarOffset, paddingBottom: Spacing.lg,
  },
  title: { fontFamily: Fonts.bodySemiBold, fontSize: 18, color: Colors.text },
  avatarSection: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.sm },
  avatarWrapper: { position: 'relative' },
  avatarImage: { width: 88, height: 88, borderRadius: 44, borderWidth: 2, borderColor: Colors.text },
  avatarPlaceholder: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.brand, borderWidth: 2, borderColor: Colors.text,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.background,
  },
  avatarHint: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },
  menuSection: { paddingHorizontal: Spacing.xxl, gap: 0 },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuContent: { flex: 1 },
  menuLabel: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.text },
  menuValue: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  nameEditRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs },
  nameInput: {
    flex: 1, fontFamily: Fonts.body, fontSize: 15, color: Colors.text,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.primary,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  saveBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 14, color: Colors.textLight },
  logoffSection: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.xxxxl },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
    padding: Spacing.xxxl, alignItems: 'center',
    width: 280, gap: Spacing.md,
  },
  modalEmoji: { fontSize: 48 },
  modalTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.text },
  modalBody: { fontFamily: Fonts.body, fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
  modalButton: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md, marginTop: Spacing.sm,
  },
  modalButtonText: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: Colors.textLight },
});
