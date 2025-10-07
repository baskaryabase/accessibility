import { NextRequest, NextResponse } from 'next/server'
import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence'
import { SpeechClient } from '@google-cloud/speech'
import formidable from 'formidable'
import { promises as fs } from 'fs'

// Initialize clients
const videoClient = new VideoIntelligenceServiceClient()
const speechClient = new SpeechClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const videoFile = formData.get('video') as File
    const languageCode = formData.get('languageCode') as string || 'en-US'
    const generateSRT = formData.get('generateSRT') === 'true'

    if (!videoFile) {
      return NextResponse.json(
        { error: 'Video file is required' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const bytes = await videoFile.arrayBuffer()
    const videoBytes = new Uint8Array(bytes)

    // Configure the video analysis request
    const videoRequest = {
      inputContent: Buffer.from(videoBytes).toString('base64'),
      features: ['SPEECH_TRANSCRIPTION' as const],
      videoContext: {
        speechTranscriptionConfig: {
          languageCode,
          enableAutomaticPunctuation: true,
          enableWordTimeOffsets: true,
          enableWordConfidence: true,
          maxAlternatives: 1,
        },
      },
    }

    // Start the video analysis operation
    const [operation] = await videoClient.annotateVideo(videoRequest)
    console.log('Waiting for operation to complete...')
    
    // Wait for the operation to complete
    const [result] = await operation.promise()
    
    if (!result.annotationResults?.[0]?.speechTranscriptions) {
      return NextResponse.json({
        transcription: '',
        segments: [],
        srtContent: '',
        message: 'No speech detected in video'
      })
    }

    const speechTranscriptions = result.annotationResults[0].speechTranscriptions
    const segments: Array<{
      text: string
      startTime: number
      endTime: number
      confidence: number
    }> = []

    let fullTranscription = ''
    let srtContent = ''
    let srtIndex = 1

    // Process transcription results
    speechTranscriptions.forEach((transcription: any) => {
      transcription.alternatives?.forEach((alternative: any) => {
        const transcript = alternative.transcript || ''
        fullTranscription += transcript + ' '
        
        // Extract timing information
        const words = alternative.words || []
        if (words.length > 0) {
          const startTime = parseTimeOffset(words[0].startTime)
          const endTime = parseTimeOffset(words[words.length - 1].endTime)
          const confidence = alternative.confidence || 0

          segments.push({
            text: transcript.trim(),
            startTime,
            endTime,
            confidence
          })

          // Generate SRT format if requested
          if (generateSRT) {
            srtContent += `${srtIndex}\n`
            srtContent += `${formatSRTTime(startTime)} --> ${formatSRTTime(endTime)}\n`
            srtContent += `${transcript.trim()}\n\n`
            srtIndex++
          }
        }
      })
    })

    return NextResponse.json({
      transcription: fullTranscription.trim(),
      segments,
      srtContent: generateSRT ? srtContent : undefined,
      totalDuration: segments.length > 0 ? segments[segments.length - 1].endTime : 0
    })

  } catch (error) {
    console.error('Video transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe video' },
      { status: 500 }
    )
  }
}

// Helper function to parse time offset from Google Cloud format
function parseTimeOffset(timeOffset: any): number {
  if (!timeOffset) return 0
  
  const seconds = parseInt(timeOffset.seconds || '0')
  const nanos = parseInt(timeOffset.nanos || '0')
  return seconds + nanos / 1000000000
}

// Helper function to format time for SRT
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const milliseconds = Math.floor((seconds % 1) * 1000)
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`
}