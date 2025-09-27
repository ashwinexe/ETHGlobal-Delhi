# SIWE Testing Guide

This guide will help you test your Sign in with Ethereum (SIWE) implementation locally.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension (for browser testing)
3. **Git** (if cloning the repository)

## Quick Start

### 1. Set up Environment

First, create a `.env` file in your project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3001
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
# Option 1: Using npm
npm start

# Option 2: Using the start script
chmod +x start.sh
./start.sh

# Option 3: Using nodemon for development
npm run dev
```

The server will start on `http://localhost:3001` by default.

## Testing Methods

### Method 1: Browser Testing (Recommended)

1. **Start your backend server** (see Quick Start above)

2. **Open the test client** in your browser:
   ```bash
   open test-client.html
   # or navigate to file:///path/to/your/project/test-client.html
   ```

3. **Connect MetaMask**:
   - Click "Connect MetaMask" button
   - Approve the connection in MetaMask
   - Make sure you're on the correct network

4. **Test SIWE Authentication**:
   - Click "Sign In with Ethereum" button
   - Sign the message in MetaMask
   - Verify the authentication success

5. **Test API Endpoints**:
   - Use the various test buttons to verify different endpoints
   - Check the API response section for results

### Method 2: Command Line Testing

1. **Install additional dependencies** (if not already installed):
   ```bash
   npm install node-fetch
   ```

2. **Run the test script**:
   ```bash
   # Basic test
   node test-api.js
   
   # Test with custom backend URL
   node test-api.js --url http://localhost:3001
   
   # Test with custom wallet
   node test-api.js --key 0x1234567890abcdef...
   ```

3. **View test results**:
   - The script will run all API tests automatically
   - Green checkmarks indicate successful tests
   - Red X marks indicate failed tests

## API Endpoints

Your SIWE backend provides the following endpoints:

### Public Endpoints

- `GET /health` - Health check
- `GET /auth/nonce` - Get nonce for SIWE
- `POST /auth/verify` - Verify SIWE message and signature
- `POST /auth/logout` - Logout user

### Protected Endpoints

- `GET /auth/me` - Get current user session
- `GET /protected` - Example protected route

## Testing Scenarios

### 1. Basic Functionality

- [ ] Server starts without errors
- [ ] Health endpoint returns 200
- [ ] Nonce endpoint generates valid nonce
- [ ] Unauthenticated requests to protected routes return 401

### 2. SIWE Authentication Flow

- [ ] Can get nonce from backend
- [ ] Can create SIWE message with correct parameters
- [ ] Can sign message with wallet
- [ ] Can verify signature with backend
- [ ] Session is created after successful authentication
- [ ] Can access protected routes after authentication

### 3. Session Management

- [ ] Session persists across requests
- [ ] `/auth/me` returns user data when authenticated
- [ ] Logout destroys session
- [ ] Cannot access protected routes after logout

### 4. Error Handling

- [ ] Invalid signatures are rejected
- [ ] Expired nonces are rejected
- [ ] Missing parameters return appropriate errors
- [ ] CORS is properly configured

## Troubleshooting

### Common Issues

1. **"MetaMask not installed"**
   - Install MetaMask browser extension
   - Refresh the page after installation

2. **"Connection failed"**
   - Check if MetaMask is unlocked
   - Try refreshing the page
   - Check browser console for errors

3. **"Authentication failed"**
   - Verify the backend server is running
   - Check that you're on the correct network
   - Ensure the message format is correct

4. **"CORS error"**
   - Check your `.env` file has correct `ALLOWED_ORIGINS`
   - Make sure the frontend URL is in the allowed origins list

5. **"Session not persisting"**
   - Check that cookies are enabled
   - Verify session configuration in server.js
   - Check browser developer tools for cookie issues

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=siwe:* npm start
```

### Network Issues

If you're having network issues:

1. **Check if server is running**:
   ```bash
   curl http://localhost:3001/health
   ```

2. **Test with different ports**:
   ```bash
   PORT=3002 npm start
   ```

3. **Check firewall settings**:
   - Ensure port 3001 is not blocked
   - Check if antivirus is interfering

## Advanced Testing

### Custom Test Wallet

Create a test wallet for automated testing:

```javascript
const { ethers } = require('ethers');
const wallet = ethers.Wallet.createRandom();
console.log('Private Key:', wallet.privateKey);
console.log('Address:', wallet.address);
```

### Load Testing

Test your SIWE implementation under load:

```bash
# Install artillery for load testing
npm install -g artillery

# Create load test configuration
cat > load-test.yml << EOF
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "SIWE Load Test"
    flow:
      - get:
          url: "/health"
      - get:
          url: "/auth/nonce"
EOF

# Run load test
artillery run load-test.yml
```

### Security Testing

1. **Test with invalid signatures**
2. **Test with expired nonces**
3. **Test with malformed messages**
4. **Test CORS with different origins**
5. **Test session hijacking protection**

## Production Considerations

Before deploying to production:

1. **Change default session secret**
2. **Set secure cookie options**
3. **Configure proper CORS origins**
4. **Set up HTTPS**
5. **Add rate limiting**
6. **Add logging and monitoring**
7. **Test with real domain names**

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check the server logs
3. Verify your environment configuration
4. Test with the provided test scripts
5. Check the SIWE documentation: https://docs.login.xyz/

## Additional Resources

- [SIWE Official Documentation](https://docs.login.xyz/)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Express.js Documentation](https://expressjs.com/)
- [MetaMask Documentation](https://docs.metamask.io/)
