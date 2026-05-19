import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Onboarding from '../Onboarding';
import { onboardingStorage } from '../../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../../utils/storage', () => {
  const original = jest.requireActual('../../utils/storage');
  return {
    ...original,
    onboardingStorage: {
      ...original.onboardingStorage,
      setCompleted: jest.fn().mockResolvedValue(undefined),
    },
  };
});

describe('Onboarding Screen', () => {
  const setup = () => {
    const navigation = { replace: jest.fn() } as any;
    const utils = render(<Onboarding navigation={navigation} />);
    return { ...utils, navigation };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore - using mock methods provided by jest-async-storage
    AsyncStorage.clear();
  });

  it('renders first screen with Skip and Next', () => {
    const { getByTestId, getByText } = setup();
    expect(getByTestId('btn-skip')).toBeTruthy();
    expect(getByTestId('btn-next')).toBeTruthy();
    expect(getByText('1/3')).toBeTruthy();
  });

  it('navigates to next screens with Next button and shows Get Started on last', async () => {
    const { getByTestId, queryByTestId, getByText } = setup();

    fireEvent.press(getByTestId('btn-next'));
    expect(getByText('2/3')).toBeTruthy();

    fireEvent.press(getByTestId('btn-next'));

    await waitFor(() => {
      expect(queryByTestId('btn-next')).toBeNull();
      expect(getByTestId('btn-start')).toBeTruthy();
    });
  });

  it('completes onboarding and navigates when Skip is pressed', async () => {
    const { getByTestId, navigation } = setup();

    fireEvent.press(getByTestId('btn-skip'));

    await waitFor(() => {
      expect(onboardingStorage.setCompleted).toHaveBeenCalled();
      expect(navigation.replace).toHaveBeenCalledWith('Home');
    });
  });

  it('completes onboarding and navigates when Get Started is pressed', async () => {
    const { getByTestId, navigation } = setup();

    // Move to last screen
    fireEvent.press(getByTestId('btn-next'));
    fireEvent.press(getByTestId('btn-next'));

    const startBtn = getByTestId('btn-start');
    fireEvent.press(startBtn);

    await waitFor(() => {
      expect(onboardingStorage.setCompleted).toHaveBeenCalled();
      expect(navigation.replace).toHaveBeenCalledWith('Home');
    });
  });

  it('exposes swipeable list with paging', () => {
    const { getByTestId } = setup();
    const list = getByTestId('onboarding-list');
    expect(list.props.horizontal).toBe(true);
    expect(list.props.pagingEnabled).toBe(true);
  });
});
