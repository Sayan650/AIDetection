import React from "react";
import OnboardingSlide from "../OnboardingSlide";
import Illustration from "../Illustration";
// import diseaseLottie from '../../../assets/lottie/disease.json';

export default function ScreenOne() {
  return (
    <OnboardingSlide
      title="Capture or Upload"
      subtitle="Take a photo or choose from gallery. We optimize it for the best analysis."
      Illustration={<Illustration /* source={diseaseLottie} */ />}
      testID="onboarding-screen-1"
    />
  );
}
