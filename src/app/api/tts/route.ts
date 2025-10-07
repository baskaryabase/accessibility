import { NextRequest, NextResponse } from 'next/server'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'

// Initialize the client
const client = new TextToSpeechClient()

export async function POST(request: NextRequest) {
  try {
    const { text, languageCode = 'en-US', voiceName, pitch = 0, speakingRate = 1 } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Construct the request
    const ttsRequest = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender: 'NEUTRAL' as const,
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
        pitch,
        speakingRate,
      },
    }

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(ttsRequest)

    // Convert the audio content to base64
    const audioContent = response.audioContent
    if (!audioContent) {
      throw new Error('No audio content received')
    }

    const base64Audio = Buffer.from(audioContent).toString('base64')

    return NextResponse.json({
      audioContent: base64Audio,
      contentType: 'audio/mpeg'
    })

  } catch (error) {
    console.error('Text-to-speech error:', error)
    return NextResponse.json(
      { error: 'Failed to synthesize speech' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve available voices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const languageCode = searchParams.get('languageCode') || 'en-US'

    const [result] = await client.listVoices({ languageCode })
    const voices = result.voices || []

    return NextResponse.json({ voices })

  } catch (error) {
    console.error('Error fetching voices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    )
  }
}