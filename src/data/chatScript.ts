// Scripted dialogue matching the Figma AI chat prototype
// Topic: "Friends in dance class" - body image and comparison

export interface ScriptedMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  delay: number; // ms delay before showing this message
}

export const chatTopic = 'Friends in dance class';

export const scriptedDialogue: ScriptedMessage[] = [
  // Chat 1: User opens with their concern
  {
    id: 'c1',
    role: 'user',
    content: "Everyone in dance class looks thinner and prettier than me. I'm so ugly.",
    delay: 0,
  },
  // Chat 2: AI acknowledges and probes
  {
    id: 'c2',
    role: 'ai',
    content: 'I hear you. Can you tell me what makes you think that way?',
    delay: 1200,
  },
  // Chat 3: User elaborates
  {
    id: 'c3',
    role: 'user',
    content: "I just look at everyone else in the mirror during class and they all look so good. And then there's me.",
    delay: 0,
  },
  // Chat 4: AI validates and identifies pattern
  {
    id: 'c4',
    role: 'ai',
    content: "It sounds like you're comparing yourself to others a lot during class. That mirror can feel like a spotlight sometimes. When you notice those thoughts, what do you feel in your body?",
    delay: 1500,
  },
  // Chat 5: User shares physical feelings
  {
    id: 'c5',
    role: 'user',
    content: 'My stomach gets tight and I just want to hide in the back row.',
    delay: 0,
  },
  // Chat 6: AI names the emotion
  {
    id: 'c6',
    role: 'ai',
    content: "That tight feeling in your stomach — that's your body's way of saying something's bothering you deeply. What you're describing sounds a lot like jealousy mixed with self-doubt. Have you heard of those before?",
    delay: 1500,
  },
  // Chat 7: User responds
  {
    id: 'c7',
    role: 'user',
    content: "I mean yeah, but I didn't think that's what this was. I thought I was just being realistic.",
    delay: 0,
  },
  // Chat 8: AI reframes
  {
    id: 'c8',
    role: 'ai',
    content: "That's actually really common — jealousy often disguises itself as \"just being realistic.\" But here's the thing: your inner critic is picking one thing (how you look) and making it the whole story. You showed up to dance class. That takes courage.",
    delay: 1800,
  },
  // Chat 9: User softens
  {
    id: 'c9',
    role: 'user',
    content: "I guess I never thought about it that way. I do really like dancing tho.",
    delay: 0,
  },
  // Chat 10: AI encourages
  {
    id: 'c10',
    role: 'ai',
    content: "And that matters way more than what the mirror shows. Next time you catch yourself comparing, try this: focus on how the music makes you feel instead of how you look. Can you try that?",
    delay: 1500,
  },
  // Chat 11: User agrees
  {
    id: 'c11',
    role: 'user',
    content: 'Yeah I can try that. Thanks.',
    delay: 0,
  },
  // Chat 12: AI offers next steps
  {
    id: 'c12',
    role: 'ai',
    content: "You're doing great by talking about this. Want to explore more about jealousy, or try a quick exercise to quiet your inner critic?",
    delay: 1200,
  },
];

// Options shown after the dialogue completes (Chat 8 - Options screen)
export const chatOptions = [
  { id: 'explore-jealousy', label: 'Explore Jealousy', icon: '🔍' },
  { id: 'quiet-critic', label: 'Quiet my inner critic', icon: '🤫' },
  { id: 'journal', label: 'Write in my journal', icon: '📝' },
];
