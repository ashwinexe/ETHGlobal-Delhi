# ETHGlobal-Delhi - SIWE Backend

This is the project submission for ETHGlobal Delhi, featuring a robust Express.js backend for Sign in with Ethereum (SIWE) authentication.

## Features

- **SIWE Authentication**: Complete Sign in with Ethereum implementation
- **Session Management**: Secure session handling with express-session
- **CORS Support**: Configurable CORS for frontend integration
- **Nonce Generation**: Cryptographically secure nonce generation
- **Message Verification**: Full SIWE message and signature verification
- **Protected Routes**: Authentication middleware for secured endpoints
- **Error Handling**: Comprehensive error handling and logging

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ashwinexe/ETHGlobal-Delhi.git
cd ETHGlobal-Delhi
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001` by default.

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and basic information.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Authentication Endpoints

#### Get Nonce
```
GET /auth/nonce
```
Generates a cryptographic nonce for SIWE message creation.

**Response:**
```json
{
  "nonce": "0x1234567890abcdef...",
  "message": "Nonce generated successfully"
}
```

#### Verify SIWE Message
```
POST /auth/verify
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "localhost:3000 wants you to sign in with your Ethereum account:\n0x...\n\nSign in with Ethereum to the app.\n\nURI: http://localhost:3000\nVersion: 1\nChain ID: 1\nNonce: 0x...\nIssued At: 2024-01-01T00:00:00.000Z",
  "signature": "0x..."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "user": {
    "address": "0x...",
    "chainId": 1,
    "domain": "localhost:3000",
    "uri": "http://localhost:3000",
    "version": "1",
    "authenticatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Current User
```
GET /auth/me
```
Returns current authenticated user information.

**Response (authenticated):**
```json
{
  "authenticated": true,
  "user": {
    "address": "0x...",
    "chainId": 1,
    "domain": "localhost:3000",
    "uri": "http://localhost:3000",
    "version": "1",
    "authenticatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (not authenticated):**
```json
{
  "authenticated": false,
  "message": "Not authenticated"
}
```

#### Logout
```
POST /auth/logout
```
Destroys the current session and logs out the user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Protected Routes

#### Example Protected Route
```
GET /protected
```
Requires authentication. Returns user information and access time.

**Response:**
```json
{
  "message": "This is a protected route",
  "user": {
    "address": "0x...",
    "chainId": 1,
    "domain": "localhost:3000",
    "uri": "http://localhost:3000",
    "version": "1",
    "authenticatedAt": "2024-01-01T00:00:00.000Z"
  },
  "accessTime": "2024-01-01T00:00:00.000Z"
}
```

## Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# CORS Configuration (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# SIWE Configuration
SIWE_DOMAIN=localhost:3000
SIWE_URI=http://localhost:3000
```

## Frontend Integration

This backend is designed to work with React frontends using Web3Modal for wallet connections. The typical flow is:

1. Frontend requests a nonce from `/auth/nonce`
2. Frontend creates a SIWE message using the nonce
3. User signs the message with their wallet
4. Frontend sends the message and signature to `/auth/verify`
5. Backend verifies and creates a session
6. Frontend can access protected routes

## Security Features

- **Secure Sessions**: HTTP-only cookies with configurable security settings
- **Nonce Validation**: Each authentication attempt requires a fresh nonce
- **CORS Protection**: Configurable origin restrictions
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive information leakage

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

## License

MIT License - see LICENSE file for details.
