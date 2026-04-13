// Shared animation config for consistency across the app

export const SPRING_BOUNCY = { damping: 15, stiffness: 150 };
export const SPRING_SNAPPY = { damping: 20, stiffness: 200 };
export const SPRING_GENTLE = { damping: 20, stiffness: 120 };

export const PRESS_SCALE = 0.97;
export const STAGGER_MS = 60;

// Entrance animation defaults
export const ENTRANCE_FROM = { opacity: 0, translateY: 16 };
export const ENTRANCE_TO = { opacity: 1, translateY: 0 };

// Fade defaults
export const FADE_IN = { opacity: 1 };
export const FADE_OUT = { opacity: 0 };

// Delay helper for staggered items
export const staggerDelay = (index: number, base: number = 0) => base + index * STAGGER_MS;
