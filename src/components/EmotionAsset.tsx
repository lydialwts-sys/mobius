import React from 'react';
import { Image, StyleProp, ImageStyle, ViewStyle } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { EmotionAssets, type EmotionKey } from '../constants/assets';

type Props = {
  name: EmotionKey;
  size?: number;
  style?: StyleProp<ImageStyle | ViewStyle>;
  resizeMode?: 'contain' | 'cover';
};

export function EmotionAsset({ name, size, style, resizeMode = 'contain' }: Props) {
  const asset = EmotionAssets[name];
  const sizeStyle: ViewStyle | undefined = size ? { width: size, height: size } : undefined;

  if (asset.type === 'video') {
    return (
      <Video
        source={asset.source}
        style={[sizeStyle, style] as StyleProp<ViewStyle>}
        videoStyle={{ width: '100%', height: '100%' } as any}
        resizeMode={resizeMode === 'contain' ? ResizeMode.CONTAIN : ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        useNativeControls={false}
      />
    );
  }

  return (
    <Image
      source={asset.source}
      style={[sizeStyle, style] as StyleProp<ImageStyle>}
      resizeMode={resizeMode}
    />
  );
}
