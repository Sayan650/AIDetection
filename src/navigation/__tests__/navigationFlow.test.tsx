import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../AppNavigator';
import { onboardingStorage } from '../../utils/storage';

jest.mock('../../utils/storage', () => {
  const actual = jest.requireActual('../../utils/storage');
  return {
    ...actual,
    onboardingStorage: {
      ...actual.onboardingStorage,
      isCompleted: jest.fn().mockResolvedValue(false),
    },
  };
});

describe('Navigation Flow', () => {
  beforeEach(() => jest.clearAllMocks());

  it('routes to Onboarding when not completed', async () => {
    (onboardingStorage.isCompleted as jest.Mock).mockResolvedValueOnce(false);
    const { findByTestId } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    // The onboarding list is a stable testID in screen
    const list = await findByTestId('onboarding-list');
    expect(list).toBeTruthy();
  });

  it('routes to Home when onboarding is completed', async () => {
    (onboardingStorage.isCompleted as jest.Mock).mockResolvedValueOnce(true);
    const { findByTestId, queryByTestId } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    // HomeScreen contains title testID
    const title = await findByTestId('home-title');
    expect(title).toBeTruthy();
    expect(queryByTestId('onboarding-list')).toBeNull();
  });
});
