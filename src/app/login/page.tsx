'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react'
import { STATIC_CREDENTIALS } from '@/components/providers/AuthProvider'

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate a brief loading time
    await new Promise(resolve => setTimeout(resolve, 800))

    if (username === STATIC_CREDENTIALS.username && password === STATIC_CREDENTIALS.password) {
      const success = onLogin(username, password)
      if (success) {
        announceToScreenReader('Login successful. Welcome to EduAssist!')
      } else {
        setError('Login failed. Please try again.')
      }
    } else {
      setError('Invalid username or password. Please try again.')
      announceToScreenReader('Login failed. Invalid credentials.')
    }

    setIsLoading(false)
  }

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'assertive')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  const fillDemoCredentials = () => {
    setUsername(STATIC_CREDENTIALS.username)
    setPassword(STATIC_CREDENTIALS.password)
    setError('')
    announceToScreenReader('Demo credentials filled in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">E</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to EduAssist
          </h1>
          <p className="text-gray-600 mb-6">
            Campus Accessibility Hub - Making education accessible for everyone
          </p>
          
          {/* Demo Credentials Info */}
          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">
              Demo Access
            </h2>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Username:</strong> eduassist</p>
              <p><strong>Password:</strong> accessibility2024</p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            >
              Fill Demo Credentials
            </button>
          </div> */}
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div 
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter your username"
                aria-describedby="username-help"
              />
            </div>
            <p id="username-help" className="mt-1 text-xs text-gray-600">
              Use the demo credentials shown above to access the application
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10"
                placeholder="Enter your password"
                aria-describedby="password-help"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            <p id="password-help" className="mt-1 text-xs text-gray-600">
              Password is case-sensitive
            </p>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>
        </form>

        {/* Accessibility Info */}
        <div className="text-center space-y-4">
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Accessibility Features
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <span>🔊</span>
                <span>Text-to-Speech</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🎙️</span>
                <span>Voice Navigation</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🎬</span>
                <span>Auto Captions</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>⠃</span>
                <span>Braille Converter</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            This application is designed with accessibility-first principles and WCAG 2.1 AA compliance.
          </p>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Keyboard Navigation
          </h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p><kbd className="px-1 py-0.5 bg-gray-200 rounded">Tab</kbd> - Navigate between fields</p>
            <p><kbd className="px-1 py-0.5 bg-gray-200 rounded">Enter</kbd> - Submit form</p>
            <p><kbd className="px-1 py-0.5 bg-gray-200 rounded">Space</kbd> - Toggle password visibility</p>
          </div>
        </div>
      </div>
    </div>
  )
}