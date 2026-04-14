export interface EmotionCharacter {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  unlocked: boolean;
}

export interface LessonStep {
  id: string;
  type: 'info' | 'quiz' | 'reflection' | 'character-reveal';
  title: string;
  content: string;
  options?: string[];
  correctAnswer?: number;
  characterId?: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  steps: LessonStep[];
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lessons: Lesson[];
  characterIds: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  moodEmoji: string;
  title: string;
  content: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export const emotionCharacters: EmotionCharacter[] = [
  { id: 'anticipation', name: 'Anticipation', emoji: '🌟', color: '#FFD700', description: 'That buzzing feeling before something big happens', unlocked: true },
  { id: 'overwhelm', name: 'Overwhelm', emoji: '🌊', color: '#64B5F6', description: 'When everything hits at once and you can\'t even', unlocked: true },
  { id: 'loneliness', name: 'Loneliness', emoji: '🌙', color: '#CE93D8', description: 'Feeling disconnected even in a crowd', unlocked: false },
  { id: 'self-doubt', name: 'Self-Doubt', emoji: '☁️', color: '#90A4AE', description: 'That voice saying you\'re not good enough', unlocked: true },
  { id: 'calm', name: 'Calm', emoji: '🍃', color: '#81C784', description: 'When your mind finally goes quiet', unlocked: false },
  { id: 'frustration', name: 'Frustration', emoji: '⚡', color: '#FF8A65', description: 'When things aren\'t going the way you planned', unlocked: false },
  { id: 'joy', name: 'Joy', emoji: '☀️', color: '#FFD700', description: 'Pure happiness that makes you feel alive', unlocked: true },
  { id: 'jealousy', name: 'Jealousy', emoji: '💚', color: '#66BB6A', description: 'Wanting what someone else has', unlocked: false },
];

export const courses: Course[] = [
  {
    id: 'silence-inner-critic',
    title: 'Silence Your Inner Critic',
    description: 'Learn to recognize and quiet that negative voice in your head',
    emoji: '🤫',
    color: '#FFD700',
    progress: 0.3,
    totalLessons: 6,
    completedLessons: 2,
    characterIds: ['self-doubt', 'calm'],
    lessons: [
      {
        id: 'sic-1',
        title: 'Meet Your Inner Critic',
        subtitle: 'Everyone has one — let\'s get to know yours',
        completed: true,
        steps: [
          { id: 's1', type: 'info', title: 'What is the Inner Critic?', content: 'Your inner critic is that voice in your head that tells you you\'re not good enough. It might say things like "you\'re so dumb" or "everyone is judging you." The thing is — almost everyone has one.' },
          { id: 's2', type: 'info', title: 'Where Does It Come From?', content: 'Your inner critic often develops from past experiences — maybe a harsh teacher, social media comparisons, or pressure to be perfect. It thinks it\'s protecting you, but it usually just makes you feel worse.' },
          { id: 's3', type: 'quiz', title: 'Quick Check', content: 'Which of these is something your inner critic might say?', options: ['"I should try my best"', '"I\'m such a failure"', '"That was a good effort"', '"I\'ll do better next time"'], correctAnswer: 1 },
          { id: 's4', type: 'character-reveal', title: 'You\'ve met Self-Doubt!', content: 'Self-Doubt is that cloudy feeling that makes everything seem harder than it is. Now that you can recognize it, you can start to manage it.', characterId: 'self-doubt' },
        ],
      },
      {
        id: 'sic-2',
        title: 'Spotting the Pattern',
        subtitle: 'Notice when your critic shows up',
        completed: true,
        steps: [
          { id: 's1', type: 'info', title: 'Common Triggers', content: 'Your inner critic loves to show up during specific moments: before a test, after posting on social media, when comparing yourself to friends, or when you make a mistake.' },
          { id: 's2', type: 'reflection', title: 'Think About It', content: 'When was the last time your inner critic was really loud? What triggered it?' },
          { id: 's3', type: 'info', title: 'The Pattern', content: 'Trigger → Thought → Feeling → Behavior. When you can spot the trigger, you can interrupt the pattern before it spirals.' },
          { id: 's4', type: 'quiz', title: 'Check Your Understanding', content: 'What\'s the first step to managing your inner critic?', options: ['Ignoring it completely', 'Recognizing when it shows up', 'Being harder on yourself', 'Avoiding all triggers'], correctAnswer: 1 },
        ],
      },
      {
        id: 'sic-3',
        title: 'Talk Back to It',
        subtitle: 'Reframe negative self-talk',
        completed: false,
        steps: [
          { id: 's1', type: 'info', title: 'The Reframe Technique', content: 'Instead of fighting your inner critic, try reframing what it says. "I\'m so stupid" becomes "I\'m still learning." "Everyone hates me" becomes "I\'m having a rough day."' },
          { id: 's2', type: 'info', title: 'Talk to Yourself Like a Friend', content: 'Would you say these things to your best friend? Probably not. Try talking to yourself the way you\'d talk to someone you care about.' },
          { id: 's3', type: 'reflection', title: 'Practice', content: 'Take a harsh thought you\'ve had recently and try to reframe it. What would you say to a friend in the same situation?' },
          { id: 's4', type: 'quiz', title: 'Reframe This', content: 'How could you reframe "I always mess everything up"?', options: ['"It\'s true, I do"', '"I made a mistake, and that\'s okay"', '"I should never try new things"', '"Other people mess up more"'], correctAnswer: 1 },
        ],
      },
      { id: 'sic-4', title: 'The Self-Compassion Break', subtitle: 'Be kind to yourself in tough moments', completed: false, steps: [] },
      { id: 'sic-5', title: 'Building Your Shield', subtitle: 'Create a toolkit for tough days', completed: false, steps: [] },
      { id: 'sic-6', title: 'Level Up', subtitle: 'Review & celebrate your progress', completed: false, steps: [] },
    ],
  },
  {
    id: 'ghosted-post',
    title: 'The Ghosted Post',
    description: 'Navigate the feelings when your post gets zero engagement',
    emoji: '👻',
    color: '#CE93D8',
    progress: 0,
    totalLessons: 4,
    completedLessons: 0,
    characterIds: ['loneliness', 'self-doubt'],
    lessons: [
      { id: 'gp-1', title: 'The Silence Hits Different', subtitle: 'Why no likes feels personal', completed: false, steps: [] },
      { id: 'gp-2', title: 'Social Media vs Reality', subtitle: 'What the algorithm doesn\'t show you', completed: false, steps: [] },
      { id: 'gp-3', title: 'Your Worth ≠ Your Likes', subtitle: 'Separating self-worth from validation', completed: false, steps: [] },
      { id: 'gp-4', title: 'Digital Detox Challenge', subtitle: 'A 24-hour experiment', completed: false, steps: [] },
    ],
  },
  {
    id: 'friendship-drama',
    title: 'Friendship Drama',
    description: 'Handle conflict without losing yourself or your friends',
    emoji: '💬',
    color: '#64B5F6',
    progress: 0,
    totalLessons: 5,
    completedLessons: 0,
    characterIds: ['frustration', 'jealousy'],
    lessons: [
      { id: 'fd-1', title: 'When Friends Change', subtitle: 'Growing apart doesn\'t mean growing wrong', completed: false, steps: [] },
      { id: 'fd-2', title: 'Setting Boundaries', subtitle: 'It\'s not mean, it\'s necessary', completed: false, steps: [] },
      { id: 'fd-3', title: 'The Apology Playbook', subtitle: 'How to say sorry and mean it', completed: false, steps: [] },
      { id: 'fd-4', title: 'Toxic vs. Tough', subtitle: 'Knowing the difference', completed: false, steps: [] },
      { id: 'fd-5', title: 'Building Your Circle', subtitle: 'Quality over quantity', completed: false, steps: [] },
    ],
  },
];

// Chapters group multiple sessions under one emotion theme
export interface ChapterSession {
  id: string;
  title: string;
  route: string;
  locked: boolean;
  completed: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  emotionId: string; // links to emotion intro page
  sessions: ChapterSession[];
}

export const chapters: Chapter[] = [
  {
    id: 'ease-anxiety',
    title: 'Ease Anxiety',
    emotionId: 'anxiety',
    sessions: [
      { id: 'meet-anxiety', title: 'Meet Anxiety', route: '/emotion/anxiety', locked: false, completed: false },
      { id: 'silence-inner-critic', title: 'Silence the inner critique', route: '/course/silence-inner-critic', locked: false, completed: false },
      { id: 'ghosted-post', title: 'The ghosted post', route: '/roleplay/ghosted-post', locked: false, completed: false },
    ],
  },
];

// Emotion intro pages
export interface EmotionIntro {
  id: string;
  name: string;
  description: string;
  imageKey: string; // key in EmotionAssets
  insights: { title: string; body: string }[];
  relatedEmotions: { name: string; imageKey: string }[];
  chapterId: string; // links to the chapter
}

export const emotionIntros: EmotionIntro[] = [
  {
    id: 'anxiety',
    name: 'Anxiety',
    description: "A constant sense of unease, even when nothing's obviously wrong.",
    imageKey: 'worried',
    insights: [
      { title: 'Social Radar', body: 'Your inner critic is not trying to hurt you, it\'s a "Security Guard" that is way too stressed out.' },
      { title: 'The 70% Rule', body: 'Most people around me are fighting the same internal battle, even if they look cool.' },
      { title: 'Name It to Tame It', body: "When you label what you're feeling, the intensity drops. Try saying 'I notice I feel anxious' instead of 'I am anxious.'" },
    ],
    relatedEmotions: [
      { name: 'Overwhelmed', imageKey: 'overwhelmed' },
      { name: 'Jealous', imageKey: 'jealous' },
      { name: 'Guilty', imageKey: 'guilty' },
      { name: 'Embarrassed', imageKey: 'embarassed' },
    ],
    chapterId: 'ease-anxiety',
  },
];

export const roleplayScenarios = [
  {
    id: 'ghosted-rp',
    title: 'The Ghosted Post',
    setup: 'You posted a photo you really liked on Instagram 3 hours ago. It has 2 likes — both from family members. Your friend just posted and already has 47 likes.',
    scenes: [
      {
        id: 'scene-1',
        narration: 'You\'re scrolling through your feed and see your friend\'s post blowing up while yours sits there. You feel a knot in your stomach.',
        prompt: 'What do you do?',
        choices: [
          { text: 'Delete your post immediately', outcome: 'avoid', feedback: 'Deleting might feel like relief, but it doesn\'t address the feeling underneath. Let\'s explore what\'s really going on.' },
          { text: 'Take a breath and put down your phone', outcome: 'healthy', feedback: 'Taking a pause is a great first step. It gives you space to process instead of reacting.' },
          { text: 'Start comparing your photos', outcome: 'spiral', feedback: 'Comparing yourself to others online is a fast track to feeling worse. Remember — you\'re seeing their highlight reel.' },
        ],
      },
      {
        id: 'scene-2',
        narration: 'After putting your phone down, you notice you\'re feeling a mix of emotions. Your inner critic is getting loud.',
        prompt: 'What\'s the inner critic saying?',
        choices: [
          { text: '"Nobody actually likes me"', outcome: 'recognize', feedback: 'That\'s Self-Doubt talking! Can you spot how it\'s taking one situation and making it about everything?' },
          { text: '"My content is just boring"', outcome: 'recognize', feedback: 'Notice how the inner critic is making this about your worth? A post\'s engagement ≠ your value.' },
          { text: '"I shouldn\'t even bother posting"', outcome: 'recognize', feedback: 'Your inner critic wants you to give up. But expressing yourself matters, regardless of the numbers.' },
        ],
      },
    ],
    emotionUnlocked: 'loneliness',
  },
];

export const sampleJournalEntries: JournalEntry[] = [
  {
    id: 'j1',
    date: '2026-04-12',
    mood: 'anxious',
    moodEmoji: '😰',
    title: 'Pre-exam spiral',
    content: 'Big math test tomorrow and I can\'t stop thinking about it. Tried the breathing exercise from the app and it helped a little.',
    tags: ['school', 'stress', 'coping'],
  },
  {
    id: 'j2',
    date: '2026-04-11',
    mood: 'happy',
    moodEmoji: '😊',
    title: 'Good day with friends',
    content: 'Hung out with Maya and Jake after school. We just talked and laughed. Felt really connected for the first time in a while.',
    tags: ['friends', 'connection'],
  },
  {
    id: 'j3',
    date: '2026-04-10',
    mood: 'sad',
    moodEmoji: '😢',
    title: 'Left out again',
    content: 'Saw everyone at Sarah\'s party on Instagram. I wasn\'t invited. Trying not to spiral but it\'s hard.',
    tags: ['social media', 'FOMO', 'loneliness'],
  },
];

export const sampleChatMessages: ChatMessage[] = [
  { id: 'c1', role: 'ai', content: 'Hey! How are you feeling right now? No wrong answers here 💛', timestamp: '2:30 PM' },
  { id: 'c2', role: 'user', content: 'idk just kinda off today', timestamp: '2:31 PM' },
  { id: 'c3', role: 'ai', content: 'I hear you. "Off" can mean a lot of things. Can you tell me more about what that feels like for you right now?', timestamp: '2:31 PM' },
  { id: 'c4', role: 'user', content: 'like im stressed but also bored? and kinda lonely i guess', timestamp: '2:32 PM' },
  { id: 'c5', role: 'ai', content: 'That\'s actually really insightful — feeling stressed AND bored at the same time is super common for teens. It might be what we call "restless anxiety" — your mind is racing but nothing feels engaging enough. The loneliness adds another layer. Want to explore what might be behind these feelings?', timestamp: '2:32 PM' },
];

export const moodOptions = [
  { emoji: '😊', label: 'Happy', color: '#FFD700' },
  { emoji: '😢', label: 'Sad', color: '#64B5F6' },
  { emoji: '😰', label: 'Anxious', color: '#FF8A65' },
  { emoji: '😤', label: 'Angry', color: '#EF5350' },
  { emoji: '😌', label: 'Calm', color: '#81C784' },
  { emoji: '😐', label: 'Meh', color: '#90A4AE' },
  { emoji: '🤔', label: 'Confused', color: '#CE93D8' },
  { emoji: '🥰', label: 'Loved', color: '#F48FB1' },
];
