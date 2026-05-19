import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export type RootStackNav<T extends keyof RootStackParamList = keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

export type RootRoute<T extends keyof RootStackParamList = keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>;

// Convenience helpers
export const navigateToResult = (
  navigation: RootStackNav,
  params: RootStackParamList['Result']
) => navigation.navigate('Result', params);

export const resetToHome = (navigation: RootStackNav) =>
  navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

export const replaceWithHome = (navigation: RootStackNav) =>
  navigation.replace('Home');
