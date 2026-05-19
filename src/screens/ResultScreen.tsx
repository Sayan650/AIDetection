import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, Share, Vibration } from "react-native";
import { theme } from "../constants/theme";
import { Button } from "../components/common/Button";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

type Props = {
  navigation: any;
  route: {
    params?: {
      disease?: string;
      confidence?: number; // 0..1
      image?: string; // uri
    };
  };
};

export default function ResultScreen({ navigation, route }: Props) {
  const params = route?.params ?? {};
  const { disease, confidence, image } = params;

  const hasError = !disease || typeof confidence !== "number" || !image;

  const confidencePct = useMemo(() => {
    if (typeof confidence !== "number") return "-";
    return `${Math.round(confidence * 100)}%`;
  }, [confidence]);

  const handleTryAgain = () => {
    Vibration.vibrate(50);
    // Go back to Home flow
    if (navigation?.replace) navigation.replace("Home");
    else if (navigation?.navigate) navigation.navigate("Home");
  };

  const handleShare = async () => {
    if (hasError) return;
    try {
      Vibration.vibrate(30);
      const message = `Diagnosis: ${disease} (${confidencePct})`;
      await Share.share({ message, url: image });
    } catch {
      // silently ignore share errors for now
    }
  };

  if (hasError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Analysis Result</Text>
        <View style={styles.card}>
          <Text style={styles.errorText} testID="result-error">
            Failed to load result. Please try again.
          </Text>
          <Button
            title="Try Again"
            variant="primary"
            onPress={handleTryAgain}
            fullWidth
            testID="btn-try-again"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeIn.duration(200)} style={styles.title} testID="result-title">Analysis Result</Animated.Text>
      <View style={styles.card}>
        <Animated.Image
          entering={FadeInUp.duration(250)}
          source={{ uri: image! }}
          style={styles.image}
          resizeMode="cover"
          testID="result-image"
        />
        <Animated.Text entering={FadeInDown.delay(100).duration(250)} style={styles.disease} testID="result-disease">{disease}</Animated.Text>
        <Animated.Text entering={FadeInDown.delay(200).duration(250)} style={styles.confidence} testID="result-confidence">Confidence: {confidencePct}</Animated.Text>

        <View style={styles.actions}>
          <Animated.View entering={FadeIn.delay(250).duration(200)}>
            <Button
              title="Share Result"
              variant="outline"
              onPress={handleShare}
              fullWidth
              testID="btn-share"
            />
          </Animated.View>
          <Animated.View entering={FadeIn.delay(300).duration(200)}>
            <Button
              title="Try Again"
              variant="primary"
              onPress={handleTryAgain}
              fullWidth
              testID="btn-try-again"
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  disease: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: "center",
  },
  confidence: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  actions: { gap: theme.spacing.md, marginTop: theme.spacing.lg },
  errorText: { color: theme.colors.error || "#ef4444", textAlign: "center", marginBottom: theme.spacing.lg },
});
