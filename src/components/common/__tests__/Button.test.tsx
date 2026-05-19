import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      const { getByText } = render(
        <Button title="Test Button" onPress={mockOnPress} />
      );
      
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('renders with custom testID', () => {
      const { getByTestId } = render(
        <Button title="Test Button" onPress={mockOnPress} testID="custom-button" />
      );
      
      expect(getByTestId('custom-button')).toBeTruthy();
      expect(getByTestId('custom-button-text')).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      const { getByTestId, queryByText } = render(
        <Button 
          title="Loading Button" 
          onPress={mockOnPress} 
          loading 
          testID="loading-button" 
        />
      );
      
      expect(getByTestId('loading-button-loading')).toBeTruthy();
      expect(queryByText('Loading Button')).toBeNull();
    });

    it('does not call onPress when loading', () => {
      const { getByTestId } = render(
        <Button 
          title="Loading Button" 
          onPress={mockOnPress} 
          loading 
          testID="loading-button" 
        />
      );
      
      fireEvent.press(getByTestId('loading-button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('does not call onPress when disabled', () => {
      const { getByTestId } = render(
        <Button 
          title="Disabled Button" 
          onPress={mockOnPress} 
          disabled 
          testID="disabled-button" 
        />
      );
      
      fireEvent.press(getByTestId('disabled-button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Press Interactions', () => {
    it('calls onPress when pressed', () => {
      const { getByTestId } = render(
        <Button 
          title="Press Button" 
          onPress={mockOnPress} 
          testID="press-button" 
        />
      );
      
      fireEvent.press(getByTestId('press-button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Variants', () => {
    it('renders different variants without errors', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const;
      
      variants.forEach((variant) => {
        const { getByText } = render(
          <Button 
            title={`${variant} Button`} 
            onPress={mockOnPress} 
            variant={variant}
          />
        );
        
        expect(getByText(`${variant} Button`)).toBeTruthy();
      });
    });
  });

  describe('Sizes', () => {
    it('renders different sizes without errors', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      
      sizes.forEach((size) => {
        const { getByText } = render(
          <Button 
            title={`${size} Button`} 
            onPress={mockOnPress} 
            size={size}
          />
        );
        
        expect(getByText(`${size} Button`)).toBeTruthy();
      });
    });
  });
});