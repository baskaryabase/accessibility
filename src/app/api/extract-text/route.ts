import { NextRequest, NextResponse } from 'next/server'
import formidable, { File as FormidableFile } from 'formidable'
import fs from 'fs/promises'
import path from 'path'

// Simple text extraction for different file types
// In a production environment, you might want to use libraries like:
// - pdf-parse for PDF files
// - mammoth for DOCX files
// - textract for comprehensive file support

async function extractTextFromFile(file: FormidableFile): Promise<string> {
  const filePath = file.filepath
  const mimeType = file.mimetype || ''
  
  try {
    // Handle plain text files
    if (mimeType === 'text/plain' || file.originalFilename?.endsWith('.txt')) {
      const buffer = await fs.readFile(filePath)
      return buffer.toString('utf-8')
    }
    
    // For demo purposes, we'll handle basic text extraction
    // In production, you would use proper PDF/DOC parsing libraries
    if (mimeType === 'application/pdf' || file.originalFilename?.endsWith('.pdf')) {
      // This is a placeholder - in production use pdf-parse or similar
      throw new Error('PDF parsing requires additional setup. Please use TXT files for now.')
    }
    
    if (mimeType.includes('word') || file.originalFilename?.endsWith('.docx') || file.originalFilename?.endsWith('.doc')) {
      // This is a placeholder - in production use mammoth or similar
      throw new Error('Word document parsing requires additional setup. Please use TXT files for now.')
    }
    
    // Try to read as text anyway
    const buffer = await fs.readFile(filePath)
    return buffer.toString('utf-8')
    
  } catch (error) {
    console.error('Error extracting text from file:', error)
    throw new Error('Failed to extract text from file. Please ensure it\'s a valid text file.')
  } finally {
    // Clean up temporary file
    try {
      await fs.unlink(filePath)
    } catch (unlinkError) {
      console.error('Error cleaning up temporary file:', unlinkError)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const data = await request.formData()
    const file = data.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }
    
    // Check file type
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload TXT, PDF, DOC, or DOCX files.' },
        { status: 400 }
      )
    }
    
    // For now, we'll only handle text files properly
    // PDF and DOC support would require additional libraries
    if (file.type !== 'text/plain') {
      return NextResponse.json(
        { error: 'Currently only TXT files are fully supported. PDF and DOC support coming soon!' },
        { status: 400 }
      )
    }
    
    // Read the file content
    const bytes = await file.arrayBuffer()
    const text = new TextDecoder('utf-8').decode(bytes)
    
    // Basic validation
    if (!text.trim()) {
      return NextResponse.json(
        { error: 'File appears to be empty or unreadable.' },
        { status: 400 }
      )
    }
    
    if (text.length > 50000) {
      return NextResponse.json(
        { error: 'File content too long. Maximum 50,000 characters allowed.' },
        { status: 400 }
      )
    }
    
    // Return extracted text with metadata
    return NextResponse.json({
      text: text.trim(),
      metadata: {
        filename: file.name,
        size: file.size,
        type: file.type,
        characterCount: text.length,
        wordCount: text.trim().split(/\s+/).length,
        lineCount: text.split('\n').length
      },
      success: true
    })
    
  } catch (error) {
    console.error('Text extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract text from file. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to return supported file types and limits
export async function GET() {
  return NextResponse.json({
    supportedTypes: [
      {
        extension: '.txt',
        mimeType: 'text/plain',
        description: 'Plain text files',
        status: 'fully_supported'
      },
      {
        extension: '.pdf',
        mimeType: 'application/pdf',
        description: 'PDF documents',
        status: 'coming_soon'
      },
      {
        extension: '.doc',
        mimeType: 'application/msword',
        description: 'Microsoft Word documents (legacy)',
        status: 'coming_soon'
      },
      {
        extension: '.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        description: 'Microsoft Word documents',
        status: 'coming_soon'
      }
    ],
    limits: {
      maxFileSize: '5MB',
      maxCharacters: 50000,
      maxLines: 10000
    },
    notes: [
      'TXT files are fully supported with UTF-8 encoding',
      'PDF and DOC support requires additional setup',
      'Large files may take longer to process',
      'Files are processed securely and not stored'
    ]
  })
}