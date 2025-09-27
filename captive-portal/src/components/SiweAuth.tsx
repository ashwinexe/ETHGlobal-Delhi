import { useState } from 'react';
import { useSiwe } from '../hooks/useSiwe';
import { WalletSelector } from './WalletSelector';

export function SiweAuth() {
  const {
    isAuthenticated,
    address,
    isLoading,
    error,
    authenticate,
    signOut,
    clearError,
  } = useSiwe();

  const [showWalletSelector, setShowWalletSelector] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isAuthenticated && address) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-800">
              Successfully Authenticated
            </h3>
            <p className="text-sm text-green-600 mt-1">
              Connected: {formatAddress(address)}
            </p>
          </div>
          <button
            onClick={signOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md mx-auto shadow-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sign In with Ethereum
        </h2>
        <p className="text-gray-600 mb-6">
          Connect your wallet to authenticate using SIWE
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowWalletSelector(true)}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Authenticating...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414a9 9 0 0112.728 0 1 1 0 01-1.414 1.414z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415a5 5 0 017.072 0 1 1 0 01-1.415 1.415z"
                  clipRule="evenodd"
                />
              </svg>
              Connect Wallet
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          You'll be prompted to sign a message to verify ownership of your wallet
        </p>
      </div>

      {showWalletSelector && (
        <WalletSelector
          onWalletSelect={() => {
            setShowWalletSelector(false);
            authenticate();
          }}
          onClose={() => setShowWalletSelector(false)}
        />
      )}
    </div>
  );
}
