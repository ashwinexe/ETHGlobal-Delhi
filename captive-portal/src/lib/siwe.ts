import { SiweMessage } from 'siwe';
import { getApiUrl, API_CONFIG } from '../config/api';
import { connectWallet as onboardConnect, signMessage as onboardSign, disconnectWallet as onboardDisconnect } from './web3Onboard';

export interface SiweAuthState {
  isAuthenticated: boolean;
  address: string | null;
  message: string | null;
  nonce: string | null;
}

export class SiweAuth {
  private static instance: SiweAuth;
  private state: SiweAuthState = {
    isAuthenticated: false,
    address: null,
    message: null,
    nonce: null,
  };

  private listeners: Set<(state: SiweAuthState) => void> = new Set();

  private constructor() {
    // Load persisted state from localStorage
    this.loadState();
  }

  static getInstance(): SiweAuth {
    if (!SiweAuth.instance) {
      SiweAuth.instance = new SiweAuth();
    }
    return SiweAuth.instance;
  }

  private loadState() {
    try {
      const saved = localStorage.getItem('siwe-auth');
      if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load SIWE state:', error);
    }
  }

  private saveState() {
    try {
      localStorage.setItem('siwe-auth', JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save SIWE state:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: SiweAuthState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): SiweAuthState {
    return { ...this.state };
  }

  async getNonce(): Promise<string> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.NONCE), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get nonce');
      }

      const data = await response.json();
      this.state.nonce = data.nonce;
      this.saveState();
      return data.nonce;
    } catch (error) {
      console.error('Error getting nonce:', error);
      throw error;
    }
  }

  async createSiweMessage(address: string, nonce: string): Promise<SiweMessage> {
    const domain = window.location.host;
    const origin = window.location.origin;

    const message = new SiweMessage({
      domain,
      address,
      statement: 'Sign in with Ethereum to the app.',
      uri: origin,
      version: '1',
      chainId: 1, // Ethereum mainnet
      nonce,
    });

    this.state.message = message.prepareMessage();
    this.saveState();
    return message;
  }

  async signInWithEthereum(address: string, signature: string): Promise<boolean> {
    try {
      if (!this.state.message) {
        throw new Error('No message to verify');
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.VERIFY), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: this.state.message,
          signature,
        }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const data = await response.json();
      
      if (data.success) {
        this.state.isAuthenticated = true;
        this.state.address = address;
        this.saveState();
        this.notifyListeners();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying signature:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await onboardDisconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
    
    this.state = {
      isAuthenticated: false,
      address: null,
      message: null,
      nonce: null,
    };
    this.saveState();
    this.notifyListeners();
  }

  async connectWallet(): Promise<string> {
    try {
      const walletInfo = await onboardConnect();
      return walletInfo.accounts[0].address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.state.address) {
      throw new Error('No wallet address available for signing.');
    }

    try {
      return await onboardSign(message, this.state.address);
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  async authenticate(): Promise<boolean> {
    try {
      // Connect wallet
      const address = await this.connectWallet();
      
      // Get nonce from backend
      const nonce = await this.getNonce();
      
      // Create SIWE message
      const siweMessage = await this.createSiweMessage(address, nonce);
      
      // Sign the message
      const signature = await this.signMessage(siweMessage.prepareMessage());
      
      // Verify with backend
      return await this.signInWithEthereum(address, signature);
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}
