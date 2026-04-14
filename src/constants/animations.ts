// Shared animation config — subtle, smooth, easy-ease feel

export const SPRING_BOUNCY = { damping: 22, stiffness: 120 };
export const SPRING_SNAPPY = { damping: 26, stiffness: 180 };
export const SPRING_GENTLE = { damping: 28, stiffness: 100 };

export const PRESS_SCALE = 0.985;
export const STAGGER_MS = 35;

// Entrance: halved translateY for subtlety
export const ENTRANCE_FROM = { opacity: 0, translateY: 8 };
export const ENTRANCE_TO = { opacity: 1, translateY: 0 };

export const FADE_IN = { opacity: 1 };
export const FADE_OUT = { opacity: 0 };

export const staggerDelay = (index: number, base: number = 0) => base + index * STAGGER_MS;
