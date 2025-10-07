'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Download, Volume2, Settings } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function TextToSpeechPage() {
  const [text, setText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    languageCode: 'en-US',
    voiceName: '',
    pitch: 0,
    speakingRate: 1,
  })
  const audioRef = useRef<HTMLAudioElement>(null)

  const sampleTexts = [
    "Welcome to EduAssist! This is a sample announcement about upcoming campus events.",
    "Library hours: Monday through Friday 8 AM to 10 PM, weekends 10 AM to 6 PM.",
    "Professor Smith's lecture on Introduction to Computer Science has been moved to Room 205.",
    "Reminder: Registration for fall semester courses begins next Monday at 9 AM.",
  ]

  const voices = [
    { name: 'en-US-Standard-A', language: 'en-US', gender: 'Female' },
    { name: 'en-US-Standard-B', language: 'en-US', gender: 'Male' },
    { name: 'en-US-Standard-C', language: 'en-US', gender: 'Female' },
    { name: 'en-US-Standard-D', language: 'en-US', gender: 'Male' },
    { name: 'en-GB-Standard-A', language: 'en-GB', gender: 'Female' },
    { name: 'en-GB-Standard-B', language: 'en-GB', gender: 'Male' },
  ]

  const synthesizeSpeech = async () => {
    if (!text.trim()) {
      alert('Please enter some text to convert to speech.')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          ...settings,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to synthesize speech')
      }

      const data = await response.json()
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      )
      
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      
      // Auto-play if audio element is available
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
        setIsPlaying(true)
      }

    } catch (error) {
      console.error('Error synthesizing speech:', error)
      alert('Failed to convert text to speech. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const downloadAudio = () => {
    if (!audioUrl) return

    const link = document.createElement('a')
    link.href = audioUrl
    link.download = 'speech-audio.mp3'
    link.click()
  }

  const loadSampleText = (sampleText: string) => {
    setText(sampleText)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main id="main-content" className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Text-to-Speech
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert announcements, lecture notes, and campus updates into natural-sounding speech.
            Powered by Google Cloud Text-to-Speech API.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Enter Text
              </h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text you want to convert to speech..."
                className="input-field min-h-32 resize-y"
                rows={6}
                aria-label="Text to convert to speech"
              />
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Quick samples:</span>
                {sampleTexts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => loadSampleText(sample)}
                    className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Sample {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Audio Controls
              </h2>
              
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={synthesizeSpeech}
                  disabled={isLoading || !text.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Generating...' : 'Generate Speech'}
                </button>

                {audioUrl && (
                  <>
                    <button
                      onClick={togglePlayPause}
                      className="btn-secondary flex items-center space-x-2"
                      aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>

                    <button
                      onClick={downloadAudio}
                      className="btn-secondary flex items-center space-x-2"
                      aria-label="Download audio file"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </>
                )}
              </div>

              {audioUrl && (
                <audio
                  ref={audioRef}
                  onEnded={() => setIsPlaying(false)}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  controls
                  className="w-full"
                  aria-label="Generated speech audio"
                >
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Voice Settings
              </h2>

              <div className="space-y-4">
                {/* Voice Selection */}
                <div>
                  <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Voice
                  </label>
                  <select
                    id="voice-select"
                    value={settings.voiceName}
                    onChange={(e) => setSettings({ ...settings, voiceName: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Default Voice</option>
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.language} - {voice.gender}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Speaking Rate */}
                <div>
                  <label htmlFor="speaking-rate" className="block text-sm font-medium text-gray-700 mb-2">
                    Speaking Rate: {settings.speakingRate}x
                  </label>
                  <input
                    id="speaking-rate"
                    type="range"
                    min="0.25"
                    max="4.0"
                    step="0.1"
                    value={settings.speakingRate}
                    onChange={(e) => setSettings({ ...settings, speakingRate: parseFloat(e.target.value) })}
                    className="w-full"
                    aria-label="Adjust speaking rate"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>

                {/* Pitch */}
                <div>
                  <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-2">
                    Pitch: {settings.pitch > 0 ? '+' : ''}{settings.pitch}
                  </label>
                  <input
                    id="pitch"
                    type="range"
                    min="-20"
                    max="20"
                    step="1"
                    value={settings.pitch}
                    onChange={(e) => setSettings({ ...settings, pitch: parseInt(e.target.value) })}
                    className="w-full"
                    aria-label="Adjust voice pitch"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Normal</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                💡 Usage Tips
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Use punctuation for natural pauses</li>
                <li>• Spell out numbers and abbreviations</li>
                <li>• Try different voices for variety</li>
                <li>• Adjust speed for comfort</li>
                <li>• Download audio for offline use</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}