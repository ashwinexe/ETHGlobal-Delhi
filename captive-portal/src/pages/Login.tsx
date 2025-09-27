import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSiwe } from '../contexts/SiweContext'

export default function Login() {
  const { open } = useAppKit()
  const { isConnected } = useAccount()
  const { signOut } = useSiwe()
  const { disconnect } = useDisconnect()
  const { isAuthenticated, signIn, isLoading, error } = useSiwe()
  const navigate = useNavigate()

  useEffect(() => {
    if (isConnected && isAuthenticated) {
      navigate('/welcome')
    }
  }, [isConnected, isAuthenticated, navigate])

  const handleSignIn = async () => {
    if (!isConnected) {
      open()
    } else {
      await signIn()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Welcome to Captive Portal
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in with Ethereum to access the internet
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h3 className="mb-4 text-lg font-medium text-white">
              Sign in with Ethereum
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Connect your wallet and sign a message to authenticate and access
              the captive portal services.
            </p>

            {error && (
              <div className="mb-4 rounded-md border border-red-500 bg-red-900/50 p-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-white px-4 py-3 text-sm font-medium text-black shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="mr-2 size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                  {isConnected ? 'Signing in...' : 'Connecting...'}
                </div>
              ) : isConnected ? (
                'Sign in with Ethereum'
              ) : (
                'Connect Wallet'
              )}
            </button>

            {isConnected && (
              <button
                onClick={() => {
                  disconnect()
                  signOut()
                }}
                className="w-full p-4 text-center text-sm text-white"
              >
                Sign Out
              </button>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By connecting, you agree to our terms of service
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
