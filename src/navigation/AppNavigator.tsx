import React, { useEffect, useState } from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { View, Text, ActivityIndicator } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import Onboarding from "../screens/Onboarding";
import ResultScreen from "../screens/ResultScreen";
import ImageUploadScreen from "../screens/ImageUpload";
import { onboardingStorage } from "../utils/storage";
import { theme } from "../constants/theme";

const Stack = createStackNavigator();

// Custom fade + slight scale for onboarding transition
const forOnboardingFade = ({ current }: any) => {
  return {
    cardStyle: {
      opacity: current.progress,
      transform: [
        {
          scale: current.progress.interpolate
            ? current.progress.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] })
            : 1,
        },
      ],
    },
  };
};

const Gate = ({ onResolved }: { onResolved: (initial: keyof any) => void }) => {
  const [state, setState] = useState<{ loading: boolean; error: string | null }>(
    { loading: true, error: null }
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const done = await onboardingStorage.isCompleted();
        if (!mounted) return;
        onResolved(done ? "Home" : "Onboarding");
      } catch (e) {
        if (!mounted) return;
        setState({ loading: false, error: "Failed to determine app state" });
      }
    })();
    return () => { mounted = false; };
  }, [onResolved]);

  if (state.error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text, marginBottom: 12 }}>{state.error}</Text>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background }}>
      <ActivityIndicator color={theme.colors.primary} />
    </View>
  );
};

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<"Onboarding" | "Home" | null>(null);

  useEffect(() => {
    // Gate will resolve and update initialRoute
  }, []);

  if (!initialRoute) {
    return <Gate onResolved={(route) => setInitialRoute(route as any)} />;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#0f172a" },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{
          // Smooth fade on enter/exit
          cardStyleInterpolator: forOnboardingFade,
          // Fast timing for snappy feel
          transitionSpec: {
            open: { animation: "timing", config: { duration: 250 } },
            close: { animation: "timing", config: { duration: 200 } },
          },
        }}
      />

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ImageUpload" component={ImageUploadScreen} />

      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          presentation: "modal",
          gestureDirection: "vertical",
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          transitionSpec: {
            open: { animation: "timing", config: { duration: 300 } },
            close: { animation: "timing", config: { duration: 250 } },
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
