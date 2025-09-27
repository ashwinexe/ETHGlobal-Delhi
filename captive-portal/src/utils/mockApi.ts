// Backend API integration for SIWE endpoints
// const API_BASE_URL =
//   'https://conservative-annabela-starwiz-7-248cfee3.koyeb.app'
const API_BASE_URL = 'http://192.168.1.170:3001'

export const api = {
  // Generate a nonce for SIWE
  getNonce: async (): Promise<{ nonce: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/nonce`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(
          `Failed to get nonce: ${response.status} ${response.statusText}`
        )
      }

      const data = await response.json()

      return { nonce: data.nonce }
    } catch (error) {
      console.error('Error getting nonce:', error)
      throw new Error('Failed to get nonce from server')
    }
  },

  // Verify SIWE message and create session
  verify: async (data: {
    message: string
    signature: string
    nonce: string
  }): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: data.message,
          signature: data.signature,
          nonce: data.nonce
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Verification failed: ${response.status} ${response.statusText} - ${errorText}`
        )
      }

      const result = await response.json()

      // If verification is successful, create a local session
      if (result.success) {
        // Extract address from message
        // const addressMatch = data.message.match(/0x[a-fA-F0-9]{40}/)
        // const address = addressMatch
        //   ? addressMatch[0]
        //   : '0x0000000000000000000000000000000000000000'
        // Extract chainId from message (look for "Chain ID: X" pattern)
        // const chainIdMatch = data.message.match(/Chain ID: (\d+)/)
        // const chainId = chainIdMatch ? parseInt(chainIdMatch[1], 10) : 1
        // session = { address, chainId }
      }

      return result
    } catch (error) {
      console.error('Error verifying SIWE message:', error)
      throw new Error('Failed to verify message with server')
    }
  },

  // Get current session (local storage for now)
  // getSession: async (): Promise<{ address: string; chainId: number }> => {
  // For now, we'll use local session storage
  // In a real app, you might want to call a /me endpoint
  // if (!session) {
  //   throw new Error('No active session')
  // }
  // return session
  // },

  // Sign out
  signOut: async (): Promise<void> => {
    // Clear local session
    // session = null
    // In a real app, you might want to call a /signout endpoint
    // to invalidate the session on the server
  }
}
