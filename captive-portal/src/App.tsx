import { useState } from 'react'
import { useSiwe } from './hooks/useSiwe'
import { ProtectedRoute } from './components/ProtectedRoute'
import { SiweAuth } from './components/SiweAuth'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const { address } = useSiwe()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Captive Portal with SIWE
          </h1>
          <p className="text-gray-600">
            Secure authentication using Sign-In with Ethereum
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <ProtectedRoute
            fallback={
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Authentication Required
                </h2>
                <SiweAuth />
              </div>
            }
          >
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Welcome to the Portal!
                </h2>
                <p className="text-gray-600">
                  You are authenticated as: <span className="font-mono text-blue-600">{address && formatAddress(address)}</span>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  🎉 Authentication Successful
                </h3>
                <p className="text-blue-700">
                  You have successfully signed in with Ethereum. This demonstrates that you own the private key for the connected wallet address.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Wallet Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Address:</span>
                      <p className="font-mono text-sm text-gray-800 break-all">{address}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Authenticated
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Demo Counter
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-4">
                      {count}
                    </div>
                    <button
                      onClick={() => setCount((count) => count + 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Increment Counter
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                  🔒 Security Note
                </h4>
                <p className="text-sm text-yellow-700">
                  This authentication was secured using SIWE (Sign-In with Ethereum), which proves ownership of your wallet without exposing your private key. The signature was verified by your backend server.
                </p>
              </div>
            </div>
          </ProtectedRoute>
        </div>
      </div>
    </div>
  )
}

export default App
