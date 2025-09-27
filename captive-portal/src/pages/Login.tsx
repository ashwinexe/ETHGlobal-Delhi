import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { open } = useAppKit()
  const { isConnected } = useAccount()
  const navigate = useNavigate()

  useEffect(() => {
    if (isConnected) {
      navigate('/welcome')
    }
  }, [isConnected, navigate])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Welcome to Captive Portal
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Connect your wallet to access the internet
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-medium text-white mb-4">
              Connect Your Wallet
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Connect your wallet to authenticate and access the captive portal services.
            </p>

            <button
              onClick={() => open()}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
            >
              Connect Wallet
            </button>
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
