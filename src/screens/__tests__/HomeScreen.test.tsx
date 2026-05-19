import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import HomeScreen from '../HomeScreen';
import { mockApiService } from '../../services/mockApi';

jest.mock('../../services/mockApi', () => {
  const original = jest.requireActual('../../services/mockApi');
  return {
    ...original,
    mockApiService: {
      ...original.mockApiService,
      detectDisease: jest.fn().mockResolvedValue({
        disease: 'Powdery Mildew',
        confidence: 0.91,
        timestamp: new Date().toISOString(),
      }),
    },
  };
});

// Provide a helper to directly call onImageSelected prop from ImageUploader
jest.mock('../../components/ImageUploader', () => {
  const React = require('react');
  const { View, Text, Button } = require('react-native');
  return {
    ImageUploader: ({ onImageSelected, selectedImage, testID }: any) => (
      <View testID={testID}>
        <Text>{selectedImage ? 'Has Image' : 'No Image'}</Text>
        <Button
          title="Mock Select"
          onPress={() =>
            onImageSelected({
              uri: 'file://image.jpg',
              type: 'image/jpeg',
              fileName: 'image.jpg',
              fileSize: 1024,
              width: 100,
              height: 100,
            })
          }
          testID="mock-select"
        />
      </View>
    ),
  };
});

describe('HomeScreen', () => {
  const setup = () => {
    const navigation = { navigate: jest.fn() } as any;
    const utils = render(<HomeScreen navigation={navigation} />);
    return { ...utils, navigation };
  };

  beforeEach(() => jest.clearAllMocks());

  it('initially disables submit button', () => {
    const { getByTestId } = setup();
    const submit = getByTestId('home-submit');
    expect(submit.props.disabled).toBe(true);
  });

  it('enables submit after image selection', () => {
    const { getByTestId } = setup();
    fireEvent.press(getByTestId('mock-select'));
    const submit = getByTestId('home-submit');
    expect(submit.props.disabled).toBe(false);
  });

  it('calls API and navigates to Result on success', async () => {
    const { getByTestId, navigation } = setup();
    fireEvent.press(getByTestId('mock-select'));
    fireEvent.press(getByTestId('home-submit'));

    await waitFor(() => {
      expect(mockApiService.detectDisease).toHaveBeenCalled();
      expect(navigation.navigate).toHaveBeenCalledWith(
        'Result',
        expect.objectContaining({
          disease: expect.any(String),
          confidence: expect.any(Number),
          image: 'file://image.jpg',
        }),
      );
    });
  });

  it('shows loading state while submitting', async () => {
    (mockApiService.detectDisease as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({ disease: 'X', confidence: 0.5, timestamp: new Date().toISOString() }), 50))
    );

    const { getByTestId, queryByTestId } = setup();
    fireEvent.press(getByTestId('mock-select'));
    fireEvent.press(getByTestId('home-submit'));

    expect(getByTestId('home-submit')).toBeTruthy();
    expect(getByTestId('home-submitting')).toBeTruthy();

    await waitFor(() => {
      expect(queryByTestId('home-submitting')).toBeNull();
    });
  });

  it('handles API errors and shows feedback', async () => {
    (mockApiService.detectDisease as jest.Mock).mockRejectedValueOnce(
      new Error(JSON.stringify({ code: 'NETWORK_ERROR', message: 'Network connection failed' }))
    );

    const { getByTestId, findByTestId } = setup();
    fireEvent.press(getByTestId('mock-select'));
    fireEvent.press(getByTestId('home-submit'));

    const errorText = await findByTestId('home-error');
    expect(errorText.props.children).toBe('Network connection failed');
  });

  it('clears image and disables submit again', () => {
    const { getByTestId } = setup();
    fireEvent.press(getByTestId('mock-select'));
    fireEvent.press(getByTestId('mock-clear'));
    const submit = getByTestId('home-submit');
    expect(submit.props.disabled).toBe(true);
  });
});

describe('HomeScreen - Error handling and retry', () => {
  const setup = () => {
    const navigation = { navigate: jest.fn() } as any;
    const utils = render(<HomeScreen navigation={navigation} />);
    return { ...utils, navigation };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('shows retry button in alert for retryable errors', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    (mockApiService.detectDisease as jest.Mock)
      .mockRejectedValueOnce(new Error(JSON.stringify({ code: 'NETWORK_ERROR', message: 'Network connection failed' })))
      .mockRejectedValueOnce(new Error(JSON.stringify({ code: 'NETWORK_ERROR', message: 'Network connection failed' })))
      .mockRejectedValueOnce(new Error(JSON.stringify({ code: 'NETWORK_ERROR', message: 'Network connection failed' })));

    const { getByTestId, findByTestId } = setup();
    fireEvent.press(getByTestId('mock-select'));
    fireEvent.press(getByTestId('home-submit'));

    // Wait until error is shown after retries
    const errorText = await findByTestId('home-error');
    expect(errorText.props.children).toBe('Network connection failed');

    expect(Alert.alert).toHaveBeenCalled();
    const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertArgs[2] || [];
    expect(buttons.find((b: any) => b.text === 'Retry')).toBeTruthy();
  });

  it('does not show retry for non-retryable errors', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    (mockApiService.detectDisease as jest.Mock)
      .mockRejectedValueOnce(new Error(JSON.stringify({ code: 'INVALID_IMAGE', message: 'Invalid image format' })));

    const { getByTestId, findByTestId } = setup();
    fireEvent.press(getByTestId('mock-select'));
    fireEvent.press(getByTestId('home-submit'));

    const errorText = await findByTestId('home-error');
    expect(errorText.props.children).toBe('Invalid image format');

    const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertArgs[2] || [];
    expect(buttons.find((b: any) => b.text === 'Retry')).toBeFalsy();
  });

  it('invokes submit again when pressing Retry', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    (mockApiService.detectDisease as jest.Mock)
      .mockRejectedValueOnce(new Error(JSON.stringify({ code: 'NETWORK_ERROR', message: 'Network connection failed' })))
      .mockRejectedValueOnce(new Error(JSON.stringify({ code: 'NETWORK_ERROR', message: 'Network connection failed' })))
      .mockRejectedValueOnce(new Error(JSON.stringify({ code: 'NETWORK_ERROR', message: 'Network connection failed' })))
      .mockResolvedValueOnce({ disease: 'X', confidence: 0.5, timestamp: new Date().toISOString() });

    const { getByTestId } = setup();
    fireEvent.press(getByTestId('mock-select'));
    fireEvent.press(getByTestId('home-submit'));

    // Simulate tapping Retry on Alert
    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
    const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertArgs[2] || [];
    const retryBtn = buttons.find((b: any) => b.text === 'Retry');
    expect(retryBtn).toBeTruthy();

    act(() => {
      retryBtn.onPress();
    });

    // After pressing Retry, detectDisease should be called again
    await waitFor(() => expect((mockApiService.detectDisease as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(4));
  });

  it('attempts up to 3 times automatically on network errors', async () => {
    jest.useFakeTimers();
    (mockApiService.detectDisease as jest.Mock)
      .mockRejectedValueOnce(new Error(JSON.stringify({ code: 'NETWORK_ERROR', message: 'Network connection failed' })))
      .mockRejectedValueOnce(new Error(JSON.stringify({ code: 'NETWORK_ERROR', message: 'Network connection failed' })))
      .mockRejectedValueOnce(new Error(JSON.stringify({ code: 'NETWORK_ERROR', message: 'Network connection failed' })));

    const { getByTestId, findByTestId } = setup();
    fireEvent.press(getByTestId('mock-select'));
    fireEvent.press(getByTestId('home-submit'));

    // Advance timers for backoff (500ms + 1000ms)
    act(() => {
      jest.advanceTimersByTime(1600);
    });

    const errorText = await findByTestId('home-error');
    expect(errorText).toBeTruthy();
    expect((mockApiService.detectDisease as jest.Mock).mock.calls.length).toBe(3);

    jest.useRealTimers();
  });
});
