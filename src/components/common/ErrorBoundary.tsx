import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { Button } from './Button';

export type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallbackMessage?: string;
  onReset?: () => void;
  testID?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log error to monitoring if desired
    console.error('ErrorBoundary caught error:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    const { hasError } = this.state;
    const { children, fallbackMessage = 'Something went wrong.', testID } = this.props;

    if (hasError) {
      return (
        <View style={styles.container} testID={testID || 'error-boundary'}>
          <Text style={styles.title}>Unexpected Error</Text>
          <Text style={styles.message}>{fallbackMessage}</Text>
          <Button title="Try Again" variant="primary" onPress={this.reset} fullWidth testID={(testID || 'error-boundary') + '-retry'} />
        </View>
      );
    }

    return children as any;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg, justifyContent: 'center' },
  title: { color: theme.colors.text, fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, textAlign: 'center', marginBottom: theme.spacing.md },
  message: { color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.lg },
});
