'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useAccessibility } from '@/components/providers/AccessibilityProvider'

export function VoiceNavigation() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const { state, dispatch } = useAccessibility()
  const recognitionRef = useRef<any>(null)

  const voiceCommands = [
    { command: 'open timetable', action: 'Navigate to timetable', description: 'Opens your class schedule' },
    { command: 'show library schedule', action: 'Navigate to library', description: 'Shows library hours and availability' },
    { command: 'read announcements', action: 'Text-to-speech announcements', description: 'Reads latest campus announcements' },
    { command: 'start reading', action: 'Text-to-speech on', description: 'Begins reading page content' },
    { command: 'stop reading', action: 'Text-to-speech off', description: 'Stops reading content' },
    { command: 'increase font size', action: 'Accessibility setting', description: 'Makes text larger' },
    { command: 'decrease font size', action: 'Accessibility setting', description: 'Makes text smaller' },
    { command: 'high contrast on', action: 'Accessibility setting', description: 'Enables high contrast mode' },
    { command: 'help', action: 'Show help', description: 'Shows available voice commands' },
  ]

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      
      const recognition = recognitionRef.current
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = state.settings.language

      recognition.onstart = () => {
        setIsListening(true)
        dispatch({ type: 'SET_LISTENING', payload: true })
      }

      recognition.onend = () => {
        setIsListening(false)
        dispatch({ type: 'SET_LISTENING', payload: false })
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript)
          dispatch({ type: 'SET_TRANSCRIPT', payload: finalTranscript })
          processVoiceCommand(finalTranscript.toLowerCase().trim())
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        dispatch({ type: 'SET_LISTENING', payload: false })
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [state.settings.language, dispatch])

  const processVoiceCommand = (command: string) => {
    const matchedCommand = voiceCommands.find(cmd => 
      command.includes(cmd.command.toLowerCase())
    )

    if (matchedCommand) {
      executeCommand(matchedCommand)
      announceAction(`Executing: ${matchedCommand.description}`)
    } else {
      announceAction('Command not recognized. Say "help" for available commands.')
    }
  }

  const executeCommand = (command: any) => {
    switch (command.command) {
      case 'open timetable':
        window.location.href = '/timetable'
        break
      case 'show library schedule':
        window.location.href = '/library'
        break
      case 'read announcements':
        readPageContent()
        break
      case 'start reading':
        readPageContent()
        break
      case 'stop reading':
        stopReading()
        break
      case 'increase font size':
        changeFontSize('larger')
        break
      case 'decrease font size':
        changeFontSize('smaller')
        break
      case 'high contrast on':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { highContrast: true } })
        break
      case 'help':
        showHelp()
        break
      default:
        console.log('Command not implemented:', command.command)
    }
  }

  const announceAction = (message: string) => {
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.rate = 0.8
    utterance.lang = state.settings.language
    speechSynthesis.speak(utterance)
  }

  const readPageContent = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      const text = mainContent.textContent || ''
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.lang = state.settings.language
      speechSynthesis.speak(utterance)
    }
  }

  const stopReading = () => {
    speechSynthesis.cancel()
  }

  const changeFontSize = (direction: 'larger' | 'smaller') => {
    const currentSize = state.settings.fontSize
    const sizes = ['small', 'medium', 'large', 'xl']
    const currentIndex = sizes.indexOf(currentSize)
    
    let newIndex = currentIndex
    if (direction === 'larger' && currentIndex < sizes.length - 1) {
      newIndex = currentIndex + 1
    } else if (direction === 'smaller' && currentIndex > 0) {
      newIndex = currentIndex - 1
    }
    
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { fontSize: sizes[newIndex] as any } 
    })
  }

  const showHelp = () => {
    const helpText = voiceCommands.map(cmd => `Say "${cmd.command}" to ${cmd.description}`).join('. ')
    announceAction(`Available commands: ${helpText}`)
  }

  const toggleListening = () => {
    if (!isSupported) {
      announceAction('Speech recognition is not supported in this browser.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
  }

  const toggleVoice = () => {
    dispatch({ type: 'TOGGLE_VOICE', payload: !state.isVoiceActive })
  }

  if (!state.isVoiceActive) {
    return null
  }

  return (
    <section className="fixed bottom-6 right-6 z-50" aria-labelledby="voice-nav-heading">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 id="voice-nav-heading" className="text-lg font-semibold text-gray-900">
            Voice Navigation
          </h3>
          <button
            onClick={toggleVoice}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close voice navigation"
          >
            <VolumeX className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleListening}
              disabled={!isSupported}
              className={`
                flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                ${isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
                }
                ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
              aria-pressed={isListening}
            >
              {isListening ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {isListening ? 'Listening...' : 'Voice Commands'}
              </p>
              <p className="text-xs text-gray-600">
                {isSupported ? 'Click mic to start' : 'Not supported'}
              </p>
            </div>
          </div>

          {transcript && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>You said:</strong> {transcript}
              </p>
            </div>
          )}

          <div className="border-t pt-3">
            <p className="text-xs text-gray-600 mb-2">Try saying:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>"Open timetable"</li>
              <li>"Read announcements"</li>
              <li>"High contrast on"</li>
              <li>"Help" for more commands</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}