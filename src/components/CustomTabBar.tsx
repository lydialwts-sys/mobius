import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Fonts, Layout } from '../constants/theme';
import { LearnNormal, LearnSelected, ChatNormal, ChatSelected, ProfileNormal, ProfileSelected } from './NavIcons';

type ActiveTab = 'learn' | 'chat' | 'profile';

interface Props {
  active: ActiveTab;
}

const tabs: { key: ActiveTab; label: string; route: string }[] = [
  { key: 'learn', label: 'Learn', route: '/(tabs)' },
  { key: 'chat', label: 'Chat', route: '/(tabs)/chat' },
  { key: 'profile', label: 'Profile', route: '/(tabs)/profile' },
];

function TabIcon({ tab, active }: { tab: ActiveTab; active: boolean }) {
  switch (tab) {
    case 'learn': return active ? <LearnSelected size={22} /> : <LearnNormal size={22} />;
    case 'chat': return active ? <ChatSelected size={24} /> : <ChatNormal size={20} />;
    case 'profile': return active ? <ProfileSelected size={22} /> : <ProfileNormal size={22} />;
  }
}

export function CustomTabBar({ active }: Props) {
  const router = useRouter();

  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable key={tab.key} style={styles.item} onPress={() => !isActive && router.replace(tab.route as any)}>
            <TabIcon tab={tab.key} active={isActive} />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  item: { alignItems: 'center', gap: Spacing.xs },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.dark },
  labelActive: { color: Colors.primary },
});
