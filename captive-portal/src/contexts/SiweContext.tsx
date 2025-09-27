import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { createSiweMessage, verifySiweMessage } from '../utils/siwe'
import { api } from '../utils/mockApi'

interface SiweContextType {
  isAuthenticated: boolean
  isLoading: boolean
  address: string | undefined
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  error: string | null
}

const SiweContext = createContext<SiweContextType | undefined>(undefined)

export const useSiwe = () => {
  const context = useContext(SiweContext)
  if (context === undefined) {
    throw new Error('useSiwe must be used within a SiweProvider')
  }
  return context
}

interface SiweProviderProps {
  children: ReactNode
}

export const SiweProvider: React.FC<SiweProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected, chainId } = useAccount()
  const { signMessageAsync } = useSignMessage()

  // Check authentication status on mount
  // useEffect(() => {
  //   checkAuthStatus()
  // }, [])

  // const checkAuthStatus = async () => {
  //   try {
  //     const { address: sessionAddress } = await api.getSession()
  //     if (sessionAddress === address) {
  //       setIsAuthenticated(true)
  //     }
  //   } catch (error) {
  //     console.error('Failed to check auth status:', error)
  //   }
  // }

  const signIn = async () => {
    if (!isConnected || !address || !chainId) {
      setError('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get nonce from server
      const { nonce } = await api.getNonce()

      // Create SIWE message
      const message = createSiweMessage(address, chainId, nonce)
      const messageBody = message.prepareMessage()

      // Sign the message
      const signature = await signMessageAsync({ message: messageBody })

      // Verify the message
      const isValid = await verifySiweMessage(message, signature)
      if (!isValid) {
        throw new Error('Invalid signature')
      }

      // Send to server for verification and session creation
      const { success } = await api.verify({
        message: messageBody,
        signature,
        nonce
      })

      if (!success) {
        throw new Error('Server verification failed')
      }

      setIsAuthenticated(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed'
      setError(errorMessage)
      console.error('Sign in error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await api.signOut()
      setIsAuthenticated(false)
      setError(null)
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const value: SiweContextType = {
    isAuthenticated,
    isLoading,
    address,
    signIn,
    signOut,
    error
  }

  return <SiweContext.Provider value={value}>{children}</SiweContext.Provider>
}
