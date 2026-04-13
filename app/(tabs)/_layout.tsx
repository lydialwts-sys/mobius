import { Tabs } from 'expo-router';
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
          height: 80,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
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
          tabBarIcon: ({ focused }) => focused ? <LearnSelected /> : <LearnNormal />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ focused }) => focused ? <ChatSelected /> : <ChatNormal />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => focused ? <ProfileSelected /> : <ProfileNormal />,
        }}
      />
    </Tabs>
  );
}
