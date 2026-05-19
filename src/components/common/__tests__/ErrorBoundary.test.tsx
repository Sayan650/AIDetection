import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBoundary } from '../ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Boom');
};

describe('ErrorBoundary', () => {
  it('catches errors and renders fallback', () => {
    const { getByTestId, getByText } = render(
      <ErrorBoundary fallbackMessage="Oops!">
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(getByTestId('error-boundary')).toBeTruthy();
    expect(getByText('Oops!')).toBeTruthy();
  });

  it('resets on retry', () => {
    const { getByTestId, rerender, queryByTestId } = render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    // Press retry
    fireEvent.press(getByTestId('error-boundary-retry'));

    // After reset, if we render a non-throwing child, it should show normal content
    rerender(
      <ErrorBoundary>
        <React.Fragment>
          <></>
        </React.Fragment>
      </ErrorBoundary>
    );

    expect(queryByTestId('error-boundary')).toBeNull();
  });
});
