// Web3-Onboard integration for enhanced wallet support
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import coinbaseModule from '@web3-onboard/coinbase';
import trustModule from '@web3-onboard/trust';
import phantomModule from '@web3-onboard/phantom';

// Initialize wallet modules
const injected = injectedModule();
const walletConnect = walletConnectModule({
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  requiredChains: [1], // Ethereum mainnet
  optionalChains: [137, 56, 10, 42161], // Polygon, BSC, Optimism, Arbitrum
});
const coinbase = coinbaseModule();
const trust = trustModule();
const phantom = phantomModule();

// Initialize Onboard
export const onboard = Onboard({
  wallets: [injected, walletConnect, coinbase, trust, phantom],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/your-project-id'
    },
    {
      id: '0x89',
      token: 'MATIC',
      label: 'Polygon',
      rpcUrl: 'https://polygon-rpc.com'
    },
    {
      id: '0x38',
      token: 'BNB',
      label: 'BNB Smart Chain',
      rpcUrl: 'https://bsc-dataseed.binance.org'
    }
  ],
  accountCenter: {
    desktop: {
      enabled: false
    },
    mobile: {
      enabled: false
    }
  }
});

export interface WalletInfo {
  label: string;
  icon: string;
  provider: any;
  accounts: Array<{
    address: string;
    ens?: string | null;
    balance?: any;
  }>;
  chains: Array<{
    id: string;
    namespace: string | undefined;
  }>;
}

export interface OnboardState {
  wallets: WalletInfo[];
  account: WalletInfo | null;
  isConnected: boolean;
  isConnecting: boolean;
}

// State management
let currentState: OnboardState = {
  wallets: [],
  account: null,
  isConnected: false,
  isConnecting: false,
};

const listeners = new Set<(state: OnboardState) => void>();

// Subscribe to state changes
export function subscribeToOnboardState(listener: (state: OnboardState) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Notify listeners of state changes
function notifyListeners() {
  listeners.forEach(listener => listener(currentState));
}

// Update state
function updateState(updates: Partial<OnboardState>) {
  currentState = { ...currentState, ...updates };
  notifyListeners();
}

// Connect wallet
export async function connectWallet(): Promise<WalletInfo> {
  try {
    updateState({ isConnecting: true });
    
    const wallets = await onboard.connectWallet();
    
    if (wallets.length === 0) {
      throw new Error('No wallet selected');
    }

    const wallet = wallets[0];
    const account = wallet.accounts[0];
    
    if (!account) {
      throw new Error('No account found in wallet');
    }

    const walletInfo: WalletInfo = {
      label: wallet.label,
      icon: wallet.icon,
      provider: wallet.provider,
      accounts: wallet.accounts.map(account => ({
        address: account.address as string,
        ens: account.ens?.name || null,
        balance: account.balance,
      })),
      chains: wallet.chains.map(chain => ({
        id: chain.id,
        namespace: chain.namespace || 'evm',
      })),
    };

    updateState({
      wallets: [walletInfo],
      account: walletInfo,
      isConnected: true,
      isConnecting: false,
    });

    return walletInfo;
  } catch (error) {
    updateState({ isConnecting: false });
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

// Disconnect wallet
export async function disconnectWallet(): Promise<void> {
  try {
    const [primaryWallet] = onboard.state.get().wallets;
    if (primaryWallet) {
      await onboard.disconnectWallet({ label: primaryWallet.label });
    }
    
    updateState({
      wallets: [],
      account: null,
      isConnected: false,
      isConnecting: false,
    });
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
}

// Sign message
export async function signMessage(message: string, address: string): Promise<string> {
  try {
    const [primaryWallet] = onboard.state.get().wallets;
    
    if (!primaryWallet) {
      throw new Error('No wallet connected');
    }

    const signature = await primaryWallet.provider.request({
      method: 'personal_sign',
      params: [message, address],
    });

    return signature as string;
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
}

// Get current state
export function getOnboardState(): OnboardState {
  return { ...currentState };
}

// Get available wallets
export function getAvailableWallets() {
  return onboard.state.get().wallets.map(wallet => ({
    label: wallet.label,
    icon: wallet.icon,
    provider: wallet.provider,
  }));
}

// Check if wallet is connected
export function isWalletConnected(): boolean {
  return currentState.isConnected && currentState.account !== null;
}

// Get current account address
export function getCurrentAddress(): string | null {
  return currentState.account?.accounts[0]?.address || null;
}

// Initialize state from existing connections
export function initializeOnboardState() {
  const state = onboard.state.get();
  const wallets = state.wallets.map(wallet => ({
    label: wallet.label,
    icon: wallet.icon,
    provider: wallet.provider,
    accounts: wallet.accounts.map(account => ({
      address: account.address as string,
      ens: account.ens?.name || null,
      balance: account.balance,
    })),
    chains: wallet.chains.map(chain => ({
      id: chain.id,
      namespace: chain.namespace || 'evm',
    })),
  }));

  updateState({
    wallets,
    account: wallets[0] || null,
    isConnected: wallets.length > 0,
    isConnecting: false,
  });
}

// Listen to onboard state changes
onboard.state.select('wallets').subscribe((wallets) => {
  const walletInfos = wallets.map(wallet => ({
    label: wallet.label,
    icon: wallet.icon,
    provider: wallet.provider,
    accounts: wallet.accounts.map(account => ({
      address: account.address as string,
      ens: account.ens?.name || null,
      balance: account.balance,
    })),
    chains: wallet.chains.map(chain => ({
      id: chain.id,
      namespace: chain.namespace || 'evm',
    })),
  }));

  updateState({
    wallets: walletInfos,
    account: walletInfos[0] || null,
    isConnected: walletInfos.length > 0,
    isConnecting: false,
  });
});
