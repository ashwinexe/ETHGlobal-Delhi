# SIWE (Sign-In with Ethereum) Integration

This project now includes a complete SIWE integration for React 19 with the following features:

## Features

- 🔐 **Secure Authentication**: Uses SIWE standard for wallet-based authentication
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- 🔄 **State Management**: Persistent authentication state with localStorage
- 🛡️ **Protected Routes**: Components that require authentication
- ⚡ **React 19**: Built with the latest React features
- 🔌 **Backend Integration**: Ready to work with your `/nonce` and `/verify` API endpoints

## Project Structure

```
src/
├── components/
│   ├── SiweAuth.tsx          # Authentication component
│   └── ProtectedRoute.tsx    # Route protection wrapper
├── hooks/
│   └── useSiwe.ts           # React hook for SIWE state
├── lib/
│   └── siwe.ts              # Core SIWE authentication logic
├── config/
│   └── api.ts               # API configuration
└── App.tsx                  # Main application component
```

## Backend API Requirements

Your backend should provide these endpoints:

### GET /api/nonce
Returns a unique nonce for the authentication challenge.

**Response:**
```json
{
  "nonce": "random-string-here"
}
```

### POST /api/verify
Verifies the SIWE signature and message.

**Request Body:**
```json
{
  "message": "SIWE message string",
  "signature": "0x...signature"
}
```

**Response:**
```json
{
  "success": true
}
```

## Configuration

Update the API configuration in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.com' 
    : 'http://localhost:3000',
  // ... rest of config
};
```

## Usage

### Basic Authentication
```tsx
import { useSiwe } from './hooks/useSiwe';

function MyComponent() {
  const { isAuthenticated, address, authenticate, signOut } = useSiwe();
  
  if (!isAuthenticated) {
    return <button onClick={authenticate}>Connect Wallet</button>;
  }
  
  return (
    <div>
      <p>Welcome, {address}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protected Routes
```tsx
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ProtectedRoute fallback={<LoginComponent />}>
      <ProtectedContent />
    </ProtectedRoute>
  );
}
```

## Dependencies

The following packages were added:

- `siwe`: SIWE message creation and validation
- `@rainbow-me/rainbowkit`: Wallet connection UI (optional)
- `wagmi`: Ethereum wallet integration
- `viem`: Ethereum library
- `@tanstack/react-query`: Data fetching and caching

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Make sure your backend is running on the configured port (default: 3000)

## Security Notes

- The SIWE implementation follows the official specification
- Private keys never leave the user's wallet
- Authentication state is persisted in localStorage
- All API calls include proper error handling
- The implementation supports both development and production environments

## Customization

- Modify the SIWE message statement in `src/lib/siwe.ts`
- Update the UI components in `src/components/`
- Adjust the API configuration in `src/config/api.ts`
- Customize the authentication flow in `src/hooks/useSiwe.ts`
