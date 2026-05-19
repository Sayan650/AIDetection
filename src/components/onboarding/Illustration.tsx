import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
// If using Lottie:
let LottieView: any;
try {
  LottieView = require("lottie-react-native");
} catch {
  LottieView = null;
}

type Props = {
  source?: object;
  fallback?: React.ReactNode;
  size?: number;
  testID?: string;
};

export default function Illustration({
  source,
  fallback,
  size = 240,
  testID,
}: Props) {
  if (!LottieView || !source) {
    return (
      <View
        style={[styles.fallback, { width: size, height: size }]}
        testID={testID}
      >
        {fallback ?? <View style={styles.placeholder} />}
      </View>
    );
  }
  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <LottieView
        source={source}
        autoPlay
        loop
        style={{ width: size, height: size }}
        testID={testID}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: "center", justifyContent: "center" },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    backgroundColor: Platform.select({
      ios: "#25304a",
      android: "#25304a",
      default: "#25304a",
    }),
  },
});
