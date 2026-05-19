import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ResultScreen from '../ResultScreen';
import { Share } from 'react-native';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Share: { share: jest.fn().mockResolvedValue({ action: 'sharedAction' }) },
  };
});

describe('ResultScreen', () => {
  const baseParams = {
    disease: 'Powdery Mildew',
    confidence: 0.91,
    image: 'file://image.jpg',
  };

  const setup = (params: any = baseParams) => {
    const navigation = { replace: jest.fn(), navigate: jest.fn() } as any;
    const route = { params } as any;
    const utils = render(<ResultScreen navigation={navigation} route={route} />);
    return { ...utils, navigation };
  };

  beforeEach(() => jest.clearAllMocks());

  it('renders result data when params are valid', () => {
    const { getByTestId } = setup();
    expect(getByTestId('result-title')).toBeTruthy();
    expect(getByTestId('result-image')).toBeTruthy();
    expect(getByTestId('result-disease').props.children).toBe('Powdery Mildew');
    expect(getByTestId('result-confidence').props.children.join('')).toContain('91%');
  });

  it('navigates back to Home on Try Again', () => {
    const { getByTestId, navigation } = setup();
    fireEvent.press(getByTestId('btn-try-again'));
    expect(navigation.replace).toHaveBeenCalledWith('Home');
  });

  it('handles missing/invalid params and shows error state', () => {
    const { getByTestId } = setup({});
    expect(getByTestId('result-error')).toBeTruthy();
  });

  it('shares result when Share button pressed', async () => {
    const { getByTestId } = setup();
    fireEvent.press(getByTestId('btn-share'));
    expect(Share.share).toHaveBeenCalled();
  });
});
