import { Easing } from 'react-native-reanimated';

// Animation durations (in milliseconds)
export const durations = {
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 750,
} as const;

// Easing functions
export const easings = {
  // Standard easing curves
  linear: Easing.linear,
  ease: Easing.ease,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  
  // Cubic bezier curves
  cubic: Easing.bezier(0.4, 0.0, 0.2, 1),
  cubicIn: Easing.bezier(0.4, 0.0, 1, 1),
  cubicOut: Easing.bezier(0.0, 0.0, 0.2, 1),
  
  // Bounce and elastic
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
  
  // Back easing
  back: Easing.back(1.5),
} as const;

// Common animation configurations
export const animations = {
  // Button press animation
  buttonPress: {
    duration: durations.fast,
    easing: easings.easeOut,
    scale: {
      pressed: 0.95,
      released: 1,
    },
  },
  
  // Screen transitions
  screenTransition: {
    duration: durations.normal,
    easing: easings.cubic,
  },
  
  // Modal animations
  modal: {
    duration: durations.normal,
    easing: easings.easeOut,
    backdrop: {
      opacity: {
        hidden: 0,
        visible: 1,
      },
    },
    content: {
      scale: {
        hidden: 0.9,
        visible: 1,
      },
      opacity: {
        hidden: 0,
        visible: 1,
      },
    },
  },
  
  // Loading spinner
  spinner: {
    duration: durations.slower,
    easing: easings.linear,
    rotation: {
      from: 0,
      to: 360,
    },
  },
  
  // Fade animations
  fade: {
    duration: durations.normal,
    easing: easings.easeInOut,
    opacity: {
      hidden: 0,
      visible: 1,
    },
  },
  
  // Slide animations
  slide: {
    duration: durations.normal,
    easing: easings.cubic,
    horizontal: {
      left: -100,
      center: 0,
      right: 100,
    },
    vertical: {
      up: -100,
      center: 0,
      down: 100,
    },
  },
  
  // Scale animations
  scale: {
    duration: durations.normal,
    easing: easings.back,
    values: {
      hidden: 0,
      small: 0.8,
      normal: 1,
      large: 1.1,
    },
  },
  
  // Onboarding specific animations
  onboarding: {
    screenTransition: {
      duration: durations.slow,
      easing: easings.cubic,
    },
    progressBar: {
      duration: durations.normal,
      easing: easings.easeOut,
    },
    illustration: {
      duration: durations.slower,
      easing: easings.elastic,
      delay: durations.fast,
    },
  },
  
  // Image upload animations
  imageUpload: {
    preview: {
      duration: durations.normal,
      easing: easings.easeOut,
      scale: {
        hidden: 0.8,
        visible: 1,
      },
    },
    progress: {
      duration: durations.fast,
      easing: easings.linear,
    },
  },
  
  // Result screen animations
  result: {
    stagger: {
      delay: durations.fast,
      duration: durations.normal,
      easing: easings.easeOut,
    },
    card: {
      duration: durations.slow,
      easing: easings.back,
      scale: {
        hidden: 0.9,
        visible: 1,
      },
    },
  },
} as const;

// Spring animation configurations
export const springs = {
  gentle: {
    damping: 20,
    stiffness: 90,
    mass: 1,
  },
  bouncy: {
    damping: 10,
    stiffness: 100,
    mass: 1,
  },
  snappy: {
    damping: 25,
    stiffness: 120,
    mass: 1,
  },
  slow: {
    damping: 30,
    stiffness: 80,
    mass: 1,
  },
} as const;

// Timing animation configurations
export const timings = {
  fast: {
    duration: durations.fast,
    easing: easings.easeOut,
  },
  normal: {
    duration: durations.normal,
    easing: easings.cubic,
  },
  slow: {
    duration: durations.slow,
    easing: easings.easeInOut,
  },
} as const;

// Animation presets for common use cases
export const presets = {
  // Fade in/out
  fadeIn: {
    duration: durations.normal,
    easing: easings.easeOut,
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    duration: durations.normal,
    easing: easings.easeIn,
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  
  // Slide in from directions
  slideInLeft: {
    duration: durations.normal,
    easing: easings.cubic,
    from: { translateX: -100, opacity: 0 },
    to: { translateX: 0, opacity: 1 },
  },
  slideInRight: {
    duration: durations.normal,
    easing: easings.cubic,
    from: { translateX: 100, opacity: 0 },
    to: { translateX: 0, opacity: 1 },
  },
  slideInUp: {
    duration: durations.normal,
    easing: easings.cubic,
    from: { translateY: 100, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
  },
  slideInDown: {
    duration: durations.normal,
    easing: easings.cubic,
    from: { translateY: -100, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
  },
  
  // Scale animations
  scaleIn: {
    duration: durations.normal,
    easing: easings.back,
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
  },
  scaleOut: {
    duration: durations.fast,
    easing: easings.easeIn,
    from: { scale: 1, opacity: 1 },
    to: { scale: 0.8, opacity: 0 },
  },
} as const;

// Type definitions
export type Duration = typeof durations[keyof typeof durations];
export type Easing = typeof easings[keyof typeof easings];
export type Animation = typeof animations[keyof typeof animations];
export type Spring = typeof springs[keyof typeof springs];
export type Timing = typeof timings[keyof typeof timings];