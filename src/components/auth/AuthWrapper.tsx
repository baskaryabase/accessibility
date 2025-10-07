'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import LoginPage from '@/app/login/page'

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { authState, login } = useAuth()

  // Show loading spinner while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600" role="status" aria-live="polite">
            Loading EduAssist...
          </p>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!authState.isAuthenticated) {
    return <LoginPage onLogin={login} />
  }

  // Show the main application if authenticated
  return <>{children}</>
}