# Web3-Onboard Setup Guide

## 🎉 Successfully Updated to Web3-Onboard!

Your SIWE integration has been successfully updated to use **@web3-onboard/walletconnect** instead of Rainbow. This provides better wallet support and more reliable connections.

## 🔧 Configuration Required

### 1. WalletConnect Project ID

You need to get a WalletConnect Project ID for WalletConnect integration:

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID
4. Set it in your environment variables:

```bash
# Create .env file in your project root
VITE_WALLETCONNECT_PROJECT_ID=your-project-id-here
```

### 2. Update API Configuration

Update `src/config/api.ts` with your backend URL:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
  // ... rest of config
};
```

## 🦊 Supported Wallets

### Desktop Wallets:
- **MetaMask** - Full support
- **Coinbase Wallet** - Full support  
- **Trust Wallet** - Full support
- **Phantom** - Full support
- **Brave Wallet** - Full support
- **WalletConnect** - Full support (via WalletConnect protocol)

### Mobile Wallets:
- **MetaMask Mobile** - Via WalletConnect
- **Coinbase Wallet Mobile** - Via WalletConnect
- **Trust Wallet Mobile** - Via WalletConnect
- **Any WalletConnect-compatible wallet**

## 🚀 Key Features

- ✅ **Multi-Wallet Support** - Choose from multiple wallet options
- ✅ **WalletConnect Integration** - Connect mobile wallets via QR code
- ✅ **Better Error Handling** - More specific error messages
- ✅ **Cross-Platform** - Works on desktop and mobile
- ✅ **SIWE Integration** - Full Sign-In with Ethereum support
- ✅ **TypeScript** - Fully typed for better development experience

## 🔄 Migration Changes

### Removed:
- ❌ Rainbow Wallet specific code
- ❌ Wagmi/Viem dependencies
- ❌ @tanstack/react-query

### Added:
- ✅ @web3-onboard/core
- ✅ @web3-onboard/walletconnect
- ✅ @web3-onboard/injected-wallets
- ✅ @web3-onboard/coinbase
- ✅ @web3-onboard/trust
- ✅ @web3-onboard/phantom

## 🛠️ Usage

The API remains the same as before:

```typescript
import { useSiwe } from './hooks/useSiwe';

function MyComponent() {
  const { isAuthenticated, address, authenticate, signOut } = useSiwe();
  
  // Same usage as before
}
```

## 📱 Mobile Support

Mobile users can now connect their wallets using:
1. **WalletConnect QR Code** - Scan with mobile wallet app
2. **Deep Links** - Direct connection to mobile wallet apps
3. **In-App Browser** - For wallets that support it

## 🔒 Security

- All wallet connections are secure and follow Web3 standards
- Private keys never leave the user's wallet
- SIWE authentication provides cryptographic proof of ownership
- WalletConnect uses encrypted peer-to-peer connections

## 🎯 Next Steps

1. Get your WalletConnect Project ID
2. Set up your environment variables
3. Test with different wallets
4. Deploy your application

The integration is now more robust and supports a wider range of wallets!
