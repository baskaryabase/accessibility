'use client'

import { useState, useRef } from 'react'
import { Upload, Play, Pause, Download, FileVideo, MessageSquare } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function CaptionsPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [segments, setSegments] = useState<any[]>([])
  const [srtContent, setSrtContent] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [settings, setSettings] = useState({
    languageCode: 'en-US',
    generateSRT: true,
    showTimestamps: true,
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supportedFormats = [
    'video/mp4',
    'video/webm',
    'video/mov',
    'video/avi',
    'video/quicktime',
    'video/mkv'
  ]

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'es-MX', name: 'Spanish (Mexico)' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log(file.type)
      if (supportedFormats.includes(file.type)) {
        setVideoFile(file)
        setTranscription('')
        setSegments([])
        setSrtContent('')
      } else {
        alert('Please select a supported video format (MP4, WebM, MOV, AVI, MKV)')
      }
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && supportedFormats.includes(file.type)) {
      setVideoFile(file)
      setTranscription('')
      setSegments([])
      setSrtContent('')
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const generateCaptions = async () => {
    if (!videoFile) {
      alert('Please select a video file first.')
      return
    }

    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('languageCode', settings.languageCode)
      formData.append('generateSRT', settings.generateSRT.toString())

      const response = await fetch('/api/video-captions', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate captions')
      }

      const data = await response.json()
      setTranscription(data.transcription)
      setSegments(data.segments || [])
      if (data.srtContent) {
        setSrtContent(data.srtContent)
      }

    } catch (error) {
      console.error('Error generating captions:', error)
      alert('Failed to generate captions. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadSRT = () => {
    if (!srtContent) return

    const blob = new Blob([srtContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${videoFile?.name || 'video'}_captions.srt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadTranscript = () => {
    if (!transcription) return

    const blob = new Blob([transcription], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${videoFile?.name || 'video'}_transcript.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const togglePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const jumpToSegment = (startTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime
    }
  }

  const getCurrentSegment = () => {
    return segments.find(segment => 
      currentTime >= segment.startTime && currentTime <= segment.endTime
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main id="main-content" className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Automatic Video Captions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate accurate captions for lecture videos using Google Cloud Video Intelligence API.
            Edit transcripts, export SRT files, and make your content accessible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upload Video
              </h2>
              
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
                  ${videoFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-primary-400'}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {videoFile ? (
                  <div className="space-y-4">
                    <FileVideo className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                      <p className="font-medium text-gray-900">{videoFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary"
                    >
                      Choose Different File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drop your video file here
                      </p>
                      <p className="text-gray-600">
                        or{' '}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          click to browse
                        </button>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supports MP4, WebM, MOV, AVI, MKV (max 100MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Select video file for captioning"
              />

              <div className="mt-6 flex justify-center">
                <button
                  onClick={generateCaptions}
                  disabled={!videoFile || isProcessing}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Generating Captions...' : 'Generate Captions'}
                </button>
              </div>
            </div>

            {/* Video Player */}
            {videoFile && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Video Preview
                </h2>
                
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={URL.createObjectURL(videoFile)}
                    className="w-full rounded-lg"
                    controls
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    aria-label="Video preview with generated captions"
                  />
                  
                  {/* Live Caption Overlay */}
                  {segments.length > 0 && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black bg-opacity-75 text-white p-3 rounded-lg">
                        <p className="text-center">
                          {getCurrentSegment()?.text || ''}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Transcript Results */}
            {transcription && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Generated Transcript
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={downloadTranscript}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download TXT</span>
                    </button>
                    {srtContent && (
                      <button
                        onClick={downloadSRT}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Download SRT</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Full Transcript</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {transcription}
                    </p>
                  </div>

                  {settings.showTimestamps && segments.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Timestamped Segments</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {segments.map((segment, index) => (
                          <div
                            key={index}
                            className={`
                              p-3 rounded-lg border cursor-pointer transition-colors duration-200
                              ${getCurrentSegment() === segment 
                                ? 'border-primary-500 bg-primary-50' 
                                : 'border-gray-200 hover:border-gray-300'
                              }
                            `}
                            onClick={() => jumpToSegment(segment.startTime)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-primary-600">
                                {Math.floor(segment.startTime / 60)}:
                                {(segment.startTime % 60).toFixed(1).padStart(4, '0')} → {' '}
                                {Math.floor(segment.endTime / 60)}:
                                {(segment.endTime % 60).toFixed(1).padStart(4, '0')}
                              </span>
                              <span className="text-xs text-gray-500">
                                {Math.round(segment.confidence * 100)}% confidence
                              </span>
                            </div>
                            <p className="text-gray-700">{segment.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Caption Settings
              </h2>

              <div className="space-y-4">
                {/* Language Selection */}
                <div>
                  <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Video Language
                  </label>
                  <select
                    id="language-select"
                    value={settings.languageCode}
                    onChange={(e) => setSettings({ ...settings, languageCode: e.target.value })}
                    className="input-field"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Generate SRT */}
                <div className="flex items-center">
                  <input
                    id="generate-srt"
                    type="checkbox"
                    checked={settings.generateSRT}
                    onChange={(e) => setSettings({ ...settings, generateSRT: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="generate-srt" className="ml-2 block text-sm text-gray-700">
                    Generate SRT file
                  </label>
                </div>

                {/* Show Timestamps */}
                <div className="flex items-center">
                  <input
                    id="show-timestamps"
                    type="checkbox"
                    checked={settings.showTimestamps}
                    onChange={(e) => setSettings({ ...settings, showTimestamps: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="show-timestamps" className="ml-2 block text-sm text-gray-700">
                    Show timestamped segments
                  </label>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            {isProcessing && (
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  🎬 Processing Video
                </h3>
                <div className="space-y-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse w-2/3"></div>
                  </div>
                  <p className="text-sm text-blue-800">
                    Analyzing video content and generating captions...
                  </p>
                  <p className="text-xs text-blue-600">
                    This may take a few minutes depending on video length.
                  </p>
                </div>
              </div>
            )}

            {/* Usage Tips */}
            <div className="card bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                💡 Tips for Better Captions
              </h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• Use clear audio without background noise</li>
                <li>• Speak at a moderate pace</li>
                <li>• Choose the correct language setting</li>
                <li>• Review and edit generated captions</li>
                <li>• Export SRT files for video players</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}