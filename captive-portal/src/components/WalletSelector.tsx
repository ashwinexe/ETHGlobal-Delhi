import { useState } from 'react';
import { onboard } from '../lib/web3Onboard';

interface WalletSelectorProps {
  onWalletSelect: () => void;
  onClose: () => void;
}

export function WalletSelector({ onWalletSelect, onClose }: WalletSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletSelect = async () => {
    try {
      setIsLoading(true);
      await onboard.connectWallet();
      onWalletSelect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading available wallets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Wallet</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-4">
            Choose your preferred wallet:
          </p>
          
          {/* MetaMask */}
          <button
            onClick={handleWalletSelect}
            disabled={isLoading}
            className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span className="text-2xl mr-3">🦊</span>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">MetaMask</div>
              <div className="text-sm text-gray-500">Connect using MetaMask</div>
            </div>
            <div className="text-gray-400">→</div>
          </button>

          {/* Coinbase Wallet */}
          <button
            onClick={handleWalletSelect}
            disabled={isLoading}
            className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span className="text-2xl mr-3">🔵</span>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Coinbase Wallet</div>
              <div className="text-sm text-gray-500">Connect using Coinbase Wallet</div>
            </div>
            <div className="text-gray-400">→</div>
          </button>

          {/* Trust Wallet */}
          <button
            onClick={handleWalletSelect}
            disabled={isLoading}
            className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span className="text-2xl mr-3">🛡️</span>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Trust Wallet</div>
              <div className="text-sm text-gray-500">Connect using Trust Wallet</div>
            </div>
            <div className="text-gray-400">→</div>
          </button>

          {/* Phantom */}
          <button
            onClick={handleWalletSelect}
            disabled={isLoading}
            className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span className="text-2xl mr-3">👻</span>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Phantom</div>
              <div className="text-sm text-gray-500">Connect using Phantom</div>
            </div>
            <div className="text-gray-400">→</div>
          </button>

          {/* WalletConnect */}
          <button
            onClick={handleWalletSelect}
            disabled={isLoading}
            className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span className="text-2xl mr-3">🔗</span>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">WalletConnect</div>
              <div className="text-sm text-gray-500">Connect using WalletConnect</div>
            </div>
            <div className="text-gray-400">→</div>
          </button>
        </div>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <h5 className="text-sm font-medium text-blue-800 mb-2">💡 Supported Wallets</h5>
          <p className="text-xs text-blue-700">
            This integration supports MetaMask, Coinbase Wallet, Trust Wallet, Phantom, and WalletConnect-compatible wallets.
          </p>
        </div>
      </div>
    </div>
  );
}
