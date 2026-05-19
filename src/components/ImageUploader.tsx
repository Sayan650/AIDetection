import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
  TouchableOpacity,
  Modal,
  Vibration,
  PermissionsAndroid,
} from "react-native";
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
  ImageLibraryOptions,
  CameraOptions,
} from "react-native-image-picker";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { theme } from "../constants/theme";
import { animations, springs } from "../constants/animations";
import { Button } from "./common/Button";
import { Card } from "./common/Card";

const { width: screenWidth } = Dimensions.get("window");
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export interface ImageData {
  uri: string;
  type: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  base64?: string;
}

export interface ImageUploaderProps {
  onImageSelected: (image: ImageData | null) => void;
  selectedImage?: ImageData | null;
  /** in bytes */
  maxFileSize?: number; // default 5MB
  /** allowed MIME types */
  allowedTypes?: string[];
  /** 0-1 */
  compressionQuality?: number; // default 0.8
  /** optional: hard cap for width/height downscale */
  maxDimension?: number; // default 1024
  testID?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  selectedImage,
  maxFileSize = 5 * 1024 * 1024,
  allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/heic",
    "image/heif",
  ],
  compressionQuality = 0.8,
  maxDimension = 1024,
  testID = "image-uploader",
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  /** ---------------- Permissions (Android) ---------------- */
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== "android") return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "We need access to your camera to take a photo.",
          buttonPositive: "OK",
          buttonNegative: "Cancel",
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          "Permission Required",
          "Camera permission was denied. You can enable it from Settings.",
        );
      }
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      Alert.alert(
        "Permission Error",
        "Unable to request camera permission. Please try again.",
      );
      return false;
    }
  }, []);

  const requestGalleryPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== "android") return true;

    const permission =
      (PermissionsAndroid as any).PERMISSIONS.READ_MEDIA_IMAGES ??
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    try {
      const granted = await PermissionsAndroid.request(permission, {
        title: "Photos Permission",
        message: "We need access to your photos to select an image.",
        buttonPositive: "OK",
        buttonNegative: "Cancel",
      });
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          "Permission Required",
          "Photos permission was denied. You can enable it from Settings.",
        );
      }
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      Alert.alert(
        "Permission Error",
        "Unable to request photos permission. Please try again.",
      );
      return false;
    }
  }, []);

  /** ---------------- Helpers ---------------- */
  const getMimeFromFilename = (name?: string) => {
    if (!name) return undefined;
    const ext = name.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "heic":
        return "image/heic";
      case "heif":
        return "image/heif";
      default:
        return undefined;
    }
  };

  const validateImage = useCallback(
    (response: ImagePickerResponse): string | null => {
      if (!response.assets || response.assets.length === 0) {
        return "No image selected";
      }
      const asset = response.assets[0];

      if (!asset.uri) {
        return "Invalid image file";
      }

      const size = asset.fileSize ?? 0;
      if (size && size > maxFileSize) {
        const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(1);
        return `Image size must be less than ${maxSizeMB}MB`;
      }

      const mime = asset.type ?? getMimeFromFilename(asset.fileName);
      if (mime && !allowedTypes.includes(mime)) {
        return `Only ${allowedTypes.join(", ")} files are supported`;
      }

      return null;
    },
    [maxFileSize, allowedTypes],
  );

  const ensureDimensions = useCallback(
    async (uri: string, width?: number, height?: number) => {
      // If RN provided dimensions are missing, probe via Image.getSize
      if (width && height) return { width, height };
      return new Promise<{ width: number; height: number }>((resolve) => {
        Image.getSize(
          uri,
          (w, h) => resolve({ width: w, height: h }),
          () => resolve({ width: 0, height: 0 }),
        );
      });
    },
    [],
  );

  const processImage = useCallback(
    async (response: ImagePickerResponse) => {
      setIsLoading(true);
      try {
        const validationError = validateImage(response);
        if (validationError) {
          Alert.alert("Invalid Image", validationError);
          return;
        }

        const asset = response.assets![0];

        // Downscale at source via picker options, but also enforce logical max
        // (If the picker already constrained, these values will be within bounds)
        const dims = await ensureDimensions(
          asset.uri!,
          asset.width,
          asset.height,
        );

        const imageData: ImageData = {
          uri: asset.uri!,
          type:
            asset.type ?? getMimeFromFilename(asset.fileName) ?? "image/jpeg",
          fileName: asset.fileName || `image_${Date.now()}.jpg`,
          fileSize: asset.fileSize || 0,
          width: Math.min(dims.width || maxDimension, maxDimension),
          height: Math.min(dims.height || maxDimension, maxDimension),
          base64: asset.base64,
        };

        onImageSelected(imageData);
      } catch (error) {
        console.error("processImage error", error);
        Alert.alert("Error", "Failed to process the selected image.");
      } finally {
        setIsLoading(false);
      }
    },
    [validateImage, ensureDimensions, onImageSelected, maxDimension],
  );

  /** ---------------- Launchers ---------------- */
  const handleCameraLaunch = useCallback(async () => {
    const granted = await requestCameraPermission();
    if (!granted) return;

    const options: CameraOptions = {
      mediaType: "photo" as MediaType,
      maxWidth: maxDimension,
      maxHeight: maxDimension,
      includeBase64: true,
      saveToPhotos: false,
    };

    setIsModalVisible(false);

    try {
      launchCamera(options, (response) => {
        if (response.didCancel) return;

        if (response.errorCode) {
          const map: Record<string, string> = {
            camera_unavailable: "Camera is not available on this device",
            permission: "Camera permission is required to take photos",
            others: response.errorMessage || "Camera error occurred",
          };
          Alert.alert("Camera Error", map[response.errorCode] || map.others);
          return;
        }
        processImage(response);
      });
    } catch (e) {
      Alert.alert("Camera Error", "An unexpected error occurred while opening the camera");
    }
  }, [maxDimension, processImage, requestCameraPermission]);

  const handleGalleryLaunch = useCallback(async () => {
    const granted = await requestGalleryPermission();
    if (!granted) return;

    const options: ImageLibraryOptions = {
      mediaType: "photo" as MediaType,
      maxWidth: maxDimension,
      maxHeight: maxDimension,
      includeBase64: true,
      selectionLimit: 1,
    };

    setIsModalVisible(false);

    try {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) return;

        if (response.errorCode) {
          const map: Record<string, string> = {
            permission: "Gallery permission is required to select photos",
            others: response.errorMessage || "Gallery error occurred",
          };
          Alert.alert("Gallery Error", map[response.errorCode] || map.others);
          return;
        }
        processImage(response);
      });
    } catch (e) {
      Alert.alert("Gallery Error", "An unexpected error occurred while opening the gallery");
    }
  }, [maxDimension, processImage, requestGalleryPermission]);

  /** ---------------- UI Animations ---------------- */
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(
      animations.buttonPress.scale.pressed,
      springs.snappy,
    );
    runOnJS(Vibration.vibrate)(50);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(
      animations.buttonPress.scale.released,
      springs.snappy,
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: withTiming(opacity.value, { duration: animations.fade.duration }),
  }));

  /** ---------------- Aspect Ratio + Sizing ---------------- */
  const getImageAspectRatio = useCallback(() => {
    if (!selectedImage || !selectedImage.width || !selectedImage.height)
      return 1;
    return selectedImage.width / selectedImage.height;
  }, [selectedImage]);

  const getImageDimensions = useCallback(() => {
    const maxWidth = screenWidth - theme.spacing.lg * 2;
    const maxHeight = 300;
    const aspectRatio = getImageAspectRatio();

    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return { width, height };
  }, [getImageAspectRatio]);

  /** ---------------- Render ---------------- */
  const handleRemoveImage = useCallback(() => {
    Alert.alert(
      "Remove Image",
      "Are you sure you want to remove the selected image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onImageSelected(null),
        },
      ],
    );
  }, [onImageSelected]);

  return (
    <View style={styles.container} testID={testID}>
      {selectedImage ? (
        <Card style={styles.imageContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={[styles.selectedImage, getImageDimensions()]}
            resizeMode="cover"
            testID={`${testID}-preview`}
          />
          <View style={styles.imageInfo}>
            <Text style={styles.imageInfoText} numberOfLines={1}>
              {selectedImage.fileName}
            </Text>
            <Text style={styles.imageInfoSubtext}>
              {selectedImage.fileSize
                ? `${(selectedImage.fileSize / 1024).toFixed(1)} KB`
                : "Size unknown"}
            </Text>
          </View>
          <View style={styles.imageActions}>
            <Button
              title="Change Image"
              onPress={() => setIsModalVisible(true)}
              variant="outline"
              size="sm"
              testID={`${testID}-change-button`}
            />
            <Button
              title="Remove"
              onPress={handleRemoveImage}
              variant="ghost"
              size="sm"
              testID={`${testID}-remove-button`}
            />
          </View>
        </Card>
      ) : (
        <AnimatedTouchableOpacity
          style={[animatedStyle, styles.uploadArea]}
          onPress={() => setIsModalVisible(true)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isLoading}
          testID={`${testID}-upload-area`}
        >
          <Text style={styles.uploadIcon}>📷</Text>
          <Text style={styles.uploadTitle}>
            {isLoading ? "Processing..." : "Upload Image"}
          </Text>
          <Text style={styles.uploadSubtitle}>
            Tap to select from camera or gallery
          </Text>
        </AnimatedTouchableOpacity>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
        testID={`${testID}-modal`}
        statusBarTranslucent
        presentationStyle="overFullScreen"
        hardwareAccelerated
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image</Text>
            <Text style={styles.modalSubtitle}>
              Choose how you'd like to add an image
            </Text>

            <View style={styles.modalActions}>
              <Button
                title="📷 Camera"
                onPress={handleCameraLaunch}
                variant="primary"
                fullWidth
                testID={`${testID}-camera-button`}
              />
              <Button
                title="🖼️ Gallery"
                onPress={handleGalleryLaunch}
                variant="secondary"
                fullWidth
                testID={`${testID}-gallery-button`}
              />
              <Button
                title="Cancel"
                onPress={() => setIsModalVisible(false)}
                variant="ghost"
                fullWidth
                testID={`${testID}-cancel-button`}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  uploadArea: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  uploadIcon: { fontSize: 48, marginBottom: theme.spacing.md },
  uploadTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  uploadSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  imageContainer: { padding: theme.spacing.md },
  selectedImage: { borderRadius: theme.borderRadius.md, alignSelf: "center" },
  imageInfo: { marginTop: theme.spacing.md, alignItems: "center" },
  imageInfoText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    textAlign: "center",
    maxWidth: "100%",
  },
  imageInfoSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  imageActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  modalContent: { width: "100%", maxWidth: 400, padding: theme.spacing.xl },
  modalTitle: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  modalSubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  modalActions: { gap: theme.spacing.md },
});
