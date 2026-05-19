import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      const { getByTestId } = render(
        <LoadingSpinner testID="default-spinner" />
      );
      
      expect(getByTestId('default-spinner')).toBeTruthy();
      expect(getByTestId('default-spinner-spinner')).toBeTruthy();
    });

    it('renders with custom testID', () => {
      const { getByTestId } = render(
        <LoadingSpinner testID="custom-spinner" />
      );
      
      expect(getByTestId('custom-spinner')).toBeTruthy();
      expect(getByTestId('custom-spinner-spinner')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      const { getByTestId } = render(
        <LoadingSpinner size="sm" testID="small-spinner" />
      );
      
      const spinner = getByTestId('small-spinner-spinner');
      expect(spinner.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: 16,
            height: 16,
            borderRadius: 8,
          })
        ])
      );
    });

    it('renders medium size correctly', () => {
      const { getByTestId } = render(
        <LoadingSpinner size="md" testID="medium-spinner" />
      );
      
      const spinner = getByTestId('medium-spinner-spinner');
      expect(spinner.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: 24,
            height: 24,
            borderRadius: 12,
          })
        ])
      );
    });

    it('renders large size correctly', () => {
      const { getByTestId } = render(
        <LoadingSpinner size="lg" testID="large-spinner" />
      );
      
      const spinner = getByTestId('large-spinner-spinner');
      expect(spinner.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: 32,
            height: 32,
            borderRadius: 16,
          })
        ])
      );
    });

    it('renders extra large size correctly', () => {
      const { getByTestId } = render(
        <LoadingSpinner size="xl" testID="xl-spinner" />
      );
      
      const spinner = getByTestId('xl-spinner-spinner');
      expect(spinner.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: 48,
            height: 48,
            borderRadius: 24,
          })
        ])
      );
    });
  });

  describe('Color', () => {
    it('applies custom color correctly', () => {
      const customColor = '#ff0000';
      const { getByTestId } = render(
        <LoadingSpinner color={customColor} testID="colored-spinner" />
      );
      
      const spinner = getByTestId('colored-spinner-spinner');
      expect(spinner.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            borderTopColor: customColor,
            borderRightColor: customColor,
          })
        ])
      );
    });

    it('uses default color when not specified', () => {
      const { getByTestId } = render(
        <LoadingSpinner testID="default-color-spinner" />
      );
      
      const spinner = getByTestId('default-color-spinner-spinner');
      expect(spinner.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            borderTopColor: '#6366f1',
            borderRightColor: '#6366f1',
          })
        ])
      );
    });
  });

  describe('Thickness', () => {
    it('applies custom thickness correctly', () => {
      const customThickness = 5;
      const { getByTestId } = render(
        <LoadingSpinner thickness={customThickness} testID="thick-spinner" />
      );
      
      const spinner = getByTestId('thick-spinner-spinner');
      expect(spinner.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            borderWidth: customThickness,
          })
        ])
      );
    });

    it('uses default thickness when not specified', () => {
      const { getByTestId } = render(
        <LoadingSpinner testID="default-thickness-spinner" />
      );
      
      const spinner = getByTestId('default-thickness-spinner-spinner');
      expect(spinner.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            borderWidth: 3,
          })
        ])
      );
    });
  });

  describe('Custom Styling', () => {
    it('applies custom style prop', () => {
      const customStyle = { marginTop: 20, opacity: 0.8 };
      const { getByTestId } = render(
        <LoadingSpinner style={customStyle} testID="custom-style-spinner" />
      );
      
      const container = getByTestId('custom-style-spinner');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining(customStyle)
        ])
      );
    });
  });

  describe('Border Properties', () => {
    it('sets transparent border color for sides', () => {
      const { getByTestId } = render(
        <LoadingSpinner testID="border-spinner" />
      );
      
      const spinner = getByTestId('border-spinner-spinner');
      expect(spinner.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            borderColor: 'transparent',
          })
        ])
      );
    });

    it('creates circular shape with border radius', () => {
      const { getByTestId } = render(
        <LoadingSpinner size="md" testID="circular-spinner" />
      );
      
      const spinner = getByTestId('circular-spinner-spinner');
      expect(spinner.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: 24,
            height: 24,
            borderRadius: 12,
          })
        ])
      );
    });
  });
});