// Export all constants from a single entry point
export * from './theme';
export * from './animations';

// Re-export commonly used items for convenience
export { theme as defaultTheme, colors, spacing } from './theme';
export { animations, durations, easings, presets } from './animations';