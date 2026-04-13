import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { Colors, Fonts } from '../../src/constants/theme';
import { LearnNormal, LearnSelected, ChatNormal, ChatSelected, ProfileNormal, ProfileSelected } from '../../src/components/NavIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.dark,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.select({ ios: 92, android: 72, default: 80 }),
          paddingTop: 10,
          paddingBottom: Platform.select({ ios: 30, android: 10, default: 16 }),
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: Fonts.bodyMedium,
        },
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontFamily: Fonts.bodySemiBold, fontSize: 18 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Learn',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}>
              {focused ? <LearnSelected size={24} /> : <LearnNormal size={24} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}>
              {focused ? <ChatSelected size={24} /> : <ChatNormal size={20} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}>
              {focused ? <ProfileSelected size={24} /> : <ProfileNormal size={24} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
