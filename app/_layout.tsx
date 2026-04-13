import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../src/constants/theme';
import { UserProvider } from '../src/context/UserContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Fraunces-Bold': require('../assets/fonts/Fraunces/static/Fraunces_72pt-Bold.ttf'),
    'Fraunces-SemiBold': require('../assets/fonts/Fraunces/static/Fraunces_72pt-SemiBold.ttf'),
    'Fraunces-Regular': require('../assets/fonts/Fraunces/static/Fraunces_72pt-Regular.ttf'),
    'GoogleSans-Regular': require('../assets/fonts/Google_Sans/static/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('../assets/fonts/Google_Sans/static/GoogleSans-Medium.ttf'),
    'GoogleSans-SemiBold': require('../assets/fonts/Google_Sans/static/GoogleSans-SemiBold.ttf'),
    'GoogleSans-Bold': require('../assets/fonts/Google_Sans/static/GoogleSans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <UserProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontFamily: 'GoogleSans-SemiBold', fontSize: 18 },
          contentStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
        <Stack.Screen name="course/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="course/lesson/[lessonId]" options={{ title: 'Lesson', headerBackTitle: 'Back', presentation: 'modal' }} />
        <Stack.Screen name="roleplay/ghosted-post" options={{ headerShown: false }} />
        <Stack.Screen name="roleplay/intro" options={{ title: 'Roleplay', headerBackTitle: 'Home' }} />
        <Stack.Screen name="roleplay/scene" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="roleplay/result" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="chat/conversation" options={{ headerShown: false }} />
        <Stack.Screen name="chat/emotion-result" options={{ title: 'Your Emotions', presentation: 'modal' }} />
        <Stack.Screen name="journal/mood-journal" options={{ headerShown: false }} />
        <Stack.Screen name="journal/new" options={{ title: 'New Entry', presentation: 'modal' }} />
        <Stack.Screen name="journal/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="profile/collection" options={{ title: 'Emotion Collection', headerBackTitle: 'Profile' }} />
        <Stack.Screen name="profile/settings" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
