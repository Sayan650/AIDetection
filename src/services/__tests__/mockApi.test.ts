/**
 * Tests for Mock API Service
 */

import { mockApiService, MockApiService, ImageData, DiagnosisResponse } from '../mockApi';

// Mock image data for testing
const validImageData: ImageData = {
  uri: 'file://test-image.jpg',
  type: 'image/jpeg',
  fileName: 'test-image.jpg',
  fileSize: 1024 * 1024, // 1MB
  width: 800,
  height: 600
};

const invalidImageData: ImageData = {
  uri: '',
  type: 'image/gif',
  fileName: 'test.gif',
  fileSize: 15 * 1024 * 1024, // 15MB (too large)
  width: 800,
  height: 600
};

describe('MockApiService', () => {
  let apiService: MockApiService;

  beforeEach(() => {
    apiService = new MockApiService();
    // Set error rate to 0 for predictable testing
    apiService.setErrorRate(0);
    // Set shorter delays for faster tests
    apiService.setDelayRange(100, 200);
  });

  describe('detectDisease', () => {
    it('should return a valid diagnosis response for valid image', async () => {
      const response = await apiService.detectDisease(validImageData);
      
      expect(response).toBeDefined();
      expect(response.disease).toBeTruthy();
      expect(response.confidence).toBeGreaterThan(0);
      expect(response.confidence).toBeLessThanOrEqual(1);
      expect(response.timestamp).toBeTruthy();
      expect(Array.isArray(response.recommendations)).toBe(true);
    });

    it('should include realistic delay', async () => {
      const startTime = Date.now();
      await apiService.detectDisease(validImageData);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });

    it('should throw error for invalid image URI', async () => {
      const invalidImage = { ...validImageData, uri: '' };
      
      await expect(apiService.detectDisease(invalidImage)).rejects.toThrow();
    });

    it('should throw error for oversized image', async () => {
      const oversizedImage = { ...validImageData, fileSize: 15 * 1024 * 1024 };
      
      await expect(apiService.detectDisease(oversizedImage)).rejects.toThrow();
    });

    it('should throw error for invalid image type', async () => {
      const invalidTypeImage = { ...validImageData, type: 'image/gif' };
      
      await expect(apiService.detectDisease(invalidTypeImage)).rejects.toThrow();
    });

    it('should simulate errors when error rate is set', async () => {
      // Set 100% error rate for testing
      apiService.setErrorRate(1.0);
      
      await expect(apiService.detectDisease(validImageData)).rejects.toThrow();
    });

    it('should return different responses for multiple calls', async () => {
      const response1 = await apiService.detectDisease(validImageData);
      const response2 = await apiService.detectDisease(validImageData);
      
      // Responses might be different due to randomization
      expect(response1.timestamp).not.toBe(response2.timestamp);
    });
  });

  describe('detectDiseases (batch)', () => {
    it('should process multiple images', async () => {
      const images = [validImageData, validImageData];
      const responses = await apiService.detectDiseases(images);
      
      expect(responses).toHaveLength(2);
      responses.forEach(response => {
        expect(response.disease).toBeTruthy();
        expect(response.confidence).toBeGreaterThan(0);
      });
    });

    it('should handle mixed valid and invalid images', async () => {
      const images = [validImageData, invalidImageData];
      const responses = await apiService.detectDiseases(images);
      
      // Should return at least one valid response
      expect(responses.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getServiceStatus', () => {
    it('should return service status', async () => {
      const status = await apiService.getServiceStatus();
      
      expect(status.status).toBe('healthy');
      expect(status.version).toBeTruthy();
      expect(typeof status.uptime).toBe('number');
    });
  });

  describe('configuration methods', () => {
    it('should allow setting error rate', () => {
      apiService.setErrorRate(0.5);
      // Error rate is private, but we can test it doesn't throw
      expect(() => apiService.setErrorRate(0.5)).not.toThrow();
    });

    it('should allow setting delay range', () => {
      apiService.setDelayRange(500, 1000);
      // Delay range is private, but we can test it doesn't throw
      expect(() => apiService.setDelayRange(500, 1000)).not.toThrow();
    });

    it('should handle invalid error rate values', () => {
      expect(() => apiService.setErrorRate(-0.1)).not.toThrow();
      expect(() => apiService.setErrorRate(1.5)).not.toThrow();
    });

    it('should handle invalid delay values', () => {
      expect(() => apiService.setDelayRange(-100, 500)).not.toThrow();
      expect(() => apiService.setDelayRange(1000, 500)).not.toThrow();
    });
  });

  describe('error scenarios', () => {
    it('should provide detailed error information', async () => {
      apiService.setErrorRate(1.0); // Force errors
      
      try {
        await apiService.detectDisease(validImageData);
      } catch (error) {
        const errorData = JSON.parse((error as Error).message);
        expect(errorData.code).toBeTruthy();
        expect(errorData.message).toBeTruthy();
      }
    });
  });
});

describe('Singleton instance', () => {
  it('should export a singleton instance', () => {
    expect(mockApiService).toBeDefined();
    expect(mockApiService).toBeInstanceOf(MockApiService);
  });
});