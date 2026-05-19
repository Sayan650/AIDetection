import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { theme } from "../../constants/theme";

type Props = {
  count: number;
  progress: Animated.SharedValue<number>; // scrollX / width
};

export default function ProgressDots({ count, progress }: Props) {
  return (
    <View style={styles.row} accessibilityRole="progressbar">
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} index={i} progress={progress} />
      ))}
    </View>
  );
}

function Dot({
  index,
  progress,
}: {
  index: number;
  progress: Animated.SharedValue<number>;
}) {
  const rStyle = useAnimatedStyle(() => {
    const input = [index - 1, index, index + 1];
    const scale = interpolate(progress.value, input, [0.8, 1.3, 0.8]);
    const opacity = interpolate(progress.value, input, [0.5, 1, 0.5]);
    return { transform: [{ scale }], opacity };
  });
  return <Animated.View style={[styles.dot, rStyle]} />;
}

const DOT = 8;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: theme.colors.primary,
  },
});
