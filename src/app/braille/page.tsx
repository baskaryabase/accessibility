'use client'

import { useState, useRef } from 'react'
import { Upload, Download, FileText, Type, Copy, Volume2, Printer, Eye } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function BraillePage() {
  const [inputText, setInputText] = useState('')
  const [brailleOutput, setBrailleOutput] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [conversionType, setConversionType] = useState<'grade1' | 'grade2'>('grade1')
  const [showVisualBraille, setShowVisualBraille] = useState(true)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const brailleOutputRef = useRef<HTMLDivElement>(null)

  const sampleTexts = [
    "Welcome to today's Computer Science lecture on data structures and algorithms.",
    "The assignment is due next Friday at 11:59 PM. Please submit your work through the online portal.",
    "Important announcement: The library will be closed for maintenance this weekend.",
    "Chapter 5 covers object-oriented programming principles including inheritance and polymorphism.",
  ]

  const brailleGrades = [
    { value: 'grade1', label: 'Grade 1 (Uncontracted)', description: 'Letter-by-letter transcription' },
    { value: 'grade2', label: 'Grade 2 (Contracted)', description: 'Uses contractions and abbreviations' },
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const supportedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!supportedTypes.includes(file.type)) {
      alert('Please upload a supported file type: TXT, PDF, DOC, or DOCX')
      return
    }

    setUploadedFile(file)
    
    try {
      if (file.type === 'text/plain') {
        const text = await file.text()
        setInputText(text)
      } else {
        // For PDF and DOC files, we'll need to extract text
        await extractTextFromFile(file)
      }
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Error reading file. Please try again.')
    }
  }

  const extractTextFromFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to extract text from file')
      }

      const data = await response.json()
      setInputText(data.text)
    } catch (error) {
      console.error('Error extracting text:', error)
      alert('Error extracting text from file. Please try again.')
    }
  }

  const convertToBraille = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text or upload a file to convert.')
      return
    }

    setIsConverting(true)
    
    try {
      const response = await fetch('/api/braille-convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText.trim(),
          grade: conversionType,
          includeVisual: showVisualBraille,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to convert to Braille')
      }

      const data = await response.json()
      setBrailleOutput(data.braille)
      
      // Announce conversion completion
      announceToScreenReader('Braille conversion completed successfully')
      
    } catch (error) {
      console.error('Error converting to Braille:', error)
      alert('Failed to convert to Braille. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  const copyToClipboard = async () => {
    if (!brailleOutput) return

    try {
      await navigator.clipboard.writeText(brailleOutput)
      announceToScreenReader('Braille text copied to clipboard')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      alert('Failed to copy to clipboard')
    }
  }

  const downloadBraille = () => {
    if (!brailleOutput) return

    const blob = new Blob([brailleOutput], { type: 'text/plain; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `braille-${Date.now()}.brf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const printBraille = () => {
    if (!brailleOutput) return

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Braille Document</title>
            <style>
              body { 
                font-family: 'SimBraille', 'Braille6', monospace; 
                font-size: 18px; 
                line-height: 1.8; 
                margin: 1in;
                white-space: pre-wrap;
              }
              @media print {
                body { font-size: 24px; }
              }
            </style>
          </head>
          <body>${brailleOutput}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const speakText = () => {
    if (!inputText) return

    const utterance = new SpeechSynthesisUtterance(inputText)
    utterance.rate = 0.8
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  const loadSampleText = (sample: string) => {
    setInputText(sample)
    setBrailleOutput('')
    setUploadedFile(null)
  }

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main id="main-content" className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Braille Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert lectures, speeches, and important notes into Braille format. 
            Support for both Grade 1 (uncontracted) and Grade 2 (contracted) Braille.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Input Text
              </h2>
              
              {/* File Upload */}
              <div className="mb-6">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Click to upload a file"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      fileInputRef.current?.click()
                    }
                  }}
                >
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <FileText className="h-8 w-8 text-green-600 mx-auto" />
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-gray-600">
                        Upload lecture notes, documents, or speech text
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports TXT, PDF, DOC, DOCX files
                      </p>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Select file to convert to Braille"
                />
              </div>

              {/* Text Input */}
              <div className="space-y-4">
                <label htmlFor="input-text" className="block text-sm font-medium text-gray-700">
                  Or type/paste your text here:
                </label>
                <textarea
                  id="input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter lecture notes, speech text, or important announcements..."
                  className="input-field min-h-48 resize-y font-mono"
                  rows={12}
                  aria-describedby="input-help"
                />
                <p id="input-help" className="text-sm text-gray-600">
                  Text will be converted to Braille format. Maximum recommended length: 10,000 characters.
                </p>
              </div>

              {/* Sample Texts */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick samples:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleTexts.map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => loadSampleText(sample)}
                      className="text-sm text-primary-600 hover:text-primary-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    >
                      Sample {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={convertToBraille}
                  disabled={isConverting || !inputText.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Type className="h-4 w-4" />
                  <span>{isConverting ? 'Converting...' : 'Convert to Braille'}</span>
                </button>

                {inputText && (
                  <button
                    onClick={speakText}
                    className="btn-secondary flex items-center space-x-2"
                    aria-label="Listen to input text"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            </div>

            {/* Braille Output */}
            {brailleOutput && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Braille Output ({conversionType === 'grade1' ? 'Grade 1' : 'Grade 2'})
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="btn-secondary flex items-center space-x-2"
                      aria-label="Copy Braille text to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={downloadBraille}
                      className="btn-secondary flex items-center space-x-2"
                      aria-label="Download Braille file"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={printBraille}
                      className="btn-secondary flex items-center space-x-2"
                      aria-label="Print Braille document"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div 
                  ref={brailleOutputRef}
                  className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 font-mono text-lg leading-relaxed whitespace-pre-wrap select-all"
                  style={{ 
                    fontFamily: "'SimBraille', 'Braille6', 'DejaVu Sans Mono', monospace",
                    fontSize: showVisualBraille ? '24px' : '18px',
                    lineHeight: showVisualBraille ? '2' : '1.6'
                  }}
                  role="textbox"
                  aria-readonly="true"
                  aria-label="Converted Braille text"
                  tabIndex={0}
                >
                  {brailleOutput}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Usage:</strong> This Braille text can be printed on a Braille embosser, 
                    sent to a refreshable Braille display, or saved for later use. 
                    The .brf file format is compatible with most Braille software.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Conversion Settings */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Braille Settings
              </h2>

              <div className="space-y-4">
                {/* Braille Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Braille Grade
                  </label>
                  <div className="space-y-3">
                    {brailleGrades.map((grade) => (
                      <label key={grade.value} className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="braille-grade"
                          value={grade.value}
                          checked={conversionType === grade.value}
                          onChange={(e) => setConversionType(e.target.value as 'grade1' | 'grade2')}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {grade.label}
                          </span>
                          <p className="text-xs text-gray-600">{grade.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Visual Braille */}
                <div className="flex items-center space-x-3">
                  <input
                    id="visual-braille"
                    type="checkbox"
                    checked={showVisualBraille}
                    onChange={(e) => setShowVisualBraille(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="visual-braille" className="text-sm text-gray-700">
                    Enhanced visual display (larger, spaced)
                  </label>
                </div>
              </div>
            </div>

            {/* Character Statistics */}
            {inputText && (
              <div className="card bg-gray-50 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Document Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Characters:</span>
                    <span className="font-mono">{inputText.length.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Words:</span>
                    <span className="font-mono">{inputText.trim().split(/\s+/).length.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lines:</span>
                    <span className="font-mono">{inputText.split('\n').length.toLocaleString()}</span>
                  </div>
                  {brailleOutput && (
                    <div className="flex justify-between pt-2 border-t border-gray-300">
                      <span className="text-gray-600">Braille cells:</span>
                      <span className="font-mono">{brailleOutput.length.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Help & Tips */}
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                💡 Braille Tips
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• <strong>Grade 1:</strong> Letter-by-letter, easier to read</li>
                <li>• <strong>Grade 2:</strong> Uses contractions, more compact</li>
                <li>• Print on 11"×11.5" paper for standard format</li>
                <li>• Use Braille embosser for tactile reading</li>
                <li>• .brf files work with JAWS and NVDA</li>
                <li>• Check local Braille production services</li>
              </ul>
            </div>

            {/* Accessibility Info */}
            <div className="card bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                ♿ Accessibility Features
              </h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• Screen reader announcements</li>
                <li>• Keyboard navigation support</li>
                <li>• High contrast Braille display</li>
                <li>• Audio preview of original text</li>
                <li>• Copy/paste functionality</li>
                <li>• Print-ready formatting</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}