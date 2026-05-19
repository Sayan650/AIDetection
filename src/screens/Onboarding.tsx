import React, { useRef, useState, useCallback } from "react";
import { View, StyleSheet, Dimensions, FlatList, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { theme } from "../constants/theme";
import ProgressDots from "../components/onboarding/ProgressDots";
import ScreenOne from "../components/onboarding/screens/ScreenOne";
import ScreenTwo from "../components/onboarding/screens/ScreenTwo";
import ScreenThree from "../components/onboarding/screens/ScreenThree";
import { Button } from "../components/common/Button";
import { onboardingStorage } from "../utils/storage";

const { width } = Dimensions.get("window");

const SLIDES = [ScreenOne, ScreenTwo, ScreenThree];

export default function Onboarding({ navigation }: any) {
  const [index, setIndex] = useState(0);
  const progress = useSharedValue(0);
  const listRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length) {
      const i = viewableItems[0].index ?? 0;
      setIndex(i);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      const x = e.contentOffset.x;
      progress.value = x / width; // slide progress (0..n)
    },
  });

  const completeOnboarding = useCallback(async () => {
    try {
      await onboardingStorage.setCompleted();
    } catch (_) {
      // swallow error, still proceed to app
    } finally {
      navigation.replace("Home");
    }
  }, [navigation]);

  const goNext = useCallback(() => {
    const next = Math.min(index + 1, SLIDES.length - 1);
    // Update state immediately so tests & UI reflect the new index
    setIndex(next);
    if (index >= SLIDES.length - 1) {
      // If already on last, finish onboarding
      completeOnboarding();
    } else {
      listRef.current?.scrollToIndex({ index: next, animated: true });
    }
  }, [index, completeOnboarding]);

  const skip = useCallback(() => {
    // Skip completes onboarding immediately
    completeOnboarding();
  }, [completeOnboarding]);

  const getStarted = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(_, i) => `slide-${i}`}
        renderItem={({ item: Comp }) => (
          <View style={{ width, paddingTop: theme.spacing.xl }}>
            <Comp />
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        testID="onboarding-list"
      />

      <View style={styles.footer}>
        <ProgressDots count={SLIDES.length} progress={progress} />

        <View style={styles.controls}>
          {index < SLIDES.length - 1 ? (
            <>
              <Button
                title="Skip"
                variant="ghost"
                onPress={skip}
                testID="btn-skip"
              />
              <Button
                title="Next"
                variant="primary"
                onPress={goNext}
                testID="btn-next"
              />
            </>
          ) : (
            <Button
              title="Get Started"
              variant="primary"
              onPress={getStarted}
              testID="btn-start"
            />
          )}
        </View>

        <Text
          style={styles.hint}
          accessibilityLabel={`Screen ${index + 1} of ${SLIDES.length}`}
        >
          {index + 1}/{SLIDES.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  hint: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
