'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthState {
  isAuthenticated: boolean
  user: { username: string } | null
  isLoading: boolean
}

interface AuthContextType {
  authState: AuthState
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Static credentials for demo purposes
export const STATIC_CREDENTIALS = {
  username: 'eduassist',
  password: 'eduassist@123'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  })

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedAuth = localStorage.getItem('eduassist-auth')
        if (savedAuth) {
          const parsedAuth = JSON.parse(savedAuth)
          // Verify the saved session is still valid (for demo, we'll just check if it exists)
          if (parsedAuth.isAuthenticated && parsedAuth.user) {
            setAuthState({
              isAuthenticated: true,
              user: parsedAuth.user,
              isLoading: false
            })
            return
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        // Clear invalid auth data
        localStorage.removeItem('eduassist-auth')
      }
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      })
    }

    checkAuthStatus()
  }, [])

  const login = (username: string, password: string): boolean => {
    if (username === STATIC_CREDENTIALS.username && password === STATIC_CREDENTIALS.password) {
      const user = { username }
      const authData = {
        isAuthenticated: true,
        user,
        timestamp: Date.now()
      }
      
      // Save authentication state to localStorage
      localStorage.setItem('eduassist-auth', JSON.stringify(authData))
      
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false
      })
      
      return true
    }
    
    return false
  }

  const logout = () => {
    // Clear authentication state
    localStorage.removeItem('eduassist-auth')
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    })
  }

  const contextValue: AuthContextType = {
    authState,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { authState } = useAuth()
    
    if (authState.isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading EduAssist...</p>
          </div>
        </div>
      )
    }
    
    if (!authState.isAuthenticated) {
      return null // This will be handled by the main layout
    }
    
    return <Component {...props} />
  }
}