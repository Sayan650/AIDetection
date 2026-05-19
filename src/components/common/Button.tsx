import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Vibration,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { animations, springs } from '../../constants/animations';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  hapticFeedback = true,
  style,
  textStyle,
  testID,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    scale.value = withSpring(animations.buttonPress.scale.pressed, springs.snappy);
    if (hapticFeedback && !isDisabled) {
      runOnJS(Vibration.vibrate)(50);
    }
    opacity.value = withTiming(0.85, { duration: 90 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(animations.buttonPress.scale.released, springs.snappy);
    opacity.value = withTiming(1, { duration: 120 });
  };

  const handlePress = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: withTiming(isDisabled ? 0.6 : opacity.value, {
        duration: animations.fade.duration,
      }),
    };
  });

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: theme.components.button.height[size],
      paddingHorizontal: theme.components.button.paddingHorizontal[size],
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: theme.fontWeight.semibold,
      textAlign: 'center',
    };

    switch (size) {
      case 'sm':
        baseStyle.fontSize = theme.fontSize.sm;
        break;
      case 'md':
        baseStyle.fontSize = theme.fontSize.base;
        break;
      case 'lg':
        baseStyle.fontSize = theme.fontSize.lg;
        break;
    }

    switch (variant) {
      case 'primary':
      case 'secondary':
        baseStyle.color = theme.colors.text;
        break;
      case 'outline':
      case 'ghost':
        baseStyle.color = theme.colors.primary;
        break;
    }

    return baseStyle;
  };

  const getSpinnerColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.colors.text;
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.text;
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[animatedStyle, getButtonStyle(), style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getSpinnerColor()}
          testID={`${testID}-loading`}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]} testID={`${testID}-text`}>
          {title}
        </Text>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});