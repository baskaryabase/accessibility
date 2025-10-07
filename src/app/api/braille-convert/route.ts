import { NextRequest, NextResponse } from 'next/server'

// Braille Grade 1 (Uncontracted) mapping - letter by letter
const GRADE1_BRAILLE_MAP: Record<string, string> = {
  // Letters
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓',
  'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏',
  'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
  'y': '⠽', 'z': '⠵',
  
  // Numbers (with number prefix ⠼)
  '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙', '5': '⠼⠑',
  '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊', '0': '⠼⠚',
  
  // Punctuation
  '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖', ':': '⠒', ';': '⠆',
  '-': '⠤', '(': '⠐⠣', ')': '⠐⠜', '"': '⠦', "'": '⠄',
  
  // Special characters
  ' ': ' ', '\n': '\n', '\t': '  ',
}

// Braille Grade 2 (Contracted) - includes common contractions
const GRADE2_CONTRACTIONS: Record<string, string> = {
  // Common word contractions
  'and': '⠯', 'for': '⠿', 'of': '⠷', 'the': '⠮', 'with': '⠾',
  'you': '⠽', 'as': '⠵', 'but': '⠃', 'can': '⠉', 'do': '⠙',
  'every': '⠑', 'from': '⠋', 'go': '⠛', 'have': '⠓', 'just': '⠚',
  'knowledge': '⠅', 'like': '⠇', 'more': '⠍', 'not': '⠝',
  'people': '⠏', 'quite': '⠟', 'rather': '⠗', 'so': '⠎',
  'that': '⠞', 'us': '⠥', 'very': '⠧', 'will': '⠺', 'it': '⠭',
  'his': '⠓', 'was': '⠺', 'were': '⠶', 'to': '⠞', 'into': '⠔⠞⠕',
  
  // Common letter combinations
  'ing': '⠬', 'ed': '⠫', 'er': '⠻', 'en': '⠢', 'in': '⠔',
  'ar': '⠜', 'ch': '⠡', 'gh': '⠣', 'ow': '⠪', 'ou': '⠳',
  'st': '⠌', 'th': '⠹', 'wh': '⠱', 'sh': '⠩', 'tion': '⠰⠝',
  
  // Prefix/suffix contractions
  'com': '⠤', 'dis': '⠲', 'con': '⠒', 'ble': '⠼', 'ness': '⠰⠎',
  'ment': '⠰⠞', 'ful': '⠰⠇', 'less': '⠰⠎⠎',
}

function convertToGrade1Braille(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map(char => GRADE1_BRAILLE_MAP[char] || char)
    .join('')
}

function convertToGrade2Braille(text: string): string {
  let result = text.toLowerCase()
  
  // Apply word contractions first (whole words)
  Object.entries(GRADE2_CONTRACTIONS).forEach(([word, braille]) => {
    if (word.length > 2) { // Only apply to longer contractions first
      const regex = new RegExp(`\\b${word}\\b`, 'g')
      result = result.replace(regex, braille)
    }
  })
  
  // Apply shorter contractions and letter combinations
  Object.entries(GRADE2_CONTRACTIONS).forEach(([pattern, braille]) => {
    if (pattern.length <= 2) {
      const regex = new RegExp(pattern, 'g')
      result = result.replace(regex, braille)
    }
  })
  
  // Convert remaining characters using Grade 1 mapping
  return result
    .split('')
    .map(char => {
      // Skip if it's already a Braille character
      if (char.charCodeAt(0) >= 0x2800 && char.charCodeAt(0) <= 0x28FF) {
        return char
      }
      return GRADE1_BRAILLE_MAP[char] || char
    })
    .join('')
}

function formatBrailleForDisplay(braille: string, includeVisual: boolean = true): string {
  if (!includeVisual) {
    return braille
  }
  
  // Add extra spacing for better visual representation
  return braille
    .split('\n')
    .map(line => line.split('').join(''))
    .join('\n')
}

function addBrailleMetadata(braille: string, originalText: string, grade: string): string {
  const timestamp = new Date().toISOString().split('T')[0]
  const metadata = `⠃⠗⠇ ⠋⠊⠇⠑ ⠛⠑⠝⠑⠗⠁⠞⠫ ${timestamp}\n⠛⠗⠁⠙⠑ ${grade === 'grade1' ? '⠼⠁' : '⠼⠃'}\n⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤\n\n`
  
  return metadata + braille
}

export async function POST(request: NextRequest) {
  try {
    const { text, grade = 'grade1', includeVisual = true } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: 'Text is too long. Maximum 50,000 characters allowed.' },
        { status: 400 }
      )
    }

    // Convert based on grade
    let brailleText: string
    
    if (grade === 'grade2') {
      brailleText = convertToGrade2Braille(text)
    } else {
      brailleText = convertToGrade1Braille(text)
    }

    // Format for display
    const formattedBraille = formatBrailleForDisplay(brailleText, includeVisual)
    
    // Add metadata for file download
    const brailleWithMetadata = addBrailleMetadata(formattedBraille, text, grade)

    // Calculate statistics
    const stats = {
      originalLength: text.length,
      brailleLength: brailleText.length,
      wordCount: text.trim().split(/\s+/).length,
      lineCount: text.split('\n').length,
      grade: grade,
      compressionRatio: grade === 'grade2' ? (brailleText.length / text.length).toFixed(2) : '1.00'
    }

    return NextResponse.json({
      braille: formattedBraille,
      brailleWithMetadata: brailleWithMetadata,
      stats: stats,
      success: true
    })

  } catch (error) {
    console.error('Braille conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to convert text to Braille' },
      { status: 500 }
    )
  }
}

// GET endpoint to return available Braille information
export async function GET() {
  return NextResponse.json({
    supportedGrades: [
      {
        grade: 'grade1',
        name: 'Grade 1 (Uncontracted)',
        description: 'Letter-by-letter transcription with no contractions',
        recommended: 'Beginners, mathematical content, proper names'
      },
      {
        grade: 'grade2',
        name: 'Grade 2 (Contracted)',
        description: 'Uses contractions and abbreviations for efficiency',
        recommended: 'General reading, literature, most documents'
      }
    ],
    features: [
      'Real-time conversion',
      'Multiple Braille grades',
      'Print-ready formatting',
      'BRF file format support',
      'Statistics and metadata',
      'Copy/paste functionality'
    ],
    fileFormats: [
      { extension: '.brf', description: 'Braille Ready Format - standard for Braille files' },
      { extension: '.txt', description: 'Plain text with Braille Unicode characters' }
    ]
  })
}