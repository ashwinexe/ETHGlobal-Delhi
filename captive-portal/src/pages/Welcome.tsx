import { useAccount, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'

// Dummy data for the stats table
const statsData = [
  {
    id: 1,
    metric: 'Estimated Time',
    value: '2 hours 30 minutes',
    status: 'Active'
  },
  {
    id: 2,
    metric: 'Bandwidth Used',
    value: '1.2 GB / 5 GB',
    status: 'Good'
  },
  {
    id: 3,
    metric: 'Speed',
    value: '25 Mbps',
    status: 'Excellent'
  },
  {
    id: 4,
    metric: 'Plan Type',
    value: 'Premium',
    status: 'Active'
  },
  {
    id: 5,
    metric: 'Data Remaining',
    value: '3.8 GB',
    status: 'Good'
  },
  {
    id: 6,
    metric: 'Session Duration',
    value: '1 hour 15 minutes',
    status: 'Active'
  }
]

export default function Welcome() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-400 bg-green-400/20'
      case 'Good':
        return 'text-blue-400 bg-blue-400/20'
      case 'Excellent':
        return 'text-purple-400 bg-purple-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Not Connected</h2>
          <p className="mb-6 text-gray-400">
            Please connect your wallet to access this page.
          </p>
          <button
            onClick={() => open()}
            className="rounded-md bg-white px-6 py-3 text-black transition-colors hover:bg-gray-100"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome to Captive Portal
              </h1>
              <p className="text-gray-400">Your internet access dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Connected as</p>
                <p className="font-mono text-white">
                  {formatAddress(address!)}
                </p>
              </div>
              <button
                onClick={() => disconnect()}
                className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-gray-600 hover:text-white"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Table */}
        <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Connection Statistics
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Real-time data about your internet connection
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {statsData.map((stat) => (
                  <tr
                    key={stat.id}
                    className="transition-colors hover:bg-gray-800/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                      {stat.metric}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                      {stat.value}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                          stat.status
                        )}`}
                      >
                        {stat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Data Usage
            </h3>
            <p className="text-3xl font-bold text-blue-400">1.2 GB</p>
            <p className="text-sm text-gray-400">of 5 GB used</p>
            <div className="mt-3 h-2 w-full rounded-full bg-gray-700">
              <div
                className="h-2 rounded-full bg-blue-400"
                style={{ width: '24%' }}
              ></div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Connection Speed
            </h3>
            <p className="text-3xl font-bold text-green-400">25 Mbps</p>
            <p className="text-sm text-gray-400">Download speed</p>
            <div className="mt-3 flex items-center">
              <div className="mr-2 size-2 rounded-full bg-green-400"></div>
              <span className="text-sm text-green-400">Excellent</span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">Plan Type</h3>
            <p className="text-3xl font-bold text-purple-400">Premium</p>
            <p className="text-sm text-gray-400">Active subscription</p>
            <div className="mt-3">
              <span className="text-sm font-medium text-purple-400">
                5 GB included
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
