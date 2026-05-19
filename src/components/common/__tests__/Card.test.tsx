import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '../Card';

describe('Card Component', () => {
  const TestContent = () => <Text>Test Content</Text>;

  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      const { getByText } = render(
        <Card>
          <TestContent />
        </Card>
      );
      
      expect(getByText('Test Content')).toBeTruthy();
    });

    it('renders with custom testID', () => {
      const { getByTestId } = render(
        <Card testID="custom-card">
          <TestContent />
        </Card>
      );
      
      expect(getByTestId('custom-card')).toBeTruthy();
    });

    it('renders children correctly', () => {
      const { getByText } = render(
        <Card>
          <Text>First Child</Text>
          <Text>Second Child</Text>
        </Card>
      );
      
      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
    });
  });

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      const { getByTestId } = render(
        <Card variant="default" testID="default-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('default-card');
      expect(card).toBeTruthy();
    });

    it('renders elevated variant correctly', () => {
      const { getByTestId } = render(
        <Card variant="elevated" testID="elevated-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('elevated-card');
      expect(card).toBeTruthy();
    });

    it('renders outlined variant correctly', () => {
      const { getByTestId } = render(
        <Card variant="outlined" testID="outlined-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('outlined-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            borderWidth: 1,
            borderColor: '#334155'
          })
        ])
      );
    });
  });

  describe('Padding', () => {
    it('applies no padding when padding is none', () => {
      const { getByTestId } = render(
        <Card padding="none" testID="no-padding-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('no-padding-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.not.objectContaining({ padding: expect.any(Number) })
        ])
      );
    });

    it('applies small padding correctly', () => {
      const { getByTestId } = render(
        <Card padding="sm" testID="small-padding-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('small-padding-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ padding: 8 })
        ])
      );
    });

    it('applies medium padding correctly', () => {
      const { getByTestId } = render(
        <Card padding="md" testID="medium-padding-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('medium-padding-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ padding: 16 })
        ])
      );
    });

    it('applies large padding correctly', () => {
      const { getByTestId } = render(
        <Card padding="lg" testID="large-padding-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('large-padding-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ padding: 24 })
        ])
      );
    });
  });

  describe('Border Radius', () => {
    it('applies small border radius correctly', () => {
      const { getByTestId } = render(
        <Card borderRadius="sm" testID="small-radius-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('small-radius-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderRadius: 8 })
        ])
      );
    });

    it('applies large border radius correctly', () => {
      const { getByTestId } = render(
        <Card borderRadius="lg" testID="large-radius-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('large-radius-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderRadius: 16 })
        ])
      );
    });
  });

  describe('Full Width', () => {
    it('applies full width when fullWidth is true', () => {
      const { getByTestId } = render(
        <Card fullWidth testID="full-width-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('full-width-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '100%' })
        ])
      );
    });

    it('does not apply full width when fullWidth is false', () => {
      const { getByTestId } = render(
        <Card fullWidth={false} testID="not-full-width-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('not-full-width-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.not.objectContaining({ width: '100%' })
        ])
      );
    });
  });

  describe('Background Color', () => {
    it('applies custom background color', () => {
      const customColor = '#ff0000';
      const { getByTestId } = render(
        <Card backgroundColor={customColor} testID="custom-bg-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('custom-bg-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: customColor })
        ])
      );
    });

    it('uses default background color when not specified', () => {
      const { getByTestId } = render(
        <Card testID="default-bg-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('default-bg-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: '#1e293b' })
        ])
      );
    });
  });

  describe('Custom Styling', () => {
    it('applies custom style prop', () => {
      const customStyle = { marginTop: 20, opacity: 0.8 };
      const { getByTestId } = render(
        <Card style={customStyle} testID="custom-style-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('custom-style-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining(customStyle)
        ])
      );
    });
  });

  describe('Elevation', () => {
    it('applies elevation none correctly', () => {
      const { getByTestId } = render(
        <Card elevation="none" testID="no-elevation-card">
          <TestContent />
        </Card>
      );
      
      const card = getByTestId('no-elevation-card');
      expect(card).toBeTruthy();
    });

    it('renders with different elevation levels', () => {
      const elevations = ['sm', 'md', 'lg', 'xl'] as const;
      
      elevations.forEach((elevation) => {
        const { getByTestId } = render(
          <Card elevation={elevation} testID={`${elevation}-elevation-card`}>
            <TestContent />
          </Card>
        );
        
        expect(getByTestId(`${elevation}-elevation-card`)).toBeTruthy();
      });
    });
  });
});