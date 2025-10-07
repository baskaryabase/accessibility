'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { AccessibilitySettings } from '@/types/accessibility'

interface AccessibilityState {
  settings: AccessibilitySettings
  isVoiceActive: boolean
  isListening: boolean
  transcript: string
}

type AccessibilityAction = 
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AccessibilitySettings> }
  | { type: 'TOGGLE_VOICE'; payload: boolean }
  | { type: 'SET_LISTENING'; payload: boolean }
  | { type: 'SET_TRANSCRIPT'; payload: string }

const initialState: AccessibilityState = {
  settings: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    voiceEnabled: true,
    language: 'en-US'
  },
  isVoiceActive: false,
  isListening: false,
  transcript: ''
}

function accessibilityReducer(state: AccessibilityState, action: AccessibilityAction): AccessibilityState {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    case 'TOGGLE_VOICE':
      return {
        ...state,
        isVoiceActive: action.payload
      }
    case 'SET_LISTENING':
      return {
        ...state,
        isListening: action.payload
      }
    case 'SET_TRANSCRIPT':
      return {
        ...state,
        transcript: action.payload
      }
    default:
      return state
  }
}

const AccessibilityContext = createContext<{
  state: AccessibilityState
  dispatch: React.Dispatch<AccessibilityAction>
} | null>(null)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(accessibilityReducer, initialState)

  return (
    <AccessibilityContext.Provider value={{ state, dispatch }}>
      <div 
        className={`
          ${state.settings.fontSize === 'small' ? 'text-sm' : ''}
          ${state.settings.fontSize === 'large' ? 'text-lg' : ''}
          ${state.settings.fontSize === 'xl' ? 'text-xl' : ''}
          ${state.settings.highContrast ? 'high-contrast' : ''}
        `}
        data-reduce-motion={state.settings.reduceMotion}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}