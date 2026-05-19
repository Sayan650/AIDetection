# Constants and Utilities

This directory contains core utility functions and design constants for the Disease Detection App.

## Usage Examples

### Storage Utilities

```typescript
import { onboardingStorage } from '../utils/storage';

// Check if onboarding is completed
const isCompleted = await onboardingStorage.isCompleted();

// Mark onboarding as completed
await onboardingStorage.setCompleted();

// Reset onboarding state
await onboardingStorage.reset();
```

### Theme Constants

```typescript
import { theme, colors, spacing } from '../constants';

// Use colors
const buttonStyle = {
  backgroundColor: colors.primary,
  color: colors.text,
};

// Use spacing
const containerStyle = {
  padding: spacing.lg,
  margin: spacing.md,
};

// Use complete theme
const cardStyle = {
  ...theme.components.card,
  backgroundColor: theme.colors.surface,
};
```

### Animation Constants

```typescript
import { animations, presets, durations } from '../constants';

// Use animation presets
const fadeInAnimation = presets.fadeIn;

// Use specific animation configs
const buttonPressConfig = animations.buttonPress;

// Use durations
const customAnimation = {
  duration: durations.normal,
  // ... other config
};
```

## File Structure

- `theme.ts` - Design tokens, colors, spacing, typography
- `animations.ts` - Animation configurations and presets
- `index.ts` - Main export file
- `../utils/storage.ts` - AsyncStorage utility functions