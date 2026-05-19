import React, { useEffect } from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { animations } from '../../constants/animations';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  thickness?: number;
  style?: ViewStyle;
  testID?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = theme.colors.primary,
  thickness = 3,
  style,
  testID,
}) => {
  const rotation = useSharedValue(0);

  const getSizeValue = (): number => {
    switch (size) {
      case 'sm':
        return 16;
      case 'md':
        return 24;
      case 'lg':
        return 32;
      case 'xl':
        return 48;
      default:
        return 24;
    }
  };

  const sizeValue = getSizeValue();

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: animations.spinner.duration,
        easing: animations.spinner.easing,
      }),
      -1, // Infinite repeat
      false // Don't reverse
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  const spinnerStyle: ViewStyle = {
    width: sizeValue,
    height: sizeValue,
    borderRadius: sizeValue / 2,
    borderWidth: thickness,
    borderColor: 'transparent',
    borderTopColor: color,
    borderRightColor: color,
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Animated.View
        style={[spinnerStyle, animatedStyle]}
        testID={`${testID}-spinner`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});