// Centralized emotion asset registry — videos (MP4) with PNG fallback where no MP4 exists.
// Import once, reference everywhere via the EmotionAsset component or EmotionAssets[key].

export type EmotionAssetEntry =
  | { type: 'video'; source: number }
  | { type: 'image'; source: number };

export const EmotionAssets = {
  motivated:    { type: 'video', source: require('../../assets/emotions_mp4/motivated.mp4') },
  happy:        { type: 'video', source: require('../../assets/emotions_mp4/happy.mp4') },
  overwhelmed:  { type: 'video', source: require('../../assets/emotions_mp4/overwhelmed.mp4') },
  depressed:    { type: 'video', source: require('../../assets/emotions_mp4/depressed.mp4') },
  chill:        { type: 'video', source: require('../../assets/emotions_mp4/chill.mp4') },
  stressed:     { type: 'video', source: require('../../assets/emotions_mp4/stressed.mp4') },
  bored:        { type: 'video', source: require('../../assets/emotions_mp4/bored.mp4') },
  tired:        { type: 'video', source: require('../../assets/emotions_mp4/tired.mp4') },
  worried:      { type: 'video', source: require('../../assets/emotions_mp4/worried.mp4') },
  meh:          { type: 'video', source: require('../../assets/emotions_mp4/meh.mp4') },
  guilty:       { type: 'video', source: require('../../assets/emotions_mp4/guilty.mp4') },
  scared:       { type: 'image', source: require('../../assets/emotions_png/scared.png') },
  jealous:      { type: 'video', source: require('../../assets/emotions_mp4/jealous.mp4') },
  proud:        { type: 'video', source: require('../../assets/emotions_mp4/proud.mp4') },
  relaxed:      { type: 'video', source: require('../../assets/emotions_mp4/relaxed.mp4') },
  excited:      { type: 'video', source: require('../../assets/emotions_mp4/excited.mp4') },
  lost:         { type: 'video', source: require('../../assets/emotions_mp4/lost.mp4') },
  satisfied:    { type: 'video', source: require('../../assets/emotions_mp4/satisfied.mp4') },
  embarassed:   { type: 'video', source: require('../../assets/emotions_mp4/embarassed.mp4') },
  surprised:    { type: 'video', source: require('../../assets/emotions_mp4/surprised.mp4') },
  joyful:       { type: 'video', source: require('../../assets/emotions_mp4/joyful.mp4') },
  moved:        { type: 'video', source: require('../../assets/emotions_mp4/moved.mp4') },
  disappoint:   { type: 'image', source: require('../../assets/emotions_png/disappoint.png') },
  supported:    { type: 'video', source: require('../../assets/emotions_mp4/supported.mp4') },
  respected:    { type: 'video', source: require('../../assets/emotions_mp4/respected.mp4') },
  accomplished: { type: 'video', source: require('../../assets/emotions_mp4/accomplished.mp4') },
} as const satisfies Record<string, EmotionAssetEntry>;

export type EmotionKey = keyof typeof EmotionAssets;
