import React from "react";
import OnboardingSlide from "../OnboardingSlide";
import Illustration from "../Illustration";
// import aiLottie from '../../../assets/lottie/ai.json';

export default function ScreenTwo() {
  return (
    <OnboardingSlide
      title="AI-Powered Insight"
      subtitle="State-of-the-art model suggests likely conditions based on your image."
      Illustration={<Illustration /* source={aiLottie} */ />}
      testID="onboarding-screen-2"
    />
  );
}
