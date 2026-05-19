import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  margin = 'none',
  borderRadius = 'lg',
  backgroundColor,
  elevation = 'md',
  fullWidth = false,
  style,
  testID,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: backgroundColor || theme.colors.surface,
      borderRadius: theme.borderRadius[borderRadius],
    };

    // Apply padding
    if (padding !== 'none') {
      baseStyle.padding = theme.spacing[padding];
    }

    // Apply margin
    if (margin !== 'none') {
      baseStyle.margin = theme.spacing[margin];
    }

    // Apply full width
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Apply variant-specific styles
    switch (variant) {
      case 'elevated':
        if (elevation !== 'none') {
          Object.assign(baseStyle, theme.shadows[elevation]);
        }
        break;
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.border;
        break;
      case 'default':
      default:
        if (elevation !== 'none') {
          Object.assign(baseStyle, theme.shadows[elevation]);
        }
        break;
    }

    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});