export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  ImageUpload: undefined;
  Result: {
    disease: string;
    confidence: number;
    image: string;
  };
};

// Screen prop helpers
export type ScreenName = keyof RootStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}