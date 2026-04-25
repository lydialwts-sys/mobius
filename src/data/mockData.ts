export interface EmotionCharacter {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  unlocked: boolean;
}

export type LessonStepType =
  | 'intro'           // course_1 only: Knowledge Session landing
  | 'character-intro' // course_1 only: meet the Anxiety character
  | 'quiz'            // 3-4 option cards
  | 'reveal'          // "Great job!"/"Reveal" white-card stack
  | 'insight'         // "Insight" white-card stack (highlight = blue accent)
  | 'summary';        // course_3 final: collected insights + Complete Session

export interface LessonOption {
  text: string;
  emoji?: string;          // for course_1 quiz options
  image?: any;             // small inline doodle (cloud/shield/telescope/etc.)
  imageAspect?: number;
}

export interface LessonCard {
  text: string;
  highlight?: boolean;     // true = blue accent text — the "punchline" card
}

export interface LessonInsightSummary {
  title: string;           // "The 70% Rule"
  body: string;
  image: any;
}

export interface LessonStep {
  id: string;
  type: LessonStepType;

  // type === 'intro' (Knowledge Session landing)
  intro?: {
    label: string;         // "Knowledge Session"
    title: string;
    tag: string;           // "Anticipate 3 min"
    description: string;
    image: any;
    imageAspect: number;
    sources: { title: string; ref: string };
  };

  // type === 'character-intro'
  characterImage?: any;
  characterImageAspect?: number;
  characterCaption?: string;   // "Hi Alex, I'm your Anxiety"
  characterCard?: string;      // body card under caption

  // type === 'quiz'
  quizSubtitle?: string;       // "Take a guess:" / "Be honest:"
  quizContext?: string;        // gray context line above the question (course_3 screen 3)
  quizTitle?: string;          // blue heading question
  options?: LessonOption[];
  correctAnswer?: number;      // -1 = any answer fine

  // type === 'reveal' | 'insight'
  sectionTitle?: string;       // "Great job!" / "Reveal" / "Insight"
  image?: any;                 // hero illustration (bottom-anchored)
  imageAspect?: number;
  cards?: LessonCard[];

  // type === 'summary'
  summaryTitle?: string;       // "Insights about Anxiety"
  insights?: LessonInsightSummary[];
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  steps: LessonStep[];
  completed: boolean;
  thumbnail?: any;
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
      // course_1 — Anxiety scenario
      {
        id: 'sic-1',
        title: 'Silence inner critic',
        subtitle: 'Meet your Anxiety',
        completed: false,
        thumbnail: require('../../assets/in app_thumbnail/silence_the_inner_critique_thumbnail.png'),
        steps: [
          {
            id: 's1',
            type: 'intro',
            intro: {
              label: 'Knowledge Session',
              title: 'Silence inner critic',
              tag: 'Anticipate 3 min',
              description: 'Managing the "everyone is looking at me" feeling and the fear of being judged.',
              image: require('../../assets/in app_thumbnail/silence_the_inner_critique_header.png'),
              imageAspect: 488 / 403,
              sources: { title: "Don't Silence Your Inner Critic. Talk to It.", ref: 'Ron Carucci, Harvard Business Review' },
            },
          },
          {
            id: 's2',
            type: 'character-intro',
            characterImage: require('../../assets/in app_thumbnail/meet_anxiety_thumbnail.png'),
            characterImageAspect: 1,
            characterCaption: "Hi Alex, I'm your Anxiety",
            characterCard: "The Inner Critic is like a pop-up advertisement in your brain that you didn't ask for.",
          },
          {
            id: 's3',
            type: 'quiz',
            quizTitle: 'Has it ever interrupted your day?',
            options: [
              { text: 'Everyone is staring at my outfit/hair.', emoji: '😳' },
              { text: "I'm the only one who doesn't get this lesson.", emoji: '🤓' },
              { text: "I shouldn't have said that weird thing 3 hours ago.", emoji: '🤦‍♀️' },
              { text: 'My friends are probably hanging out without me.', emoji: '💔' },
            ],
            correctAnswer: -1,
          },
          {
            id: 's4',
            type: 'reveal',
            sectionTitle: 'Reveal',
            image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path A_reveal.png'),
            imageAspect: 501 / 549,
            cards: [
              { text: "Ouch. We've all been there. It's like having a tiny, mean commentator living in your head." },
              { text: "It's exhausting, it's loud, and honestly?" },
              { text: "It's really heavy to carry around all day." },
            ],
          },
          {
            id: 's5',
            type: 'reveal',
            sectionTitle: 'Reveal',
            image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path A_reveal.png'),
            imageAspect: 501 / 549,
            cards: [
              { text: 'But...' },
              { text: "You aren't 'weird' for thinking this way—you're actually just human.", highlight: true },
            ],
          },
        ],
      },
      // course_2 — Why your brain made it
      {
        id: 'sic-2',
        title: 'Silence inner critic',
        subtitle: 'Why your brain even allows it',
        completed: false,
        thumbnail: require('../../assets/in app_thumbnail/silence_the_inner_critique_thumbnail.png'),
        steps: [
          {
            id: 's1',
            type: 'quiz',
            quizSubtitle: 'Take a guess:',
            quizTitle: 'Why does your brain even allow this mean voice to exist?',
            options: [
              { text: 'Because your brain wants you to be sad.', image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path A_option 1.png'), imageAspect: 150 / 141 },
              { text: "It's an old survival instinct trying to keep you 'safe.'", image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path A_option 2.png'), imageAspect: 263 / 148 },
              { text: "It's a sign that you are actually failing.", image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path A_option 3.png'), imageAspect: 257 / 167 },
            ],
            correctAnswer: 1,
          },
          {
            id: 's2',
            type: 'reveal',
            sectionTitle: 'Great job!',
            image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path A_success.png'),
            imageAspect: 451 / 398,
            cards: [
              { text: "Thousands of years ago, being 'kicked out' of the tribe meant you wouldn't survive." },
              { text: "Your brain developed a 'Social Radar' to make sure you fit in." },
              { text: 'Today, your Inner Critic is just that radar over-reacting.' },
              { text: "It's not trying to hurt you; it's a 'Security Guard' that is way too stressed out.", highlight: true },
            ],
          },
          {
            id: 's3',
            type: 'quiz',
            quizSubtitle: 'Be honest:',
            quizTitle: "When you're scrolling through social media, what percentage of your peers do you think are actually confident and NOT struggling with an Inner Critic?",
            options: [
              { text: 'Only about 10%' },
              { text: 'Around 50%' },
              { text: 'Almost everyone looks like they have it together.' },
            ],
            correctAnswer: -1,
          },
          {
            id: 's4',
            type: 'reveal',
            sectionTitle: 'Reveal',
            image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path A_reveal.png'),
            imageAspect: 501 / 549,
            cards: [
              { text: "It looks like everyone is fine (Choice C), but research shows that over 70% of teenagers report having a 'harsh inner voice' daily." },
              { text: "You're seeing their 'Highlight Reel' while feeling your 'Behind-the-Scenes.' You are definitely not alone.", highlight: true },
            ],
          },
        ],
      },
      // course_3 — Spotlight Effect & coping (longest, ends with summary)
      {
        id: 'sic-3',
        title: 'Silence inner critic',
        subtitle: 'Spotlight effect & tools',
        completed: false,
        thumbnail: require('../../assets/in app_thumbnail/silence_the_inner_critique_thumbnail.png'),
        steps: [
          {
            id: 's1',
            type: 'quiz',
            quizSubtitle: 'Take a guess:',
            quizTitle: 'If your Inner Critic was an ancestor from 10,000 years ago, what would their job be?',
            options: [
              { text: 'The Party Planner.', image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path B_option 1.png'), imageAspect: 134 / 172 },
              { text: 'The Look-Out Scout.', image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path b_option 2.png'), imageAspect: 175 / 153 },
              { text: 'The Artist.', image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path B_option 3.png'), imageAspect: 177 / 147 },
            ],
            correctAnswer: 1,
          },
          {
            id: 's2',
            type: 'reveal',
            sectionTitle: 'Great job!',
            image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path B_success.png'),
            imageAspect: 304 / 344,
            cards: [
              { text: "Your brain is hard-wired to look for 'social threats.'" },
              { text: "Back then, being 'uncool' or annoying the group meant you might get kicked out of the tribe and have to fight a saber-tooth tiger alone." },
              { text: "Your brain thinks a 'cringe' text message is a life-or-death survival situation!", highlight: true },
            ],
          },
          {
            id: 's3',
            type: 'quiz',
            quizContext: 'Think about a time a classmate tripped or said something slightly wrong in class.',
            quizTitle: 'How long did you think about it afterward?',
            options: [
              { text: 'I thought about it for days.' },
              { text: 'Maybe for 5 seconds, then I forgot.' },
              { text: "I'm still thinking about it now." },
            ],
            correctAnswer: 1,
          },
          {
            id: 's4',
            type: 'insight',
            sectionTitle: 'Insight',
            image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path B_insights.png'),
            imageAspect: 489 / 412,
            cards: [
              { text: 'This is called the Spotlight Effect.', highlight: true },
              { text: 'We think everyone is shining a spotlight on our mistakes, but really, everyone is just holding their own spotlight, worrying about themselves!' },
              { text: "If you don't judge them for hours, they likely aren't judging you either." },
            ],
          },
          {
            id: 's5',
            type: 'quiz',
            quizSubtitle: 'Be honest:',
            quizTitle: 'When your Inner Critic gets really LOUD and mean, does that mean the things it\'s saying are more likely to be true?',
            options: [
              { text: 'Yes, the louder it is, the more I should listen.' },
              { text: "No, it just means my brain's alarm is being extra sensitive." },
            ],
            correctAnswer: 1,
          },
          {
            id: 's6',
            type: 'insight',
            sectionTitle: 'Insight',
            image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path B_insights_2.png'),
            imageAspect: 307 / 383,
            cards: [
              { text: 'Think of it like a car alarm.', highlight: true },
              { text: 'A car alarm goes off whether someone is breaking in OR if a harmless cat just jumped on the hood.' },
              { text: "A loud voice doesn't mean a big truth; it just means a sensitive alarm." },
            ],
          },
          {
            id: 's7',
            type: 'summary',
            summaryTitle: 'Insights about Anxiety',
            insights: [
              {
                title: 'Social Radar',
                body: "Your inner critic is not trying to hurt you; it's a 'Security Guard' that is way too stressed out.",
                image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path A_success.png'),
              },
              {
                title: 'The 70% Rule',
                body: 'Most people around me are fighting the same internal battle, even if they look cool.',
                // TODO: needs a "treasure box" illustration export from Figma
                image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path A_reveal.png'),
              },
              {
                title: 'Spotlight Effect',
                body: 'We think everyone is shining a spotlight on our mistakes, but really, everyone is just holding their own spotlight, worrying about themselves!',
                image: require('../../assets/in app_thumbnail/silence_the_inner_critique_path B_insights.png'),
              },
            ],
          },
        ],
      },
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
  thumbnail?: any;
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
      { id: 'meet-anxiety', title: 'Meet Anxiety', route: '/emotion/anxiety', locked: false, completed: false, thumbnail: require('../../assets/in app_thumbnail/meet_anxiety_thumbnail.png') },
      { id: 'silence-inner-critic', title: 'Silence the inner critique', route: '/course/silence-inner-critic', locked: false, completed: false, thumbnail: require('../../assets/in app_thumbnail/silence_the_inner_critique_thumbnail.png') },
      { id: 'ghosted-post', title: 'The ghosted post', route: '/roleplay/ghosted-post', locked: false, completed: false, thumbnail: require('../../assets/in app_thumbnail/the ghosted post_thumbnail.png') },
      // 4th node: locked until session 3 is completed
      { id: 'anxiety-next', title: 'Coming soon', route: '', locked: true, completed: false },
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
