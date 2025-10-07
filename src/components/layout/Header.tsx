'use client'

import { useState } from 'react'
import { Menu, X, Volume2, Settings, LogOut } from 'lucide-react'
import { useAccessibility } from '@/components/providers/AccessibilityProvider'
import { useAuth } from '@/components/providers/AuthProvider'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state, dispatch } = useAccessibility()
  const { authState, logout } = useAuth()

  const navigation = [
    { name: 'Home', href: '#home', current: true },
    { name: 'Features', href: '#features', current: false },
    { name: 'Text-to-Speech', href: '/tts', current: false },
    { name: 'Captions', href: '/captions', current: false },
    { name: 'Braille', href: '/braille', current: false },
    { name: 'Voice Navigation', href: '/voice', current: false },
  ]

  const toggleVoice = () => {
    dispatch({ type: 'TOGGLE_VOICE', payload: !state.isVoiceActive })
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout()
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              <a href="#home" aria-label="EduAssist - Campus Accessibility Hub">
                EduAssist
              </a>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" role="navigation" aria-label="Main navigation">
            <ul className="flex space-x-8">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`
                      px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      ${item.current 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }
                    `}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Accessibility Controls */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{authState.user?.username}</span>
              </span>
            </div>

            <button
              onClick={toggleVoice}
              className={`
                p-2 rounded-md transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                ${state.isVoiceActive 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }
              `}
              aria-label={state.isVoiceActive ? 'Disable voice navigation' : 'Enable voice navigation'}
              aria-pressed={state.isVoiceActive}
            >
              <Volume2 className="h-5 w-5" />
            </button>

            <button
              className="p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Accessibility settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Log out of EduAssist"
              title="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle main menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3" role="navigation" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    ${item.current 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }
                  `}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}