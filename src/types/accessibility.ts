export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xl'
  highContrast: boolean
  reduceMotion: boolean
  voiceEnabled: boolean
  language: string
}

export interface VoiceCommand {
  command: string
  action: string
  description: string
}

export interface CaptionSettings {
  enabled: boolean
  fontSize: number
  backgroundColor: string
  textColor: string
  position: 'top' | 'bottom'
}

export interface TTSSettings {
  voice: string
  rate: number
  pitch: number
  volume: number
  language: string
}

export interface STTSettings {
  language: string
  continuous: boolean
  interimResults: boolean
}

export interface TranslationSettings {
  sourceLanguage: string
  targetLanguage: string
  enabled: boolean
}