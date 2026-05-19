import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, Alert, Vibration } from "react-native";
import { theme } from "../constants/theme";
import { Button } from "../components/common/Button";
import { ImageUploader, ImageData as PickerImageData } from "../components/ImageUploader";
import { geminiApiService } from "../services/geminiApi";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export default function HomeScreen({ navigation }: any) {
  const [image, setImage] = useState<PickerImageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const canSubmit = useMemo(() => !!image && !loading, [image, loading]);

  const parseApiError = (e: any): { code?: string; message: string } => {
    try {
      const parsed = JSON.parse(e?.message ?? "{}");
      return { code: parsed?.code, message: parsed?.message || "Failed to upload image." };
    } catch {
      return { message: "Failed to upload image." };
    }
  };

  const retryable = (code?: string) => code === 'NETWORK_ERROR' || code === 'SERVER_ERROR' || code === 'RATE_LIMIT';

  const handleSubmit = useCallback(async () => {
    if (!image) return;
    setLoading(true);
    Vibration.vibrate(50);
    setError(null);

    let attempts = 0;
    let lastErr: any = null;

    while (attempts < 3) {
      try {
        const result = await geminiApiService.detectDisease({
          uri: image.uri,
          type: image.type,
          fileName: image.fileName,
          fileSize: image.fileSize,
          width: image.width,
          height: image.height,
          base64: image.base64,
        });

        navigation.navigate("Result", {
          disease: result.disease,
          confidence: result.confidence,
          image: image.uri,
        });
        setRetryCount(0);
        return;
      } catch (e: any) {
        const { code, message } = parseApiError(e);
        lastErr = { code, message };
        if (retryable(code) && attempts < 2) {
          // Exponential backoff: 500ms, 1000ms
          const delay = 500 * Math.pow(2, attempts);
          await new Promise((r) => setTimeout(r, delay));
          attempts += 1;
          continue;
        } else {
          break;
        }
      }
    }

    const finalMessage = lastErr?.message || "Failed to upload image.";
    setError(finalMessage);
    Alert.alert("Upload Error", finalMessage, [
      retryable(lastErr?.code)
        ? {
            text: "Retry",
            onPress: () => {
              setRetryCount((c) => c + 1);
              // re-run
              handleSubmit();
            },
          }
        : { text: "OK" },
    ]);
    setLoading(false);
  }, [image, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="home-title">Disease Detection</Text>
      <Text style={styles.subtitle}>Upload a disease image to detect possible diseases.</Text>

      <View style={styles.content}>
        <ImageUploader
          onImageSelected={setImage}
          selectedImage={image}
          testID="image-uploader"
        />

        {error ? (
          <Text style={styles.errorText} testID="home-error">{error}</Text>
        ) : null}

        {loading ? (
          <View style={{ alignItems: 'center' }}>
            <LoadingSpinner size="lg" testID="home-submitting" />
          </View>
        ) : null}

        <Button
          title={loading ? "Submitting" : "Submit"}
          onPress={handleSubmit}
          disabled={!canSubmit}
          loading={loading}
          variant="primary"
          fullWidth
          testID="home-submit"
          style={styles.submitBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: theme.spacing.xl,
  },
  subtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  content: { gap: theme.spacing.lg },
  submitBtn: { marginTop: theme.spacing.lg },
  errorText: { color: theme.colors.error || "#ef4444", textAlign: "center" },
  loadingText: { color: theme.colors.textSecondary, textAlign: "center" },
});
