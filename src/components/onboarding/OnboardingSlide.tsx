import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { theme } from "../../constants/theme";

type Props = {
  title: string;
  subtitle: string;
  Illustration?: React.ReactNode; // animated illustration node
  testID?: string;
};

export default function OnboardingSlide({
  title,
  subtitle,
  Illustration,
  testID,
}: Props) {
  return (
    <Animated.View
      entering={FadeInUp.duration(500)}
      exiting={FadeOutDown.duration(300)}
      style={styles.container}
      testID={testID}
    >
      <View style={styles.illustration}>{Illustration}</View>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    width: "100%",
    alignItems: "center",
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
