# Mock API Service

This directory contains the mock API service for disease detection functionality.

## Usage

```typescript
import { mockApiService, ImageData } from './mockApi';

// Example image data
const imageData: ImageData = {
  uri: 'file://path/to/image.jpg',
  type: 'image/jpeg',
  fileName: 'plant-image.jpg',
  fileSize: 1024 * 1024, // 1MB
  width: 800,
  height: 600
};

// Detect disease
try {
  const result = await mockApiService.detectDisease(imageData);
  console.log('Disease detected:', result.disease);
  console.log('Confidence:', result.confidence);
  console.log('Recommendations:', result.recommendations);
} catch (error) {
  const errorData = JSON.parse(error.message);
  console.error('API Error:', errorData.message);
}
```

## Configuration

```typescript
// Configure error simulation for testing
mockApiService.setErrorRate(0.2); // 20% chance of error

// Configure response delays
mockApiService.setDelayRange(1000, 3000); // 1-3 second delay
```

## Features

- **Realistic Delays**: Simulates network latency (1.5-3.5 seconds by default)
- **Error Simulation**: Configurable error rate for testing error handling
- **Sample Data**: Returns realistic disease detection responses
- **Validation**: Validates image data (size, type, URI)
- **Batch Processing**: Supports multiple image analysis
- **Health Check**: Service status endpoint

## Error Scenarios

The service simulates various error conditions:

- `NETWORK_ERROR`: Connection issues
- `SERVER_ERROR`: Internal server problems  
- `INVALID_IMAGE`: Invalid image format or missing URI
- `IMAGE_TOO_LARGE`: File size exceeds 10MB limit
- `RATE_LIMIT`: Too many requests

## Sample Diseases

The mock service returns one of these sample diseases:

- Bacterial Leaf Spot
- Powdery Mildew  
- Rust Disease
- Healthy Plant

Each response includes confidence level and treatment recommendations.