/**
 * Mock API service for disease detection
 * Simulates real API behavior with delays and error scenarios
 */

export interface ImageData {
  uri: string;
  type: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
}

export interface DiagnosisResponse {
  disease: string;
  confidence: number;
  recommendations?: string[];
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

// Sample disease data for mock responses
const MOCK_DISEASES = [
  {
    disease: "Eczema (Atopic Dermatitis)",
    confidence: 0.85,
    recommendations: [
      "Moisturize skin frequently with emollients.",
      "Avoid known triggers like certain soaps, fabrics, or foods.",
      "Use topical corticosteroids as prescribed for flare-ups.",
      "Consult a dermatologist for a personalized treatment plan."
    ]
  },
  {
    disease: "Psoriasis",
    confidence: 0.90,
    recommendations: [
      "Apply topical treatments like corticosteroids or vitamin D analogues.",
      "Consider phototherapy (light therapy) under medical supervision.",
      "Manage stress and maintain a healthy lifestyle.",
      "Seek advice from a dermatologist for systemic medications if severe."
    ]
  },
  {
    disease: "Acne Vulgaris",
    confidence: 0.93,
    recommendations: [
      "Use a gentle cleanser twice daily.",
      "Apply over-the-counter treatments containing benzoyl peroxide or salicylic acid.",
      "Avoid picking or squeezing pimples.",
      "Consult a dermatologist for prescription medications if acne is persistent or severe."
    ]
  },
  {
    disease: "Healthy Skin",
    confidence: 0.95,
    recommendations: [
      "Maintain a consistent skincare routine.",
      "Protect skin from sun exposure with SPF 30+ sunscreen.",
      "Stay hydrated and maintain a balanced diet.",
      "Monitor for any new or changing spots."
    ]
  }
];

// Error scenarios for testing
const ERROR_SCENARIOS = [
  {
    code: "NETWORK_ERROR",
    message: "Network connection failed",
    details: "Please check your internet connection and try again"
  },
  {
    code: "SERVER_ERROR",
    message: "Internal server error",
    details: "Our servers are experiencing issues. Please try again later"
  },
  {
    code: "INVALID_IMAGE",
    message: "Invalid image format",
    details: "Please upload a valid image file (JPG, PNG, or WEBP)"
  },
  {
    code: "IMAGE_TOO_LARGE",
    message: "Image file too large",
    details: "Please upload an image smaller than 10MB"
  },
  {
    code: "RATE_LIMIT",
    message: "Too many requests",
    details: "Please wait a moment before trying again"
  }
];

class MockApiService {
  private errorRate: number = 0.15; // 15% chance of error for testing
  private minDelay: number = 1500; // Minimum delay in ms
  private maxDelay: number = 3500; // Maximum delay in ms

  /**
   * Simulates disease detection API call
   * @param imageData - The image data to analyze
   * @returns Promise with diagnosis response or error
   */
  async detectDisease(imageData: ImageData): Promise<DiagnosisResponse> {
    // Simulate network delay
    const delay = this.getRandomDelay();
    await this.sleep(delay);

    // Simulate error scenarios for testing
    if (this.shouldSimulateError()) {
      const error = this.getRandomError();
      throw new Error(JSON.stringify(error));
    }

    // Validate image data
    this.validateImageData(imageData);

    // Generate mock response
    const mockResponse = this.generateMockResponse();
    
    return mockResponse;
  }

  /**
   * Simulates batch disease detection (for future use)
   * @param images - Array of image data
   * @returns Promise with array of diagnosis responses
   */
  async detectDiseases(images: ImageData[]): Promise<DiagnosisResponse[]> {
    const results: DiagnosisResponse[] = [];
    
    for (const image of images) {
      try {
        const result = await this.detectDisease(image);
        results.push(result);
      } catch (error) {
        // In batch processing, we might want to continue with other images
        console.warn('Failed to process image:', image.fileName, error);
      }
    }
    
    return results;
  }

  /**
   * Simulates checking API health/status
   * @returns Promise with service status
   */
  async getServiceStatus(): Promise<{ status: string; version: string; uptime: number }> {
    await this.sleep(500); // Quick response for health check
    
    return {
      status: 'healthy',
      version: '1.0.0',
      uptime: Math.floor(Math.random() * 86400) // Random uptime in seconds
    };
  }

  /**
   * Configure error simulation for testing
   * @param errorRate - Probability of error (0-1)
   */
  setErrorRate(errorRate: number): void {
    this.errorRate = Math.max(0, Math.min(1, errorRate));
  }

  /**
   * Configure delay range for testing
   * @param minDelay - Minimum delay in milliseconds
   * @param maxDelay - Maximum delay in milliseconds
   */
  setDelayRange(minDelay: number, maxDelay: number): void {
    this.minDelay = Math.max(0, minDelay);
    this.maxDelay = Math.max(this.minDelay, maxDelay);
  }

  // Private helper methods

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getRandomDelay(): number {
    return Math.floor(Math.random() * (this.maxDelay - this.minDelay + 1)) + this.minDelay;
  }

  private shouldSimulateError(): boolean {
    return Math.random() < this.errorRate;
  }

  private getRandomError(): ApiError {
    const randomIndex = Math.floor(Math.random() * ERROR_SCENARIOS.length);
    return ERROR_SCENARIOS[randomIndex];
  }

  private validateImageData(imageData: ImageData): void {
    if (!imageData.uri) {
      throw new Error(JSON.stringify({
        code: "INVALID_IMAGE",
        message: "Missing image URI",
        details: "Image data must include a valid URI"
      }));
    }

    // Simulate file size validation
    if (imageData.fileSize > 10 * 1024 * 1024) { // 10MB limit
      throw new Error(JSON.stringify(ERROR_SCENARIOS.find(e => e.code === "IMAGE_TOO_LARGE")));
    }

    // Simulate file type validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(imageData.type.toLowerCase())) {
      throw new Error(JSON.stringify(ERROR_SCENARIOS.find(e => e.code === "INVALID_IMAGE")));
    }
  }

  private generateMockResponse(): DiagnosisResponse {
    const randomIndex = Math.floor(Math.random() * MOCK_DISEASES.length);
    const mockDisease = MOCK_DISEASES[randomIndex];
    
    // Generate a confidence score between 60% and 70%
    const confidence = Math.random() * (0.70 - 0.60) + 0.60;

    return {
      disease: mockDisease.disease,
      confidence: Math.round(confidence * 100) / 100, // Round to 2 decimal places
      recommendations: mockDisease.recommendations,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const mockApiService = new MockApiService();

// Export class for testing purposes
export { MockApiService };