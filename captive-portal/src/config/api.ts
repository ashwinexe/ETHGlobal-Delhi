// API Configuration
export const API_CONFIG = {
  // Base URL for your backend API
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  // API endpoints
  ENDPOINTS: {
    NONCE: '/api/nonce',
    VERIFY: '/api/verify',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
} as const;

// Helper function to get full API URL
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}
