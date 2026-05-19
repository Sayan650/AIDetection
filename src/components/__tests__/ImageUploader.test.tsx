import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert, Vibration } from 'react-native';
import { ImageUploader, ImageUploaderProps, ImageData } from '../ImageUploader';

// Mock react-native-image-picker
const mockLaunchImageLibrary = jest.fn();
const mockLaunchCamera = jest.fn();

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: (options: any, callback: any) => mockLaunchImageLibrary(options, callback),
  launchCamera: (options: any, callback: any) => mockLaunchCamera(options, callback),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Vibration
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Vibration: {
      vibrate: jest.fn(),
    },
    Alert: {
      alert: jest.fn(),
    },
  };
});

const mockImageData: ImageData = {
  uri: 'file://test-image.jpg',
  type: 'image/jpeg',
  fileName: 'test-image.jpg',
  fileSize: 1024000, // 1MB
  width: 800,
  height: 600,
};

const defaultProps: ImageUploaderProps = {
  onImageSelected: jest.fn(),
  testID: 'test-image-uploader',
};

describe('ImageUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders upload area when no image is selected', () => {
      const { getByTestId, getByText } = render(<ImageUploader {...defaultProps} />);
      
      expect(getByTestId('test-image-uploader-upload-area')).toBeTruthy();
      expect(getByText('Upload Image')).toBeTruthy();
      expect(getByText('Tap to select from camera or gallery')).toBeTruthy();
    });

    it('renders image preview when image is selected', () => {
      const { getByTestId, getByText } = render(
        <ImageUploader {...defaultProps} selectedImage={mockImageData} />
      );
      
      expect(getByTestId('test-image-uploader-preview')).toBeTruthy();
      expect(getByText('test-image.jpg')).toBeTruthy();
      expect(getByText('1000.0 KB')).toBeTruthy();
      expect(getByTestId('test-image-uploader-change-button')).toBeTruthy();
      expect(getByTestId('test-image-uploader-remove-button')).toBeTruthy();
    });

    it('shows loading state when processing image', () => {
      const { getByText, rerender } = render(<ImageUploader {...defaultProps} />);
      
      // Simulate loading state by triggering image selection
      const uploadArea = getByText('Upload Image');
      fireEvent.press(uploadArea);
      
      // Mock successful image selection that triggers loading
      act(() => {
        mockLaunchImageLibrary.mockImplementation((options, callback) => {
          callback({
            assets: [{
              uri: mockImageData.uri,
              type: mockImageData.type,
              fileName: mockImageData.fileName,
              fileSize: mockImageData.fileSize,
              width: mockImageData.width,
              height: mockImageData.height,
            }],
          });
        });
      });
      
      expect(getByText('Processing...')).toBeTruthy();
    });
  });

  describe('Image Selection Modal', () => {
    it('opens modal when upload area is pressed', () => {
      const { getByTestId } = render(<ImageUploader {...defaultProps} />);
      
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      expect(getByTestId('test-image-uploader-modal')).toBeTruthy();
      expect(getByTestId('test-image-uploader-camera-button')).toBeTruthy();
      expect(getByTestId('test-image-uploader-gallery-button')).toBeTruthy();
      expect(getByTestId('test-image-uploader-cancel-button')).toBeTruthy();
    });

    it('closes modal when cancel button is pressed', () => {
      const { getByTestId, queryByTestId } = render(<ImageUploader {...defaultProps} />);
      
      // Open modal
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      // Close modal
      const cancelButton = getByTestId('test-image-uploader-cancel-button');
      fireEvent.press(cancelButton);
      
      expect(queryByTestId('test-image-uploader-modal')).toBeFalsy();
    });
  });

  describe('Camera Functionality', () => {
    it('launches camera when camera button is pressed', () => {
      const { getByTestId } = render(<ImageUploader {...defaultProps} />);
      
      // Open modal
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      // Press camera button
      const cameraButton = getByTestId('test-image-uploader-camera-button');
      fireEvent.press(cameraButton);
      
      expect(mockLaunchCamera).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 1024,
          maxHeight: 1024,
          includeBase64: false,
        }),
        expect.any(Function)
      );
    });

    it('handles camera success response', async () => {
      const onImageSelected = jest.fn();
      const { getByTestId } = render(
        <ImageUploader {...defaultProps} onImageSelected={onImageSelected} />
      );
      
      // Open modal and press camera button
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      const cameraButton = getByTestId('test-image-uploader-camera-button');
      fireEvent.press(cameraButton);
      
      // Simulate successful camera response
      const callback = mockLaunchCamera.mock.calls[0][1];
      act(() => {
        callback({
          assets: [{
            uri: mockImageData.uri,
            type: mockImageData.type,
            fileName: mockImageData.fileName,
            fileSize: mockImageData.fileSize,
            width: mockImageData.width,
            height: mockImageData.height,
          }],
        });
      });
      
      await waitFor(() => {
        expect(onImageSelected).toHaveBeenCalledWith(mockImageData);
      });
    });

    it('handles camera cancellation', () => {
      const onImageSelected = jest.fn();
      const { getByTestId } = render(
        <ImageUploader {...defaultProps} onImageSelected={onImageSelected} />
      );
      
      // Open modal and press camera button
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      const cameraButton = getByTestId('test-image-uploader-camera-button');
      fireEvent.press(cameraButton);
      
      // Simulate camera cancellation
      const callback = mockLaunchCamera.mock.calls[0][1];
      act(() => {
        callback({ didCancel: true });
      });
      
      expect(onImageSelected).not.toHaveBeenCalled();
    });

    it('handles camera permission error', () => {
      const { getByTestId } = render(<ImageUploader {...defaultProps} />);
      
      // Open modal and press camera button
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      const cameraButton = getByTestId('test-image-uploader-camera-button');
      fireEvent.press(cameraButton);
      
      // Simulate permission error
      const callback = mockLaunchCamera.mock.calls[0][1];
      act(() => {
        callback({
          errorCode: 'permission',
          errorMessage: 'Camera permission denied',
        });
      });
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Camera Error',
        'Camera permission is required to take photos'
      );
    });
  });

  describe('Gallery Functionality', () => {
    it('launches gallery when gallery button is pressed', () => {
      const { getByTestId } = render(<ImageUploader {...defaultProps} />);
      
      // Open modal
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      // Press gallery button
      const galleryButton = getByTestId('test-image-uploader-gallery-button');
      fireEvent.press(galleryButton);
      
      expect(mockLaunchImageLibrary).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 1024,
          maxHeight: 1024,
          includeBase64: false,
          selectionLimit: 1,
        }),
        expect.any(Function)
      );
    });

    it('handles gallery success response', async () => {
      const onImageSelected = jest.fn();
      const { getByTestId } = render(
        <ImageUploader {...defaultProps} onImageSelected={onImageSelected} />
      );
      
      // Open modal and press gallery button
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      const galleryButton = getByTestId('test-image-uploader-gallery-button');
      fireEvent.press(galleryButton);
      
      // Simulate successful gallery response
      const callback = mockLaunchImageLibrary.mock.calls[0][1];
      act(() => {
        callback({
          assets: [{
            uri: mockImageData.uri,
            type: mockImageData.type,
            fileName: mockImageData.fileName,
            fileSize: mockImageData.fileSize,
            width: mockImageData.width,
            height: mockImageData.height,
          }],
        });
      });
      
      await waitFor(() => {
        expect(onImageSelected).toHaveBeenCalledWith(mockImageData);
      });
    });
  });

  describe('Image Validation', () => {
    it('validates file size and shows error for oversized images', () => {
      const { getByTestId } = render(
        <ImageUploader {...defaultProps} maxFileSize={500000} /> // 500KB limit
      );
      
      // Open modal and press gallery button
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      const galleryButton = getByTestId('test-image-uploader-gallery-button');
      fireEvent.press(galleryButton);
      
      // Simulate oversized image response
      const callback = mockLaunchImageLibrary.mock.calls[0][1];
      act(() => {
        callback({
          assets: [{
            ...mockImageData,
            fileSize: 1000000, // 1MB (exceeds 500KB limit)
          }],
        });
      });
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Invalid Image',
        'Image size must be less than 0.5MB'
      );
    });

    it('validates file type and shows error for unsupported types', () => {
      const { getByTestId } = render(<ImageUploader {...defaultProps} />);
      
      // Open modal and press gallery button
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      const galleryButton = getByTestId('test-image-uploader-gallery-button');
      fireEvent.press(galleryButton);
      
      // Simulate unsupported file type response
      const callback = mockLaunchImageLibrary.mock.calls[0][1];
      act(() => {
        callback({
          assets: [{
            ...mockImageData,
            type: 'image/gif', // Unsupported type
          }],
        });
      });
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Invalid Image',
        'Only image/jpeg, image/jpg, image/png files are supported'
      );
    });

    it('handles missing image data', () => {
      const { getByTestId } = render(<ImageUploader {...defaultProps} />);
      
      // Open modal and press gallery button
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      const galleryButton = getByTestId('test-image-uploader-gallery-button');
      fireEvent.press(galleryButton);
      
      // Simulate response with no assets
      const callback = mockLaunchImageLibrary.mock.calls[0][1];
      act(() => {
        callback({ assets: [] });
      });
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Invalid Image',
        'No image selected'
      );
    });
  });

  describe('Image Removal', () => {
    it('shows confirmation dialog when remove button is pressed', () => {
      const { getByTestId } = render(
        <ImageUploader {...defaultProps} selectedImage={mockImageData} />
      );
      
      const removeButton = getByTestId('test-image-uploader-remove-button');
      fireEvent.press(removeButton);
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Remove Image',
        'Are you sure you want to remove the selected image?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
          expect.objectContaining({ text: 'Remove', style: 'destructive' }),
        ])
      );
    });

    it('calls onImageSelected with null when removal is confirmed', () => {
      const onImageSelected = jest.fn();
      const { getByTestId } = render(
        <ImageUploader {...defaultProps} selectedImage={mockImageData} onImageSelected={onImageSelected} />
      );
      
      const removeButton = getByTestId('test-image-uploader-remove-button');
      fireEvent.press(removeButton);
      
      // Simulate user confirming removal
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const confirmButton = alertCall[2][1]; // Second button (Remove)
      confirmButton.onPress();
      
      expect(onImageSelected).toHaveBeenCalledWith(null);
    });
  });

  describe('Animations and Interactions', () => {
    it('triggers haptic feedback on press', () => {
      const { getByTestId } = render(<ImageUploader {...defaultProps} />);
      
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent(uploadArea, 'pressIn');
      
      expect(Vibration.vibrate).toHaveBeenCalledWith(50);
    });
  });

  describe('Custom Props', () => {
    it('uses custom compression quality', () => {
      const { getByTestId } = render(
        <ImageUploader {...defaultProps} compressionQuality={0.5} />
      );
      
      // Open modal and press camera button
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      const cameraButton = getByTestId('test-image-uploader-camera-button');
      fireEvent.press(cameraButton);
      
      expect(mockLaunchCamera).toHaveBeenCalledWith(
        expect.objectContaining({
          quality: 0.5,
        }),
        expect.any(Function)
      );
    });

    it('uses custom allowed types for validation', () => {
      const { getByTestId } = render(
        <ImageUploader {...defaultProps} allowedTypes={['image/png']} />
      );
      
      // Open modal and press gallery button
      const uploadArea = getByTestId('test-image-uploader-upload-area');
      fireEvent.press(uploadArea);
      
      const galleryButton = getByTestId('test-image-uploader-gallery-button');
      fireEvent.press(galleryButton);
      
      // Simulate JPEG image (not in allowed types)
      const callback = mockLaunchImageLibrary.mock.calls[0][1];
      act(() => {
        callback({
          assets: [{
            ...mockImageData,
            type: 'image/jpeg',
          }],
        });
      });
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Invalid Image',
        'Only image/png files are supported'
      );
    });
  });

  describe('Permission handling', () => {
    it('alerts when camera permission denied', async () => {
      const { getByTestId } = render(<ImageUploader {...defaultProps} />);

      // Open modal and press camera
      fireEvent.press(getByTestId('test-image-uploader-upload-area'));
      const cameraBtn = getByTestId('test-image-uploader-camera-button');

      // Mock permission denied by making launchCamera never called and simulating permission request returning denied
      // We cannot easily hook into PermissionsAndroid here, so rely on the component's Alert when permission denied path is taken via error mapping
      // Simulate callback error path
      mockLaunchCamera.mockImplementationOnce((opts: any, cb: any) => cb({ errorCode: 'permission', errorMessage: 'Denied' }));

      fireEvent.press(cameraBtn);
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Camera Error',
          'Camera permission is required to take photos'
        );
      });
    });

    it('alerts when gallery permission denied', async () => {
      const { getByTestId } = render(<ImageUploader {...defaultProps} />);

      // Open modal and press gallery
      fireEvent.press(getByTestId('test-image-uploader-upload-area'));
      const galleryBtn = getByTestId('test-image-uploader-gallery-button');

      mockLaunchImageLibrary.mockImplementationOnce((opts: any, cb: any) => cb({ errorCode: 'permission', errorMessage: 'Denied' }));

      fireEvent.press(galleryBtn);
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Gallery Error',
          'Gallery permission is required to select photos'
        );
      });
    });
  });
});