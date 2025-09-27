import { SiweMessage } from 'siwe'

// Helper function to create SIWE message
export const createSiweMessage = (
  address: string,
  chainId: number,
  nonce: string
) => {
  return new SiweMessage({
    nonce,
    chainId,
    address,
    version: '1',
    uri: window.location.origin,
    domain: window.location.host,
    statement: 'Sign in with Ethereum to access the captive portal',
    issuedAt: new Date().toISOString()
  })
}

// Helper function to verify SIWE message
export const verifySiweMessage = async (
  message: SiweMessage,
  signature: string
) => {
  try {
    const result = await message.verify({ signature })
    return result.success
  } catch (error) {
    console.error('SIWE verification failed:', error)
    return false
  }
}
