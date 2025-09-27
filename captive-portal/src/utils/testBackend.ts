// Test utility for backend API endpoints
// This file can be used to test your backend integration

export interface NonceResponse {
  nonce: string;
}

export interface VerifyRequest {
  message: string;
  signature: string;
}

export interface VerifyResponse {
  success: boolean;
}

export async function testNonceEndpoint(baseUrl: string): Promise<NonceResponse> {
  const response = await fetch(`${baseUrl}/api/nonce`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get nonce: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function testVerifyEndpoint(
  baseUrl: string,
  message: string,
  signature: string
): Promise<VerifyResponse> {
  const response = await fetch(`${baseUrl}/api/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      signature,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to verify: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Example usage in browser console:
// import { testNonceEndpoint, testVerifyEndpoint } from './utils/testBackend';
// 
// // Test nonce endpoint
// testNonceEndpoint('http://localhost:3000')
//   .then(data => console.log('Nonce:', data))
//   .catch(err => console.error('Error:', err));
//
// // Test verify endpoint (with dummy data)
// testVerifyEndpoint('http://localhost:3000', 'test message', '0x123...')
//   .then(data => console.log('Verify:', data))
//   .catch(err => console.error('Error:', err));
