import React from "react";
import OnboardingSlide from "../OnboardingSlide";
import Illustration from "../Illustration";
// import privacyLottie from '../../../assets/lottie/privacy.json';

export default function ScreenThree() {
  return (
    <OnboardingSlide
      title="Your Data, Your Control"
      subtitle="We respect privacy. Review, delete, and control your uploads at any time."
      Illustration={<Illustration /* source={privacyLottie} */ />}
      testID="onboarding-screen-3"
    />
  );
}
