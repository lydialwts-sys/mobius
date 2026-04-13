import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image, TextInput, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { Audio } from 'expo-av';
import { Colors, Spacing, BorderRadius, Fonts } from '../../src/constants/theme';

function MapPinIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M11.5 4.5C11.5 3.829 11.307 3.172 10.945 2.608C10.582 2.043 10.065 1.595 9.455 1.316C8.844 1.037 8.167 0.94 7.503 1.035C6.839 1.13 6.216 1.415 5.709 1.854C5.202 2.293 4.831 2.869 4.642 3.512C4.453 4.156 4.453 4.84 4.641 5.484C4.83 6.128 5.2 6.704 5.707 7.144C6.214 7.583 6.836 7.868 7.5 7.964V14.5C7.5 14.633 7.553 14.76 7.646 14.854C7.74 14.947 7.867 15 8 15C8.133 15 8.26 14.947 8.354 14.854C8.447 14.76 8.5 14.633 8.5 14.5V7.964C9.332 7.842 10.094 7.426 10.644 6.79C11.195 6.154 11.499 5.341 11.5 4.5ZM8 7C7.506 7 7.022 6.853 6.611 6.579C6.2 6.304 5.88 5.914 5.69 5.457C5.501 5 5.452 4.497 5.548 4.012C5.645 3.527 5.883 3.082 6.232 2.732C6.582 2.383 7.027 2.144 7.512 2.048C7.997 1.952 8.5 2.001 8.957 2.19C9.414 2.38 9.804 2.7 10.079 3.111C10.353 3.522 10.5 4.006 10.5 4.5C10.5 5.163 10.237 5.799 9.768 6.268C9.299 6.737 8.663 7 8 7Z" fill={color} />
    </Svg>
  );
}

function EmotionInline({ source, size = 28 }: { source: any; size?: number }) {
  return <Image source={source} style={{ width: size, height: size, marginHorizontal: 2 }} resizeMode="contain" />;
}

const allEmotionStickers = [
  { id: 'depressed', image: require('../../assets/emotions_png/depressed.png'), label: 'depressed' },
  { id: 'overwhelmed', image: require('../../assets/emotions_png/overwhelmed.png'), label: 'overwhelmed' },
  { id: 'chill', image: require('../../assets/emotions_png/chill.png'), label: 'chill' },
  { id: 'motivated', image: require('../../assets/emotions_png/motivated.png'), label: 'motivated' },
  { id: 'stressed', image: require('../../assets/emotions_png/stress.png'), label: 'stressed' },
  { id: 'bored', image: require('../../assets/emotions_png/bored.png'), label: 'bored' },
  { id: 'happy', image: require('../../assets/emotions_png/happy.png'), label: 'happy' },
  { id: 'tired', image: require('../../assets/emotions_png/tired.png'), label: 'tired' },
  { id: 'worried', image: require('../../assets/emotions_png/worried.png'), label: 'worried' },
  { id: 'meh', image: require('../../assets/emotions_png/meh.png'), label: 'meh' },
  { id: 'guilty', image: require('../../assets/emotions_png/guilty.png'), label: 'guilty' },
  { id: 'scared', image: require('../../assets/emotions_png/scared.png'), label: 'scared' },
  { id: 'jealous', image: require('../../assets/emotions_png/jealous.png'), label: 'jealous' },
  { id: 'proud', image: require('../../assets/emotions_png/proud.png'), label: 'proud' },
  { id: 'relaxed', image: require('../../assets/emotions_png/relaxed.png'), label: 'relaxed' },
  { id: 'excited', image: require('../../assets/emotions_png/excited.png'), label: 'excited' },
  { id: 'lost', image: require('../../assets/emotions_png/lost.png'), label: 'lost' },
  { id: 'satisfied', image: require('../../assets/emotions_png/satisfied.png'), label: 'satisfied' },
];

const stickerFilters = ['Low-key', 'Meh', 'A Lot'];

// Generate a fixed waveform pattern
const WAVEFORM_BARS = Array.from({ length: 40 }, (_, i) => {
  const x = i / 40;
  return 4 + Math.abs(Math.sin(x * Math.PI * 3.5)) * 16 + Math.random() * 4;
});

type ViewMode = 'journal' | 'stickers';

export default function JournalEntryScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('journal');
  const [stickerSearch, setStickerSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandAnim] = useState(new Animated.Value(0));

  // Audio state
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    Animated.spring(expandAnim, { toValue: 1, tension: 50, friction: 9, useNativeDriver: true }).start();
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const loadAndPlay = async () => {
    try {
      if (soundRef.current) {
        if (isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/journal_case study/journal demo_case study.mp3'),
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
            setDuration(status.durationMillis || 0);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
            }
          }
        }
      );
      soundRef.current = sound;
      setIsPlaying(true);
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  const progress = duration > 0 ? position / duration : 0;
  const scale = expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  const opacity = expandAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.8, 1] });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View style={[styles.container, { transform: [{ scale }], opacity }]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </Pressable>
        </View>

        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>Dec 16, 2025</Text>
          <View style={styles.breadcrumbRow}>
            <MapPinIcon size={14} color={Colors.textSecondary} />
            <Text style={styles.breadcrumb}>Home</Text>
          </View>
        </View>

        {/* Vibe selector - full width, all round corners */}
        <View style={styles.vibeContainer}>
          <View style={styles.vibeSelector}>
            <Text style={styles.vibeLabel}>Vibe: </Text>
            <Text style={styles.vibeValue}>Low-key Stressed</Text>
            <View style={{ flex: 1 }} />
            <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
          </View>
        </View>

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.contentPadding}>
          {viewMode === 'journal' ? (
            <View style={styles.journalContent}>
              {/* Bento box: main left, two subs parallel right, voice below right */}
              <View style={styles.bentoBox}>
                <View style={styles.bentoLeft}>
                  <Image source={require('../../assets/journal_case study/main.jpg')} style={styles.bentoMain} resizeMode="cover" />
                </View>
                <View style={styles.bentoRight}>
                  {/* Two sub images in same row */}
                  <View style={styles.bentoSubRow}>
                    <Image source={require('../../assets/journal_case study/sub_top right.jpg')} style={styles.bentoSubImage} resizeMode="cover" />
                    <Image source={require('../../assets/journal_case study/sub_middle.jpg')} style={styles.bentoSubImage} resizeMode="cover" />
                  </View>
                  {/* Voice message linked to MP3 */}
                  <Pressable style={styles.voiceMessage} onPress={loadAndPlay}>
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={16} color={Colors.text} />
                    <Text style={styles.voiceTime}>{duration > 0 ? formatTime(isPlaying ? position : duration) : '00:54'}</Text>
                    <View style={styles.waveformMini}>
                      {WAVEFORM_BARS.map((h, i) => {
                        const barProgress = i / WAVEFORM_BARS.length;
                        const isPast = barProgress <= progress;
                        return (
                          <View
                            key={i}
                            style={[
                              styles.waveBarMini,
                              { height: h, backgroundColor: isPast ? Colors.text : Colors.border },
                            ]}
                          />
                        );
                      })}
                    </View>
                  </Pressable>
                </View>
              </View>

              {/* Body text with inline emotion doodle memes */}
              <View style={styles.bodyTextContainer}>
                <View style={styles.textRow}>
                  <Text style={styles.journalText}>Today just felt... off. </Text>
                  <EmotionInline source={require('../../assets/emotions_png/depressed.png')} />
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.journalText}>Nothing major happened but my brain</Text>
                  <EmotionInline source={require('../../assets/emotions_png/overwhelmed.png')} size={24} />
                  <Text style={styles.journalText}> keeps spiraling anyway.</Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.journalText}>Kinda tired of myself </Text>
                  <EmotionInline source={require('../../assets/emotions_png/chill.png')} />
                  <Text style={styles.journalText}> but also trying to be gentle about it.</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.stickerContent}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color={Colors.textTertiary} />
                <TextInput style={styles.searchInput} placeholder="Search stickers" placeholderTextColor={Colors.textTertiary} value={stickerSearch} onChangeText={setStickerSearch} />
              </View>
              <View style={styles.filterRow}>
                <Pressable style={[styles.filterTag, styles.filterTagActive]}>
                  <Ionicons name="checkmark" size={14} color={Colors.textLight} />
                </Pressable>
                {stickerFilters.map((f) => (
                  <Pressable key={f} style={[styles.filterTag, activeFilter === f && styles.filterTagSelected]} onPress={() => setActiveFilter(activeFilter === f ? null : f)}>
                    <Text style={styles.filterText}>{f}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.stickerGrid}>
                {allEmotionStickers.map((s) => (
                  <Pressable key={s.id} style={styles.stickerItem}>
                    <Image source={s.image} style={styles.stickerImage} resizeMode="contain" />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Floating toolbar - all round corners */}
        <View style={styles.toolbar}>
          <Pressable style={styles.toolbarItem}>
            <Ionicons name="image-outline" size={24} color={Colors.dark} />
            <Text style={styles.toolbarLabel}>Image</Text>
          </Pressable>
          <Pressable style={styles.toolbarItem} onPress={() => setViewMode(viewMode === 'stickers' ? 'journal' : 'stickers')}>
            <Image source={require('../../assets/emotions_png/depressed.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
            <Text style={styles.toolbarLabel}>Sticker</Text>
          </Pressable>
          <Pressable style={styles.toolbarItem}>
            <Ionicons name="camera-outline" size={24} color={Colors.dark} />
            <Text style={styles.toolbarLabel}>Camera</Text>
          </Pressable>
          <Pressable style={styles.toolbarItem}>
            <Ionicons name="mic-outline" size={24} color={Colors.dark} />
            <Text style={styles.toolbarLabel}>Record</Text>
          </Pressable>
          <Pressable style={styles.toolbarItem}>
            <Ionicons name="navigate-outline" size={24} color={Colors.dark} />
            <Text style={styles.toolbarLabel}>Location</Text>
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { paddingHorizontal: Spacing.xxl, paddingTop: 52, paddingBottom: Spacing.sm },
  dateHeader: { paddingHorizontal: Spacing.xxl, marginBottom: Spacing.md },
  dateText: { fontSize: 26, fontFamily: Fonts.heading, color: Colors.text, marginBottom: Spacing.xs },
  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  breadcrumb: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },

  // Vibe selector - full width, fully rounded
  vibeContainer: { paddingHorizontal: Spacing.xxl, marginBottom: Spacing.lg },
  vibeSelector: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  vibeLabel: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  vibeValue: { fontFamily: Fonts.body, fontSize: 16, color: Colors.text },

  scrollContent: { flex: 1 },
  contentPadding: { paddingHorizontal: Spacing.xxl, paddingBottom: 100 },
  journalContent: { gap: Spacing.xl },

  // Bento box: main left tall, right column with 2 images in a row + voice below
  bentoBox: { flexDirection: 'row', gap: Spacing.sm, height: 240 },
  bentoLeft: { flex: 1.1 },
  bentoMain: { width: '100%', height: '100%', borderRadius: BorderRadius.lg },
  bentoRight: { flex: 1, gap: Spacing.sm },
  bentoSubRow: { flexDirection: 'row', gap: Spacing.sm, flex: 1 },
  bentoSubImage: { flex: 1, borderRadius: BorderRadius.lg },
  voiceMessage: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  voiceTime: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.text, minWidth: 36 },
  waveformMini: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 1, height: 22 },
  waveBarMini: { width: 2, borderRadius: 1 },

  // Body text
  bodyTextContainer: { gap: Spacing.xs },
  textRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  journalText: { fontFamily: Fonts.body, fontSize: 16, lineHeight: 28, color: Colors.text },

  // Sticker picker
  stickerContent: { gap: Spacing.lg },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.pill,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontFamily: Fonts.body, fontSize: 15, color: Colors.text, paddingVertical: Spacing.md },
  filterRow: { flexDirection: 'row', gap: Spacing.sm },
  filterTag: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  filterTagActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterTagSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  filterText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.text },
  stickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  stickerItem: {
    width: '31%' as any, aspectRatio: 1,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', padding: Spacing.sm,
  },
  stickerImage: { width: '80%', height: '80%' },

  // Floating toolbar - fully rounded
  toolbar: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    marginHorizontal: Spacing.lg, marginBottom: Spacing.xxxl,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  toolbarItem: { alignItems: 'center', gap: 2 },
  toolbarLabel: { fontFamily: Fonts.body, fontSize: 10, color: Colors.dark },
});
