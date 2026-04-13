import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants/theme';

interface Props {
  fallbackRoute?: string;
  onPress?: () => void;
}

export function BackButton({ fallbackRoute, onPress }: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    } else if (fallbackRoute) {
      router.replace(fallbackRoute as any);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.6} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
      <Ionicons name="arrow-back" size={Layout.backButtonSize} color={Colors.text} />
    </TouchableOpacity>
  );
}
