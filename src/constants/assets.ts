// Centralized emotion PNG asset registry
// Import once, reference everywhere by key

export const EmotionAssets = {
  motivated: require('../../assets/emotions_png/motivated.png'),
  happy: require('../../assets/emotions_png/happy.png'),
  overwhelmed: require('../../assets/emotions_png/overwhelmed.png'),
  depressed: require('../../assets/emotions_png/depressed.png'),
  chill: require('../../assets/emotions_png/chill.png'),
  stress: require('../../assets/emotions_png/stress.png'),
  bored: require('../../assets/emotions_png/bored.png'),
  tired: require('../../assets/emotions_png/tired.png'),
  worried: require('../../assets/emotions_png/worried.png'),
  meh: require('../../assets/emotions_png/meh.png'),
  guilty: require('../../assets/emotions_png/guilty.png'),
  scared: require('../../assets/emotions_png/scared.png'),
  jealous: require('../../assets/emotions_png/jealous.png'),
  proud: require('../../assets/emotions_png/proud.png'),
  relaxed: require('../../assets/emotions_png/relaxed.png'),
  excited: require('../../assets/emotions_png/excited.png'),
  lost: require('../../assets/emotions_png/lost.png'),
  satisfied: require('../../assets/emotions_png/satisfied.png'),
  embarassed: require('../../assets/emotions_png/embarassed.png'),
  surprised: require('../../assets/emotions_png/surprised.png'),
  joyful: require('../../assets/emotions_png/joyful.png'),
  moved: require('../../assets/emotions_png/moved.png'),
  disappoint: require('../../assets/emotions_png/disappoint.png'),
  supported: require('../../assets/emotions_png/supported.png'),
  respected: require('../../assets/emotions_png/respected.png'),
  accoumplished: require('../../assets/emotions_png/accoumplished.png'),
} as const;

export type EmotionKey = keyof typeof EmotionAssets;
